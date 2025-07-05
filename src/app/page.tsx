"use client";

import { useState } from "react";
import LoginForm from "./auth/login/page";
import SignupForm from "./auth/signup/page";
import { useAuth } from "../../hooks/useauth";
import { useRouter } from "next/navigation";
import { API_URL } from "../../config/config";


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const auth = useAuth();
  if (!auth) {
    throw new Error("Auth context is undefined. Please ensure AuthProvider is set up correctly.");
  }
  const { login } = auth;
  const router = useRouter();

  const handleLogin = async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log("Signin API Response checking==>", res);

    const data = await res.json();

    if (!data?.user || !data?.token) {
      throw new Error("Login failed");
    }
    if (data.user.isAdmin) {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }

    login(data.user, data.token);


  };

  const handleSignup = async (name: string,
    email: string,
    password: string,
    currentGrade?: string,
    country?: string,
    phoneNumber?: string): Promise<void> => {

    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, currentGrade, country, phoneNumber }),
    });

    const data = await res.json();

    if (!data?.user || !data?.token) {
      throw new Error("Signup failed");
    }

    login(data.user, data.token);

    if (data.user.isAdmin) {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
