import { z, defineCollection } from "astro:content";

export const postsCollection = defineCollection({
    schema: () => z.object({
        belonging: z.string(),
        title: z.string(),
        publishDate: z.date(),
        img: z.string(),
        description: z.string(),
        tags: z.array(z.string())
    }),
});

export const collections = {
    posts: postsCollection,
    picture: postsCollection,
    technique: postsCollection,
};
