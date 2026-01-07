import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'hero',
    title: 'Sección Hero',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'text',
            rows: 3,
            description: 'Título principal del hero. Usa saltos de línea para múltiples líneas',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtítulo',
            type: 'string',
            description: 'Texto descriptivo debajo del título',
        }),
        defineField({
            name: 'primaryButtonText',
            title: 'Texto del Botón Primario',
            type: 'string',
            description: 'Ej: "Ordena Ahora"',
        }),
        defineField({
            name: 'primaryButtonLink',
            title: 'Enlace del Botón Primario',
            type: 'string',
        }),
        defineField({
            name: 'secondaryButtonText',
            title: 'Texto del Botón Secundario',
            type: 'string',
            description: 'Ej: "Ver Menú" (opcional)',
        }),
        defineField({
            name: 'secondaryButtonLink',
            title: 'Enlace del Botón Secundario',
            type: 'string',
            description: 'URL o ancla para el botón secundario',
        }),
        defineField({
            name: 'heroImage',
            title: 'Imagen del Hero',
            type: 'image',
            description: 'Imagen principal del producto/comida',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'backgroundImage',
            title: 'Imagen de Fondo',
            type: 'image',
            description: 'Imagen de fondo para la sección hero (patrones, texturas, etc.)',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'stat1Value',
            title: 'Estadística 1 - Valor',
            type: 'string',
            description: 'Ej: "100%"',
        }),
        defineField({
            name: 'stat1Label',
            title: 'Estadística 1 - Etiqueta',
            type: 'string',
            description: 'Ej: "Fresh"',
        }),
        defineField({
            name: 'stat2Value',
            title: 'Estadística 2 - Valor',
            type: 'string',
            description: 'Ej: "30min"',
        }),
        defineField({
            name: 'stat2Label',
            title: 'Estadística 2 - Etiqueta',
            type: 'string',
            description: 'Ej: "Delivery"',
        }),
        defineField({
            name: 'stat3Value',
            title: 'Estadística 3 - Valor',
            type: 'string',
            description: 'Ej: "5★"',
        }),
        defineField({
            name: 'stat3Label',
            title: 'Estadística 3 - Etiqueta',
            type: 'string',
            description: 'Ej: "Rating"',
        }),
        defineField({
            name: 'badgeText',
            title: 'Texto del Badge',
            type: 'string',
            description: 'Texto en el badge decorativo. Ej: "$$$"',
        }),
        defineField({
            name: 'badgeSubtext',
            title: 'Subtexto del Badge',
            type: 'string',
            description: 'Texto pequeño en el badge. Ej: "Mejor Precio"',
        }),
    ],
})
