// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";

const baseUrl = process.env.WORDPRESS_URL;

interface FetchOptions extends RequestInit {
  next?: {
    revalidate?: number | false;
  };
}

function getUrl(path: string, query?: Record<string, any>) {
  if (!baseUrl) {
    return "";
  }
  const params = query ? querystring.stringify(query) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

// In development, use a short revalidation time so new posts show up quickly.
// In production, use a longer time (1 hour) to reduce server load.
// You can also set up on-demand revalidation via a webhook from WordPress.
const isDev = process.env.NODE_ENV === 'development';

const defaultFetchOptions: FetchOptions = {
  next: {
    revalidate: isDev ? 60 : 3600, // 60 seconds in dev, 1 hour in production
  },
};

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// Fetch with timeout using AbortController
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Retry helper with improved error detection and longer backoff for unstable hosts
async function fetchWithRetry(url: string, options: RequestInit, retries = 5, backoff = 2000): Promise<Response> {
  try {
    const response = await fetchWithTimeout(url, options, 30000);
    // If 5xx error, throw to retry
    if (response.status >= 500) {
      throw new Error(`Server error: ${response.status}`);
    }
    return response;
  } catch (error: any) {
    const isRetryable =
      error.name === 'AbortError' || // Timeout
      error.cause?.code === 'UND_ERR_SOCKET' ||
      error.cause?.code === 'ECONNRESET' ||
      error.cause?.code === 'ECONNREFUSED' ||
      error.cause?.code === 'ETIMEDOUT' ||
      error.message?.includes('fetch failed') ||
      error.message?.includes('closed') ||
      error.message?.includes('Server error') ||
      error.message?.includes('network');

    if (retries > 0 && isRetryable) {
      console.warn(`[WordPress] Fetch failed for ${url}, retrying in ${backoff}ms... (${retries} attempts left). Error: ${error.message || error.name}`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, Math.min(backoff * 1.5, 10000)); // Cap backoff at 10s
    }
    throw error;
  }
}


async function wordpressFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  if (!url) {
    console.warn("[WordPress] No URL provided to wordpressFetch. Returning default value.");
    // Return empty array for array types, or null/empty object for others
    return [] as any;
  }
  const userAgent = "Next.js WordPress Client";
  const username = process.env.WORDPRESS_USERNAME;
  const applicationPassword = process.env.WORDPRESS_APPLICATION_PASSWORD;

  const headers: HeadersInit = {
    "User-Agent": userAgent,
    "Connection": "keep-alive", // Try to maintain connection
  };

  if (username && applicationPassword) {
    const credentials = Buffer.from(`${username}:${applicationPassword}`).toString("base64");
    headers["Authorization"] = `Basic ${credentials}`;
  }

  try {
    const response = await fetchWithRetry(url, {
      ...defaultFetchOptions,
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API request failed: ${response.statusText}`,
        response.status,
        url
      );
    }

    const responseClone = response.clone();

    try {
      return await response.json();
    } catch (parseError) {
      const text = await responseClone.text();
      console.error("[WordPress] Failed to parse JSON. Response text:", text.substring(0, 500));
      throw new Error(`Failed to parse JSON from ${url}`);
    }
  } catch (error: any) {
    console.error(`[WordPress] Error fetching (${url}):`, error.message || error);
    // During build, if we can't fetch, return an empty result instead of crashing the build
    if (process.env.NODE_ENV === 'production') {
      return [] as any;
    }
    throw error;
  }
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 20, // Reduced from 100 to be lighter
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  const url = getUrl("/wp-json/wp/v2/posts", query);
  return wordpressFetch<Post[]>(url);
}

export async function getPostById(id: number): Promise<Post> {
  const url = getUrl(`/wp-json/wp/v2/posts/${id}`);
  return wordpressFetch<Post>(url);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const url = getUrl("/wp-json/wp/v2/posts", { slug });
  const response = await wordpressFetch<Post[]>(url);
  return response[0];
}

export async function getAllCategories(): Promise<Category[]> {
  const url = getUrl("/wp-json/wp/v2/categories");
  return wordpressFetch<Category[]>(url);
}

export async function getCategoryById(id: number): Promise<Category> {
  const url = getUrl(`/wp-json/wp/v2/categories/${id}`);
  return wordpressFetch<Category>(url);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const url = getUrl("/wp-json/wp/v2/categories", { slug });
  const response = await wordpressFetch<Category[]>(url);
  return response[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { categories: categoryId, _embed: true });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tagId, _embed: true });
  return wordpressFetch<Post[]>(url);
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags", { post: postId });
  return wordpressFetch<Tag[]>(url);
}

export async function getAllTags(): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags");
  return wordpressFetch<Tag[]>(url);
}

export async function getTagById(id: number): Promise<Tag> {
  const url = getUrl(`/wp-json/wp/v2/tags/${id}`);
  return wordpressFetch<Tag>(url);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const url = getUrl("/wp-json/wp/v2/tags", { slug });
  const response = await wordpressFetch<Tag[]>(url);
  return response[0];
}

export async function getAllPages(): Promise<Page[]> {
  const url = getUrl("/wp-json/wp/v2/pages");
  return wordpressFetch<Page[]>(url);
}

export async function getPageById(id: number): Promise<Page> {
  const url = getUrl(`/wp-json/wp/v2/pages/${id}`);
  return wordpressFetch<Page>(url);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const url = getUrl("/wp-json/wp/v2/pages", { slug });
  const response = await wordpressFetch<Page[]>(url);
  return response[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  const url = getUrl("/wp-json/wp/v2/users");
  return wordpressFetch<Author[]>(url);
}

export async function getAuthorById(id: number): Promise<Author> {
  const url = getUrl(`/wp-json/wp/v2/users/${id}`);
  return wordpressFetch<Author>(url);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const url = getUrl("/wp-json/wp/v2/users", { slug });
  const response = await wordpressFetch<Author[]>(url);
  return response[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { author: authorId, _embed: true });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  // If author doesn't exist, return empty array instead of crashing
  if (!author) {
    console.warn(`Author "${authorSlug}" not found in WordPress`);
    return [];
  }
  const url = getUrl("/wp-json/wp/v2/posts", { author: author.id, _embed: true });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  // If category doesn't exist, return empty array instead of crashing
  if (!category) {
    console.warn(`Category "${categorySlug}" not found in WordPress`);
    return [];
  }
  const url = getUrl("/wp-json/wp/v2/posts", { categories: category.id, _embed: true });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  // If tag doesn't exist, return empty array instead of crashing
  if (!tag) {
    console.warn(`Tag "${tagSlug}" not found in WordPress`);
    return [];
  }
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tag.id, _embed: true });
  return wordpressFetch<Post[]>(url);
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia | null> {
  if (id === 0) {
    return null;
  }
  const url = getUrl(`/wp-json/wp/v2/media/${id}`);
  return wordpressFetch<FeaturedMedia>(url);
}

export async function searchCategories(query: string): Promise<Category[]> {
  const url = getUrl("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Category[]>(url);
}

export async function searchTags(query: string): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Tag[]>(url);
}

export async function searchAuthors(query: string): Promise<Author[]> {
  const url = getUrl("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Author[]>(url);
}

export { WordPressAPIError };
