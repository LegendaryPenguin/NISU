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
import {
  displayNameFromUser,
  getStaticCoupleNames,
  normalizeEmail,
} from "@/lib/couple-profile";

interface AuthContextValue {
  user: User | null;
  displayName: string;
  partnerName: string;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_NAMES = { displayName: "User", partnerName: "Partner" };

async function resolveCoupleNames(
  user: User
): Promise<{ displayName: string; partnerName: string }> {
  const email = normalizeEmail(user.email);
  const staticNames = getStaticCoupleNames(email);
  if (staticNames) return staticNames;

  try {
    const supabase = createClient();
    const { data: partnerRow } = await supabase
      .from("nisu_couple_members")
      .select("email")
      .neq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (partnerRow?.email) {
      const partnerStatic = getStaticCoupleNames(partnerRow.email);
      if (partnerStatic) {
        return {
          displayName: displayNameFromUser(email, user.user_metadata),
          partnerName: partnerStatic.displayName,
        };
      }
    }
  } catch {
    /* offline */
  }

  return {
    displayName: displayNameFromUser(email, user.user_metadata),
    partnerName: "Partner",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [names, setNames] = useState(DEFAULT_NAMES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
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

  useEffect(() => {
    if (!user) {
      setNames(DEFAULT_NAMES);
      return;
    }
    let cancelled = false;
    resolveCoupleNames(user).then((resolved) => {
      if (!cancelled) setNames(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        displayName: names.displayName,
        partnerName: names.partnerName,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
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
