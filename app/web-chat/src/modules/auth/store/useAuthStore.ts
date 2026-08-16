import { create } from 'zustand';
import { AuthStore, User } from '../types';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user: User | null) => 
    set({ user, isAuthenticated: !!user }),
    
  setLoading: (isLoading: boolean) => 
    set({ isLoading }),
    
  setError: (error: string | null) => 
    set({ error }),
    
  logout: () => 
    set({ user: null, isAuthenticated: false, error: null }),
}));
