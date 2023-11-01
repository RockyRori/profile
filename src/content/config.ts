import { z, defineCollection } from "astro:content";

const pictureCollection = defineCollection({
    schema: ({ image }) => z.object({
        title: z.string(),
        publishDate: z.date(),
        description: z.string(),
        img: z.string(),
        tags: z.array(z.string())
    }),
});
const techniqueCollection = defineCollection({
    schema: ({ image }) => z.object({
        title: z.string(),
        publishDate: z.date(),
        description: z.string(),
        img: z.string(),
        tags: z.array(z.string())
    }),
});

export const collections = {
    picture: pictureCollection,
    technique: techniqueCollection,
};
