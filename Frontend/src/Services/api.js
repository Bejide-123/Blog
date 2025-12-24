// src/services/auth.js
import axios from 'axios'
import { supabase } from '../lib/supabase.js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const axiosInstance = axios.create({
  baseURL: SUPABASE_URL,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
})

// --------------------- SIGN UP ---------------------
export const signUp = async ({ email, password, username, fullName }) => {
  // Step 1: Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name: fullName }, // goes to user_metadata
    },
  });

  if (error) throw error;

  // Ensure user exists before inserting profile
  const userId = data?.user?.id;
  if (!userId) throw new Error("Signup failed: No user returned");

  // Step 2: Insert into profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        username,
        full_name: fullName,
      },
    ])

  if (profileError) throw profileError;

  return data;
};

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  if (!data?.user) throw new Error("Login failed: No user returned");

  return data;
};


// --------------------- GET PROFILE ---------------------
export const getProfile = async (userId) => {
  const { data, error } = await axiosInstance
    .get(`/rest/v1/profiles?id=eq.${userId}`)
    .then(res => ({ data: res.data[0], error: null }))
    .catch(err => ({ data: null, error: err.response.data }))

  if (error) throw error
  return data
}

// --------------------- UPDATE PROFILE ---------------------
export const updateProfile = async (userId, { username, fullName }) => {
  const { data, error } = await axiosInstance
    .patch(`/rest/v1/profiles?id=eq.${userId}`, { username, full_name: fullName })
    .then(res => ({ data: res.data, error: null }))
    .catch(err => ({ data: null, error: err.response.data }))

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Add this to your auth.js service

// --------------------- GET CURRENT USER PROFILE ---------------------
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// --------------------- CREATE POST ---------------------
export const createPost = async (postData) => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // Calculate read time
    const wordCount = postData.content.split(/\s+/).filter(Boolean).length
    const readTime = Math.ceil(wordCount / 200)

    // Prepare post data
    const postToCreate = {
      title: postData.title,
      content: postData.content,
      tags: postData.tags || [],
      status: postData.status || 'draft',
      authorid: user.id,
      read_time: readTime,
      word_count: wordCount,
      featured_image: null, // We'll update this after image upload
      createdat: new Date().toISOString(), // Add this for timestamp
      updatedat: new Date().toISOString(), // Add this for timestamp
    }

    // Handle image upload if exists (base64 data URL)
    if (postData.image && postData.image.startsWith('data:image')) {
      try {
        const imageUrl = await uploadImage(
          postData.image, 
          'posts', 
          `post_${user.id}_${Date.now()}`
        );
        postToCreate.featured_image = imageUrl;
      } catch (imageError) {
        console.error("Image upload failed:", imageError);
        // Continue without image
        // You could show a warning: "Image upload failed, continuing without image"
      }
    }

    // Insert post into database
    const { data, error } = await supabase
      .from('posts')
      .insert([postToCreate])
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

// --------------------- UPLOAD IMAGE TO MEDIA BUCKET ---------------------
export const uploadImage = async (base64Image, folder, filename) => {
  try {
    // Convert base64 to blob
    const response = await fetch(base64Image);
    const blob = await response.blob();
    
    // Get file extension
    const fileExt = base64Image.split(';')[0].split('/')[1] || 'jpg';
    const filePath = `${folder}/${filename}.${fileExt}`;

    // Upload to 'media' bucket
    const { data, error } = await supabase.storage
      .from('media')  // Use 'media' bucket
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
// --------------------- GET POSTS ---------------------
export const getPosts = async (options = {}) => {
  const {
    status = 'published',
    limit = 20,
    offset = 0,
    authorId = null,
    tag = null,
  } = options

  try {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (authorId) {
      query = query.eq('author_id', authorId)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    const { data, error } = await query

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

// --------------------- GET SINGLE POST ---------------------
export const getPost = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('id', postId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

// --------------------- UPDATE POST ---------------------
export const updatePost = async (postId, updates) => {
  try {
    // Calculate new read time if content is updated
    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).filter(Boolean).length
      updates.read_time = Math.ceil(wordCount / 200)
      updates.word_count = wordCount
    }

    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

// --------------------- DELETE POST ---------------------
export const deletePost = async (postId) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

// --------------------- GET USER'S POSTS ---------------------
export const getUserPosts = async (userId, status = null) => {
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching user posts:', error)
    throw error
  }
}

// --------------------- GET POST TAGS ---------------------
export const getPopularTags = async (limit = 10) => {
  try {
    // This is a simplified approach - you might want to store tags separately
    // For now, we'll fetch all posts and count tags
    const { data: posts, error } = await supabase
      .from('posts')
      .select('tags')
      .eq('status', 'published')

    if (error) throw error

    const tagCount = {}
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })

    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }))
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw error
  }
}