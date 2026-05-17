import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const artifactSchema = z.object({
  title: z.string(),
  description: z.string(),
  section: z.enum(["manifesto", "essays", "visuals", "labs", "notes"]),
  date: z.coerce.date(),
  status: z.enum(["seed", "draft", "ready"]).default("seed"),
  order: z.number().default(999),
  tags: z.array(z.string()).default([]),
  beautifulPoint: z.string(),
});

const artifactCollection = (section: string) =>
  defineCollection({
    loader: glob({
      base: `./src/content/${section}`,
      pattern: "**/*.{md,mdx}",
    }),
    schema: artifactSchema,
  });

export const collections = {
  manifesto: artifactCollection("manifesto"),
  essays: artifactCollection("essays"),
  visuals: artifactCollection("visuals"),
  labs: artifactCollection("labs"),
  notes: artifactCollection("notes"),
};
