'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function VogueStyleFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
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
    <footer className="bg-black border-t border-gray-200 pt-16 pb-8 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="hover:opacity-75 transition-all flex items-center gap-2 font-glacial text-white">
              <h3 className="font-medium text-2xl lg:text-5xl md:text-4xl">KiawaNoteS</h3> 
              <span className="md:inline text-xs md:text-xs leading-tight font-bold text-red-600 dark:text-gray-600 self-end pb-1">
                THE BLOG<br />OF KIAWA VURNER
              </span>
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-6 mb-10">
            {/* GitHub Icon */}
            <a href="https://github.com/kiawavurner" className="text-red-600 hover:text-indigo-900 transition-colors" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            
            {/* X (formerly Twitter) Icon */}
            <a href="https://x.com/kiawavurner" className="text-red-600 hover:text-indigo-900 transition-colors" aria-label="X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
            
            {/* Reddit Icon */}
            <a href="https://reddit.com/user/kiawavurner" className="text-red-600 hover:text-indigo-900 transition-colors" aria-label="Reddit">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M17.5 12a2.5 2.5 0 0 0-4.96-.46 7.5 7.5 0 0 0-5.08 0A2.5 2.5 0 1 0 4.5 15c0 .17.02.34.05.5A7.5 7.5 0 0 0 12 19a7.5 7.5 0 0 0 7.45-3.5c.03-.16.05-.33.05-.5a2.5 2.5 0 0 0 0-5"></path>
                <circle cx="9" cy="13" r="1"></circle>
                <circle cx="15" cy="13" r="1"></circle>
                <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
              </svg>
            </a>
            
            {/* Substack Icon */}
            <a href="https://kiawavurner.substack.com" className="text-red-600 hover:text-indigo-900 transition-colors" aria-label="Substack">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"></path>
              </svg>
            </a>
            
            {/* TikTok Icon (Replaced with actual TikTok SVG) */}
            <a href="https://tiktok.com/@kiawavurner" className="text-red-600 hover:text-indigo-900 transition-colors" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>

          {/* Footer Newsletter */}
          <div className="max-w-md w-full mb-12">
            <h3 className="text-center text-sm uppercase tracking-wider font-medium mb-4 text-white">Sign up for the newsletter</h3>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-grow py-2 px-3 border-b border-gray-400 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="ml-2 uppercase text-xs tracking-wider font-medium text-white hover:text-indigo-300"
              >
                Sign Up
              </button>
            </form>
            {isSubmitted && (
              <div className="mt-2 text-center text-green-400 text-sm">
                Thank you for subscribing!
              </div>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div>
            <h3 className="font-medium uppercase text-xs tracking-wider mb-4 text-white">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-300 hover:text-indigo-900">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-300 hover:text-indigo-900">Contact</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-300 hover:text-indigo-900">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium uppercase text-xs tracking-wider mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/books-culture" className="text-sm text-gray-300 hover:text-indigo-900">Books&Culture</Link></li>
              <li><Link href="/posts" className="text-sm text-gray-300 hover:text-indigo-900">The Latest</Link></li>
              <li><Link href="/fiction" className="text-sm text-gray-300 hover:text-indigo-900">Fiction</Link></li>
              <li><Link href="/lifestyle" className="text-sm text-gray-300 hover:text-indigo-900">Lifestyle</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium uppercase text-xs tracking-wider mb-4 text-white">Features</h3>
            <ul className="space-y-2">
              <li><Link href="/weekly-edit" className="text-sm text-gray-300 hover:text-indigo-900">Weekly Edit</Link></li>
              <li><Link href="/interviews" className="text-sm text-gray-300 hover:text-indigo-900">Interviews</Link></li>
              <li><Link href="/reviews" className="text-sm text-gray-300 hover:text-indigo-900">Reviews</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium uppercase text-xs tracking-wider mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-300 hover:text-indigo-900">Terms of Use</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-300 hover:text-indigo-900">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-sm text-gray-300 hover:text-indigo-900">Cookie Policy</Link></li>
              <li><Link href="/accessibility" className="text-sm text-gray-300 hover:text-indigo-900">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-200 pt-8">
          <p className="text-xs text-gray-300">
            © {currentYear} KiawaNoteS, THE BLOG OF KIAWA VURNER. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}