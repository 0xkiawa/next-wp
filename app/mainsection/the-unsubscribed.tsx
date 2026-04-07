import Image from "next/image";
import Link from "next/link";
import MantelCard from "@/components/posts/mantel-card";
import { getAllPosts } from "@/lib/wordpress";
import { Post } from "@/lib/wordpress.d";

/* ─────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────── */
function getEmbeddedImageUrl(post: Post): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
}

function getEmbeddedImageAlt(post: Post): string {
  return (
    (post._embedded?.["wp:featuredmedia"]?.[0] as any)?.alt_text ||
    stripHtml(post.title?.rendered ?? "")
  );
}

function formatMonthYear(dateStr: string): string {
  return new Date(dateStr)
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/* ─────────────────────────────────────────────────────────────────
   Props
───────────────────────────────────────────────────────────────── */
interface UnsubscribedProps {
  excludedPostIds?: number[];
}

/* ─────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────── */
export default async function TheUnsubscribed({
  excludedPostIds = [],
}: UnsubscribedProps) {
  /* ── Data ──────────────────────────────────── */
  const allPosts = await getAllPosts({});
  const posts = [...allPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((p) => !excludedPostIds.includes(p.id));

  if (posts.length === 0) return null;

  const featuredPost = posts[0];
  const articlePosts = posts.slice(1, 7);

  const imageUrl = getEmbeddedImageUrl(featuredPost);
  const imageAlt = getEmbeddedImageAlt(featuredPost);
  const dateLabel = formatMonthYear(featuredPost.date);
  const excerpt = stripHtml(featuredPost.excerpt?.rendered ?? "").substring(0, 200);

  /* ── Render ────────────────────────────────── */
  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-10 py-0">

      {/* TOP RULE */}
      <div className="w-full h-[2px] bg-black" />

      {/* TWO-COLUMN WRAPPER */}
      <div className="flex w-full" style={{ minHeight: "640px" }}>

        {/* ═══════════════════════════════════════
            LEFT  3/4 — Monthly Issue (black card)
        ═══════════════════════════════════════ */}
        <div
          className="flex flex-col bg-black p-8 md:p-12"
          style={{ width: "75%" }}
        >
          {/* Monthly Issue label */}
          <div className="mb-7 flex-shrink-0">
            <p className="font-space-mono text-white/50 text-[10px] tracking-[0.22em] uppercase leading-none mb-0.5">
              MONTHLY ISSUE
            </p>
            <p className="font-space-mono text-white text-[11px] tracking-[0.18em] uppercase">
              {dateLabel}
            </p>
            <div className="w-10 h-px bg-white/20 mt-3" />
          </div>

          {/* Title */}
          <Link href={`/posts/${featuredPost.slug}`} className="group mb-5 block flex-shrink-0">
            <h2
              className="text-white font-stilson text-3xl md:text-4xl lg:text-[2.7rem] leading-[1.1] tracking-tight group-hover:text-gray-300 transition-colors duration-300 line-clamp-4"
              dangerouslySetInnerHTML={{ __html: featuredPost.title?.rendered ?? "" }}
            />
          </Link>

          {/* Excerpt */}
          <p className="text-gray-400 font-garamond italic text-lg md:text-xl leading-relaxed mb-8 line-clamp-3 flex-shrink-0">
            {excerpt}
          </p>

          {/* Featured Image — centred in remaining flex space */}
          <div className="flex-1 flex items-center justify-center">
            {imageUrl ? (
              <Link
                href={`/posts/${featuredPost.slug}`}
                className="relative block w-full max-w-lg overflow-hidden group"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 70vw, 45vw"
                />
                <div className="absolute inset-0 border border-white/10 pointer-events-none" />
              </Link>
            ) : (
              <div
                className="w-full max-w-lg bg-neutral-900 border border-white/10"
                style={{ aspectRatio: "4/3" }}
              />
            )}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-[2px] bg-black flex-shrink-0" />

        {/* ═══════════════════════════════════════
            RIGHT  1/4 — split 50/50 top / bottom
        ═══════════════════════════════════════ */}
        <div className="flex flex-col" style={{ width: "25%" }}>

          {/* TOP HALF — decorative breathing room */}
          <div className="flex-1 bg-white border-b-2 border-black flex items-center justify-center overflow-hidden">
            <span
              className="font-space-mono text-[9px] tracking-[0.3em] text-black/15 uppercase select-none"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              KIAWANOTES
            </span>
          </div>

          {/* BOTTOM HALF — swipeable article reel */}
          <div className="flex-1 bg-white flex flex-col overflow-hidden p-4">

            {/* "FEATURED ARTICLES" heading */}
            <p className="font-space-mono text-black text-[9px] tracking-[0.22em] uppercase mb-3 flex-shrink-0">
              FEATURED ARTICLES
            </p>

            {/* Scroll reel — shows 1.5 cards to hint at swiping */}
            <div
              className="no-scrollbar flex gap-3 overflow-x-auto flex-1"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {articlePosts.map((post) => (
                <div
                  key={post.id}
                  className="flex-shrink-0"
                  style={{ width: "72%", scrollSnapAlign: "start" }}
                >
                  <MantelCard post={post} />
                </div>
              ))}
            </div>

            {/* Swipe hint */}
            <p className="font-space-mono mt-2 text-[8px] tracking-[0.2em] text-black/30 uppercase flex-shrink-0">
              ← swipe
            </p>
          </div>

        </div>
      </div>

      {/* BOTTOM RULE */}
      <div className="w-full h-[2px] bg-black" />

    </section>
  );
}
