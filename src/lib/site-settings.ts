// The shape of src/site.config.ts. A site changes the values there, never
// this file. L is the union of the site's language codes, so every text that
// differs per language must be given in all of them.

import type { ImageMetadata } from "astro";

export type Localized<L extends string> = Record<L, string>;

export interface PostalAddress {
  street: string;
  postalCode: string;
  city: string;
  /** ISO 3166-1 alpha-2 code, for example "SI". */
  country: string;
}

export interface SiteSettings<L extends string> {
  /** The main address of the site in production, with no trailing slash. */
  url: string;
  /** The site's name in the header and in the page titles. */
  name: string;
  /** The default description of a page, per language. */
  description: Localized<L>;
  /** The languages, in the order the language switch shows them. */
  languages: readonly L[];
  /** The language "/" leads to, and the target of hreflang x-default. */
  defaultLanguage: L;
  /**
   * The picture shown when a page is shared on social networks or in a chat:
   * an imported photo (import photo from "./assets/photo.jpg"), cropped to
   * 1200 × 630 at build, with what it shows in every language. A page or an
   * item may give its own. Without one, a shared link shows no picture.
   */
  shareImage?: { src: ImageMetadata; alt: Localized<L> };
  /** The colour of the browser's address bar on a phone: the site's background or brand colour, as "#rrggbb". */
  themeColor: string;

  company: {
    /** The name people know, for example "Trislab". */
    name: string;
    /** The registered name, for example "Trislab d.o.o.". */
    legalName: string;
    address: PostalAddress;
    registrationNumber?: string;
    vatId?: string;
    /** Any other line the law asks for in the imprint (court register, share capital…), per language. */
    imprintNotes?: Localized<L>[];
    /** A path under public/, or an absolute URL. */
    logo: string;
    /** Profiles of the company elsewhere (LinkedIn, GitHub…), as absolute URLs. */
    profiles: string[];
  };

  contact: {
    /** E-mail by topic. Role mailboxes only, never a person's address. */
    topics: { email: string; label: Localized<L> }[];
    phone?: string;
    /** A plain link to a map. Nothing is embedded: an embedded map loads an outside service. */
    mapUrl?: string;
    googleBusinessUrl?: string;
  };

  /** Which legal pages the site has. The texts are in src/content/legal/<language>/. */
  legalPages: {
    imprint: boolean;
    privacy: boolean;
    /** Only where the law requires one, or the client wants it. */
    accessibility: boolean;
    /** The website's carbon footprint and the company's environmental measures (ESG). */
    sustainability: boolean;
  };

  /** The JSON-LD on every page: Organization, or LocalBusiness when customers visit the address. */
  structuredData: "Organization" | "LocalBusiness" | "none";

  /**
   * Cookieless visit counts with Plausible Analytics, off when left out
   * (docs/analytics.md). Counts only on the production domain. When set, add
   * the endpoint's origin to connect-src in public/_headers and say so in the
   * privacy policy of every language: pnpm test checks both.
   */
  analytics?: {
    provider: "plausible";
    /** The site's name in Plausible; by default the host of `url` without "www.". */
    domain?: string;
    /** Where events go; by default https://plausible.io/api/event. */
    endpoint?: string;
  };

  /** /.well-known/security.txt (RFC 9116). */
  securityTxt: {
    /** A role mailbox or a URL, for example "mailto:security@example.com". */
    contact: string;
    /** ISO date-time; at most a year ahead. ci warns 30 days before and fails after it. */
    expires: string;
  };
}
