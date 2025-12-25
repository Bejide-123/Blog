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
    // Fetch posts first
    let query = supabase
      .from('posts')
      .select('*')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .limit(limit)
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (authorId) {
      query = query.eq('authorid', authorId)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    const { data: posts, error: postsError, count } = await query

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      throw postsError
    }

    if (!posts || posts.length === 0) {
      return {
        posts: [],
        total: 0,
        hasMore: false
      }
    }

    // Get unique author IDs
    const authorIds = [...new Set(posts.map(post => post.authorid).filter(Boolean))]

    // Fetch author profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', authorIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      // Continue with posts even if profiles fail
    }

    // Create a map of profiles
    const profileMap = {}
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile
      })
    }

    // Combine posts with author data
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
    // Fetch the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (postError) {
      if (postError.code === 'PGRST116') {
        throw new Error('Post not found')
      }
      throw postError
    }

    // If no author ID, return post without author
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

    // Fetch author profile
    const { data: author, error: authorError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio')
      .eq('id', post.authorid)
      .single()

    // Return post with author (even if author fetch fails)
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

// --------------------- GET TRENDING POSTS ---------------------
export const getTrendingPosts = async (limit = 10) => {
  try {
    // This assumes you have a views_count column
    // If not, just get latest posts
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('createdat', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error in getTrendingPosts:', error)
    throw error
  }
}

// --------------------- GET POSTS BY TAG ---------------------
export const getPostsByTag = async (tag, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .contains('tags', [tag])
      .order('createdat', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error in getPostsByTag:', error)
    throw error
  }
}

// --------------------- GET POPULAR TAGS ---------------------
export const getPopularTags = async (limit = 10) => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('tags')
      .eq('status', 'published')

    if (error) throw error

    // Count tag frequency
    const tagCount = {}
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })

    // Convert to array and sort
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

// --------------------- SEARCH POSTS ---------------------
export const searchPosts = async (searchTerm, options = {}) => {
  const {
    limit = 20,
    offset = 0
  } = options

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .eq('status', 'published')
      .order('createdat', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error in searchPosts:', error)
    throw error
  }
}