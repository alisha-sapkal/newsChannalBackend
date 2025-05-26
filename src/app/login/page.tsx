"use client";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const userRole = session.user?.role;
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [session, router]);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/admin" });
  };

  return (
    <div className={styles["login-area-parent"]}>
      <h1>Welcome to the login page</h1>
      <button
        className={styles["login-with-google-btn"]}
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  );
}
