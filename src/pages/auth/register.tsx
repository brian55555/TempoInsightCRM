import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => {
    setIsLoading(true);
    setError("");

    try {
      // In a real implementation, this would connect to Firebase Authentication
      // and create a new user with pending approval status
      console.log("Registration submitted:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message and redirect to login
      alert(
        "Registration submitted! An administrator will review your request.",
      );
      navigate("/auth/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RegisterForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
