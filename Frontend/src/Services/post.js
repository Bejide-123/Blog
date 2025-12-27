import { supabase } from '../lib/supabase.js'

// --------------------- GET PUBLIC POSTS WITH AUTHOR INFO ---------------------
export const getPublicPosts = async (options = {}) => {
  const {
    status = 'published',
    limit = 10,
    offset = 0,
    authorId = null,
    tag = null,
    sortBy = 'createdat',
    sortOrder = 'desc'
  } = options

  try {
    let query = supabase
      .from('posts')
      .select('*')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)
    if (authorId) query = query.eq('authorid', authorId)
    if (tag) query = query.contains('tags', [tag])

    const { data: posts, error: postsError, count } = await query

    if (postsError) throw postsError
    if (!posts || posts.length === 0) {
      return { posts: [], total: 0, hasMore: false }
    }

    const authorIds = [...new Set(posts.map(post => post.authorid).filter(Boolean))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', authorIds)

    const profileMap = {}
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile
      })
    }

    const postsWithAuthors = posts.map(post => ({
      ...post,
      author: profileMap[post.authorid] || {
        username: 'anonymous',
        full_name: 'Anonymous',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorid || 'anonymous'}`
      }
    }))

    return {
      posts: postsWithAuthors,
      total: count || postsWithAuthors.length,
      hasMore: posts.length === limit
    }

  } catch (error) {
    console.error('Error in getPublicPosts:', error)
    throw error
  }
}

// --------------------- GET SINGLE POST WITH AUTHOR ---------------------
export const getPostWithAuthor = async (postId) => {
  try {
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (postError) {
      if (postError.code === 'PGRST116') throw new Error('Post not found')
      throw postError
    }

    if (!post.authorid) {
      return {
        ...post,
        author: {
          username: 'anonymous',
          full_name: 'Anonymous',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous'
        }
      }
    }

    const { data: author } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio')
      .eq('id', post.authorid)
      .single()

    return {
      ...post,
      author: author || {
        username: 'anonymous',
        full_name: 'Anonymous',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorid}`
      }
    }

  } catch (error) {
    console.error('Error in getPostWithAuthor:', error)
    throw error
  }
}

// --------------------- LIKE/UNLIKE POST ---------------------
export const togglePostLike = async (postId, userId) => {
  try {
    // Check if already liked - use array approach to avoid single() issues
    const { data: existingLikes, error: likeError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (likeError) throw likeError;

    const isLiked = existingLikes && existingLikes.length > 0;

    if (isLiked) {
      // Unlike - delete the existing like(s)
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;
      
      // Get current count and decrement
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('likescount')
        .eq('id', postId)
        .single();

      if (postError) throw postError;

      const newCount = Math.max(0, (post?.likescount || 0) - 1);
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({ likescount: newCount })
        .eq('id', postId);

      if (updateError) throw updateError;

      return { liked: false, count: newCount };
    } else {
      // Like - insert new like
      const { error: insertError } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: userId
        });

      if (insertError) throw insertError;

      // Get current count and increment
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('likescount')
        .eq('id', postId)
        .single();

      if (postError) throw postError;

      const newCount = (post?.likescount || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({ likescount: newCount })
        .eq('id', postId);

      if (updateError) throw updateError;

      return { liked: true, count: newCount };
    }
  } catch (error) {
    console.error('Error toggling post like:', error);
    throw error;
  }
}

// --------------------- GET USER'S LIKED POSTS ---------------------
export const getUserLikedPosts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', userId)

    if (error) throw error;
    return data?.map(like => like.post_id) || []
  } catch (error) {
    console.error('Error getting user liked posts:', error)
    return []
  }
}

// --------------------- SAVE/UNSAVE POST ---------------------
export const toggleSavePost = async (postId, userId) => {
  try {
    // Check if already saved - use array approach
    const { data: existingSaves, error: saveError } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (saveError) throw saveError;

    const isSaved = existingSaves && existingSaves.length > 0;

    if (isSaved) {
      // Unsave
      const { error: deleteError } = await supabase
        .from('saved_posts')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      return { saved: false };
    } else {
      // Save
      const { error: insertError } = await supabase
        .from('saved_posts')
        .insert({
          post_id: postId,
          user_id: userId,
          saved_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
      return { saved: true };
    }
  } catch (error) {
    console.error('Error toggling save post:', error);
    throw error;
  }
}

// --------------------- GET SAVED POSTS WITH DETAILS ---------------------
export const getSavedPostsWithDetails = async (userId) => {
  try {
    // First get all saved post IDs for this user
    const { data: savedItems, error: savedError } = await supabase
      .from('saved_posts')
      .select('post_id, saved_at')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    if (savedError) throw savedError
    if (!savedItems || savedItems.length === 0) return []

    // Get post IDs
    const postIds = savedItems.map(item => item.post_id)

    // Fetch the full posts data
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .in('id', postIds)

    if (postsError) throw postsError
    if (!posts || posts.length === 0) return []

    // Get unique author IDs
    const authorIds = [...new Set(posts.map(post => post.authorid).filter(Boolean))]
    
    // Fetch author profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', authorIds)

    const profileMap = {}
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile
      })
    }

    // Create a map of saved_at dates
    const savedAtMap = {}
    savedItems.forEach(item => {
      savedAtMap[item.post_id] = item.saved_at
    })

    // Combine posts with author data and saved_at date
    const postsWithDetails = posts.map(post => ({
      ...post,
      saved_at: savedAtMap[post.id],
      author: profileMap[post.authorid] || {
        username: 'anonymous',
        full_name: 'Anonymous',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorid || 'anonymous'}`
      }
    }))

    // Sort by saved_at date (most recent first)
    return postsWithDetails.sort((a, b) => 
      new Date(b.saved_at) - new Date(a.saved_at)
    )

  } catch (error) {
    console.error('Error in getSavedPostsWithDetails:', error)
    return []
  }
}

// --------------------- GET USER'S SAVED POSTS ---------------------
export const getUserSavedPosts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('saved_posts')
      .select('post_id')
      .eq('user_id', userId)

    if (error) throw error;
    return data?.map(save => save.post_id) || []
  } catch (error) {
    console.error('Error getting user saved posts:', error)
    return []
  }
}

// --------------------- GET TRENDING POSTS ---------------------
export const getTrendingPosts = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('likescount', { ascending: false })
      .limit(limit)

    if (error) throw error;
    return data || []
  } catch (error) {
    console.error('Error in getTrendingPosts:', error)
    return []
  }
}

// --------------------- GET POPULAR TAGS ---------------------
export const getPopularTags = async (limit = 10) => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('tags')
      .eq('status', 'published')

    if (error) throw error;

    const tagCount = {}
    posts?.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })

    const sortedTags = Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }))

    return sortedTags
  } catch (error) {
    console.error('Error in getPopularTags:', error)
    return []
  }
}