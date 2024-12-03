"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, User } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // If the user is authenticated, redirect to the dashboard
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSigninWithEmail = async (e: React.FormEvent) => {
    e.preventDefault(); // Corrected from e.prevent.default()

    // Reset previous errors
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Prevent automatic redirects
      });

      if (res?.error) {
        // Handle sign-in error
        setError("Invalid Credentials");
        return;
      }

      // If no error, redirect to dashboard
      router.replace("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center">
          Login to Your Account
        </h2>
        <form className="space-y-4 mt-6" onSubmit={handleSigninWithEmail}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full bg-green-600 hover:bg-green-600/80 text-white p-5 shadow-lg"
            type="submit"
          >
            Sign In
          </Button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-[5px] mt-2">
              {error}
            </div>
          )}
        </form>
        <div className="my-4 text-center text-gray-500">OR</div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => signIn("google")}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <User size={20} />
            Login with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn("github")}
            className="flex items-center justify-center gap-2"
          >
            <Github size={20} />
            Login with GitHub
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
