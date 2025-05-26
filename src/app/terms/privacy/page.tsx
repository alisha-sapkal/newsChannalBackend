import React from "react";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicyPage = () => {
  return (
    <div className={styles.container} style={{marginTop: "25px"}}>
      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.text}>
        At The Bombay Forum (referred to as “we,” “our,” or “us”), we prioritize your privacy. This Privacy Policy outlines the types of personal information we collect, how we use it, and the measures we take to protect your data.
      </p>
      <h2 className={styles.sectionHeading}>1. Information We Collect</h2>
      <p className={styles.text}>We may collect personal information when you interact with our website, including but not limited to:</p>
      <ul className={styles.list}>
        <li>Name and contact details (email, phone number)</li>
        <li>IP addresses and device information</li>
        <li>Browser type and settings</li>
        <li>Pages visited and time spent on our site</li>
        <li>Any information voluntarily provided (e.g., through forms or comments)</li>
      </ul>

      <h2 className={styles.sectionHeading}>2. Use of Information</h2>
      <p className={styles.text}>We use the information we collect to:</p>
      <ul className={styles.list}>
        <li>Provide, maintain, and improve our services</li>
        <li>Personalize your experience on our website</li>
        <li>Communicate with you regarding updates, news, and promotions</li>
        <li>Analyze and improve the effectiveness of our website</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className={styles.sectionHeading}>3. Cookies</h2>
      <p className={styles.text}>
        We use cookies and similar tracking technologies to enhance your browsing experience. Cookies help us understand user behavior, remember your preferences, and improve the performance of our website. You can control the use of cookies through your browser settings.
      </p>

      <h2 className={styles.sectionHeading}>4. Data Sharing</h2>
      <ul className={styles.list}>
        <li>With trusted service providers who assist us in operating our website</li>
        <li>When required by law or to protect our rights</li>
      </ul>

      <h2 className={styles.sectionHeading}>5. Security</h2>
      <p className={styles.text}>
        We take appropriate measures to safeguard your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
      </p>

      <h2 className={styles.sectionHeading}>6. Third-Party Links</h2>
      <p className={styles.text}>
        Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these sites, and we encourage you to read their privacy policies.
      </p>

      <h2 className={styles.sectionHeading}>7. Your Choices</h2>
      <ul className={styles.list}>
        <li>Access, correct, or delete your personal information</li>
        <li>Opt-out of email communications</li>
        <li>Disable cookies through your browser settings</li>
      </ul>

      <h2 className={styles.sectionHeading}>8. Changes to This Policy</h2>
      <p className={styles.text}>
        We may update this Privacy Policy from time to time. Any changes will be reflected here, and we encourage you to review this page periodically.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
