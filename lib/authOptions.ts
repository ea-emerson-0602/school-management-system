import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "./mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("Error during credentials login:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await connectMongoDB();

          // Check if user already exists
          const existingUser = await User.findOne({ email: profile?.email });
          if (!existingUser) {
            // Create a new user if not found
            await User.create({
              name: profile?.name || "Unknown",
              email: profile?.email,
              image: profile?.picture || profile?.avatar_url, // profile picture from Google or GitHub
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error("Error saving OAuth user:", error);
          return false; // Deny sign-in on error
        }
      }

      return true; // Allow sign-in
    },
  },
};
