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
import WeekendEssayHeader from '@/app/mainsection/weekend-essay-header';

// Revalidate the homepage every 60 seconds so WordPress updates appear quickly
export const revalidate = 60;

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
  const allPosts = await getAllPosts({});
  // Sort posts by date descending to ensure absolute latest is at index 0 (bypassing sticky)
  const posts = [...allPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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

  // Find the previous featured post (non-interview, non-science) for when science is featured
  const previousFeaturedPost = isLatestPostScience
    ? posts.find(post =>
      post.id !== latestNonInterviewPost?.id &&
      (!interviewsCategoryId || !post.categories.includes(interviewsCategoryId)) &&
      (!scienceCategoryId || !post.categories.includes(scienceCategoryId))
    )
    : undefined;

  // Fetch posts from the personal category for Fiction section
  const personalPosts = await getPostsByCategorySlug("books");
  // Get the first personal post (or undefined if none exists)
  const personalPost = personalPosts.length > 0 ? personalPosts[0] : undefined;

  // Fetch posts from the science category for science section
  const sciencePosts = await getPostsByCategorySlug("science");
  // Get the latest science post (for when featured is NOT science)
  const scienceSectionPost = sciencePosts.length > 0 ? sciencePosts[0] : undefined;

  // Fetch posts from \"interviews\" for Interviews section
  const culturePosts = await getPostsByCategorySlug("interviews");
  const interviewPost = culturePosts.length > 0 ? culturePosts[0] : undefined;

  // Collect all post IDs that are already displayed in other sections
  const excludedPostIds: number[] = [
    latestNonInterviewPost?.id,
    previousFeaturedPost?.id,
    isLatestPostScience ? undefined : scienceSectionPost?.id,
    interviewPost?.id,
  ].filter((id): id is number => id !== undefined);

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
      {/* ── Subscribe banner — between section 1 and The Mantel ── */}
      <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-10 py-3 flex items-center gap-3 border-t border-b border-gray-200">
        {/* Illustrated icon — square crop like New Yorker monocle man */}
        <img
          src="/favicon.ico"
          alt="KiawaNotes"
          width={48}
          height={48}
          className="flex-shrink-0 object-cover"
        />
        {/* Text */}
        <p className="font-serif text-sm md:text-base text-black leading-snug">
          Support{" "}
          <em className="font-bold not-italic" style={{ fontStyle: "italic" }}>KiawaNotes</em>
          {"'s"} Bold, Unwavered and Independent Journalism.{" "}
          <a
            href="/sign-up"
            className="font-bold underline underline-offset-2 hover:text-red-700 transition-colors duration-200"
          >
            Subscribe today »
          </a>
        </p>
      </div>

      <Unsubscribed excludedPostIds={excludedPostIds} />
      <Podcast />
      {interviewPost && <Interviews post={interviewPost} />}
      {/* Second section: If featured is science, show previous featured. Otherwise show science post */}
      {isLatestPostScience
        ? (previousFeaturedPost && <FeaturedPostCard post={previousFeaturedPost} />)
        : (scienceSectionPost && <NonFiction post={scienceSectionPost} />)
      }
      <Culture />

      {/* Fiction section (The Weekend Essay) - fetches latest post internally */}
      <div className="py-24 md:py-32">
        <WeekendEssayHeader />
        <Fiction />
      </div>
      <Books />
      <SubscribePopup />
    </>
  );
}
