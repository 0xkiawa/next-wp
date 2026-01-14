type SiteConfig = {
  site_domain: string;
  site_name: string;
  site_description: string;
};

// Helper to get the site URL dynamically
const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""); // Remove trailing slash
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return "https://kiawanotes.vercel.app";
};

export const siteConfig: SiteConfig = {
  site_name: "KiawaNotes",
  site_description: "Insightful articles on culture, science, books and more",
  site_domain: getSiteUrl(),
};
