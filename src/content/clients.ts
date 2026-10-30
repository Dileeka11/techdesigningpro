// Our Clients page. Add each client as { name, logo } – `logo` is a path under /public,
// e.g. "/images/clients/emaar.png". The client's own wording goes in `intro` (leave "" to hide).

export type Client = { name: string; logo: string };

export const clients = {
  title: "Our Clients",
  intro: "",
  items: [
    { name: "OBMI", logo: "/images/clients/obmi.png" },
    { name: "Aedas Architects", logo: "/images/clients/aedas.png" },
    { name: "Dynamic Design Consultants", logo: "/images/clients/dynamic.png" },
    { name: "Kieferle + Partner", logo: "/images/clients/kieferle.png" },
    { name: "Wells", logo: "/images/clients/wells.png" },
    { name: "IDA International Design Associates", logo: "/images/clients/ida.png" },
    { name: "depa", logo: "/images/clients/depa.png" },
    { name: "ALEC Fitout", logo: "/images/clients/alec.png" },
    { name: "Royse", logo: "/images/clients/royse.png" },
    { name: "DCI", logo: "/images/clients/dci.png" },
    { name: "Sonuvo Design by Soul", logo: "/images/clients/sonuvo.png" },
    { name: "LMD Studio Design Consultants", logo: "/images/clients/lmd.png" },
  ] as Client[],
};
