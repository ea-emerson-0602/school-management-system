"use client";

import { useState, useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      redirect
      ("/");
    }
  }, [session, router]);

  if (session) {
    return null; // or you could show a loading state
  }
  const handleEmailSignUp = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setError("");

    // Validate inputs
    if (!name || !email || !password) {
      setError("All fields are necessary");
      console.error("Registration error: All fields are necessary");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();
      if (user) {
        setError("User already exists.");
        return;
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });
        // Parse the response to get more detailed error information
        const responseData = await res.json();

        if (res.ok) {
          // Registration successful
          console.log("User registered successfully");
          // Clear input fields
          const form = e.target;
          form.reset();
          router.push("/");
        } else {
          // Registration failed
          console.error("User registration failed:", responseData);
          setError(responseData.message || "Registration failed");
        }
      }
      // Parse the response to get more detailed error information
    } catch (error) {
      // Network or other errors
      console.error("Error during registration:", error);
      setError("An unexpected error occurred");
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      await signIn(provider, { callbackUrl: "/" }); // Redirect to homepage after OAuth sign-in
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-[5px]">
        <h2 className="text-2xl font-semibold text-center">
          Create an Account
        </h2>
        <form className="space-y-4 mt-6" onSubmit={handleEmailSignUp}>
          <Input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            className="w-full bg-green-600 hover:bg-green-600/80 text-white p-5 shadow-lg"
            type="submit"
          >
            Register
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
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            className="flex items-center justify-center gap-2"
          >
            Sign up with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn("github")}
            className="flex items-center justify-center gap-2"
          >
            <Github size={20} />
            Sign up with GitHub
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
