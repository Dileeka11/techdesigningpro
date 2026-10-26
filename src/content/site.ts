// Site-wide content. Every visible sentence on the site is copied word for word
// from the original www.techdesigningpro.com pages – edit text here, not in components.

import { asset } from "@/lib/basePath";

export const site = {
  name: "TechDesigningPro",
  url: "https://www.techdesigningpro.com",
  phone: "+971554841633",
  phoneHref: "tel:+971554841633",
  whatsappHref: "https://wa.me/971554841633?text=I+am+interested+in+your+services.",
  email: "info@techdesigningpro.com",
  emailHref: "mailto:info@techdesigningpro.com",
  location: "Dubai, UAE",
  offices: ["Dubai", "Philippines", "India", "Sri Lanka"],
  // The old site linked these icons to "#". Add the real profile URLs to show them.
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
  },
  consultNow: "Consult Now",
  // Endpoint of the PHP mail handler shipped in /public (works on shared hosting).
  contactEndpoint: asset("/contact.php"),
} as const;

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const servicesNav = [
  { label: "Revit", href: "/services/revit/" },
  { label: "AutoCAD", href: "/services/autocad/" },
  { label: "Procurement Management (FF & E)", href: "/services/procurement-management/" },
  { label: "Project Management", href: "/services/project-management/" },
];

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  { label: "Services", href: "/services/", children: servicesNav },
  { label: "Gallery", href: "/gallery/" },
  { label: "Our Clients", href: "/our-clients/" },
  { label: "Projects", href: "/projects/" },
  { label: "Contact Us", href: "/contact-us/" },
];

export const footer = {
  aboutTitle: "About Us",
  aboutText:
    "At our company, we are more than just engineers. We are problem solvers, innovators, and collaborators. With over 20 years of experience in engineering consultancy, we have become experts in our field, with a focus on delivering high-quality designs and solutions for our clients.",
  linksTitle: "Links",
  links: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us/" },
    { label: "Services", href: "/services/" },
    { label: "Gallery", href: "/gallery/" },
    { label: "Our Clients", href: "/our-clients/" },
    { label: "Projects", href: "/projects/" },
    { label: "Contact Us", href: "/contact-us/" },
  ],
  companyTitle: "Company",
  rights: "TechDesigningPro All rights reserved.",
};
