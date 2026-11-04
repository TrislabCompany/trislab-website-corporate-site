// The site's own facts, read at build time: languages, company, contact,
// legal pages, structured data and security.txt. Change the values here; the
// shape is in src/lib/site-settings.ts. Nothing here is secret: it all ends up
// in the public pages. Values that differ per Environment go to /config.json
// instead (src/lib/config.ts).

import type { SiteSettings } from "./lib/site-settings";

/** The site's languages. With one language, the URLs have no language prefix. */
export const languages = ["en", "sl", "hr", "sr", "it"] as const;
export type Lang = (typeof languages)[number];

const site: SiteSettings<Lang> = {
  url: "https://trislab.com",
  name: "Trislab",
  description: {
    en: "Trislab builds custom software and cloud systems and protects them with Netwrix security solutions, as the official Netwrix partner for Slovenia, Croatia, Italy and Serbia.",
    sl: "Trislab razvija programsko opremo in oblačne sisteme po meri ter jih ščiti z varnostnimi rešitvami Netwrix kot uradni partner Netwrix za Slovenijo, Hrvaško, Italijo in Srbijo.",
    hr: "Trislab razvija softver i oblačne sustave po mjeri te ih štiti Netwrix sigurnosnim rješenjima kao službeni Netwrix partner za Sloveniju, Hrvatsku, Italiju i Srbiju.",
    sr: "Trislab razvija softver i cloud sisteme po meri i štiti ih Netwrix bezbednosnim rešenjima kao zvanični Netwrix partner za Sloveniju, Hrvatsku, Italiju i Srbiju.",
    it: "Trislab sviluppa software e sistemi cloud su misura e li protegge con le soluzioni di sicurezza Netwrix, come partner ufficiale Netwrix per Slovenia, Croazia, Italia e Serbia.",
  },
  languages,
  defaultLanguage: "en",

  company: {
    name: "Trislab",
    legalName: "Trislab d.o.o.",
    address: { street: "Ankaranska cesta 7b", postalCode: "6000", city: "Koper", country: "SI" },
    registrationNumber: "8074585000",
    vatId: "SI40832198",
    logo: "/favicon.svg",
    profiles: [],
  },

  contact: {
    topics: [
      {
        email: "info@trislab.com",
        label: { en: "General questions", sl: "Splošna vprašanja", hr: "Opća pitanja", sr: "Opšta pitanja", it: "Domande generali" },
      },
      {
        email: "sales@trislab.com",
        label: { en: "Sales", sl: "Prodaja", hr: "Prodaja", sr: "Prodaja", it: "Vendite" },
      },
      {
        email: "support@trislab.com",
        label: { en: "Support", sl: "Podpora", hr: "Podrška", sr: "Podrška", it: "Supporto" },
      },
      {
        email: "marketing@trislab.com",
        label: { en: "Marketing", sl: "Marketing", hr: "Marketing", sr: "Marketing", it: "Marketing" },
      },
    ],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Ankaranska+cesta+7b+6000+Koper+Slovenija",
  },

  legalPages: { imprint: true, privacy: true, accessibility: true },

  // Customers don't visit the office, so Organization rather than LocalBusiness.
  structuredData: "Organization",

  securityTxt: {
    contact: "mailto:support@trislab.com",
    expires: "2027-10-31T23:00:00.000Z",
  },
};

export default site;
