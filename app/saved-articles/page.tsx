'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface Bookmark {
  _id: string;
  wpPostId: number;
  postTitle: string;
  postSlug: string;
  createdAt: string;
}

export default function SavedArticlesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/login?redirect=/saved-articles');
      return;
    }

    if (user) {
      fetchBookmarks();
    }
  }, [user, loading, router]);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your saved articles',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeBookmark = async (id: string) => {
    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setBookmarks(bookmarks.filter(bookmark => bookmark._id !== id));
        toast({
          title: 'Bookmark removed',
          description: 'Article has been removed from your bookmarks',
        });
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove bookmark',
        variant: 'destructive',
      });
    }
  };

  if (loading || (isLoading && user)) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Saved Articles</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Saved Articles</h1>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">No saved articles yet</h2>
          <p className="text-gray-500 mb-6">Articles you bookmark will appear here</p>
          <Button asChild>
            <Link href="/posts">Browse Articles</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarks.map(bookmark => (
            <div key={bookmark._id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <Link 
                  href={`/posts/${bookmark.postSlug}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {bookmark.postTitle}
                </Link>
                <p className="text-sm text-gray-500">
                  Saved on {new Date(bookmark.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeBookmark(bookmark._id)}
                aria-label="Remove bookmark"
              >
                <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}