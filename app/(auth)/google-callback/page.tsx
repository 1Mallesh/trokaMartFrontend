"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GoogleCallbackContent() {
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
        localStorage.setItem("loginMethod", "google");
        localStorage.setItem("authStatus", "redirecting");

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

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("authStatus", "success");

        localStorage.removeItem("loginMethod");

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
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to Google...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}