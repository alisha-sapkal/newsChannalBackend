import React from "react";
import styles from "./TermsAndConditions.module.css";

const TermsAndConditionsPage = () => {
  return (
    <div className={styles.container} style={{marginTop: "25px"}}>
      <h1 className={styles.heading}>Terms and Conditions</h1>
      <p className={styles.text}>
        Welcome to The Bombay Forum. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. If you do not agree with these terms, please do not use our website.
      </p>

      <h2 className={styles.sectionHeading}>1. Acceptance of Terms</h2>
      <p className={styles.text}>
        By using The Bombay Forum, you agree to be legally bound by these Terms and Conditions, which may be updated from time to time. It is your responsibility to review this page periodically.
      </p>

      <h2 className={styles.sectionHeading}>2. Use of Content</h2>
      <p className={styles.text}>
        All content provided on The Bombay Forum is for informational purposes only. You may not reproduce, distribute, or exploit the content in any form without our explicit written permission.
      </p>

      <h2 className={styles.sectionHeading}>3. User Conduct</h2>
      <p className={styles.text}>
        When using our website, you agree to provide accurate and truthful information, not engage in illegal activities, and not transmit harmful content.
      </p>

      <h2 className={styles.sectionHeading}>4. Intellectual Property</h2>
      <p className={styles.text}>
        All content on The Bombay Forum is protected by copyright. Unauthorized use of our intellectual property may result in legal action.
      </p>

      <h2 className={styles.sectionHeading}>5. Third-Party Links</h2>
      <p className={styles.text}>
        Our website may contain links to third-party websites. These links are provided for your convenience, and we do not endorse or take responsibility for the content or practices of these websites.
      </p>

      <h2 className={styles.sectionHeading}>6. Disclaimer of Warranties</h2>
      <p className={styles.text}>
        The Bombay Forum is provided on an “as is” and “as available” basis. We make no warranties or representations regarding the accuracy, completeness, or reliability of the content.
      </p>

      <h2 className={styles.sectionHeading}>7. Limitation of Liability</h2>
      <p className={styles.text}>
        In no event shall The Bombay Forum, its affiliates, or its staff be liable for any damages arising from the use or inability to use the website.
      </p>

      <h2 className={styles.sectionHeading}>8. Indemnification</h2>
      <p className={styles.text}>
        You agree to indemnify The Bombay Forum from any claims or damages arising from your use of the website.
      </p>

      <h2 className={styles.sectionHeading}>9. Governing Law</h2>
      <p className={styles.text}>
        These Terms and Conditions are governed by the laws of [Jurisdiction].
      </p>

      <h2 className={styles.sectionHeading}>10. Changes to Terms</h2>
      <p className={styles.text}>
        We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page, and your continued use of the website after any changes indicates your acceptance of the new terms.
      </p>
    </div>
  );
};

export default TermsAndConditionsPage;
