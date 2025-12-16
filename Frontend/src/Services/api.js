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
