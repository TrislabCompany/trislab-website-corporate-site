// The interface strings and the short page texts in English. Every other
// language file has the same keys (the type UiStrings makes sure of it).
// English is the source: the other languages are drafts from it, reviewed by
// a native speaker.
const en = {
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.products": "Products",
  "nav.partners": "Partners",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.main": "Main",
  "nav.skip": "Skip to content",
  "language.switch": "Language",

  "hero.eyebrow": "Cloud architecture, systems engineering and cybersecurity",
  "hero.heading": "We build reliable systems and defend them against real threats.",
  "hero.subheading":
    "Trislab pairs engineering precision in software development with uncompromising protection of infrastructure, for organisations that mean business.",
  "hero.badge": "Official regional partner of Netwrix",
  "hero.regions": "Slovenia · Croatia · Italy · Serbia",

  "cta.contactSales": "Contact sales",
  "cta.services": "Our services",
  "cta.readMore": "Read more",
  "cta.heading": "Interested?",
  "cta.text": "Write to our sales team and we will get back to you.",

  "services.heading": "Our services",
  "services.lead": "We design and build software and cloud systems, and secure them with Netwrix solutions.",

  "products.heading": "Products",
  "products.lead": "Our own cloud software and advanced cybersecurity for the digital transformation of your business.",
  "products.saas": "Software as a service",
  "products.security": "Cybersecurity solutions",
  "products.securityLead": "Four pillars of protection that cover data, passwords, privileged access and active threats.",
  "products.compliance": "Compliance",
  "products.vendorProduct": "Solution",

  "partners.heading": "Partners",
  "partners.lead": "Trislab is the official regional partner of Netwrix for Slovenia, Croatia, Italy and Serbia.",
  "partners.netwrixRole": "Official regional partner",
  "partners.netwrixText":
    "Netwrix makes cybersecurity, data governance and identity and access management solutions. We deploy them for our customers and support them in daily use.",
  "partners.regions": "Regions",
  "partners.visit": "Visit netwrix.com",

  "about.heading": "About Trislab",
  "about.p1":
    "Trislab d.o.o. was founded as an engineering company that builds robust, secure and highly scalable custom software for demanding public and private clients.",
  "about.p2":
    "While designing advanced systems and modern cloud architecture, we saw a critical gap in the market: organisations lacked visibility into what happens inside their IT infrastructure. They often did not know who accessed which data, and when, which exposed their digital assets to serious risks.",
  "about.p3":
    "That shaped how we grew. Today we bridge top-tier engineering and uncompromising protection. As the official regional partner for Netwrix solutions, we give companies not only advanced software but also full oversight, identity auditing and a high level of cyber resilience.",
  "about.visibility": "Absolute visibility",
  "about.who": "Who",
  "about.when": "When",
  "about.where": "Where",
  "about.what": "What",
  "about.markets": "regional markets",
  "about.serviceTypes": "service types",

  "footer.tagline": "Advanced information systems and cybersecurity for organisations that mean business.",
  "footer.noCookies": "This website uses no cookies.",
  "footer.rights": "All rights reserved.",

  "legal.nav": "Legal",
  "legal.imprint": "Imprint",
  "legal.privacy": "Privacy policy",
  "legal.accessibility": "Accessibility statement",
  "imprint.company": "Company",
  "imprint.address": "Address",
  "imprint.registrationNumber": "Registration number",
  "imprint.vatId": "VAT ID",
  "imprint.contact": "Contact",
  "contact.title": "Contact",
  "contact.lead": "For collaboration or enquiries, write to us directly.",
  "contact.address": "Address",
  "contact.email": "E-mail",
  "contact.phone": "Phone",
  "contact.map": "Open in Google Maps",
  "contact.googleBusiness": "Our Google Business profile",
  "notFound.title": "Page not found",
  "notFound.text": "The page you asked for doesn't exist.",
  "notFound.home": "Go to the home page",
};

export type UiKey = keyof typeof en;
export type UiStrings = Record<UiKey, string>;
export default en satisfies UiStrings;
