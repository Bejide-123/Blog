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

// --------------------- GET POST WITH DETAILS ---------------------
export const getPostDetails = async (postId) => {
  try {
    // Get post with author info
    const post = await getPostWithAuthor(postId);
    
    // Get comments for this post
    const comments = await getPostComments(postId);
    
    // Get comment count from posts table directly (more efficient)
    const commentCount = post.comments_count || 0;
    
    return {
      ...post,
      comments,
      commentCount
    };
  } catch (error) {
    console.error('Error in getPostDetails:', error);
    throw error;
  }
};

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
    } else {
      // Like - insert new like
      const { error: insertError } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: userId
        });

      // If insertion fails due to unique constraint, ignore (concurrent request may have inserted)
      if (insertError && !/unique|constraint|23505/i.test(insertError.message || '')) {
        throw insertError;
      }
    }

    // Always compute the authoritative likes count from the likes table
    const { data: likesData, error: countError, count } = await supabase
      .from('likes')
      .select('id', { count: 'exact' })
      .eq('post_id', postId);

    if (countError) throw countError;

    const newCount = count || 0;

    const { error: updateError } = await supabase
      .from('posts')
      .update({ likescount: newCount })
      .eq('id', postId);

    if (updateError) throw updateError;

    return { liked: !isLiked, count: newCount };
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

// --------------------- GET POST COMMENTS ---------------------
export const getPostComments = async (postId) => {
  try {
    // First get comments
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (commentsError) throw commentsError;
    if (!comments || comments.length === 0) return [];

    // Get unique user IDs from comments
    const userIds = [...new Set(comments.map(comment => comment.user_id).filter(Boolean))];
    
    if (userIds.length === 0) {
      // Return comments with anonymous authors
      return comments.map(comment => ({
        ...comment,
        author: {
          id: comment.user_id,
          username: 'anonymous',
          full_name: 'Anonymous',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id || 'anonymous'}`
        }
      }));
    }

    // Get profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // Return with anonymous authors if profiles fetch fails
      return comments.map(comment => ({
        ...comment,
        author: {
          id: comment.user_id,
          username: 'anonymous',
          full_name: 'Anonymous',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id || 'anonymous'}`
        }
      }));
    }

    // Create profile map
    const profileMap = {};
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile;
      });
    }

    // Combine comments with author data
    const commentsWithAuthors = comments.map(comment => ({
      ...comment,
      author: profileMap[comment.user_id] || {
        id: comment.user_id,
        username: 'anonymous',
        full_name: 'Anonymous',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id || 'anonymous'}`
      }
    }));

    return commentsWithAuthors;
  } catch (error) {
    console.error('Error getting post comments:', error);
    return [];
  }
};

// --------------------- ADD COMMENT ---------------------
export const addComment = async (postId, userId, content) => {
  try {
    // Insert comment
    const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: content
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // First, get current comment count
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('comments_count')
      .eq('id', postId)
      .single();

    if (postError) throw postError;

    // Update post comment count
    const newCount = (post?.comments_count || 0) + 1;
    const { error: updateError } = await supabase
      .from('posts')
      .update({ comments_count: newCount })
      .eq('id', postId);

    if (updateError) throw updateError;

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', userId)
      .maybeSingle();

    return {
      ...comment,
      author: profile || {
        id: userId,
        username: 'anonymous',
        full_name: 'Anonymous',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId || 'anonymous'}`
      }
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// --------------------- DELETE COMMENT ---------------------
export const deleteComment = async (commentId, userId) => {
  try {
    // First check if user owns the comment
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('post_id')
      .eq('id', commentId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    // Delete the comment
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) throw deleteError;
    
    // First, get current comment count
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('comments_count')
      .eq('id', comment.post_id)
      .single();

    if (postError) throw postError;

    // Decrement post comment count
    const newCount = Math.max(0, (post?.comments_count || 0) - 1);
    await supabase
      .from('posts')
      .update({ comments_count: newCount })
      .eq('id', comment.post_id);
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// --------------------- GET COMMENT COUNT ---------------------
export const getCommentCount = async (postId) => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('comments_count')
      .eq('id', postId)
      .single();

    if (error) throw error;
    
    return post?.comments_count || 0;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
};

// --------------------- TOGGLE COMMENT LIKE ---------------------
export const toggleCommentLike = async (commentId, userId) => {
  try {
    // Check if already liked
    const { data: existingLikes, error: likeError } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    // If table doesn't exist, return without error
    if (likeError && likeError.code === 'PGRST205') {
      console.log('comment_likes table not found');
      return { liked: false };
    }
    
    if (likeError) throw likeError;

    const isLiked = existingLikes && existingLikes.length > 0;

    if (isLiked) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;
      
      // First, get current likes count
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .select('likes_count')
        .eq('id', commentId)
        .single();

      if (commentError) throw commentError;

      // Update comment likes count
      const newCount = Math.max(0, (comment?.likes_count || 0) - 1);
      await supabase
        .from('comments')
        .update({ likes_count: newCount })
        .eq('id', commentId);
      
      return { liked: false };
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId
        });

      if (insertError) throw insertError;

      // First, get current likes count
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .select('likes_count')
        .eq('id', commentId)
        .single();

      if (commentError) throw commentError;

      // Update comment likes count
      const newCount = (comment?.likes_count || 0) + 1;
      await supabase
        .from('comments')
        .update({ likes_count: newCount })
        .eq('id', commentId);
      
      return { liked: true };
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return { liked: false };
  }
};

// --------------------- GET COMMENT LIKES ---------------------
export const getCommentLikes = async (commentId) => {
  try {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('user_id')
      .eq('comment_id', commentId);

    if (error && error.code === 'PGRST205') {
      return [];
    }
    
    if (error) throw error;
    
    return data?.map(like => like.user_id) || [];
  } catch (error) {
    console.error('Error getting comment likes:', error);
    return [];
  }
};

// --------------------- GET USER COMMENT LIKES ---------------------
export const getUserCommentLikes = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', userId);

    if (error && error.code === 'PGRST205') {
      return [];
    }
    
    if (error) throw error;
    
    return data?.map(like => like.comment_id) || [];
  } catch (error) {
    console.error('Error getting user comment likes:', error);
    return [];
  }
};


// ... all your existing functions ...

// ==================== SEARCH FUNCTIONS ====================

// --------------------- SEARCH POSTS ---------------------
export const searchPosts = async (searchTerm, filters = {}) => {
  const {
    limit = 20,
    offset = 0,
    sortBy = 'createdat',
    sortOrder = 'desc'
  } = filters;

  try {
    // Build the query for full-text search
    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .limit(limit)
      .range(offset, offset + limit - 1);

    // If search term is provided, use full-text search
    if (searchTerm.trim()) {
      // Search in title, content, and tags
      query = query.or(
        `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
      );
    }

    const { data: posts, error: postsError, count } = await query;

    if (postsError) throw postsError;
    if (!posts || posts.length === 0) {
      return { posts: [], total: 0, hasMore: false };
    }

    // Get author information for all posts
    const authorIds = [...new Set(posts.map(post => post.authorid).filter(Boolean))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', authorIds);

    const profileMap = {};
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile;
      });
    }

    // Combine posts with author data
    const postsWithAuthors = posts.map(post => ({
      ...post,
      author: profileMap[post.authorid] || {
        username: 'anonymous',
        full_name: 'Anonymous',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorid || 'anonymous'}`
      }
    }));

    return {
      posts: postsWithAuthors,
      total: count || postsWithAuthors.length,
      hasMore: posts.length === limit
    };

  } catch (error) {
    console.error('Error in searchPosts:', error);
    throw error;
  }
};

// --------------------- SEARCH USERS ---------------------
export const searchUsers = async (searchTerm, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio')
      .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
      .limit(limit);

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error in searchUsers:', error);
    return [];
  }
};

// --------------------- SEARCH TAGS ---------------------
export const searchTags = async (searchTerm, limit = 10) => {
  try {
    // Get all posts and extract tags
    const { data: posts, error } = await supabase
      .from('posts')
      .select('tags')
      .eq('status', 'published');

    if (error) throw error;

    // Count occurrences of matching tags
    const tagCount = {};
    posts?.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          const tagLower = tag.toLowerCase();
          const searchLower = searchTerm.toLowerCase();
          
          if (tagLower.includes(searchLower)) {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          }
        });
      }
    });

    // Sort by count and limit
    const sortedTags = Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));

    return sortedTags;
  } catch (error) {
    console.error('Error in searchTags:', error);
    return [];
  }
};

// --------------------- GET SEARCH SUGGESTIONS ---------------------
export const getSearchSuggestions = async (searchTerm, limit = 5) => {
  try {
    const [posts, users, tags] = await Promise.all([
      // Search posts for suggestions
      supabase
        .from('posts')
        .select('title, id')
        .eq('status', 'published')
        .ilike('title', `%${searchTerm}%`)
        .limit(limit),

      // Search users for suggestions
      supabase
        .from('profiles')
        .select('username, full_name')
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(limit),

      // Get tag suggestions
      searchTags(searchTerm, limit)
    ]);

    const suggestions = [];

    // Add post suggestions
    if (posts.data) {
      posts.data.forEach(post => {
        suggestions.push({
          type: 'post',
          text: post.title,
          icon: '📝'
        });
      });
    }

    // Add user suggestions
    if (users.data) {
      users.data.forEach(user => {
        suggestions.push({
          type: 'user',
          text: `@${user.username}`,
          subtitle: user.full_name,
          icon: '👤'
        });
      });
    }

    // Add tag suggestions
    if (tags.length > 0) {
      tags.forEach(tagObj => {
        suggestions.push({
          type: 'tag',
          text: `#${tagObj.tag}`,
          count: tagObj.count,
          icon: '🏷️'
        });
      });
    }

    return suggestions.slice(0, limit * 3); // Limit total suggestions

  } catch (error) {
    console.error('Error in getSearchSuggestions:', error);
    return [];
  }
};