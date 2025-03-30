import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Successful login will trigger the useEffect above to redirect
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">
            Business Intelligence CRM
          </h1>
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
