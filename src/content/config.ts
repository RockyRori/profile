import { z, defineCollection } from "astro:content";

export const postsCollection = defineCollection({
    schema: ({ image }) => z.object({
        title: z.string(),
        publishDate: z.date(),
        description: z.string(),
        img: z.string(),
        tags: z.array(z.string()),
        belonging: z.string()
    }),
});

export const collections = {
    posts: postsCollection,
    picture: postsCollection,
    technique: postsCollection,
};
