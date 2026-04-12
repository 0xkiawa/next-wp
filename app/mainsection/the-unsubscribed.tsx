import Image from "next/image";
import Link from "next/link";
import MantelCard from "@/components/posts/mantel-card";
import { getAllPosts } from "@/lib/wordpress";
import { Post } from "@/lib/wordpress.d";
import he from "he";

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
  return he.decode(html.replace(/<[^>]*>/g, "").trim());
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
    <section className="w-full max-w-[1400px] mx-auto lg:px-24">

      {/* ══════════════════════════════════════════════
          DESKTOP LAYOUT  (md and up)
          Left 75%: white bg + inset black card
          Thin 1px divider
          Right 25%: white — no top/bottom black rules
      ══════════════════════════════════════════════ */}
      <div className="hidden md:flex w-full bg-white" style={{ minHeight: "640px" }}>

        {/* LEFT 75% — white padding wrapping the inset black card */}
        <div className="bg-white p-3 lg:p-4" style={{ width: "75%" }}>
          <div className="bg-black h-full flex flex-col p-8 lg:p-10">

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
        </div>

        {/* Thin 1px vertical divider */}
        <div className="w-px bg-black flex-shrink-0" />

        {/* RIGHT 25% — clean white, no top/bottom black rules */}
        <div className="flex flex-col bg-white" style={{ width: "25%" }}>

          {/* TOP HALF — Sign Up CTA (desktop only) */}
          <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-5 py-6">
            <div className="relative w-full">
              <span className="absolute -top-2 -left-1 text-red-700 leading-none select-none font-space-mono"
                style={{ fontSize: "2.6rem", lineHeight: 1 }}>
                &ldquo;
              </span>
              <p className="font-space-mono font-bold text-black text-xl tracking-normal uppercase leading-[1.85] text-center px-4 pt-5 pb-4">
                How am I supposed to calculate volume when I don't have the speakers?
              </p>
              <span className="absolute -bottom-4 -right-1 text-red-700 leading-none select-none font-space-mono"
                style={{ fontSize: "2.6rem", lineHeight: 1 }}>
                &rdquo;
              </span>
            </div>
          </div>

          {/* Subtle mid-divider between the two halves */}
          <div className="h-px bg-black/15 mx-4" />

          {/* BOTTOM HALF — swipeable article reel */}
          <div className="flex-1 flex flex-col overflow-hidden p-4">
            <p className="font-space-mono text-black text-xs tracking-widest uppercase font-bold mb-3 flex-shrink-0">
              FEATURED ARTICLES
            </p>

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

            <p className="font-space-mono mt-2 text-[8px] tracking-[0.2em] text-black/30 uppercase flex-shrink-0">
              ← swipe
            </p>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE LAYOUT  (below md)
          1. Black card — full width
             – image full width on top
             – label / title / excerpt below
          2. Small white gap
          3. 3px black divider
          4. Featured Articles — swipeable 1.5 cards
      ══════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col">

        {/* Quote — white space above black card, mobile only */}
        <div className="md:hidden relative w-full bg-white px-8 pt-7 pb-6">
          <span className="absolute top-4 left-4 text-red-700 leading-none select-none font-space-mono"
            style={{ fontSize: "2.8rem", lineHeight: 1 }}>
            &#10077;
          </span>
          <p className="font-space-mono font-bold text-black text-3xl tracking-normal uppercase leading-[1.85] text-center px-4">
            How am I supposed to calculate volume when I don't have the speakers?
          </p>
          <span className="absolute bottom-2 right-4 text-red-700 leading-none select-none font-space-mono"
            style={{ fontSize: "2.8rem", lineHeight: 1 }}>
            &#10078;
          </span>
        </div>

        {/* Black card — full width */}
        <div className="bg-black w-full flex flex-col">

          {/* Image — full width, top of card */}
          {imageUrl ? (
            <Link
              href={`/posts/${featuredPost.slug}`}
              className="relative block w-full overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </Link>
          ) : (
            <div className="w-full bg-neutral-900" style={{ aspectRatio: "4/3" }} />
          )}

          {/* Text below the image */}
          <div className="p-6 pb-8">

            {/* Monthly Issue label */}
            <div className="mb-4">
              <p className="font-space-mono text-white/50 text-[10px] tracking-[0.22em] uppercase leading-none mb-0.5">
                MONTHLY ISSUE
              </p>
              <p className="font-space-mono text-white text-[11px] tracking-[0.18em] uppercase">
                {dateLabel}
              </p>
              <div className="w-10 h-px bg-white/20 mt-3" />
            </div>

            {/* Title */}
            <Link href={`/posts/${featuredPost.slug}`} className="group block mb-4">
              <h2
                className="text-white font-stilson text-2xl leading-[1.15] tracking-tight group-hover:text-gray-300 transition-colors line-clamp-4"
                dangerouslySetInnerHTML={{ __html: featuredPost.title?.rendered ?? "" }}
              />
            </Link>

            {/* Excerpt */}
            <p className="text-gray-400 font-garamond italic text-base leading-relaxed line-clamp-3">
              {excerpt}
            </p>

          </div>
        </div>

        {/* Subscribe banner — slides in after 5s, mobile only */}
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .subscribe-slide {
            opacity: 0;
            animation: slideUp 0.6s ease-out 5s forwards;
          }
        `}</style>

        <div className="subscribe-slide lg:hidden w-full border-t border-b border-black/10">
          <div className="max-w-[1400px] mx-auto px-7 flex items-center gap-3">
            <img
              src="/kiawanotesicon.png"
              alt="KiawaNotes"
              width={48}
              height={48}
              className="flex-shrink-0 object-cover rounded-[10px]"
            />
            <p className="font-acaslon text-sm text-black leading-snug">
              Support{" "}
              <em style={{ fontStyle: "italic" }} className="font-bold font-acaslon">KiawaNotes</em>
              {"'s"} Bold, Unwavered and Independent Journalism.{" "}
              <a
                href="/sign-up"
                className="font-bold underline underline-offset-2 hover:text-red-700 transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe today »
              </a>
            </p>
          </div>
        </div>

        {/* White space gap */}
        <div className="h-5 bg-white" />

        {/* 3px black divider */}
        <div className="h-[3px] bg-black" />

        {/* Featured Articles reel */}
        <div className="bg-white px-4 pt-4 pb-6">
          <p className="font-space-mono text-black text-xs tracking-widest uppercase font-bold mb-3">
            FEATURED ARTICLES
          </p>

          <div
            className="no-scrollbar flex gap-3 overflow-x-auto"
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

          <p className="font-space-mono mt-3 text-[8px] tracking-[0.2em] text-black/30 uppercase">
            ← swipe
          </p>
        </div>

      </div>

    </section>
  );
}
