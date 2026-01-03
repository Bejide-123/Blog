// Add these to your existing api.js or create a new searchService.js
import { supabase } from '../lib/supabase.js';

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