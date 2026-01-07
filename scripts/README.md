# Menu Import Script

Este script permite importar todos los productos del menú a Sanity CMS automáticamente.

## Productos Incluidos

### Categoría: Other
- Pollo a Plancha (L. 220)
- Fish Tacos (L. 210)
- Fish Fingers (L. 200)  
- Costi-Ricas Fritas (L. 170)
- Costi-Ricas BBQ (L. 175)
- Chuleta con Tajadas (L. 175)
- Camarones Empanizados (L. 300)

### Categoría: Boneless
- Boneless con Papas (6, 12, 18, 24 piezas)
- Boneless con Wild Fries (6, 12, 18, 24 piezas)
- Wild Combo 16 Boneless (L. 390)

### Categoría: Wings (Alitas)
- Alitas con Papas (6, 12, 18, 24 piezas)
- Alitas con Wild Fries (6, 12, 18, 24 piezas)

### Categoría: Fries (Papas)
- Wild Fries Personal (L. 90)
- Wild Fries Familiar (L. 160)

### Categoría: Drinks (Bebidas)
- Sodas o Jugos Personales (L. 30)

## Salsas Disponibles
Todas las alitas y boneless incluyen opción de elegir entre:
- Honey Hot
- Buffalo Mild
- Buffalo Parmesan
- Inferno BBQ
- Jalapeña
- Sweet Chili
- Garlic Parmesan
- BBQ
- Honey Mustard

## Requisitos

1. **Token de Sanity**: Necesitas crear un token de API en tu proyecto de Sanity
   - Ve a https://www.sanity.io/manage
   - Selecciona tu proyecto
   - Ve a "API" → "Tokens"
   - Crea un token con permisos de "Editor" o "Admin"

2. **Variables de entorno**: Agrega el token a tu `.env.local`:
   ```
   SANITY_API_TOKEN=tu_token_aquí
   ```

3. **Dependencias**: Instala el cliente de Sanity si no lo tienes:
   ```bash
   npm install @sanity/client
   ```

## Uso

1. Asegúrate de tener tu token de Sanity configurado en `.env.local`

2. Ejecuta el script desde la raíz del proyecto:
   ```bash
   node scripts/import-menu.js
   ```

3. El script creará todos los productos en Sanity automáticamente

## Notas Importantes

- ⚠️ **Imágenes**: El script no sube imágenes. Necesitarás agregar las imágenes manualmente desde Sanity Studio después de ejecutar el script.

- 🔄 **Re-ejecución**: Si ejecutas el script múltiples veces, creará productos duplicados. Para evitar esto, puedes:
  - Borrar los productos existentes antes de volver a ejecutar
  - Modificar el script para verificar si un producto ya existe

- ✏️ **Personalización**: Puedes editar el archivo `scripts/import-menu.js` para:
  - Ajustar precios
  - Añadir/quitar productos
  - Modificar opciones y salsas
  - Cambiar categorías

## Próximos Pasos

Después de ejecutar el script:

1. **Ve a Sanity Studio**: http://localhost:3000/studio
2. **Agrega imágenes** a cada producto
3. **Revisa y ajusta** descripciones si es necesario
4. **Publica** los cambios

## Estructura de Opciones

Los productos con opciones (como Boneless y Alitas) tienen:

- **Cantidad de piezas**: Opciones de 6, 12, 18 o 24 piezas con precios incrementales
- **Salsas**: Selección obligatoria de 1 salsa (o 2 para el Wild Combo)
- **Complementos**: Algunos productos permiten elegir acompañamientos

Todas las opciones están configuradas como `required: true` para asegurar que el cliente haga su selección.
