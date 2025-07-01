import { Metadata } from 'next';
import Fiction from '@/components/posts/fiction-card';
import NonFiction from '@/components/posts/science-post-card';
import FeaturedPostCard from '@/components/posts/featured-post-card';
import { getAllPosts, getPostsByCategorySlug } from "@/lib/wordpress";
import Unsubscribed from '@/app/mainsection/the-unsubscribed';
import BooksCulture from '@/app/mainsection/book-culture';
import WeeklyEdit from '@/app/mainsection/weekly-edit';
import SubscribePopup from '@/app/mainsection/subscribe-popup';
import Image from '@/app/mainsection/image';

// Define metadata for the home page
export const metadata: Metadata = {
  title: 'KiawaNotes | The Blog of Kiawa Vurner',
  description: 'Explore thought-provoking articles on books, culture, ideas, and more from Kiawa Vurner.',
  keywords: ['blog', 'books', 'culture', 'ideas', 'Kiawa Vurner'],
  authors: [{ name: 'Kiawa Vurner' }],
  openGraph: {
    title: 'KiawaNotes | The Blog of Kiawa Vurner',
    description: 'Explore thought-provoking articles on books, culture, ideas, and more from Kiawa Vurner.',
    url: 'https://kiawanotes.com',
    siteName: 'KiawaNotes',
    images: [
      {
        url: '/twitter-image.jpg', // Make sure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: 'KiawaNotes Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KiawaNotes | The Blog of Kiawa Vurner',
    description: 'Explore thought-provoking articles on books, culture, ideas, and more from Kiawa Vurner.',
    images: ['/twitter-image.jpg'], // Make sure this image exists in your public folder
    creator: '@kiawavurner',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  // Fetch the latest post instead of a specific post by ID
  const posts = await getAllPosts({});
  const latestPost = posts[0]; // Get the first post, which is the latest one
  
  // Fetch posts from the personal category for Fiction section
  const personalPosts = await getPostsByCategorySlug("books");
  // Get the first personal post (or undefined if none exists)
  const personalPost = personalPosts.length > 0 ? personalPosts[0] : undefined;
  //fetch posts from the personal category for Fiction section
  const personalPosts2 = await getPostsByCategorySlug("personal");
  // Get the first personal post (or undefined if none exists)
  const personalPost2 = personalPosts2.length > 0 ? personalPosts2[0] : undefined;
  
  return (
    <>
      {/* Featured Post Card */}
      <div className="mb-8 py-4">
        {latestPost && <FeaturedPostCard post={latestPost} />} {/* Display the latest post if available */}
      </div>
      <Unsubscribed />
      <Image />
      <WeeklyEdit />
      {/* Culture section with personal category post */}
      {personalPost2 && <NonFiction post={personalPost2} />}
      <BooksCulture />
      
      {/* Fiction section with personal category post */}
      {personalPost && <Fiction post={personalPost} />}
      <SubscribePopup />
    </>
  );
}
