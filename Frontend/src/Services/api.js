// src/services/auth.js
import axios from 'axios'
import { supabase, SUPABASE_STORAGE_BUCKET } from '../lib/supabase.js' 

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
// UPDATE the uploadImage function (it's already correct in your code, just make sure)
export const uploadImage = async (file, folder = 'posts') => {
  try {
    console.log('Uploading image to media bucket...', file.name);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${folder}/${timestamp}_${randomString}.${fileExt}`;
    
    // Upload to 'media' bucket
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = await supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    console.log('Upload successful. URL:', publicUrl);
    return publicUrl;
    
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// UPDATE createPost function to store URL properly
export const createPost = async (postData) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) throw new Error('User not authenticated')

    const wordCount = postData.content.split(/\s+/).filter(Boolean).length
    const readTime = Math.ceil(wordCount / 200)

    const postToCreate = {
      title: postData.title,
      content: postData.content,
      tags: postData.tags || [],
      status: postData.status || 'draft',
      authorid: user.id,
      ispublic: postData.isPublic !== undefined ? postData.isPublic : true, // FIX: use isPublic
      allowcomments: postData.allowComments !== undefined ? postData.allowComments : true, // FIX: use allowComments
      read_time: readTime,
      word_count: wordCount,
      viewscount: 0,
      likescount: 0,
      comments_count: 0,
      featured_image: postData.featured_image || null, // STORE THE URL HERE
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    }

    console.log('Creating post with image URL:', postToCreate.featured_image)

    const { error } = await supabase
      .from('posts')
      .insert([postToCreate])

    if (error) {
      console.error('Insert error:', error)
      throw error
    }

    console.log('Post created successfully')
    return { success: true }
    
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

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

// In src/services/auth.js - Add this function if not already there:

// --------------------- GET POSTS WITH PROFILES ---------------------
export const getPostsWithProfiles = async (options = {}) => {
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
        profiles:authorid (
          username,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
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

// --------------------- GET USER PROFILE BY ID ---------------------
export const getUserProfileById = async (userId) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        avatar_url,
        bio,
        location,
        website_url,
        created_at,
        followers_count,
        following_count,
        posts_count
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;

    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// --------------------- CHECK FOLLOW STATUS ---------------------
export const checkFollowStatus = async (targetUserId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isFollowing: false };

    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single();

    return { isFollowing: !!data };
  } catch (error) {
    return { isFollowing: false };
  }
};

// --------------------- TOGGLE FOLLOW ---------------------
export const toggleFollowUser = async (targetUserId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check current follow status
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single();

    if (existingFollow) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) throw error;
      return { isFollowing: false, action: 'unfollowed' };
    } else {
      // Follow
      const { error } = await supabase
        .from('follows')
        .insert([{
          follower_id: user.id,
          following_id: targetUserId
        }]);

      if (error) throw error;
      return { isFollowing: true, action: 'followed' };
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    throw error;
  }
};

// --------------------- GET USER STATS ---------------------
export const getUserStats = async (userId) => {
  try {
    const [
      { count: postsCount },
      { count: followersCount },
      { count: followingCount }
    ] = await Promise.all([
      supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('authorid', userId)
        .eq('status', 'published'),
      supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId),
      supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', userId)
    ]);

    return {
      posts: postsCount || 0,
      followers: followersCount || 0,
      following: followingCount || 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { posts: 0, followers: 0, following: 0 };
  }
};