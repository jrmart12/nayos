import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export { client, urlFor }

// GROQ queries
export const HERO_QUERY = `*[_type == "hero"][0]{
  _id,
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  heroImage,
  backgroundImage,
  stat1Value,
  stat1Label,
  stat2Value,
  stat2Label,
  stat3Value,
  stat3Label,
  badgeText,
  badgeSubtext
}`

export const ABOUT_QUERY = `*[_type == "about"][0]{
  ...,
  backgroundImage,
  features[]->{
    _id,
    title,
    description,
    icon
  }
}`

export const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc)`

export const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && isFeatured == true] | order(_createdAt desc)[0...6]`

export const BEST_SELLERS_QUERY = `*[_type == "product" && isBestSeller == true] | order(_createdAt desc)[0...8]`

export const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(_createdAt desc)`

export const BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc)[0...3]`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  ...,
  navigation,
  productsBackgroundImage,
  testimonialsBackgroundImage,
  blogBackgroundImage,
  deliveryBackgroundImage
}`

export const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  description,
  detailedDescription,
  price,
  currency,
  image,
  gallery,
  category,
  isBestSeller,
  isFeatured,
  options,
  allowSpecialInstructions
}`

export const RELATED_PRODUCTS_QUERY = `*[_type == "product" && category == $category && _id != $currentId] | order(_createdAt desc)[0...4]`
