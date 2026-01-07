import { type SchemaTypeDefinition } from 'sanity'
import hero from '../schemas/hero'
import about from '../schemas/about'
import product from '../schemas/product'
import feature from '../schemas/feature'
import testimonial from '../schemas/testimonial'
import blogPost from '../schemas/blogPost'
import siteSettings from '../schemas/siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [hero, about, product, feature, testimonial, blogPost, siteSettings],
}
