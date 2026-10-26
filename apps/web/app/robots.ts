import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const siteUrl = 'https://skedaddle.example.com'; // TODO: replace with the real production domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
