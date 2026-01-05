'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PremiumFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Footer subscribe email:', email);
    setIsSubmitted(true);
    setEmail('');
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-20 pb-12 border-t border-gray-800">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">

        {/* Top Section: Newsletter & Branding */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20 border-b border-white/20 pb-16">

          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <Link href="/" className="group block mb-8">
              <h3 className="font-glacial font-medium text-4xl md:text-5xl lg:text-6xl tracking-tight mb-2 group-hover:opacity-80 transition-opacity">
                KiawaNoteS
              </h3>
              <span className="block font-glacial text-red-600 text-xs tracking-[0.2em] uppercase">
                The Blog of Kiawa Vurner
              </span>
            </Link>
            <p className="font-acaslon italic text-lg text-gray-400 max-w-sm leading-relaxed">
              "Curated thoughts on culture, books, and the brilliant minds shaping our future."
            </p>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-7 pl-0 lg:pl-12 border-l-0 lg:border-l border-white/20">
            <div className="max-w-md">
              <span className="block font-newyorker text-red-600 text-xs tracking-widest uppercase mb-4">
                The Newsletter
              </span>
              <h4 className="font-stilson text-2xl md:text-3xl font-bold mb-6 leading-tight">
                Get the best of KiawaNotes delivered to your inbox every week.
              </h4>

              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-transparent border-b border-white/30 py-4 pr-32 text-lg font-acaslon placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 font-futura font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                  Subscribe
                </button>
              </form>

              {isSubmitted && (
                <p className="mt-3 text-sm text-green-400 font-acaslon italic animate-in fade-in">
                  Welcome to the club.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-8 mb-20">

          {/* Column 1 */}
          <div className="flex flex-col space-y-4">
            <h5 className="font-newyorker text-sm tracking-widest text-red-600 uppercase mb-2">Sections</h5>
            <Link href="/books-culture" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">Books & Culture</Link>
            <Link href="/posts" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">The Latest</Link>
            <Link href="/fiction" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">Fiction</Link>
            <Link href="/lifestyle" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">Lifestyle</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            <h5 className="font-newyorker text-sm tracking-widest text-red-600 uppercase mb-2">Features</h5>
            <Link href="/weekly-edit" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">The Weekly Edit</Link>
            <Link href="/interviews" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">Interviews</Link>
            <Link href="/reviews" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">Reviews</Link>
            <Link href="/archive" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">Achieve</Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-4">
            <h5 className="font-newyorker text-sm tracking-widest text-red-600 uppercase mb-2">Company</h5>
            <Link href="/about" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">About Us</Link>
            <Link href="/contact" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">Contact</Link>
            <Link href="/careers" className="font-acaslon text-lg text-gray-300 hover:text-white hover:underline decoration-1 underline-offset-4 transition-all">Careers</Link>
          </div>

          {/* Column 4: Socials (Mobile: separate row, Desktop: col) */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-start lg:items-end space-y-6 lg:space-y-4 mt-4 lg:mt-0">
            <h5 className="font-newyorker text-sm tracking-widest text-red-600 uppercase mb-2 lg:text-right w-full">Follow Us</h5>
            <div className="flex gap-4">
              <SocialLink href="https://github.com/kiawavurner" label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </SocialLink>
              <SocialLink href="https://x.com/kiawavurner" label="X">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              </SocialLink>
              <SocialLink href="https://reddit.com/user/kiawavurner" label="Reddit">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M17.5 12a2.5 2.5 0 0 0-4.96-.46 7.5 7.5 0 0 0-5.08 0A2.5 2.5 0 1 0 4.5 15c0 .17.02.34.05.5A7.5 7.5 0 0 0 12 19a7.5 7.5 0 0 0 7.45-3.5c.03-.16.05-.33.05-.5a2.5 2.5 0 0 0 0-5"></path><circle cx="9" cy="13" r="1"></circle><circle cx="15" cy="13" r="1"></circle><path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path></svg>
              </SocialLink>
              <SocialLink href="https://kiawavurner.substack.com" label="Substack">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"></path></svg>
              </SocialLink>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Copy */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-glacial tracking-wide text-gray-500">
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
          <p>
            © {currentYear} KiawaNotes. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

function SocialLink({ href, children, label }: { href: string, children: React.ReactNode, label: string }) {
  return (
    <a
      href={href}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
      aria-label={label}
    >
      {children}
    </a>
  )
}