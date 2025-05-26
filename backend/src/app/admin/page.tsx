"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import styles from "./AdminPage.module.css";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import the styles for React-Quill
import crypto from "crypto"; // For article ID generation

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const MarkdownIt = require("markdown-it");

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "the-bombay-forum.firebaseapp.com",
  projectId: "the-bombay-forum",
  storageBucket: "the-bombay-forum.appspot.com",
  messagingSenderId: "3452039032",
  appId: "1:3452039032:web:d9d74dadd9718340eee28d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

interface FormData {
  articleId: string;
  title: string;
  description: string;
  sphoto: string;
  lphoto: string;
  type: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const md = new MarkdownIt();

  const [formData, setFormData] = useState<FormData>({
    articleId: "",
    title: "",
    description: "",
    sphoto: "",
    lphoto: "",
    type: "",
  });

  const [editorContent, setEditorContent] = useState<string>("");
  const [smallPhotoFile, setSmallPhotoFile] = useState<File | null>(null);
  const [largePhotoFile, setLargePhotoFile] = useState<File | null>(null);
  const [generateIdAutomatically, setGenerateIdAutomatically] = useState(true);
  const [loading, setLoading] = useState(false); // Loading state
  const [formErrors, setFormErrors] = useState<string>("");
  const [formValid, setFormValid] = useState<boolean>(false);

  // Generate Article ID from title
  const generateArticleId = (title: string) => {
    const titleSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 240);
    const suffix = crypto
      .createHash("md5")
      .update(title)
      .digest("hex")
      .slice(0, 7);
    return `${titleSlug}-${suffix}`;
  };

  // Handle changes to title and other text fields
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Automatically generate article ID if switched on
    if (generateIdAutomatically && e.target.name === "title") {
      const generatedId = generateArticleId(e.target.value);
      setFormData((prevData) => ({
        ...prevData,
        articleId: generatedId,
      }));
    }
  };

  // Handle rich text editor changes
  const handleEditorChange = (content: string) => {
    setEditorContent(content); // HTML content from editor
  };

  // Handle file changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0] || null;
    if (type === "sphoto") setSmallPhotoFile(file);
    if (type === "lphoto") setLargePhotoFile(file);
  };

  // Upload image to Firebase
  const uploadImage = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // Validate form data
  const validateForm = () => {
    if (
      !formData.title.trim() ||
      !formData.articleId.trim() ||
      !editorContent.trim() ||
      !smallPhotoFile ||
      !largePhotoFile ||
      !formData.type.trim()
    ) {
      setFormErrors("All fields must be filled out.");
      return false;
    }
    setFormErrors("");
    return true;
  };

  useEffect(() => {
    setFormValid(validateForm());
  }, [formData, editorContent, smallPhotoFile, largePhotoFile]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    if (!validateForm()) {
      setLoading(false); // Set loading state to false if validation fails
      return;
    }

    try {
      // We are sending the HTML from the editor directly as 'description'
      const sphotoURL = smallPhotoFile
        ? await uploadImage(
            smallPhotoFile,
            `images/${formData.articleId}-small.jpg`
          )
        : "";
      const lphotoURL = largePhotoFile
        ? await uploadImage(
            largePhotoFile,
            `images/${formData.articleId}-large.jpg`
          )
        : "";

      const newFormData = {
        ...formData,
        description: editorContent, // HTML content from the editor
        sphoto: sphotoURL,
        lphoto: lphotoURL,
      };

      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });

      if (res.ok) {
        alert("News added successfully!");
        setFormData({
          articleId: "",
          title: "",
          description: "",
          sphoto: "",
          lphoto: "",
          type: "",
        });
        setEditorContent("");
        setSmallPhotoFile(null);
        setLargePhotoFile(null);
      } else {
        alert("Error adding news.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Set loading state to false after completion
    }
  };

  // Check if user is an admin
  if (!session || session.user?.role !== "admin") {
    router.push("/");
    return null;
  }

  return (
    <>
      <div className={styles.container} style={{ marginTop: "90px" }}>
        <h1 className={styles.heading}>Add News</h1>
        {formErrors && <div className={styles.error}>{formErrors}</div>}{" "}
        {/* Error message */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChange}
            className={styles.input}
            value={formData.title}
          />
          <div>
            <label>
              <input
                type="checkbox"
                checked={generateIdAutomatically}
                onChange={() =>
                  setGenerateIdAutomatically(!generateIdAutomatically)
                }
              />
              Generate Article ID Automatically
            </label>
          </div>
          <input
            type="text"
            name="articleId"
            placeholder="Article ID"
            onChange={handleChange}
            className={styles.input}
            value={formData.articleId}
            disabled={generateIdAutomatically}
          />
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            placeholder="Write the description..."
            className={styles.textarea}
            theme="snow"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "sphoto")}
            className={styles.input}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "lphoto")}
            className={styles.input}
          />
          <select
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className={styles.input}
          >
            <option value="">Select Type</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="finance">Finance</option>
            <option value="markets">Markets</option>
            <option value="technology">Technology</option>
            <option value="bombay">Bombay</option>
          </select>
          <button
            type="submit"
            className={styles.button}
            disabled={loading || !formValid}
          >
            {loading ? "Adding..." : "Add News"}
          </button>
          {loading && <div className={styles.loading}>Loading...</div>}{" "}
          {/* Loading screen */}
        </form>
        {/* Optional: Preview of the HTML content */}
        {/* <h2>Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: editorContent }} className={styles.preview}></div> */}
      </div>
    </>
  );
}
