"use client"

import type { User, Question } from "@/types";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Mock user data for demonstration purposes
const MOCK_USER: User = {
  uid: "mock-user-123",
  displayName: "Alex Doe",
  email: "alex.doe@example.com",
  photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop",
  interestTags: ["Machine Learning", "Web Development", "Data Science"],
  bookmarkedEvents: ["event-1"],
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  updateUser: () => {},
});

// Since we don't have a real backend, we'll use localStorage to simulate persistence.
const LOCAL_STORAGE_USER_KEY = 'campusconnect_user';

export const AuthProviderComponent = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data from local storage
    setTimeout(() => {
      try {
        const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // If no user in storage, use the mock user and save it
          setUser(MOCK_USER);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(MOCK_USER));
        }
      } catch (error) {
        // If something goes wrong, default to mock user
        setUser(MOCK_USER);
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, []);

  const updateUser = useCallback((updatedUser: User | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, []);

  const value = { user, loading, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
