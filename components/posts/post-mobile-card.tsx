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
        className="flex flex-row-reverse gap-4 lg:flex-col not-prose relative py-4 sm:py-6 md:py-6 lg:py-0"
      >
        <div
          className={cn(
            "h-28 w-40 sm:h-28 sm:w-40 md:h-48 md:w-56 lg:h-64 lg:w-full flex items-center justify-center overflow-hidden lg:border-r ",
            isLast ? "lg:last:border-r-0" : ""
          )}
        >
          <div className="w-full h-full relative rounded-md lg:w-2/3">
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
        <div className="flex flex-col gap-1 sm:gap-2 w-full">
          <p className="text-red-600 text-xs text-left lg:text-center">{category.name}</p>
          <div
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            className="text-xl sm:text-xl lg:text-xl text-primary font-stilson font-bold hover:underline decoration-muted-foreground underline-offset-4 transition-all break-words"
          ></div>
          <div
            className="text-xm sm:text-xl lg:text-base font-acaslon"
            dangerouslySetInnerHTML={{
              __html:
                post.excerpt.rendered.split(" ").slice(0, 12).join(" ").trim() +
                "...",
            }}
          ></div>
        </div>
      </Link>
      {!isLast && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-100 dark:bg-neutral-900 block lg:hidden" />
      )}
    </div>
  );
}