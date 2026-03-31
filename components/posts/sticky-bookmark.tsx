'use client';

import { useEffect, useRef, useState } from 'react';
import { BookmarkButton } from './bookmark-button';

interface StickyBookmarkProps {
  wpPostId: number;
  postTitle: string;
  postSlug: string;
  children: React.ReactNode;
}

/**
 * Wraps article content and places a sticky BookmarkButton on the left side.
 * The bookmark icon is hidden by default and fades in when the content section
 * scrolls into view; it fades out when the content section leaves the viewport.
 */
export function StickyBookmark({ wpPostId, postTitle, postSlug, children }: StickyBookmarkProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show the bookmark when any part of the content is in view
        setIsVisible(entry.isIntersecting);
      },
      {
        // A small negative margin so it triggers slightly after the top enters
        rootMargin: '-80px 0px -80px 0px',
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={contentRef} className="relative">
      {/* Sticky bookmark on the left */}
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
          <BookmarkButton
            wpPostId={wpPostId}
            postTitle={postTitle}
            postSlug={postSlug}
          />
        </div>
      </div>

      {/* Article content */}
      {children}
    </div>
  );
}
