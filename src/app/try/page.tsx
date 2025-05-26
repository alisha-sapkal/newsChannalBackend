'use client';
import { signOut, useSession } from "next-auth/react";
import React from "react";

export default function Try() {
  const session = useSession();
  return (
    <div>
      <div>{session?.data?.user?.name}</div>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
