import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'feature',
    title: 'Característica',
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
            rows: 3,
        }),
        defineField({
            name: 'icon',
            title: 'Ícono',
            type: 'image',
            description: 'Ícono pequeño o imagen para esta característica',
        }),
    ],
})
