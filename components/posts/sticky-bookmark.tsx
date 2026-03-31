'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface StickyBookmarkProps {
  wpPostId: number;
  postTitle: string;
  postSlug: string;
  children: React.ReactNode;
}

/**
 * Wraps article content and places a sticky bookmark icon on the left side.
 * Icon-only design with a "+" badge on the top-right corner.
 * Hidden by default, fades in when the content scrolls into view.
 */
export function StickyBookmark({ wpPostId, postTitle, postSlug, children }: StickyBookmarkProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Check bookmark status
  useEffect(() => {
    if (!user || loading) return;

    const checkBookmarkStatus = async () => {
      try {
        const response = await fetch('/api/bookmarks', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const bookmark = data.bookmarks.find((b: any) => b.wpPostId === wpPostId);
          if (bookmark) {
            setIsBookmarked(true);
            setBookmarkId(bookmark._id);
          }
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [user, loading, wpPostId]);

  // Intersection Observer for visibility
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '-80px 0px -80px 0px',
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleBookmarkToggle = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsLoading(true);

    try {
      if (isBookmarked && bookmarkId) {
        const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (response.ok) {
          setIsBookmarked(false);
          setBookmarkId(null);
          toast({ title: 'Bookmark removed', description: 'Article removed from your bookmarks' });
        }
      } else {
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ wpPostId, postTitle, postSlug }),
        });
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(true);
          setBookmarkId(data.bookmark._id);
          toast({ title: 'Bookmark added', description: 'Article saved to your bookmarks' });
        } else if (response.status === 409) {
          toast({ title: 'Already bookmarked', description: 'This article is already in your bookmarks', variant: 'destructive' });
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({ title: 'Error', description: 'Failed to update bookmark', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={contentRef} className="relative">
      {/* Sticky bookmark icon on the left */}
      <div
        className={`
          hidden lg:block
          absolute -left-16 xl:-left-20 top-0
          h-full
        `}
      >
        <div
          className={`
            sticky top-32
            transition-all duration-500 ease-in-out
            ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
          `}
        >
          <button
            onClick={handleBookmarkToggle}
            disabled={isLoading}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            className={`
              group cursor-pointer disabled:opacity-50
              w-12 h-12 rounded-xl border border-gray-300 bg-white
              flex items-center justify-center
              transition-all duration-200 hover:shadow-md hover:border-gray-400 active:scale-95
            `}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-colors duration-300 ${isBookmarked ? 'text-black' : 'text-gray-700 group-hover:text-black'}`}
            >
              {/* Ribbon bookmark shape */}
              <path
                d="M7 4H14V13L10.5 10.5L7 13V4Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={isBookmarked ? 'currentColor' : 'none'}
              />
              {/* "+" sign at top-right */}
              <line x1="17" y1="4" x2="17" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="14" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              {/* Bottom bar */}
              <line x1="5" y1="19" x2="19" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Article content */}
      {children}
    </div>
  );
}
