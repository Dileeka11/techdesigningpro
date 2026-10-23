/** Sub-folder the site is served from ("" at the domain root). Set BASE_PATH at build time, e.g. BASE_PATH=/web/techdesigningpro. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public file path (/images/…, /data/…) with the base path. */
export const asset = (p: string) => `${basePath}${p}`;
