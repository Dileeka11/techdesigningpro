// Projects page – starts with the project images from the gallery; swap in project images by id
// (see content/image-manifest.json). The request bar posts to /contact.php like the contact form.

import { gallery } from "@/content/gallery";

export const projects = {
  title: "Projects",
  images: gallery.images,
  requestInfo: {
    title: "Request Information",
    // Sent as the message body so the e-mail shows where the request came from.
    message: "Request Information – Projects",
  },
};
