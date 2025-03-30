import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const handleLogin = (values: { email: string; password: string }) => {
    // This would be replaced with actual authentication logic
    console.log("Login attempt with:", values);
    // In a real implementation, this would call Firebase authentication
    // and handle redirects based on authentication status
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

        <LoginForm onSubmit={handleLogin} />

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
