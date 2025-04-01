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

// Create the auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
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
      console.log("=== SIGN IN DEBUG START ====");
      console.log("Sign in attempt with email:", email);
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log(
        "Supabase Key length:",
        import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
      );

      if (!email || !password) {
        console.log("Missing email or password");
        return {
          data: null,
          error: new Error("Email and password are required"),
        };
      }

      // First check if the user exists in the users table
      console.log("Checking if user exists with email:", email);

      // Log the SQL query that would be executed
      const query = supabase
        .from("users")
        .select("email, status")
        .eq("email", email);

      // Log the constructed query URL for debugging
      console.log("SQL Query URL:", query.url.toString());

      try {
        const { data: existingUser, error: checkError } =
          await query.maybeSingle();

        console.log("User existence check result:", {
          data: existingUser,
          error: checkError,
        });

        if (checkError) {
          console.error("Error checking existing user:", checkError);
          return { data: null, error: checkError };
        }

        // If user doesn't exist in users table, don't attempt auth sign in
        if (!existingUser) {
          console.error("User not found in users table");
          return {
            data: null,
            error: new Error("Invalid email or password"),
          };
        }

        // Check user status before attempting login
        if (
          existingUser.status === "pending" ||
          existingUser.status === "inactive"
        ) {
          const statusMessage =
            existingUser.status === "pending"
              ? "Your account is awaiting administrator approval."
              : "Your account has been deactivated. Please contact an administrator.";

          console.log("User status check failed:", existingUser.status);
          return {
            data: null,
            error: new Error(statusMessage),
          };
        }
      } catch (queryError) {
        console.error("Error during user existence check query:", queryError);
        // Continue with auth attempt even if the query fails
        console.log("Continuing with auth despite query error");
      }

      // Proceed with authentication
      console.log("Proceeding with authentication attempt");
      try {
        console.log("Auth request payload:", { email, password: "[REDACTED]" });

        // Add a retry mechanism for database errors
        let retryCount = 0;
        const maxRetries = 2;
        let response;

        while (retryCount <= maxRetries) {
          try {
            response = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            // If no database error, break out of retry loop
            if (
              !response.error ||
              !response.error.message.includes("Database error")
            ) {
              break;
            }

            console.log(
              `Database error encountered, retry attempt ${retryCount + 1} of ${maxRetries}`,
            );
            retryCount++;

            // Wait before retrying (exponential backoff)
            if (retryCount <= maxRetries) {
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * retryCount),
              );
            }
          } catch (innerError) {
            console.error("Exception during auth attempt:", innerError);
            return { data: null, error: innerError as Error };
          }
        }

        console.log("Auth response received:", {
          hasData: !!response.data,
          hasError: !!response.error,
          errorMessage: response.error?.message,
          errorStatus: response.error?.status,
          sessionExists: !!response.data?.session,
        });

        if (response.error) {
          console.error("Supabase auth error:", {
            message: response.error.message,
            status: response.error.status,
            name: response.error.name,
            stack: response.error.stack,
          });

          // Provide a more user-friendly error message for database errors
          if (response.error.message.includes("Database error")) {
            return {
              data: null,
              error: new Error(
                "The authentication service is temporarily unavailable. Please try again in a few moments.",
              ),
            };
          }

          return response;
        }

        console.log("Authentication successful");
        console.log("=== SIGN IN DEBUG END ====");
        return response;
      } catch (authError) {
        console.error("Exception during auth.signInWithPassword:", authError);
        return { data: null, error: authError as Error };
      }
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      console.log("=== SIGN IN DEBUG END WITH ERROR ====");
      return { data: null, error: error as Error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("=== SIGN UP DEBUG START ====");
      console.log("Sign up attempt with email:", email);
      console.log("User data provided:", {
        ...userData,
        password: "[REDACTED]",
      });
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log(
        "Supabase Key length:",
        import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
      );

      // Input validation
      if (!email || !password) {
        console.log("Missing email or password");
        return {
          data: null,
          error: new Error("Email and password are required"),
        };
      }

      if (!userData || !userData.name) {
        console.log("Missing user data or name");
        return {
          data: null,
          error: new Error("Name is required"),
        };
      }

      // First check if the email already exists in the users table
      console.log("Checking if email already exists:", email);
      try {
        const { data: existingUser, error: checkError } = await supabase
          .from("users")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        console.log("Existing user check result:", {
          existingUser,
          checkError,
        });

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
      } catch (queryError) {
        console.error("Exception during existing user check:", queryError);
        // Continue with signup attempt even if the query fails
        console.log("Continuing with signup despite query error");
      }

      // Create the user in Supabase Auth
      console.log("Attempting to create user in Supabase Auth");
      try {
        const signUpPayload = {
          email,
          password,
          options: {
            data: {
              name: userData.name,
              status: "pending",
            },
          },
        };
        console.log("Auth signUp payload:", {
          ...signUpPayload,
          password: "[REDACTED]",
        });

        const { data, error } = await supabase.auth.signUp(signUpPayload);

        console.log("Auth signUp response:", {
          hasData: !!data,
          hasUser: !!data?.user,
          hasError: !!error,
          errorMessage: error?.message,
          errorStatus: error?.status,
        });

        if (error) {
          console.error("Error signing up user in Auth:", {
            message: error.message,
            status: error.status,
            name: error.name,
            stack: error.stack,
          });
          return { data, error };
        }

        if (!data.user) {
          console.error("No user returned from signup");
          return { data, error: new Error("No user returned from signup") };
        }

        console.log("User created in Auth:", data.user.id);

        // Insert the user into the users table
        console.log("Inserting user into users table");
        const userRecord = {
          id: data.user.id,
          email: email,
          name: userData.name,
          is_admin: false,
          is_approved: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        console.log("User record to insert:", userRecord);

        const { error: insertError } = await supabase
          .from("users")
          .insert([userRecord]);

        if (insertError) {
          console.error("Error inserting user into users table:", {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details,
            hint: insertError.hint,
          });

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
        console.log("=== SIGN UP DEBUG END ====");
        return { data, error: null };
      } catch (authError) {
        console.error("Exception during auth.signUp:", authError);
        return { data: null, error: authError as Error };
      }
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      console.log("=== SIGN UP DEBUG END WITH ERROR ====");
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
    }, 800); // Further reduced timeout to 800ms for faster response

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
}

// Create a custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
