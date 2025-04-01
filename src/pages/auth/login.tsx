import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const { signIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", values.email);
      const { data, error } = await signIn(values.email, values.password);

      if (error) {
        console.error("Login error details:", error);

        // Provide more user-friendly error messages
        let errorMessage = error.message || "Invalid credentials";

        // Handle specific error cases
        if (errorMessage.includes("Database error")) {
          errorMessage =
            "The authentication service is temporarily unavailable. Please try again in a few moments.";
        } else if (errorMessage.includes("Invalid login credentials")) {
          errorMessage =
            "The email or password you entered is incorrect. Please try again.";
        } else if (errorMessage.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address before logging in.";
        }

        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // User status is now checked in the signIn function, so we can proceed directly

      if (data?.session) {
        console.log("Login successful");
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
          variant: "default",
        });
        // Successful login will trigger the useEffect above to redirect
        navigate("/");
      } else {
        console.error("No session returned");
        toast({
          title: "Login failed",
          description: "Authentication failed. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Insight CRM</h1>
          <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500">
            By signing in, you agree to our{" "}
            <Link
              to="/terms"
              className="font-medium text-primary hover:text-primary/80"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium text-primary hover:text-primary/80"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
