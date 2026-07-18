import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://eatandgo.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/menu'],
      disallow: ['/admin/', '/kassa/', '/cart/', '/profile/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
