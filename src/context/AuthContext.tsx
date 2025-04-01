import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Define the shape of our auth context
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (
    email: string,
    password: string,
    userData: any,
  ) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the auth provider component as a named arrow function component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if a user has admin role
  const checkUserRole = async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("is_admin, status")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error checking user admin status:", error);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const isUserAdmin = data?.is_admin === true;
      console.log(
        "User admin status:",
        isUserAdmin,
        "is_admin:",
        data?.is_admin,
      );
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        return {
          data: null,
          error: new Error("Email and password are required"),
        };
      }

      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (response.error) {
        console.error("Supabase auth error:", response.error);
        return response;
      }

      return response;
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      return { data: null, error: error as Error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Input validation
      if (!email || !password) {
        return {
          data: null,
          error: new Error("Email and password are required"),
        };
      }

      if (!userData || !userData.firstName || !userData.lastName) {
        return {
          data: null,
          error: new Error("First name and last name are required"),
        };
      }

      // First check if the email already exists in the users table
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing user:", checkError);
        return { data: null, error: checkError };
      }

      if (existingUser) {
        console.error("Email already exists in users table");
        return {
          data: null,
          error: new Error("An account with this email already exists"),
        };
      }

      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: `${userData.firstName} ${userData.lastName}`,
            status: "pending",
          },
        },
      });

      if (error) {
        console.error("Error signing up user in Auth:", error);
        return { data, error };
      }

      if (!data.user) {
        console.error("No user returned from signup");
        return { data, error: new Error("No user returned from signup") };
      }

      console.log("User created in Auth:", data.user.id);

      // Insert the user into the users table
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: email,
          name: userData.firstName,
          is_admin: false,
          is_approved: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error("Error inserting user into users table:", insertError);

        // If we failed to insert into users table, attempt to delete the auth user
        // to maintain consistency
        try {
          // We need to use the admin API to delete the user, which requires a service role
          // Since we don't have direct access to that here, we'll log the error
          // In a production environment, you might want to use a serverless function for this
          console.error(
            "Failed to insert user into users table. The auth user may need to be manually deleted.",
            data.user.id,
          );
        } catch (deleteErr) {
          console.error(
            "Error attempting cleanup after failed insert:",
            deleteErr,
          );
        }

        return {
          data: null,
          error: new Error("Registration failed. Please contact support."),
        };
      }

      console.log("User added to users table successfully");
      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      return { data: null, error: err as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // Initialize auth state and set up listener
  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        if (isMounted) setIsLoading(true);
        const { data } = await supabase.auth.getSession();

        if (!isMounted) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session?.user?.id) {
          if (isMounted) await checkUserRole(data.session.user.id);
        } else {
          if (isMounted) setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    // Set a timeout to ensure loading state doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log("Loading timeout reached, forcing loading state to false");
        setIsLoading(false);
      }
    }, 3000); // 3 second timeout

    getInitialSession();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.id) {
        await checkUserRole(session.user.id);
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    // Clean up subscription on unmount
    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Create the auth context value
  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };

  // Provide the auth context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for using the auth context as an arrow function
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
