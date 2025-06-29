import { siteConfig } from '@/config/site';
import { getAllPosts, getAllProjects } from '@/utils/mdx';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ['', '/spotify'].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const posts = getAllPosts().map((post) => ({
        url: `${siteConfig.url}/posts/${post.slug}`,
        lastModified: new Date(post.metadata.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const projects = getAllProjects().map((project) => ({
        url: `${siteConfig.url}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const products = [
        {
            url: `${siteConfig.url}/products/preset`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${siteConfig.url}/products/lut`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
    ];

    return [...routes, ...posts, ...projects, ...products];
}