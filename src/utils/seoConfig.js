const rawSiteUrl = import.meta.env.VITE_SITE_URL || "https://growskillstech.com";

export const SITE_URL = rawSiteUrl.replace(/\/$/, "");
export const SITE_NAME = "Grow Skills Tech";
export const SITE_TAGLINE = "Software Development & IT Training";

export const defaultSeo = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description:
    "Grow Skills Tech is an IT company focused on software development and IT training. We build web apps, mobile apps, and custom software, and train professionals in modern technologies—plus digital marketing and brand design.",
  keywords:
    "Grow Skills Tech, software development, IT training, custom software, web development, mobile app development, full stack development, coding courses, programming training, digital marketing, SEO, brand design, technology company India",
  image: "/favicon.png",
};

export const pageSeo = {
  home: defaultSeo,
};

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/favicon.png"),
    description: defaultSeo.description,
    email: "growskillstech@gmail.com",
    telephone: "+917470834876",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61576749813417",
      "https://www.instagram.com/scholarsmediatech/?hl=en",
      "https://www.linkedin.com/company/scholars-mediatech-pvt-ltd/",
      "https://x.com/scholarsmediatech",
      "https://www.youtube.com/@scholarsmediatech",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: defaultSeo.description,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}
