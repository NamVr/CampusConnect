"use client"

import type { User as AppUser } from "@/types";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged, User as FirebaseUser, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";


interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  updateUser: (user: Partial<AppUser>) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  updateUser: () => {},
  signOut: async () => {},
});

export const AuthProviderComponent = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleUser = useCallback(async (rawUser: FirebaseUser | null) => {
    if (rawUser) {
      setFirebaseUser(rawUser);
      const userRef = doc(db, 'users', rawUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as AppUser;
        setUser(userData);
      } else {
        // First time login, create user doc
        const newUser: AppUser = {
          uid: rawUser.uid,
          displayName: rawUser.displayName,
          email: rawUser.email,
          photoURL: rawUser.photoURL,
          interestTags: ["Machine Learning", "Web Development"], // Default interests
          bookmarkedEvents: [],
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      }
      setLoading(false);
    } else {
      setUser(null);
      setFirebaseUser(null);
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (updatedData: Partial<AppUser>) => {
    if (user) {
        const newUserData = { ...user, ...updatedData };
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, newUserData, { merge: true });
        setUser(newUserData);
    }
  }, [user]);

  const signOut = useCallback(async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
    setLoading(false);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, [handleUser]);

  const value = { user, firebaseUser, loading, updateUser, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
