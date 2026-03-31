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
          absolute -left-20 lg:-left-28 xl:-left-40 2xl:-left-48 top-0
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
            aria-label={isBookmarked ? 'Remove bookmark' : 'Save article'}
            className={`
              group cursor-pointer disabled:opacity-50 overflow-hidden
              inline-flex items-center gap-2 h-12
              border-[0.5px] border-gray-300 bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)]
              transition-all duration-500 ease-out hover:border-black active:scale-95
              ${isBookmarked
                ? 'rounded-[14px] pl-3 pr-4 max-w-[220px]'
                : 'rounded-[14px] pl-[11px] pr-[11px] max-w-[48px] hover:max-w-[220px] hover:pl-3 hover:pr-4'
              }
            `}
          >
            {/* Bookmark icon with thin line */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`flex-shrink-0 transition-colors duration-500 ${isBookmarked ? 'text-black' : 'text-black group-hover:text-black'}`}
            >
              {isBookmarked ? (
                <path
                  d="M7 5H17V19L12 15L7 19Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
              ) : (
                <>
                  <path
                    d="M13 5H7V19L12 15L17 19V9"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* "+" sign perfectly fitting the top-right cutout */}
                  <line x1="17" y1="2" x2="17" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="14" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </>
              )}
            </svg>

            {/* Text appears only when bookmarked */}
            <div 
              className={`transition-all duration-500 ease-out flex-shrink-0 overflow-hidden ${
                isBookmarked 
                  ? 'opacity-100 max-w-[120px]' 
                  : 'opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[120px]'
              }`}
            >
              <span className="text-[11px] font-glacial font-bold tracking-widest text-black uppercase whitespace-nowrap">
                {isBookmarked ? 'SAVED' : 'SAVE ARTICLE'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Article content */}
      {children}
    </div>
  );
}
