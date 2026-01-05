"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Send } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AuthButton } from '@/components/auth/auth-button';

import { useNavbarTitle } from './NavbarTitleContext';

const FixedDualNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { title } = useNavbarTitle();

  const displayTitle = title || "THE BLOG OF KIAWA VURNER";

  // Handle scroll events with direction detection and smooth transition
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';

      clearTimeout(timeoutId);

      // If scrolling down and past threshold, show scrolled state
      if (scrollingDirection === 'down' && currentScrollY > 80) {
        setIsScrolled(true);
      }
      // If scrolling up, add a slight delay to prevent flickering
      else if (scrollingDirection === 'up') {
        timeoutId = setTimeout(() => {
          setIsScrolled(false);
        }, 100); // slight delay prevents flicker on small scrolls up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className="h-16 md:h-16">
        {/* Spacer for fixed header - single navbar height */}
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
        {/* Single navbar container */}
        <div className="relative h-16">
          {/* Navbar - Transforms content on scroll */}
          <div
            className="bg-white dark:bg-background h-16 flex items-center justify-between px-4 md:px-6 transition-all duration-700 ease-in-out z-50 border-b border-gray-200 dark:border-gray-800"
          >
            {/* Left section with menu button and blog title (when scrolled) */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 focus:outline-none"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={cn(
                      "absolute inset-0 transition-opacity duration-300",
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    )}
                  />
                  <X
                    className={cn(
                      "absolute inset-0 transition-opacity duration-300",
                      isMenuOpen ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              </button>

              {/* Blog title appears when scrolled */}
              <div
                tabIndex={-1}
                className={cn(
                  "ml-4 transition-all duration-500 ease-in",
                  isScrolled ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
                )}
              >
                <Link href="/" className="text-xs font-extrabold font-glacial uppercase">
                  <span dangerouslySetInnerHTML={{ __html: displayTitle }} />
                </Link>
              </div>
            </div>

            {/* Center content: Logo (not scrolled) / Newsletter (scrolled) */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              {/* Logo - Only visible when not scrolled */}
              <div
                tabIndex={-1}
                className={cn(
                  "transition-all duration-500 ease-in",
                  isScrolled ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                )}
              >
                <Link href="/" className="hover:opacity-75 transition-all flex items-center gap-2 font-glacial">
                  <h3 className="font-medium text-2xl lg:text-5xl md:text-4xl">KiawaNoteS</h3>
                  <span className="hidden md:inline text-xs md:text-xs leading-tight font-bold dark:text-gray-600 self-end pb-1 uppercase">
                    THE BLOG<br />OF KIAWA VURNER
                  </span>
                </Link>
              </div>

              {/* Newsletter signup - Only visible when scrolled, takes the place of the logo */}
              <div
                tabIndex={-1}
                className={cn(
                  "absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center transition-all duration-500 ease-in",
                  isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                )}
              >
                <Link
                  href="/newsletter"
                  className="hidden sm:flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <div className="bg-black dark:bg-gray-800 rounded-full p-1.5 flex items-center justify-center">
                    <Send size={20} className="text-white transform rotate-180" />
                  </div>
                  <span className="text-xs font-bold font-newyorker text-red-600">
                    SIGN IN FOR NEWSLETTER
                  </span>
                </Link>
              </div>
            </div>

            {/* Right section - Auth Button */}
            <div className="flex items-center">
              <AuthButton />
            </div>
          </div>

          {/* Dropdown Menu Panel - Formerly Sliding Side Panel */}
          <div
            ref={menuRef}
            className={cn(
              "absolute top-full left-0 w-72 bg-white dark:bg-background shadow-lg transform transition-all duration-300 ease-in-out z-40", // Changed positioning and transition
              isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none" // Changed animation
            )}
          >
            {/* Content container with simplified padding */}
            <div className="p-4"> {/* Simplified padding, removed h-full and pt-20 */}
              <div className="px-6 py-2 font-newyorker">
                <h2 className="text-xl font-bold">Sections</h2>
                <nav>
                  <ul className="font-glacial group">
                    {[
                      { name: 'Home', href: '/' },
                      { name: 'The Latest', href: '/posts' },
                      { name: 'Books & Culture', href: '/books-culture' },
                      { name: 'Personal', href: '/category/personal' },
                      { name: 'Ideas', href: '/category/ideas' },
                      { name: 'Science', href: '/science-tech' },
                      { name: 'Entertainment', href: '/category/entertainment' },
                    ].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block py-2 transition-colors font-glacial group-hover:text-gray-400",
                            pathname === item.href ? "text-red-600 font-bold !text-red-600" : "hover:text-primary hover:!text-black"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Divider Line */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-4 relative">
                  <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-background px-2 text-xs text-red-600 font-bold">
                    CONNECT WITH ME
                  </span>
                </div>

                {/* Connect With Me Section */}
                <div className="mt-6">
                  <div className="flex justify-center space-x-2 mt-2">
                    <a
                      href="https://github.com/kiawavurner"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white rounded-full hover:bg-red-200 transition-colors border-2 border-red-600"
                      aria-label="GitHub"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#E53E3E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </a>

                    <a
                      href="https://x.com/kiawavurner"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white rounded-full hover:bg-red-200 transition-colors border-2 border-red-600"
                      aria-label="X (Twitter)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#E53E3E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                      </svg>
                    </a>

                    <a
                      href="https://reddit.com/user/kiawavurner"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white rounded-full hover:bg-red-200 transition-colors border-2 border-red-600"
                      aria-label="Reddit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#E53E3E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14z"></path>
                        <path d="M12 8l1 -5l6 1"></path>
                        <circle cx="19" cy="4" r="1"></circle>
                        <circle cx="9" cy="13" r=".5" fill="#E53E3E"></circle>
                        <circle cx="15" cy="13" r=".5" fill="#E53E3E"></circle>
                        <path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5"></path>
                      </svg>
                    </a>

                    {/* Substack Icon */}
                    <a
                      href="https://kiawavurner.substack.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white rounded-full hover:bg-red-200 transition-colors border-2 border-red-600"
                      aria-label="Substack"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#E53E3E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16v4h-16z"></path>
                        <path d="M4 10h16v4h-16z"></path>
                        <path d="M4 16h16v4h-16z"></path>
                      </svg>
                    </a>

                    {/* TikTok Icon */}
                    <a
                      href="https://tiktok.com/@kiawavurner"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white rounded-full hover:bg-red-200 transition-colors border-2 border-red-600"
                      aria-label="TikTok"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#E53E3E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay when menu is open */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-30 transition-opacity duration-500 ease-in-out",
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      </header>
    </>
  );
};

export default FixedDualNavbar;
