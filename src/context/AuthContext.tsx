"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

const USER_MAP: Record<string, { displayName: string; partnerName: string }> = {
  "nisch.rawal@gmail.com": { displayName: "Nischay", partnerName: "Supritha" },
  "suprithachak@gmail.com": { displayName: "Supritha", partnerName: "Nischay" },
};

interface AuthContextValue {
  user: User | null;
  displayName: string;
  partnerName: string;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getUserNames(user: User | null) {
  if (!user?.email) return { displayName: "User", partnerName: "Partner" };
  const mapped = USER_MAP[user.email];
  if (mapped) return mapped;
  const name = user.user_metadata?.full_name || user.email.split("@")[0];
  return { displayName: name, partnerName: "Partner" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  }, []);

  const { displayName, partnerName } = getUserNames(user);

  return (
    <AuthContext.Provider
      value={{ user, displayName, partnerName, isLoading, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
