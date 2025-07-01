import "./globals.css";

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
import { acaslonPro, stilson, millerDaily, newyorker, futura, glacial, ghost, garamond } from "@/lib/fonts";

// Initialize the Inter font
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

import Balancer from "react-wrap-balancer";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next"
import FixedDualNavbar from '@/components/navigation/FixedDualNavbar';

export const metadata: Metadata = {
  title: "WordPress & Next.js Starter by 9d8",
  description:
    "A starter template for Next.js with WordPress as a headless CMS.",
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, acaslonPro.variable,
          stilson.variable,
          millerDaily.variable,
          newyorker.variable,
          glacial.variable,
          ghost.variable,
          futura.variable,
          garamond.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <FixedDualNavbar />
            {children}
            <Footer />
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
