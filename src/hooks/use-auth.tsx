"use client"

import type { User as AppUser } from "@/types";
import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// Mock user data
const MOCK_USER: AppUser = {
  uid: 'user-1',
  displayName: 'Alex Doe',
  email: 'alex.doe@example.com',
  photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop',
  interestTags: ['Machine Learning', 'Web Development', 'Python'],
  bookmarkedEvents: ['event-1', 'event-3'],
};


interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  updateUser: (user: Partial<AppUser>) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  updateUser: () => {},
  signOut: async () => {},
});

export const AuthProviderComponent = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(MOCK_USER);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateUser = useCallback(async (updatedData: Partial<AppUser>) => {
    if (user) {
        const newUserData = { ...user, ...updatedData };
        setUser(newUserData);
    }
  }, [user]);

  const signOut = useCallback(async () => {
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = { user, firebaseUser: null, loading, updateUser, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
