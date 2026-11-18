import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const siteUrl = 'https://skedaddleenterprises26.com';

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
