"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Import useEffect
import Dashboard from "./dashboard/page";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to the login page if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Render the authenticated user's content
  return session ? (
    <Dashboard/>
  ) : null; // Render nothing if unauthenticated (before redirect)
}
