import Link from "next/link";
import Image from "next/image";
import { getFeaturedMediaById, getAuthorById, getCategoryById, getAllPosts } from "@/lib/wordpress";

export default async function TheWeekendEssay() {
  // Fetch all posts and find the most recent one posted on Saturday (The Weekend Essay)
  const allPosts = await getAllPosts();

  // Find posts that were published on a Saturday (day 6 in JavaScript: 0=Sunday, 6=Saturday)
  const saturdayPosts = allPosts.filter(p => {
    const postDate = new Date(p.date);
    return postDate.getDay() === 6; // Saturday
  });

  // Use the most recent Saturday post, or fallback to latest post if no Saturday post exists
  const post = saturdayPosts.length > 0 ? saturdayPosts[0] : allPosts[0];

  if (!post) return null;

  const media = await getFeaturedMediaById(post.featured_media);
  const author = await getAuthorById(post.author);
  const category = await getCategoryById(post.categories[0]);

  // Format the date like "April 23  2024"
  const postDate = new Date(post.date);
  const formattedDate = postDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Extract plain text title
  const titleText = post.title.rendered.replace(/<[^>]+>/g, '');

  // Get the excerpt/subtitle text (strip HTML)
  const excerptText = post.excerpt?.rendered
    ? post.excerpt.rendered.replace(/<[^>]+>/g, '').trim()
    : '';

  // Get image caption from featured media
  const imageCaption = media?.caption?.rendered
    ? media.caption.rendered.replace(/<[^>]+>/g, '').trim()
    : '';

  return (
    <section className="weekend-essay-section">
      <div className="weekend-essay-container">
        {/* Text Content - Left Side */}
        <div className="weekend-essay-text">
          {/* Category Label */}
          <Link
            href={`/posts/?category=${category.id}`}
            className="weekend-essay-category"
          >
            {category.name}
          </Link>

          {/* Title */}
          <h2 className="weekend-essay-title">
            <Link href={`/posts/${post.slug}`}>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Link>
          </h2>

          {/* Subtitle/Excerpt */}
          {excerptText && (
            <p 
              className="weekend-essay-subtitle"
              dangerouslySetInnerHTML={{ __html: excerptText }}
            />
          )}

          {/* Author & Date */}
          <div className="weekend-essay-meta">
            <p className="weekend-essay-author">By {author.name}</p>
            <p className="weekend-essay-date">{formattedDate}</p>
          </div>
        </div>

        {/* Image - Right Side */}
        {media && (
          <div className="weekend-essay-image-wrapper">
            <Link href={`/posts/${post.slug}`} style={{ display: 'block', width: '100%' }}>
              <div className="weekend-essay-image-container">
                <Image
                  src={media.source_url}
                  alt={media.alt_text || titleText}
                  fill
                  className="weekend-essay-image"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Caption Bar */}
      {imageCaption && (
        <div className="weekend-essay-caption">
          <span dangerouslySetInnerHTML={{ __html: imageCaption }} />
        </div>
      )}

      {/* If no caption from media, show a default */}
      {!imageCaption && (
        <div className="weekend-essay-caption">
          illustration by {author.name.toLowerCase()}
        </div>
      )}

      {/* Bottom Link */}
      <div className="weekend-essay-footer">
        <Link
          href={`/posts/?category=${category.id}`}
          className="weekend-essay-footer-link"
        >
          All {category.name} →
        </Link>
      </div>

      <style>{`
        .weekend-essay-section {
          max-width: 72rem;
          margin: 0 auto;
          background: #ffffff;
          padding: 3rem 2rem 2rem;
          position: relative;
        }

        .weekend-essay-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: start;
        }

        @media (min-width: 768px) {
          .weekend-essay-container {
            grid-template-columns: 45% 55%;
            gap: 2.5rem;
          }
        }

        /* Category Label */
        .weekend-essay-category {
          font-family: var(--font-acaslon), Georgia, serif;
          font-style: italic;
          font-size: 1.05rem;
          color: #e8635a;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 0.25rem;
          transition: color 0.2s ease;
          letter-spacing: 0.01em;
        }

        .weekend-essay-category:hover {
          color: #c4443d;
        }

        /* Title */
        .weekend-essay-title {
          font-family: var(--font-coolvetica), var(--font-stilson), sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 700;
          color: #1a3a4a;
          line-height: 1.1;
          margin: 0 0 0.75rem 0;
          letter-spacing: -0.01em;
        }

        .weekend-essay-title a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .weekend-essay-title a:hover {
          color: #2a5a6a;
        }

        /* Make italic/em words in the title coral-colored */
        .weekend-essay-title em,
        .weekend-essay-title i {
          color: #e8635a;
          font-style: italic;
        }

        /* Subtitle */
        .weekend-essay-subtitle {
          font-family: var(--font-acaslon), Georgia, serif;
          font-style: italic;
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #2c2c2c;
          line-height: 1.45;
          margin: 0 0 2rem 0;
          max-width: 95%;
        }

        /* Author & Date */
        .weekend-essay-meta {
          margin-top: auto;
        }

        .weekend-essay-author {
          font-family: var(--font-futura), var(--font-knockout), sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .weekend-essay-date {
          font-family: var(--font-futura), var(--font-knockout), sans-serif;
          font-weight: 400;
          font-size: 0.95rem;
          color: #555;
          margin: 0.15rem 0 0 0;
          letter-spacing: 0.03em;
        }

        /* Image Wrapper */
        .weekend-essay-image-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .weekend-essay-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          max-height: 36rem;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .weekend-essay-image-container {
            aspect-ratio: 3 / 4;
          }
        }

        .weekend-essay-image {
          object-fit: contain;
          object-position: center top;
          transition: transform 0.4s ease;
        }

        .weekend-essay-image-container:hover .weekend-essay-image {
          transform: scale(1.02);
        }

        /* Caption Bar */
        .weekend-essay-caption {
          font-family: var(--font-futura), var(--font-knockout), sans-serif;
          font-size: 0.85rem;
          color: #e8635a;
          font-weight: 600;
          text-align: center;
          padding: 1rem 1rem 0.5rem;
          margin-top: 1rem;
          letter-spacing: 0.02em;
          line-height: 1.5;
        }

        /* Footer */
        .weekend-essay-footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e0e0e0;
          max-width: 16rem;
          margin-left: auto;
          margin-right: auto;
        }

        .weekend-essay-footer-link {
          font-family: var(--font-acaslon), Georgia, serif;
          font-style: italic;
          font-size: 0.9rem;
          color: #888;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .weekend-essay-footer-link:hover {
          color: #1a1a1a;
          text-decoration: underline;
        }

        /* Mobile adjustments */
        @media (max-width: 767px) {
          .weekend-essay-section {
            padding: 2rem 1.25rem 1.5rem;
          }

          .weekend-essay-text {
            order: 1;
          }

          .weekend-essay-image-wrapper {
            order: 2;
          }

          .weekend-essay-meta {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}