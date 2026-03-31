// Services/settings.js
import { supabase } from '../lib/supabase';

// ─── Get user profile from profiles table ─────────────────────────────────────
export const getUserProfile = async (userId) => {
  if (!userId) throw new Error('No userId provided');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
};

// ─── Ensure a preferences row exists for the user ─────────────────────────────
// Creates a default row if one doesn't exist yet — safe to call every time
export const ensurePreferencesExist = async (userId) => {
  if (!userId) throw new Error('No userId provided');

  // Check if row already exists
  const { data, error: fetchError } = await supabase
    .from('user_preferences')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle(); // Changed from .single() to .maybeSingle()

  // If not found, insert defaults
  if (!data) {
    const { error: insertError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        show_followers: true,
        show_following: true,
        profile_searchable: true,
        dark_mode: false,
        email_notifications: true,
        weekly_digest: false,
        allow_comments: true,
        profile_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;
    console.log('Created default preferences for user:', userId);
  } else if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError;
  }

  return true;
};

// ─── Fetch user preferences ───────────────────────────────────────────────────
export const getUserPreferences = async (userId) => {
  if (!userId) throw new Error('No userId provided');

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle(); // Changed from .single() to .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error;

  return data ?? {
    show_followers: true,
    show_following: true,
    profile_searchable: true,
    dark_mode: false,
    email_notifications: true,
    weekly_digest: false,
    allow_comments: true,
    profile_public: true,
  };
};

// ─── Create or update user preferences ───────────────────────────────────────
// FIXED: Properly handles update vs insert without conflicts
export const upsertUserPreferences = async (userId, preferences) => {
  if (!userId) throw new Error('No userId provided');

  // First, check if record exists
  const { data: existing, error: checkError } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') throw checkError;

  let result;
  
  if (existing) {
    // UPDATE existing record
    result = await supabase
      .from('user_preferences')
      .update({
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .maybeSingle();
  } else {
    // INSERT new record
    result = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        ...preferences,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();
  }

  if (result.error) throw result.error;
  return result.data;
};

// ─── Update profile info (username only — no email in profiles table) ─────────
export const updateProfileInfo = async (userId, updates) => {
  if (!userId) throw new Error('No userId provided');

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...(updates.username && { username: updates.username }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ─── Update email via Supabase Auth (not profiles table) ─────────────────────
export const updateEmail = async (newEmail) => {
  if (!newEmail) throw new Error('No email provided');

  const { data, error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw error;

  return { success: true, message: 'Confirmation email sent to ' + newEmail };
};

// ─── Change password ──────────────────────────────────────────────────────────
export const changePassword = async (userEmail, currentPassword, newPassword) => {
  if (!userEmail) throw new Error('No email provided');

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: currentPassword,
  });
  if (signInError) throw new Error('Current password is incorrect');

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (updateError) throw updateError;

  return { success: true, message: 'Password updated successfully' };
};

// ─── Delete user account ──────────────────────────────────────────────────────
export const deleteUserAccount = async (userId) => {
  if (!userId) throw new Error('No userId provided');

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  
  if (error) throw error;

  await supabase.auth.signOut();

  return { success: true, message: 'Account deleted successfully' };
};

// ─── Sync theme preference ────────────────────────────────────────────────────
export const syncThemePreference = async (userId, isDarkMode) => {
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  if (userId) {
    await upsertUserPreferences(userId, { dark_mode: isDarkMode });
  }
  return { success: true };
};

// ─── Initialize default preferences for new user ─────────────────────────────
export const initializeUserPreferences = async (userId) => {
  if (!userId) throw new Error('No userId provided');

  const { data, error } = await supabase
    .from('user_preferences')
    .insert({
      user_id: userId,
      show_followers: true,
      show_following: true,
      profile_searchable: true,
      dark_mode: false,
      email_notifications: true,
      weekly_digest: false,
      allow_comments: true,
      profile_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};