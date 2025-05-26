// components/NewsletterSubscription.tsx
"use client";

import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");

  const handleSubscription = () => {
    console.log("Subscribed with email:", email);
    // Add your subscription logic here
  };

  return (
    <div className="footer-subscription">
      <h2>Subscribe to our newsletter</h2>
      <div>
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <IconButton aria-label="subscribe" onClick={handleSubscription}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
