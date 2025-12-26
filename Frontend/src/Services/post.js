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
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (existingLike) {
      // Unlike
      await supabase.from('likes').delete().eq('id', existingLike.id)
      
      // Get current count and decrement
      const { data: post } = await supabase
        .from('posts')
        .select('likescount')
        .eq('id', postId)
        .single()

      const newCount = Math.max(0, (post?.likescount || 0) - 1)
      
      await supabase
        .from('posts')
        .update({ likescount: newCount })
        .eq('id', postId)

      return { liked: false, count: newCount }
    } else {
      // Like
      await supabase.from('likes').insert({
        post_id: postId,
        user_id: userId
      })

      // Get current count and increment
      const { data: post } = await supabase
        .from('posts')
        .select('likescount')
        .eq('id', postId)
        .single()

      const newCount = (post?.likescount || 0) + 1
      
      await supabase
        .from('posts')
        .update({ likescount: newCount })
        .eq('id', postId)

      return { liked: true, count: newCount }
    }
  } catch (error) {
    console.error('Error toggling post like:', error)
    throw error
  }
}

// --------------------- GET USER'S LIKED POSTS ---------------------
export const getUserLikedPosts = async (userId) => {
  try {
    const { data } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', userId)

    return data?.map(like => like.post_id) || []
  } catch (error) {
    console.error('Error getting user liked posts:', error)
    return []
  }
}

// --------------------- SAVE/UNSAVE POST ---------------------
export const toggleSavePost = async (postId, userId) => {
  try {
    // Check if already saved
    const { data: existingSave } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (existingSave) {
      // Unsave
      await supabase.from('saved_posts').delete().eq('id', existingSave.id)
      return { saved: false }
    } else {
      // Save
      await supabase.from('saved_posts').insert({
        post_id: postId,
        user_id: userId,
        saved_at: new Date().toISOString()
      })
      return { saved: true }
    }
  } catch (error) {
    console.error('Error toggling save post:', error)
    throw error
  }
}

// --------------------- GET USER'S SAVED POSTS ---------------------
export const getUserSavedPosts = async (userId) => {
  try {
    const { data } = await supabase
      .from('saved_posts')
      .select('post_id')
      .eq('user_id', userId)

    return data?.map(save => save.post_id) || []
  } catch (error) {
    console.error('Error getting user saved posts:', error)
    return []
  }
}

// --------------------- GET TRENDING POSTS ---------------------
export const getTrendingPosts = async (limit = 10) => {
  try {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('likescount', { ascending: false })
      .limit(limit)

    return data || []
  } catch (error) {
    console.error('Error in getTrendingPosts:', error)
    return []
  }
}

// --------------------- GET POPULAR TAGS ---------------------
export const getPopularTags = async (limit = 10) => {
  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('tags')
      .eq('status', 'published')

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