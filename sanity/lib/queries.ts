import { groq } from "next-sanity";

export const productsQuery = groq`*[_type == "product"] {
  _id,
  name,
  description,
  price,
  "image": image.asset->url,
  category,
  isBestSeller,
  isFeatured
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  title,
  description,
  phone,
  email,
  address,
  socialMedia
}`;
