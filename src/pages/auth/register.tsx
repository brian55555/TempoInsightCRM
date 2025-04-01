import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
  }) => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await signUp(values.email, values.password, {
        name: values.name,
      });

      if (error) {
        setError(error.message || "Registration failed. Please try again.");
        return;
      }

      // Show success message and redirect to login
      toast({
        title: "Registration submitted!",
        description: "An administrator will review your request.",
      });

      navigate("/auth/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <a
              href="/auth/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              sign in to your account
            </a>
          </p>
        </div>
        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          className="flex gap-x-1.5"
        />
      </div>
    </div>
  );
}
