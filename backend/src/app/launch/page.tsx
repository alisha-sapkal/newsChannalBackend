"use client";
import { useState } from "react";
import Confetti from "react-confetti";
import Head from "next/head";
import Image from "next/image";
import styles from "./Launch.module.css";

export default function Launch() {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleLaunchClick = () => {
    setIsCelebrating(true);
    setIsBouncing(true);
    // setTimeout(() => {
    //   setIsCelebrating(false);
    // }, 5000); // Stop confetti after 5 seconds
    // setTimeout(() => {
    //   setIsBouncing(false);
    // }, 1000); // Stop bounce after 1 second
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>The Bombay Forum</title>
      </Head>
      <div
        className={`${styles.logoContainer} ${isBouncing ? styles.bounce : ""}`}
      >
        <img src="/images/logo.png" alt="Logo" width={150} />
        <h1 className={styles.title}>The Bombay Forum</h1>
      </div>
      {!isCelebrating && (
        <button className={styles.launchButton} onClick={handleLaunchClick}>
          Launch
        </button>
      )}
      {isCelebrating && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
    </div>
  );
}
