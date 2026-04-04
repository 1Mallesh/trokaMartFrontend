"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setGoogleAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const userDataParam = searchParams.get("user_data");
        const tokenParam = searchParams.get("token");

        if (tokenParam) {
          localStorage.setItem("token", tokenParam);
        }

        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user || !localStorage.getItem("token")) {
          setError("Authentication failed: Missing user data or token");
          setIsLoading(false);
          return;
        }

        setGoogleAuth(user, localStorage.getItem("token") || "");

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
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h1>Authentication Failed</h1>
          <p>{error}</p>
          <button onClick={() => router.push("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <div>Loading... Redirecting...</div>;
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <AuthSuccessContent />
    </Suspense>
  );
}