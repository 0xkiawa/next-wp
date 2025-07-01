'use client';

import { useState, useEffect } from 'react';
import { Check, Share2, Copy, Twitter, Link } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BookmarkButtonProps {
  wpPostId: number;
  postTitle: string;
  postSlug: string;
}

export function BookmarkButton({ wpPostId, postTitle, postSlug }: BookmarkButtonProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Check if the post is already bookmarked
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
          const bookmark = data.bookmarks.find(b => b.wpPostId === wpPostId);
          
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
  
  const handleBookmarkToggle = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isBookmarked && bookmarkId) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (response.ok) {
          setIsBookmarked(false);
          setBookmarkId(null);
          toast({
            title: 'Bookmark removed',
            description: 'Article has been removed from your bookmarks',
          });
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            wpPostId,
            postTitle,
            postSlug,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(true);
          setBookmarkId(data.bookmark._id);
          toast({
            title: 'Bookmark added',
            description: 'Article has been saved to your bookmarks',
          });
        } else if (response.status === 409) {
          toast({
            title: 'Already bookmarked',
            description: 'This article is already in your bookmarks',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${postSlug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied',
      description: 'Article link has been copied to clipboard',
    });
    setShowShareOptions(false);
  };

  const handleShareTwitter = () => {
    const url = `${window.location.origin}/posts/${postSlug}`;
    const text = encodeURIComponent(`${postTitle}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
    setShowShareOptions(false);
  };

  const handleShareReddit = () => {
    const url = `${window.location.origin}/posts/${postSlug}`;
    window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(postTitle)}`, '_blank');
    setShowShareOptions(false);
  };
  
  return (
    <div className="flex items-center justify-center gap-2 sticky top-0 z-10 bg-white py-2">
      <Button
        variant="outline"
        onClick={handleBookmarkToggle}
        disabled={isLoading}
        className="bg-white hover:bg-gray-50 border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 font-futura"
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {isBookmarked ? (
          <>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-red-600"
            >
              <path 
                d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" 
                fill="currentColor" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs font-medium tracking-wider">SAVED</span>
            <Check size={14} className="text-green-600" />
          </>
        ) : (
          <>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-red-600"
            >
              <path 
                d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs font-medium tracking-wider">SAVE ARTICLE</span>
          </>
        )}
      </Button>

      <Popover open={showShareOptions} onOpenChange={setShowShareOptions}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50 border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 font-futura"
            aria-label="Share article"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-red-600"
            >
              <path 
                d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08261 9.25653C7.54305 8.48575 6.6734 8 5.7 8C4.20883 8 3 9.20883 3 10.7C3 12.1912 4.20883 13.4 5.7 13.4C6.67345 13.4 7.54315 12.9142 8.08271 12.1434L15.0227 16.0294C15.0077 16.1508 15 16.2745 15 16.4C15 18.0569 16.3431 19.4 18 19.4C19.6569 19.4 21 18.0569 21 16.4C21 14.7431 19.6569 13.4 18 13.4C17.0266 13.4 16.1569 13.8858 15.6174 14.6566L8.67733 10.7706C8.69233 10.6492 8.7 10.5255 8.7 10.4C8.7 10.2745 8.69233 10.1508 8.67733 10.0294L15.6174 6.14347C16.1569 6.91425 17.0266 7.4 18 7.4C18 7.4 18 8 18 8Z" 
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs font-medium tracking-wider">SHARE</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="center">
          <div className="grid gap-1">
            <Button 
              variant="ghost" 
              className="flex items-center justify-start gap-2 h-9 px-2 font-futura"
              onClick={handleCopyLink}
            >
              <Copy size={16} className="text-gray-700" />
              <span className="text-xs font-medium">Copy Link</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center justify-start gap-2 h-9 px-2 font-futura"
              onClick={handleShareTwitter}
            >
              <Twitter size={16} className="text-gray-700" />
              <span className="text-xs font-medium">Share on X (Twitter)</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center justify-start gap-2 h-9 px-2 font-futura"
              onClick={handleShareReddit}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-gray-700">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              <span className="text-xs font-medium">Share on Reddit</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}