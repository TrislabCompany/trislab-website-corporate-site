import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Content is kept per language: src/content/<collection>/<language>/<name>.md.
// The same file name in two languages is the same item translated; its id is
// "<language>/<name>" (src/lib/content.ts splits it). English is the source;
// the other languages are drafts from it, reviewed by a native speaker.

/** The icons the site draws (src/components/Icon.astro). */
const icon = z.enum(["code", "cloud", "shield", "platform", "data", "key", "identity", "radar", "compliance"]);

// One page per service: /<lang>/services/<name>.
const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    icon,
    /** Position in lists, lowest first. */
    order: z.number().int(),
    tags: z.array(z.string()).default([]),
  }),
});

// One page per product: /<lang>/products/<name>. Only launched products, the
// Netwrix pillars and the NIS2 page.
const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    icon,
    order: z.number().int(),
    /** The group the products page lists it under. */
    group: z.enum(["saas", "security", "compliance"]),
    /** Shown only once Trislab confirms it. */
    status: z.enum(["live", "pilot", "planned"]).optional(),
    /** The vendor's product, for example "Netwrix Auditor". */
    vendorProduct: z.string().optional(),
    /** A page with more about the product, as an absolute URL. */
    link: z.string().url().optional(),
    features: z.array(z.string()).default([]),
  }),
});

// The texts of the privacy policy, the accessibility statement and the
// sustainability page: src/content/legal/<language>/privacy.md,
// accessibility.md and sustainability.md. The imprint is built from
// src/site.config.ts. The pages show no date: no law asks for one, and a date
// that is not kept up to date does more harm than good.
const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { services, products, legal };
