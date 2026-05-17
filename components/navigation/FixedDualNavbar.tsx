"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, Send, Bookmark } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AuthButton } from '@/components/auth/auth-button';

import { useNavbarTitle } from './NavbarTitleContext';

const FixedDualNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('light');
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { title, isHidden } = useNavbarTitle();

  const displayTitle = title || "THE BLOG OF KIAWA VURNER";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';

      clearTimeout(timeoutId);

      if (scrollingDirection === 'down' && currentScrollY > 80) {
        setIsScrolled(true);
      } else if (scrollingDirection === 'up') {
        timeoutId = setTimeout(() => {
          setIsScrolled(false);
        }, 100);
      }

      lastScrollY.current = currentScrollY;

      const elementsAtHeader = document.elementsFromPoint(window.innerWidth / 2, 32);
      let detectedTheme: 'light' | 'dark' = 'light';

      const bgElement = elementsAtHeader.find(el => {
        if (el.closest('header')) return false;
        if (el.classList.contains('bg-black') || el.classList.contains('dark:bg-black') || el.classList.contains('bg-gray-900') || el.classList.contains('bg-[#0f0f0f]')) {
          detectedTheme = 'dark';
          return true;
        }
        if (el.classList.contains('bg-white') || el.classList.contains('bg-gray-50') || el.tagName === 'BODY' || el.tagName === 'MAIN' || el.tagName === 'HTML') {
          detectedTheme = 'light';
          return true;
        }
        if (el.tagName === 'SECTION' || el.tagName === 'MAIN') {
          const style = window.getComputedStyle(el);
          if (style.backgroundColor === 'rgb(0, 0, 0)' || style.backgroundColor === 'rgba(0, 0, 0, 1)' || style.backgroundColor.startsWith('rgb(15, 15, 15)')) {
            detectedTheme = 'dark';
            return true;
          } else if (style.backgroundColor === 'rgb(255, 255, 255)' || style.backgroundColor === 'rgba(255, 255, 255, 1)') {
            detectedTheme = 'light';
            return true;
          }
        }
        return false;
      });

      setNavTheme(detectedTheme);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

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
      <div className={cn("h-16 md:h-16", isHidden && "hidden")}>
        {/* Spacer */}
      </div>

      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isHidden && "opacity-0 pointer-events-none -translate-y-full"
      )}>
        {/* Single navbar container */}
        <div className="relative h-16">
          <div
            className={cn(
              "h-16 flex items-center justify-between px-4 md:px-6 transition-all duration-700 ease-in-out z-50 border-b",
              navTheme === 'light'
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-200 dark:bg-background dark:border-gray-800 dark:text-white"
            )}
          >
            {/* Left: menu button + scrolled title */}
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

            {/* Center: Logo / Newsletter */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div
                tabIndex={-1}
                className={cn(
                  "transition-all duration-500 ease-in",
                  isScrolled ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                )}
              >
                <Link href="/" className="hover:opacity-75 transition-all flex items-center gap-2 font-glacial">
                  <h3 className="font-bold text-2xl lg:text-5xl md:text-4xl">KiawaNoteS</h3>
                  <span className="hidden md:inline text-xs md:text-xs leading-tight font-bold dark:text-gray-600 self-end pb-1 uppercase">
                    THE BLOG<br />OF KIAWA VURNER
                  </span>
                </Link>
              </div>

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

            {/* Right: Auth */}
            <div className="flex items-center">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Full-screen Menu Overlay */}
        <div
          ref={menuRef}
          className={cn(
            "fixed inset-0 z-[60] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          )}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[#d4d2cd]" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col px-6 md:px-12 lg:px-16 py-6 md:py-8">

            {/* Header: Logo left, X right */}
            <div className="flex items-start justify-between">

              {/* LOGO: rises from buried ground on menu open */}
              <div className="overflow-hidden" style={{ paddingBottom: '2px' }}>
                <div
                  style={{
                    transform: isMenuOpen ? 'translateY(0)' : 'translateY(110%)',
                    opacity: isMenuOpen ? 1 : 0,
                    transition: isMenuOpen
                      ? 'transform 0.75s cubic-bezier(0.22,1,0.36,1) 0.08s, opacity 0.4s ease 0.08s'
                      : 'transform 0.3s ease, opacity 0.2s ease',
                  }}
                >
                  <Link
                    href="/"
                    className="hover:opacity-75 transition-opacity font-glacial"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {/* Mobile: stacked. Desktop: side-by-side like original navbar */}
                    <div className="flex flex-col md:flex-row md:items-end md:gap-2">
                      <span className="font-bold text-2xl md:text-4xl text-black leading-none tracking-tight">
                        KiawaNoteS
                      </span>
                      <div className="flex flex-col leading-tight md:self-end md:pb-0.5">
                        <span className="font-glacial text-black text-[10px] md:text-xs font-extrabold uppercase tracking-wide">
                          THE BLOG
                        </span>
                        <span className="font-glacial text-black text-[10px] md:text-xs font-extrabold uppercase tracking-wide">
                          OF KIAWA VURNER
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-black hover:text-black/50 transition-colors duration-300"
                aria-label="Close menu"
              >
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>

            {/* Divider — more breathing room on mobile before nav items */}
            <div
              className={cn(
                "w-full h-px bg-black/40 mt-16 md:mt-7 md:my-6 transition-all duration-700 delay-100 border-b border-black/30",
                isMenuOpen ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
              )}
              style={{ transformOrigin: 'left center' }}
            />

            {/* Navigation Container
                Mobile: justify-start, items sit below divider with some padding.
                Desktop (md+): justify-center — vertically centred. */}
            <div className="flex-1 flex flex-col justify-start md:justify-center items-end w-full pt-8 md:pt-0">

              {/* Bracket + nav wrapped together — bracket tracks nav height exactly on mobile */}
              <div className="relative w-full flex flex-col items-end md:block">

                {/* Right Bracket Line */}
                <div
                  className={cn(
                    "absolute right-2 md:right-8 w-3 md:w-4",
                    "top-0 bottom-0",
                    "border-r border-t border-b border-black/40 rounded-r-xl pointer-events-none"
                  )}
                />

                <nav className="flex flex-col items-end pr-8 md:pr-16 lg:pr-20 relative z-10 w-full">
                  {[
                    { name: 'Home', href: '/' },
                    { name: 'The Latest', href: '/posts' },
                    { name: 'Books & Culture', href: '/books-culture' },
                    { name: 'Personal', href: '/category/personal' },
                    { name: 'Ideas', href: '/category/ideas' },
                    { name: 'Science', href: '/science-tech' },
                    { name: 'Entertainment', href: '/category/entertainment' },
                  ].map((item, index) => (
                    <div
                      key={item.name}
                      className={cn(
                        "transition-all duration-500",
                        isMenuOpen
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-8"
                      )}
                      style={{ transitionDelay: isMenuOpen ? `${150 + index * 60}ms` : '0ms' }}
                    >
                      <Link
                        href={item.href}
                        className="group flex items-baseline justify-end cursor-pointer transition-transform duration-300 hover:-translate-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {/* Number */}
                        <div
                          className={cn(
                            "relative overflow-hidden min-h-[1.5em] flex items-center py-[0.08em]",
                            pathname === item.href && "text-red-700/50"
                          )}
                          style={{
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            textRendering: 'geometricPrecision',
                          }}
                        >
                          <span className="absolute left-0 top-0 translate-y-[-100%] opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 font-newyorker font-thin text-black/30 text-2xl sm:text-2xl md:text-3xl lg:text-[2.6rem] tracking-tight">
                            {String(index + 1).padStart(2, '0')}.
                          </span>
                          <span className="transition-all duration-300 ease-out group-hover:translate-y-full group-hover:opacity-0 font-newyorker font-extralight text-2xl sm:text-2xl md:text-3xl lg:text-[2.6rem] tracking-tight mr-2 md:mr-3">
                            {String(index + 1).padStart(2, '0')}.
                          </span>
                        </div>

                        {/* Item name — bigger on mobile to fill the space */}
                        <span className={cn(
                          "font-helvetica font-bold tracking-tighter text-[2.5rem] sm:text-4xl md:text-5xl lg:text-[3.2rem] leading-[0.95] transition-colors duration-300",
                          pathname === item.href
                            ? "text-red-700"
                            : "text-[#1d1d1b] group-hover:text-black/60"
                        )}>
                          {item.name}
                        </span>
                      </Link>
                    </div>
                  ))}
                </nav>
              </div>{/* end bracket+nav wrapper */}

              {/* Secondary links — visible on mobile only, right-aligned small text */}
              <div className="md:hidden w-full flex flex-col items-end pr-8 mt-5 gap-1">
                {[
                  { name: 'Interviews', href: '/interviews' },
                  { name: 'Reviews', href: '/reviews' },
                  { name: 'Archive', href: '/archive' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Careers', href: '/careers' },
                ].map((item, index) => (
                  <div
                    key={item.name}
                    className={cn(
                      "transition-all duration-500",
                      isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    )}
                    style={{ transitionDelay: isMenuOpen ? `${550 + index * 40}ms` : '0ms' }}
                  >
                    <Link
                      href={item.href}
                      className="font-helvetica text-sm text-black/60 hover:text-black transition-colors duration-200 tracking-wide"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Your Library */}
              <div className="w-full flex justify-end pr-8 md:pr-16 lg:pr-20 mt-3 md:mt-3">
                <Link
                  href="/saved-articles"
                  className="group flex items-center gap-2 text-[#1d1d1b] hover:text-black/60 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="relative overflow-x-visible overflow-y-hidden h-[1.3em] flex items-center">
                    <span className="absolute inset-0 translate-y-[-100%] opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 font-helvetica font-bold tracking-tight text-sm md:text-base">
                      Your Library
                    </span>
                    <span className="transition-all duration-300 ease-out group-hover:translate-y-full group-hover:opacity-0 font-helvetica font-bold tracking-tight text-sm md:text-base">
                      Your Library
                    </span>
                  </div>
                  <div className="text-[#FFD100]">
                    <svg width="18" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.5L12 17.5L4 22.5V3C4 2.44772 4.44772 2 5 2Z" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="absolute bottom-6 left-6 md:left-12 lg:left-16 flex items-center gap-4 md:gap-6">
              <span className="font-helvetica text-xs text-black/50 tracking-wider">
                © KiawaNotes
              </span>
              <div className="flex items-center gap-3">
                <a href="https://github.com/kiawavurner" target="_blank" rel="noopener noreferrer"
                  className="text-black/50 hover:text-black/80 transition-colors" aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
                <a href="https://x.com/kiawavurner" target="_blank" rel="noopener noreferrer"
                  className="text-black/50 hover:text-black/80 transition-colors" aria-label="X">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default FixedDualNavbar;