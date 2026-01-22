import { Metadata } from 'next';
import Fiction from '@/components/posts/fiction-card';
import NonFiction from '@/components/posts/science-post-card';
import FeaturedPostCard from '@/components/posts/featured-post-card';
import { getAllPosts, getPostsByCategorySlug, getCategoryBySlug } from "@/lib/wordpress";
import Unsubscribed from '@/app/mainsection/the-unsubscribed';
import Culture from '@/app/mainsection/-culture';
import Books from '@/app/mainsection/-books';
import Interviews from '@/app/mainsection/interviews';
import SubscribePopup from '@/app/mainsection/subscribe-popup';
import Podcast from '@/app/mainsection/podcast';

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
  // Fetch the latest posts
  const posts = await getAllPosts({});

  // Fetch the science category to get its ID
  const scienceCategory = await getCategoryBySlug("science");
  const scienceCategoryId = scienceCategory?.id;

  // Fetch the interviews category to get its ID
  const interviewsCategory = await getCategoryBySlug("interviews");
  const interviewsCategoryId = interviewsCategory?.id;

  // Find the first post that is NOT in the interviews category (for featured section)
  const latestNonInterviewPost = posts.find(post =>
    !interviewsCategoryId || !post.categories.includes(interviewsCategoryId)
  );

  // Check if the featured post is in the science category
  const isLatestPostScience = latestNonInterviewPost && scienceCategoryId
    ? latestNonInterviewPost.categories.includes(scienceCategoryId)
    : false;

  // Fetch posts from the personal category for Fiction section
  const personalPosts = await getPostsByCategorySlug("books");
  // Get the first personal post (or undefined if none exists)
  const personalPost = personalPosts.length > 0 ? personalPosts[0] : undefined;
  //fetch posts from the personal category for Fiction section
  const personalPosts2 = await getPostsByCategorySlug("science");
  // Get the first personal post (or undefined if none exists)
  const personalPost2 = personalPosts2.length > 0 ? personalPosts2[0] : undefined;

  // Fetch posts from "interviews" for Interviews section
  const culturePosts = await getPostsByCategorySlug("interviews");
  const interviewPost = culturePosts.length > 0 ? culturePosts[0] : undefined;

  return (
    <>
      {/* Featured Post Card - conditionally render based on category */}
      <div className="mb-8 py-4">
        {latestNonInterviewPost && (
          isLatestPostScience
            ? <NonFiction post={latestNonInterviewPost} />
            : <FeaturedPostCard post={latestNonInterviewPost} />
        )}
      </div>
      <Unsubscribed />
      <Podcast />
      {interviewPost && <Interviews post={interviewPost} />}
      {/* Culture section with personal category post */}
      {personalPost2 && <NonFiction post={personalPost2} />}
      <Culture />

      {/* Fiction section (The Weekend Essay) - fetches latest post internally */}
      <Fiction />
      <Books />
      <SubscribePopup />
    </>
  );
}
