import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const siteUrl = 'https://skedaddleenterprises26.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/team', '/privacy', '/terms', '/trust', '/support', '/delete-account', '/child-safety'];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
