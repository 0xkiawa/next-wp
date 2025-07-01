/**
 * Calculates the number of words in HTML content by stripping HTML tags
 * and counting the remaining words.
 */
export function calculateWordCount(htmlContent: string): number {
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ').trim();
  const words = textContent.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Calculates the estimated reading time in minutes for HTML content
 * by stripping HTML tags, counting words, and using an average reading speed.
 * @param htmlContent The HTML content to analyze
 * @param wordsPerMinute The average reading speed (default: 225 words per minute)
 * @returns The estimated reading time in minutes
 */
export function calculateReadingTime(htmlContent: string, wordsPerMinute: number = 225): number {
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ').trim();
  const words = textContent.split(/\s+/).filter(word => word.length > 0);
  return Math.ceil(words.length / wordsPerMinute);
}