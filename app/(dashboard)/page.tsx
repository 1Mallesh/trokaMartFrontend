"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")!);

    if (user.role === "admin") {
      router.push("/dashboard/admin");
    } else if (user.role === "seller") {
      router.push("/dashboard/seller");
    } else {
      router.push("/dashboard/buyer");
    }
  }, []);

  return <p>Redirecting...</p>;
}