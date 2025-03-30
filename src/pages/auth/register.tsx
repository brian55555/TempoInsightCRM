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
    firstName: string;
    lastName: string;
  }) => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signUp(values.email, values.password, {
        firstName: values.firstName,
        lastName: values.lastName,
      });

      if (error) {
        throw error;
      }

      // Show success message and redirect to login
      toast({
        title: "Registration submitted!",
        description: "An administrator will review your request.",
      });
      
      navigate("/auth/login");
    } catch (err) {
      console.error("Registration error:", err);

