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
export const toggleFollowUser = async (targetUserId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    console.log('DEBUG: Starting follow toggle');
    console.log('DEBUG: Current user ID:', user.id);
    console.log('DEBUG: Target user ID:', targetUserId);

    // Check existing follow
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .maybeSingle();

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

      if (deleteError) {
        console.error('DEBUG: Delete error:', deleteError);
        throw deleteError;
      }
      
      console.log('DEBUG: Follow record deleted');
      
      // 2. Get CURRENT profiles data
      console.log('DEBUG: Fetching current profiles...');
      
      // Get target user's current followers count
      const { data: targetProfile, error: targetError } = await supabase
        .from('profiles')
        .select('followers_count')
        .eq('id', targetUserId)
        .single();
      
      if (targetError) console.error('DEBUG: Target profile error:', targetError);
      
      // Get current user's current following count  
      const { data: currentProfile, error: currentError } = await supabase
        .from('profiles')
        .select('following_count')
        .eq('id', user.id)
        .single();
      
      if (currentError) console.error('DEBUG: Current profile error:', currentError);
      
      console.log('DEBUG: Target current followers:', targetProfile?.followers_count || 0);
      console.log('DEBUG: Current user following:', currentProfile?.following_count || 0);
      
      // 3. Update counts SIMPLY
      // Update TARGET user's followers (person being unfollowed)
      const { error: updateTargetError } = await supabase
        .from('profiles')
        .update({ 
          followers_count: Math.max((targetProfile?.followers_count || 0) - 1, 0)
        })
        .eq('id', targetUserId);
      
      if (updateTargetError) {
        console.error('DEBUG: Update target error:', updateTargetError);
      } else {
        console.log('DEBUG: Updated target followers count');
      }
      
      // Update CURRENT user's following (person doing the unfollowing)
      const { error: updateCurrentError } = await supabase
        .from('profiles')
        .update({ 
          following_count: Math.max((currentProfile?.following_count || 0) - 1, 0)
        })
        .eq('id', user.id);
      
      if (updateCurrentError) {
        console.error('DEBUG: Update current error:', updateCurrentError);
      } else {
        console.log('DEBUG: Updated current following count');
      }
      
      console.log('DEBUG: Unfollow completed');
      return { isFollowing: false, action: 'unfollowed' };
      
    } else {
      // FOLLOW
      console.log('DEBUG: Following user', targetUserId);
      
      // 1. First get current counts BEFORE inserting
      console.log('DEBUG: Fetching current profiles BEFORE follow...');
      
      const { data: targetProfile, error: targetError } = await supabase
        .from('profiles')
        .select('followers_count')
        .eq('id', targetUserId)
        .single();
      
      if (targetError) console.error('DEBUG: Target profile error:', targetError);
      
      const { data: currentProfile, error: currentError } = await supabase
        .from('profiles')
        .select('following_count')
        .eq('id', user.id)
        .single();
      
      if (currentError) console.error('DEBUG: Current profile error:', currentError);
      
      console.log('DEBUG: Target current followers:', targetProfile?.followers_count || 0);
      console.log('DEBUG: Current user following:', currentProfile?.following_count || 0);
      
      // 2. Insert follow record
      const { error: insertError } = await supabase
        .from('follows')
        .insert([{
          follower_id: user.id,
          following_id: targetUserId,
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('DEBUG: Insert error:', insertError);
        throw insertError;
      }
      
      console.log('DEBUG: Follow record inserted');
      
      // 3. Update counts
      // Update TARGET user's followers (person being followed) - INCREASE
      const { error: updateTargetError } = await supabase
        .from('profiles')
        .update({ 
          followers_count: (targetProfile?.followers_count || 0) + 1
        })
        .eq('id', targetUserId);
      
      if (updateTargetError) {
        console.error('DEBUG: Update target error:', updateTargetError);
      } else {
        console.log('DEBUG: Updated target followers count to:', (targetProfile?.followers_count || 0) + 1);
      }
      
      // Update CURRENT user's following (person doing the following) - INCREASE
      const { error: updateCurrentError } = await supabase
        .from('profiles')
        .update({ 
          following_count: (currentProfile?.following_count || 0) + 1
        })
        .eq('id', user.id);
      
      if (updateCurrentError) {
        console.error('DEBUG: Update current error:', updateCurrentError);
      } else {
        console.log('DEBUG: Updated current following count to:', (currentProfile?.following_count || 0) + 1);
      }
      
      console.log('DEBUG: Follow completed');
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