import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
    storage: process.env.NODE_ENV === 'production' ? {
        kind: 'github',
        repo: 'ttvn91/laduflower',
    } : {
        kind: 'local',
    },

    collections: {
        gallery: collection({
            label: 'Gallery Categories',
            slugField: 'slug',
            path: 'src/data/gallery/*',
            format: { data: 'json' },
            columns: ['title', 'order'],
            schema: {
                slug: fields.slug({ name: { label: 'Slug' } }),
                title: fields.text({ label: 'Title' }),
                order: fields.integer({ label: 'Order', defaultValue: 1 }),
                coverIndex: fields.integer({
                    label: 'Cover Image Index',
                    defaultValue: 1,
                    description: 'Which image to use as cover (1 = first image)'
                }),
                images: fields.array(
                    fields.object({
                        image: fields.image({
                            label: 'Image',
                            directory: 'public/gallery',
                            publicPath: '/gallery/',
                        }),
                        alt: fields.text({ label: 'Mô tả ảnh cho SEO' }),
                        order: fields.integer({ label: 'Order', defaultValue: 1 }),
                    }),
                    {
                        label: 'Images',
                        itemLabel: props => `#${props.fields.order.value} - ${props.fields.alt.value || props.fields.image.value?.filename || 'Image'}`,
                    }
                ),
            },
        }),
    },

    singletons: {
        content: singleton({
            label: 'Site Content',
            path: 'src/data/content',
            format: { data: 'json' },
            schema: {
                site: fields.object({
                    title: fields.text({ label: 'Site Title' }),
                    tagline: fields.text({ label: 'Tagline' }),
                    location: fields.text({ label: 'Location' }),
                }),
                hero: fields.object({
                    title: fields.text({ label: 'Title' }),
                    subtitle: fields.text({ label: 'Subtitle' }),
                }),
                gallery: fields.object({
                    badge: fields.text({ label: 'Badge' }),
                    title: fields.text({ label: 'Title' }),
                    description: fields.text({ label: 'Description', multiline: true }),
                }),
                about: fields.object({
                    badge: fields.text({ label: 'Badge' }),
                    title: fields.text({ label: 'Title' }),
                    features: fields.array(
                        fields.object({
                            title: fields.text({ label: 'Title' }),
                            description: fields.text({ label: 'Description' }),
                        }),
                        {
                            label: 'Features',
                            itemLabel: props => props.fields.title.value,
                        }
                    ),
                }),
                contact: fields.object({
                    badge: fields.text({ label: 'Badge' }),
                    title: fields.text({ label: 'Title' }),
                    description: fields.text({ label: 'Description', multiline: true }),
                    socialLinks: fields.array(
                        fields.object({
                            name: fields.text({ label: 'Name' }),
                            url: fields.url({ label: 'URL' }),
                        }),
                        {
                            label: 'Social Links',
                            itemLabel: props => props.fields.name.value,
                        }
                    ),
                }),
                footer: fields.object({
                    brandName: fields.text({ label: 'Brand Name' }),
                    copyright: fields.text({ label: 'Copyright' }),
                }),
            },
        }),
    },
});
