import { supabase } from './supabaseClient';
import { User } from '../types';

export const authService = {
  // Map Supabase user to our App User type
  mapUser: (supabaseUser: any): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
      avatar: supabaseUser.user_metadata?.avatar_url
    };
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned');

    return authService.mapUser(data.user);
  },

  register: async (email: string, password: string, name?: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        }
      }
    });

    if (error) throw error;
    // Note: If email confirmation is enabled in Supabase, data.user might be null or session null until confirmed.
    // For this app, we assume immediate login or we return the user object to show "Check email" state if needed.
    if (!data.user) throw new Error('Registration failed');

    return authService.mapUser(data.user);
  },

  loginWithGoogle: async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return authService.mapUser(session.user);
    }
    return null;
  }
};