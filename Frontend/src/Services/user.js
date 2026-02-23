// src/services/user.js
import { supabase } from '../lib/supabase.js';

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

    // Use maybeSingle instead of single to handle "no rows found" gracefully
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .maybeSingle(); // Changed from .single() to .maybeSingle()

    // Handle specific errors
    if (error) {
      // PGRST116 = no rows found (which is okay)
      if (error.code === 'PGRST116') {
        return { isFollowing: false };
      }
      // 406 error = Not Acceptable (RLS issue or table doesn't exist)
      if (error.code === '406' || error.message?.includes('406')) {
        console.warn('Follows table may have RLS issues or doesn\'t exist:', error.message);
        return { isFollowing: false };
      }
      // Throw other errors
      throw error;
    }

    return { isFollowing: !!data };
  } catch (error) {
    console.error('Error checking follow status:', error);
    return { isFollowing: false };
  }
};

// --------------------- TOGGLE FOLLOW (DEBUG VERSION) ---------------------
// --------------------- TOGGLE FOLLOW (IMPROVED VERSION) ---------------------
export const toggleFollowUser = async (targetUserId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    console.log('DEBUG: Starting follow toggle');
    console.log('DEBUG: Current user ID:', user.id);
    console.log('DEBUG: Target user ID:', targetUserId);

    // Check if follows table exists and is accessible
    try {
      // Check existing follow
      const { data: existingFollow, error: checkError } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      if (checkError) {
        // If table doesn't exist, show a helpful message
        if (checkError.code === '42P01') {
          console.error('Follows table does not exist. Please create it in Supabase SQL editor.');
          throw new Error('Follow system is not set up yet. Please contact support.');
        }
        throw checkError;
      }

      console.log('DEBUG: Already following?', !!existingFollow);

      if (existingFollow) {
        // UNFOLLOW
        console.log('DEBUG: Unfollowing user', targetUserId);
        
        // 1. Delete the follow record
        const { error: deleteError } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (deleteError) throw deleteError;
        
        console.log('DEBUG: Follow record deleted');
        
        // 2. Fetch current counts
        const { data: targetProfile, error: targetFetchError } = await supabase
          .from('profiles')
          .select('followers_count')
          .eq('id', targetUserId)
          .single();
        
        const { data: currentProfile, error: currentFetchError } = await supabase
          .from('profiles')
          .select('following_count')
          .eq('id', user.id)
          .single();
        
        if (targetFetchError || currentFetchError) {
          console.error('Error fetching profiles:', { targetFetchError, currentFetchError });
          throw new Error('Could not fetch profile data for update');
        }
        
        // 3. Update counts
        const targetNewCount = Math.max((targetProfile?.followers_count || 0) - 1, 0);
        const currentNewCount = Math.max((currentProfile?.following_count || 0) - 1, 0);
        
        const updatePromises = [
          supabase
            .from('profiles')
            .update({ followers_count: targetNewCount })
            .eq('id', targetUserId),
          supabase
            .from('profiles')
            .update({ following_count: currentNewCount })
            .eq('id', user.id)
        ];
        
        const [targetUpdate, currentUpdate] = await Promise.all(updatePromises);
        
        if (targetUpdate.error || currentUpdate.error) {
          console.error('Error updating counts:', { targetError: targetUpdate.error, currentError: currentUpdate.error });
          throw new Error('Could not update follower/following counts');
        }
        
        console.log('DEBUG: Unfollow completed');
        return { isFollowing: false, action: 'unfollowed' };
        
      } else {
        // FOLLOW
        console.log('DEBUG: Following user', targetUserId);
        
        // 1. Fetch current counts BEFORE inserting follow record
        const { data: targetProfile, error: targetFetchError } = await supabase
          .from('profiles')
          .select('followers_count')
          .eq('id', targetUserId)
          .single();
        
        const { data: currentProfile, error: currentFetchError } = await supabase
          .from('profiles')
          .select('following_count')
          .eq('id', user.id)
          .single();
        
        if (targetFetchError || currentFetchError) {
          console.error('Error fetching profiles:', { targetFetchError, currentFetchError });
          throw new Error('Could not fetch profile data');
        }
        
        // 2. Insert follow record
        const { error: insertError } = await supabase
          .from('follows')
          .insert([{
            follower_id: user.id,
            following_id: targetUserId,
            created_at: new Date().toISOString()
          }]);

        if (insertError) {
          // If it's a duplicate, it's okay - they're already following
          if (insertError.code === '23505') {
            console.log('DEBUG: Already following (duplicate)');
            return { isFollowing: true, action: 'already_following' };
          }
          throw insertError;
        }
        
        console.log('DEBUG: Follow record inserted');
        
        // 3. Calculate new counts
        const targetNewCount = (targetProfile?.followers_count || 0) + 1;
        const currentNewCount = (currentProfile?.following_count || 0) + 1;
        
        // 4. Update counts in parallel
        const updatePromises = [
          supabase
            .from('profiles')
            .update({ followers_count: targetNewCount })
            .eq('id', targetUserId),
          supabase
            .from('profiles')
            .update({ following_count: currentNewCount })
            .eq('id', user.id)
        ];
        
        const [targetUpdate, currentUpdate] = await Promise.all(updatePromises);
        
        if (targetUpdate.error || currentUpdate.error) {
          console.error('Error updating counts:', { targetError: targetUpdate.error, currentError: currentUpdate.error });
          throw new Error('Could not update follower/following counts');
        }
        
        console.log('DEBUG: Follow completed');
        return { isFollowing: true, action: 'followed' };
      }
    } catch (tableError) {
      console.error('Table access error:', tableError);
      throw new Error('Follow system is not properly configured. Please try again later.');
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

// --------------------- GET USER POSTS ---------------------
export const getUserPosts = async (userId, options = {}) => {
  try {
    const { status = 'published', limit = 20, offset = 0 } = options;
    
    // Get posts first
    let query = supabase
      .from('posts')
      .select('*')
      .eq('authorid', userId)
      .order('createdat', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: posts, error } = await query;

    if (error) throw error;

    if (!posts || posts.length === 0) return [];

    // Get author profiles separately
    const authorIds = [...new Set(posts.map(post => post.authorid))];
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .in('id', authorIds);

    if (profilesError) {
      console.warn('Could not fetch profiles:', profilesError);
      return posts; // Return posts without author info if profiles fetch fails
    }

    // Create a map for quick profile lookup
    const profilesMap = {};
    if (profiles) {
      profiles.forEach(profile => {
        profilesMap[profile.id] = {
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        };
      });
    }

    // Add profile info to each post
    const postsWithProfiles = posts.map(post => ({
      ...post,
      profiles: profilesMap[post.authorid] || null
    }));

    return postsWithProfiles;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

// --------------------- GET USER FOLLOWERS ---------------------
export const getUserFollowers = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower:profiles!follows_follower_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          bio
        ),
        created_at
      `)
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      // Handle 406 error
      if (error.code === '406' || error.message?.includes('406')) {
        console.warn('Follows table may have RLS issues. Returning empty followers list.');
        return [];
      }
      throw error;
    }

    return data.map(follow => ({
      ...follow.follower,
      followed_at: follow.created_at
    }));
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

// --------------------- GET USER FOLLOWING ---------------------
export const getUserFollowing = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        following:profiles!follows_following_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          bio
        ),
        created_at
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      // Handle 406 error
      if (error.code === '406' || error.message?.includes('406')) {
        console.warn('Follows table may have RLS issues. Returning empty following list.');
        return [];
      }
      throw error;
    }

    return data.map(follow => ({
      ...follow.following,
      followed_at: follow.created_at
    }));
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};