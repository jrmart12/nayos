import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Producto',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre del Producto',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Categoría',
            type: 'string',
            options: {
                list: [
                    { title: 'Hamburguesas', value: 'hamburguesas' },
                    { title: 'Pollo', value: 'pollo' },
                    { title: 'Acompañamientos', value: 'acompanamientos' },
                    { title: 'Bebidas', value: 'bebidas' },
                    { title: 'Combos', value: 'combos' },
                ],
            },
        }),
        defineField({
            name: 'price',
            title: 'Precio',
            type: 'number',
            validation: (Rule) => Rule.required().positive(),
        }),
        defineField({
            name: 'currency',
            title: 'Moneda',
            type: 'string',
            initialValue: 'HNL',
            options: {
                list: [
                    { title: 'Lempira (HNL)', value: 'HNL' },
                    { title: 'Dólar (USD)', value: 'USD' },
                ],
            },
        }),
        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'detailedDescription',
            title: 'Descripción Detallada',
            type: 'array',
            of: [
                {
                    type: 'block',
                },
                {
                    type: 'image',
                },
            ],
            description: 'Descripción completa del producto con formato rico',
        }),
        defineField({
            name: 'image',
            title: 'Imagen del Producto',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'gallery',
            title: 'Galería de Imágenes',
            type: 'array',
            of: [{ type: 'image' }],
            description: 'Imágenes adicionales del producto',
        }),
        defineField({
            name: 'options',
            title: 'Opciones de Personalización',
            type: 'array',
            description: 'Opciones que el cliente puede seleccionar (ej: salsas, toppings, etc.)',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'name',
                            title: 'Nombre de la Opción',
                            type: 'string',
                            description: 'Ej: "Elige tu salsa", "Agrega extras"',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'required',
                            title: '¿Es Obligatorio?',
                            type: 'boolean',
                            initialValue: false,
                            description: 'Si es obligatorio, el cliente debe seleccionar una opción',
                        },
                        {
                            name: 'multiple',
                            title: '¿Permite Múltiples Selecciones?',
                            type: 'boolean',
                            initialValue: false,
                            description: 'Si está activado, el cliente puede seleccionar más de una opción',
                        },
                        {
                            name: 'choices',
                            title: 'Opciones Disponibles',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        {
                                            name: 'label',
                                            title: 'Nombre',
                                            type: 'string',
                                            description: 'Ej: "BBQ", "Buffalo", "Teriyaki"',
                                            validation: (Rule) => Rule.required(),
                                        },
                                        {
                                            name: 'extraPrice',
                                            title: 'Precio Extra',
                                            type: 'number',
                                            initialValue: 0,
                                            description: 'Costo adicional por esta opción (0 si no tiene costo)',
                                        },
                                    ],
                                    preview: {
                                        select: {
                                            label: 'label',
                                            price: 'extraPrice',
                                        },
                                        prepare({ label, price }) {
                                            return {
                                                title: label,
                                                subtitle: price > 0 ? `+L. ${price}` : 'Sin cargo extra',
                                            }
                                        },
                                    },
                                },
                            ],
                            validation: (Rule) => Rule.required().min(1),
                        },
                    ],
                    preview: {
                        select: {
                            name: 'name',
                            required: 'required',
                            multiple: 'multiple',
                        },
                        prepare({ name, required, multiple }) {
                            const badges = []
                            if (required) badges.push('Obligatorio')
                            if (multiple) badges.push('Múltiple')
                            return {
                                title: name,
                                subtitle: badges.length > 0 ? badges.join(' • ') : 'Opcional',
                            }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'allowSpecialInstructions',
            title: 'Permitir Indicaciones Especiales',
            type: 'boolean',
            initialValue: true,
            description: 'Permite que el cliente agregue notas o instrucciones especiales',
        }),
        defineField({
            name: 'isBestSeller',
            title: 'Más Vendido',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'isFeatured',
            title: 'Producto Destacado',
            type: 'boolean',
            initialValue: false,
        }),
    ],
})
