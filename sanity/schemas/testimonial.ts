import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'testimonial',
    title: 'Testimonio',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre del Cliente',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Rol/Título',
            type: 'string',
            description: 'Ej: "Cliente Regular", "Dueño de Restaurante"',
        }),
        defineField({
            name: 'content',
            title: 'Contenido del Testimonio',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Foto del Cliente',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'rating',
            title: 'Calificación',
            type: 'number',
            validation: (Rule) => Rule.required().min(1).max(5),
            initialValue: 5,
        }),
    ],
})
