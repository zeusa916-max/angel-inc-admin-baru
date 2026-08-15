import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/auth', '/auth/'],
      },
    ],
    sitemap: 'https://angel-inc.vercel.app/sitemap.xml',
    host: 'https://angel-inc.vercel.app',
  };
}
