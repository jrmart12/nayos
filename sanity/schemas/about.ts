import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'about',
    title: 'Sección Acerca De',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'image',
            title: 'Imagen',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'features',
            title: 'Características',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'feature' }] }],
        }),
        defineField({
            name: 'backgroundImage',
            title: 'Imagen de Fondo',
            type: 'image',
            description: 'Imagen de fondo para la sección about',
            options: {
                hotspot: true,
            },
        }),
    ],
})
