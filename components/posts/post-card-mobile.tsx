import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";

export default async function PostComponent({
  post,
  isLast = false,
}: {
  post: Post;
  isLast?: boolean;
}) {
  const media = await getFeaturedMediaById(post.featured_media);
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = await getCategoryById(post.categories[0]);

  return (
    <div className="relative">
      <Link
        href={`/posts/${post.slug}`}
        className="flex flex-col gap-4 sm:flex-col md:flex-row-reverse lg:flex-col not-prose relative py-4 sm:py-6 md:py-6 lg:py-0"
      >
        {/* Image container */}
        <div
          className={cn(
            "h-48 w-full sm:h-48 sm:w-full md:h-36 md:w-64 lg:h-48 lg:w-full flex items-center justify-center overflow-hidden lg:border-r lg:border-gray-200",
            isLast ? "lg:last:border-r-0" : ""
          )}
        >
          <div className="w-full h-full relative rounded-md lg:w-3/4">
            {media?.source_url ? (
              <Image
                className="object-cover"
                src={media.source_url}
                alt={post.title.rendered}
                layout="fill"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
            )}
          </div>
        </div>

        {/* Content container */}
        <div className="flex flex-col gap-1 sm:flex-col md:flex-col w-full">
          <p className="text-red-600 text-xs font-garamond">{category.name}</p>
          <div
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            className="text-xl sm:text-xl lg:text-xl text-primary font-garamond font-bold hover:underline decoration-muted-foreground underline-offset-4 transition-all break-words"
          ></div>
          <div
            className="text-xm sm:text-xl lg:text-base font-garamond"
            dangerouslySetInnerHTML={{
              __html:
                post.excerpt.rendered.split(" ").slice(0, 12).join(" ").trim() +
                "...",
            }}
          ></div>
        </div>
      </Link>
      {!isLast && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 lg:hidden" />
      )}
    </div>
  );
}