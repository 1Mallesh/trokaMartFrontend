"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        console.error("Google OAuth error:", error, errorDescription);
        router.push(`/login?error=${encodeURIComponent("Google login failed. Please try again.")}`);
        return;
      }

      if (!code) {
        router.push(`/login?error=${encodeURIComponent("No authorization code received")}`);
        return;
      }

      try {
        // Store login method
        localStorage.setItem("loginMethod", "google");

        // Show redirecting message via localStorage
        localStorage.setItem("authStatus", "redirecting");

        // Send the code to backend for token exchange
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/auth/google/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("Backend authentication failed");
        }

        const data = await response.json();

        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("authStatus", "success");

        // Clean up
        localStorage.removeItem("loginMethod");

        // Redirect to success page which will handle role-based routing
        router.push("/auth-success");
      } catch (err) {
        console.error("OAuth callback error:", err);
        localStorage.removeItem("authStatus");
        router.push(`/login?error=${encodeURIComponent("Google login failed. Please try again.")}`);
      }
    };

    handleCallback();
  }, [searchParams, router]);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Google for secure sign-in</h1>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    </div>
  );
}
