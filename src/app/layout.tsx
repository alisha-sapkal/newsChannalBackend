import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../../assets/css/Layout.scss";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import ClientLayout from "./ClientLayout";
import DarkButton from "./components/DarkButton";
import SearchIcon from "@mui/icons-material/Search";
import SearchBarClient from "./components/SearchBarClient";
import NewsletterSubscription from "./components/NewsletterSubscription";
import Weather from "./components/Weather";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Bombay Forum",
  description: "Get your daily dose of news from The Bombay Forum",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navList = [
    { name: "Lifestyle", link: "/category/lifestyle" },
    { name: "Finance", link: "/category/finance" },
    { name: "Markets", link: "/category/markets" },
    { name: "Technology", link: "/category/technology" },
    { name: "Bombay", link: "/category/bombay" },
  ];

  const privacyPolicy = [
    { name: "Terms and conditions", link: "/terms/conditions" },
    { name: "Privacy policy", link: "/terms/privacy" },
  ];

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Add the Google Analytics script */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=G-SXGQN0NSTW`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-SXGQN0NSTW', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7601934185385486"
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body className={inter.className}>
        <ClientLayout session={session}>
          <div>
            <header>
              <div className="mobile-nav">
                <div className="logo">
                  <Link href="/">
                    <Image
                      src="/images/logo.png"
                      alt="Logo"
                      width={93}
                      height={40}
                    />
                  </Link>
                  <h1 className="title">
                    <Link href="/">The Bombay Forum</Link>
                  </h1>
                </div>
                <nav>
                  <ul>
                    <div className="search-icon">
                      <Link href="/search">
                        <SearchBarClient />
                      </Link>
                    </div>
                    {navList.map((navItem) => (
                      <div key={navItem.name}>
                        <Link href={navItem.link}>{navItem.name}</Link>
                      </div>
                    ))}
                  </ul>
                  <DarkButton />
                </nav>
                <div className="weather">
                  <Weather />
                </div>
              </div>
              <div className="desktop-nav">
                <nav>
                  <ul>
                    {navList
                      .slice(0, Math.ceil(navList.length / 2))
                      .map((navItem) => (
                        <li key={navItem.name}>
                          <Link href={navItem.link}>{navItem.name}</Link>
                        </li>
                      ))}
                  </ul>
                  <div className="search-icon">
                    <Link href="/search">
                      <SearchBarClient />
                    </Link>
                  </div>
                  <ul>
                    <div className="logo">
                      <Link href="/">
                        <Image
                          src="/images/logo.png"
                          alt="Logo"
                          width={93}
                          height={40}
                        />
                      </Link>
                      <h1 className="title">
                        <Link href="/">The Bombay Forum</Link>
                      </h1>
                    </div>
                  </ul>
                  <ul>
                    {navList
                      .slice(Math.ceil(navList.length / 2), navList.length)
                      .map((navItem) => (
                        <li key={navItem.name}>
                          <Link href={navItem.link}>{navItem.name}</Link>
                        </li>
                      ))}
                    <DarkButton />
                  </ul>
                </nav>
                <div className="weather">
                  <Weather />
                </div>
              </div>
            </header>
            {children}
            <section className="footer">
              <div className="footer-row-1-parent">
                <div className="footer-row-1">
                  <div className="about-section">
                    <div className="heading">
                      <Link href="/">
                        <Image
                          src="/images/logo.png"
                          alt="Logo"
                          width={53}
                          height={20}
                        />
                      </Link>
                      <h1 className="title">
                        <Link href="/">The Bombay Forum</Link>
                      </h1>
                    </div>
                    <div className="body">
                      <p>
                        Stay informed with the latest headlines, in-depth
                        analysis, and real-time updates from around the globe.
                      </p>
                    </div>
                  </div>
                  <div className="footer-links">
                    <h2>Quick Links</h2>
                    <ul>
                      {navList.map((navItem) => (
                        <li key={navItem.name}>
                          <Link href={navItem.link}>{navItem.name}</Link>
                        </li>
                      ))}
                    </ul>
                    <ul>
                      {privacyPolicy.map((navItem) => (
                        <li key={navItem.name}>
                          <Link href={navItem.link}>{navItem.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <NewsletterSubscription />
                </div>
              </div>
              <div className="footer-row-2">
                <div className="footer-info">
                  <p>© 2024 The Bombay Forum All Rights Reserved.</p>
                </div>
                <div className="footer-socials">
                  <Link href="https://www.instagram.com/thebombayforum/">
                    <Image
                      src="/images/social/instagram_logo.png"
                      alt="Instagram"
                      width={30}
                      height={30}
                    />
                  </Link>
                  <Link href="https://www.threads.net/@thebombayforum">
                    <Image
                      src="/images/social/threads_logo.png"
                      alt="Threads"
                      width={30}
                      height={30}
                    />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
