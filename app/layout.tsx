import "./globals.css";
import "katex/dist/katex.min.css";


import { Section, Container } from "@/components/craft";
import { Inter as FontSans } from "next/font/google";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNav } from "@/components/nav/mobile-nav";
import Footer from '@/app/mainsection/footer';
import { Analytics } from "@vercel/analytics/react";
import { Button } from "@/components/ui/button";
import { AuthProvider } from "@/lib/auth-context";

import { mainMenu, contentMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { acaslonPro, stilson, millerDaily, newyorker, futura, glacial, ghost, garamond, coolvetica, plusJakarta, imbue, knockout, spaceMono, helvetica } from "@/lib/fonts";

// Initialize the Inter font
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

import Balancer from "react-wrap-balancer";
import Logo from "@/public/logoo.svg";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next"
import type { Viewport } from "next";
import FixedDualNavbar from '@/components/navigation/FixedDualNavbar';
import { JsonLd } from "@/components/seo/json-ld";
import { primaryAuthor, publisher } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL('https://kiawanotes.com'),
  title: {
    default: 'KiawaNotes | The Blog of Kiawa Vurner',
    template: '%s | KiawaNotes',
  },
  description: 'Explore thought-provoking articles on books, culture, science, ideas, and more from Kiawa Vurner — also known as Victor Kiawa.',
  keywords: ['KiawaNotes', 'Kiawa Vurner', 'Victor Kiawa', 'blog', 'books', 'culture', 'ideas', 'science'],
  authors: [{ name: 'Kiawa Vurner' }],
  creator: 'Kiawa Vurner',
  publisher: 'KiawaNotes',
  alternates: {
    canonical: 'https://kiawanotes.com',
  },
  openGraph: {
    title: 'KiawaNotes | The Blog of Kiawa Vurner',
    description: 'Explore thought-provoking articles on books, culture, science, ideas, and more from Kiawa Vurner.',
    url: 'https://kiawanotes.com',
    siteName: 'KiawaNotes',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KiawaNotes | The Blog of Kiawa Vurner',
    description: 'Explore thought-provoking articles on books, culture, science, ideas, and more from Kiawa Vurner.',
    creator: '@kiawavurner',
    site: '@kiawavurner',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

import { NavbarTitleProvider } from "@/components/navigation/NavbarTitleContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD: Person (Victor Kiawa / Kiawa Vurner) + WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://kiawanotes.com/#website',
    name: 'KiawaNotes',
    url: 'https://kiawanotes.com',
    description: 'Thought-provoking articles on books, culture, science, and ideas by Kiawa Vurner.',
    publisher,
    author: primaryAuthor,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kiawanotes.com/posts?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={[{ "@context": "https://schema.org", ...publisher }, { "@context": "https://schema.org", ...primaryAuthor }, websiteSchema]} />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased overflow-x-hidden", fontSans.variable, acaslonPro.variable,
        stilson.variable,
        millerDaily.variable,
        newyorker.variable,
        glacial.variable,
        ghost.variable,
        futura.variable,
        coolvetica.variable,
        garamond.variable,
        plusJakarta.variable,
        imbue.variable,
        knockout.variable,
        spaceMono.variable,
        helvetica.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <NavbarTitleProvider>
              <FixedDualNavbar />
              {children}
              <Footer />
            </NavbarTitleProvider>
          </AuthProvider>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}

const Nav = ({ className, children, id }: NavProps) => {
  return (
    <nav
      className={cn("sticky z-50 top-0 bg-background", "border-b", className)}
      id={id}
    >
      <div
        id="nav-container"
        className="max-w-5xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href="/"
        >
          <Image
            src={Logo}
            alt="Logo"
            loading="eager"
            className="dark:invert"
            width={42}
            height={26.44}
          ></Image>
          <h2 className="text-sm">{siteConfig.site_name}</h2>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
          <Button asChild className="hidden sm:flex">
            <Link href="https://github.com/9d8dev/next-wp">Get Started</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};
