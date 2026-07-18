import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eatandgo.vercel.app';

  // Define static routes
  const staticRoutes = [
    '',
    '/menu',
    '/cart',
    '/profile',
    '/kassa',
    '/admin',
    '/admin/orders',
    '/admin/menu',
    '/admin/clients',
    '/admin/analytics',
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/menu' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/menu' ? 0.8 : 0.5,
  }));
}
