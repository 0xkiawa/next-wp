import { getAllAuthors, getAuthorById } from "@/lib/wordpress";
import { Author } from "@/lib/wordpress.d";
import Image from "next/image";
import Link from "next/link";

export default async function AboutTheAuthor({ authorId }: { authorId?: number }) {
    let authors: Author[] = [];

    if (authorId) {
        try {
            const author = await getAuthorById(authorId);
            if (author) {
                authors = [author];
            }
        } catch (error) {
            console.error(`Failed to fetch author with ID ${authorId}:`, error);
        }
    } else {
        authors = await getAllAuthors();
    }

    if (authors.length === 0) {
        return null;
    }

    const getAvatarUrl = (author: any) => {
        // First try to find a valid WordPress avatar
        if (author.avatar_urls) {
            const url = author.avatar_urls['96'] || author.avatar_urls['48'] || author.avatar_urls['24'] || Object.values(author.avatar_urls)[0];
            if (url) return url;
        }

        // Fallback to UI Avatars if no WP avatar is found or if it's invalid
        const name = author.name || 'Author';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=96`;
    };

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-stilson">
            {/* Left column for author profiles */}
            <div>
                <div className="space-y-6">
                    {authors.map((author: any) => (
                        <div key={author.id} className="flex items-start space-x-4">
                            {/* Avatar image */}
                            <div className="flex-shrink-0">
                                <Image
                                    className="rounded-full bg-gray-100 object-cover"
                                    src={getAvatarUrl(author)}
                                    alt={`Profile of ${author.name}`}
                                    width={80}
                                    height={80}
                                    unoptimized
                                />
                            </div>

                            {/* Author info */}
                            <div className="flex-1">
                                {/* Author name on top */}
                                <div className="mb-1">
                                    <Link
                                        href={`/posts/?author=${author.id}`}
                                        className="font-medium text-base uppercase text-orange-600 hover:text-orange-500 no-underline"
                                    >
                                        {author.name}
                                    </Link>
                                </div>

                                {/* Bio below */}
                                <div className="text-sm text-gray-600 leading-normal font-glacial">
                                    {author.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right column for other content */}
            <div>
                {/* Add your other content here */}
            </div>
        </div>
    );
}