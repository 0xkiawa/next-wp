import { siteConfig } from "@/site.config";

export const siteUrl = new URL(siteConfig.site_domain);

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(value: string, length = 160) {
  return value.length > length ? `${value.slice(0, length - 1).trimEnd()}…` : value;
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const publisher = {
  "@type": "Organization",
  "@id": `${siteConfig.site_domain}/#organization`,
  name: siteConfig.site_name,
  url: siteConfig.site_domain,
  logo: { "@type": "ImageObject", url: absoluteUrl("/android-chrome-512x512.png") },
};

export const primaryAuthor = {
  "@type": "Person",
  "@id": `${siteConfig.site_domain}/#kiawa`,
  name: "Kiawa",
  alternateName: ["Kiawa Vurner", "Victor Kiawa"],
  url: siteConfig.site_domain,
  sameAs: [
    "https://github.com/kiawavurner",
    "https://x.com/kiawavurner",
    "https://www.instagram.com/kiawanotes/",
  ],
};
