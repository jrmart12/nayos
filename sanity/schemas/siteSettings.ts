import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Configuración del Sitio',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título del Sitio',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descripción del Sitio',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
        }),
        defineField({
            name: 'cartBackgroundImage',
            title: 'Imagen de Fondo del Carrito',
            type: 'image',
            description: 'Imagen de fondo que se mostrará en el modal del carrito',
        }),
        defineField({
            name: 'navigation',
            title: 'Configuración de Navegación',
            type: 'object',
            description: 'Configuración de los enlaces del menú de navegación',
            fields: [
                defineField({
                    name: 'menuItems',
                    title: 'Enlaces del Menú',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                defineField({
                                    name: 'label',
                                    title: 'Texto del Enlace',
                                    type: 'string',
                                    validation: (Rule) => Rule.required(),
                                }),
                                defineField({
                                    name: 'link',
                                    title: 'URL o Ancla',
                                    type: 'string',
                                    description: 'Ej: "/" para home, "#menu" para ancla, "/about" para página',
                                    validation: (Rule) => Rule.required(),
                                }),
                                defineField({
                                    name: 'highlight',
                                    title: 'Resaltar',
                                    type: 'boolean',
                                    initialValue: false,
                                    description: 'Mostrar con estilo destacado',
                                }),
                            ],
                            preview: {
                                select: {
                                    label: 'label',
                                    link: 'link',
                                    highlight: 'highlight',
                                },
                                prepare({ label, link, highlight }) {
                                    return {
                                        title: label,
                                        subtitle: `${link}${highlight ? ' (Destacado)' : ''}`,
                                    }
                                },
                            },
                        },
                    ],
                    validation: (Rule) => Rule.required().min(1),
                }),
                defineField({
                    name: 'ctaButton',
                    title: 'Botón de Acción Principal',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'text',
                            title: 'Texto del Botón',
                            type: 'string',
                            initialValue: 'RESERVA TU MESA',
                        }),
                        defineField({
                            name: 'link',
                            title: 'Enlace',
                            type: 'string',
                            description: 'URL, número de teléfono (tel:+50412345678) o WhatsApp',
                            initialValue: '#contact',
                        }),
                        defineField({
                            name: 'style',
                            title: 'Estilo del Botón',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Amarillo (Primary)', value: 'primary' },
                                    { title: 'Blanco con Borde (Secondary)', value: 'secondary' },
                                ],
                            },
                            initialValue: 'primary',
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'phone',
            title: 'Número de Teléfono',
            type: 'string',
        }),
        defineField({
            name: 'email',
            title: 'Correo Electrónico',
            type: 'string',
        }),
        defineField({
            name: 'address',
            title: 'Dirección',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'socialMedia',
            title: 'Redes Sociales',
            type: 'object',
            fields: [
                { name: 'facebook', title: 'URL de Facebook', type: 'url' },
                { name: 'instagram', title: 'URL de Instagram', type: 'url' },
                { name: 'twitter', title: 'URL de Twitter', type: 'url' },
                { name: 'youtube', title: 'URL de YouTube', type: 'url' },
            ],
        }),
        defineField({
            name: 'delivery',
            title: 'Servicio de Entrega',
            type: 'object',
            fields: [
                {
                    name: 'enabled',
                    title: 'Habilitar Sección de Entrega',
                    type: 'boolean',
                    initialValue: true,
                },
                {
                    name: 'title',
                    title: 'Título de la Sección de Entrega',
                    type: 'string',
                    initialValue: 'Envíos a Domicilio',
                },
                {
                    name: 'subtitle',
                    title: 'Subtítulo de la Sección de Entrega',
                    type: 'string',
                    initialValue: '¡Recibe tus carnes frescas directamente en tu puerta!',
                },
                {
                    name: 'description',
                    title: 'Descripción de Entrega',
                    type: 'text',
                    rows: 4,
                    initialValue: 'Ofrecemos servicio de entrega a domicilio en La Ceiba y alrededores. Tus productos llegan frescos y en perfectas condiciones, listos para preparar las mejores comidas para ti y tu familia.',
                },
                {
                    name: 'image',
                    title: 'Imagen de Entrega',
                    type: 'image',
                    description: 'Imagen que representa el servicio de delivery',
                },
                {
                    name: 'features',
                    title: 'Características de Entrega',
                    type: 'array',
                    of: [{ type: 'string' }],
                    initialValue: [
                        'Entrega gratuita en pedidos mayores a L. 500',
                        'Horarios flexibles de entrega',
                        'Productos frescos garantizados',
                        'Seguimiento de tu pedido en tiempo real'
                    ],
                },
                {
                    name: 'whatsappMessage',
                    title: 'Plantilla de Mensaje de WhatsApp',
                    type: 'string',
                    initialValue: '¡Hola! Me gustaría ordenar productos de Premium Meats. ¿Me pueden ayudar con el pedido?',
                },
            ],
        }),
        defineField({
            name: 'productsBackgroundImage',
            title: 'Imagen de Fondo - Sección de Productos',
            type: 'image',
            description: 'Fondo para las secciones de productos destacados y más vendidos',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'testimonialsBackgroundImage',
            title: 'Imagen de Fondo - Testimonios',
            type: 'image',
            description: 'Fondo para la sección de testimonios',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'blogBackgroundImage',
            title: 'Imagen de Fondo - Blog',
            type: 'image',
            description: 'Fondo para la sección de blog',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'deliveryBackgroundImage',
            title: 'Imagen de Fondo - Delivery',
            type: 'image',
            description: 'Fondo para la sección de delivery',
            options: {
                hotspot: true,
            },
        }),
    ],
})
