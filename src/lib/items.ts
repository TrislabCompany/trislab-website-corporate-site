// Services and products: sorted lists per language, and the static paths of
// their detail pages.
import { getCollection, type CollectionEntry } from "astro:content";
import { prefixed, type Lang } from "../i18n";
import { entryLang, entryLanguages, entrySlug, getEntries } from "./content";

type ItemCollection = "services" | "products";

export async function sortedItems<C extends ItemCollection>(collection: C, lang: Lang) {
  const entries = (await getEntries(collection, lang)) as CollectionEntry<C>[];
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** getStaticPaths for /<lang>/<collection>/<name>: one page per item and language. */
export async function itemPaths(collection: ItemCollection) {
  const entries = await getCollection(collection);
  return Promise.all(
    entries.map(async (entry) => {
      const lang = entryLang(entry);
      const id = entrySlug(entry);
      return {
        params: { lang: prefixed ? lang : undefined, id },
        props: { entry, lang, available: await entryLanguages(collection, id) },
      };
    }),
  );
}
