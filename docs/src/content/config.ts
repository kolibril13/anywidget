import { defineCollection, z } from "astro:content";
import { OPEN_GRAPH, SITE } from "../consts";

const collection = defineCollection({
	schema: z.object({
		file: z.string().default("/"),
		title: z.string().default(SITE.title),
		description: z.string().default(SITE.description),
		lang: z.literal('en-us').default(SITE.defaultLanguage),
		dir: z.union([z.literal('ltr'), z.literal('rtl')]).default('ltr'),
		image: z
			.object({
				src: z.string(),
				alt: z.string(),
			})
			.default(OPEN_GRAPH.image),
		ogLocale: z.string().default(SITE.defaultLanguage),
		authors: z.array(z.string()).optional(),
	}),
});

export const collections = {
	docs: collection,
	blog: collection,
};
