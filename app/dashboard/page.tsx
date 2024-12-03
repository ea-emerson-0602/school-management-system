"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <>
          <img
            src={session.user?.image as string}
            className="rounded-full h-20 w-20"
          ></img>
          <div className="text-3xl font-bold text-green-400">
            Welcome back, {session.user?.name}
          </div>
          <p className="font-bold">{session.user?.email}</p>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </>
      ) : (
        <>
          {" "}
          <div className="text-red-500 text-3xl font-bold">
            You're not logged in
          </div>
          <div className="flex space-x-5">
            <Link href="/login" className="border border-black  rounded-xl">
              Login
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
