import { getAllAuthors } from "@/lib/wordpress";
import Link from "next/link";

export default async function Page() {
    const authors = await getAllAuthors();
    
    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-stilson">
            {/* Left column for author profiles */}
            <div>
                <div className="space-y-6">
                    {authors.map((author: any) => (
                        <div key={author.id} className="flex items-start space-x-4">
                            {/* Avatar image */}
                            <div className="flex-shrink-0">
                                <img
                                    className="w-20 h-20 rounded-full"
                                    src={author.avatar_urls?.[96]}
                                    alt={`Profile of ${author.name}`}
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