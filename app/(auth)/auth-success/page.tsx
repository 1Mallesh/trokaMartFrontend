"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setGoogleAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // Get user data from query params or localStorage
        const userDataParam = searchParams.get("user_data");
        const tokenParam = searchParams.get("token");

        if (tokenParam) {
          // Backend sent token in query param
          localStorage.setItem("token", tokenParam);
        }

        // Get user from localStorage or API
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user || !localStorage.getItem("token")) {
          setError("Authentication failed: Missing user data or token");
          setIsLoading(false);
          return;
        }

        // Update auth store
        setGoogleAuth(user, localStorage.getItem("token") || "");

        // Role-based redirect
        const role = user.role?.toLowerCase() || "user";

        if (role === "admin") {
          router.push("/admin/dashboard");
        } else if (role === "seller") {
          router.push("/dashboard/seller");
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("OAuth success page error:", err);
        setError("An error occurred during authentication");
        setIsLoading(false);
      }
    };

    handleOAuthSuccess();
  }, [searchParams, setGoogleAuth, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign-In</h1>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      </div>
    </div>
  );
}
