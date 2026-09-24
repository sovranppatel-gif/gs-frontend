import { Helmet } from "react-helmet-async";
import {
  SITE_NAME,
  absoluteUrl,
  defaultSeo,
  organizationJsonLd,
  websiteJsonLd,
} from "../utils/seoConfig.js";

export default function SeoHead({
  title = defaultSeo.title,
  description = defaultSeo.description,
  keywords = defaultSeo.keywords,
  path = "/",
  image = defaultSeo.image,
  noindex = false,
  includeWebsiteSchema = true,
}) {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const robots = noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large";

  const jsonLd = [organizationJsonLd()];
  if (includeWebsiteSchema) {
    jsonLd.push(websiteJsonLd());
  }

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
