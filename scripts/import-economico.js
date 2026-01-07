const { createClient } = require('@sanity/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ==================== MENÚ ECONÓMICO ====================
// Disponible de Martes a Jueves
// L.100 cada plato

const costillaFritaBBQ = {
  name: 'Costilla Frita o BBQ',
  slug: 'costilla-frita-bbq-economico',
  category: 'economico',
  price: 120,
  currency: 'HNL',
  description: 'Costilla frita o BBQ con tajadas de plátano verde, frijoles y escabeche.',
  image: null,
  options: [
    {
      name: 'Tipo de Costilla',
      required: true,
      multiple: false,
      choices: [
        { label: 'Costilla Frita', extraPrice: 0 },
        { label: 'Costilla BBQ', extraPrice: 0 },
      ],
    },
  ],
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const polloPlancha = {
  name: 'Pollo a la Plancha',
  slug: 'pollo-plancha-economico',
  category: 'economico',
  price: 120,
  currency: 'HNL',
  description: 'Pollo a la plancha con complementos a elegir y tajadas.',
  image: null,
  options: [],
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const chuletaTajadas = {
  name: 'Chuleta con Tajadas',
  slug: 'chuleta-tajadas-economico',
  category: 'economico',
  price: 120,
  currency: 'HNL',
  description: 'Chuleta con tajadas de plátano verde, salsa especial de la casa, frijoles y escabeche.',
  image: null,
  options: [],
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

// All economic menu products
const economicoProducts = [
  costillaFritaBBQ,
  polloPlancha,
  chuletaTajadas,
];

async function importEconomicoMenu() {
  console.log('🍽️ Importing Menú Económico...\n');
  console.log('These products are available Tuesday to Thursday.\n');

  for (const product of economicoProducts) {
    try {
      // Check if product already exists
      const existing = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug: product.slug }
      );

      if (existing) {
        console.log(`⚠️ Product already exists: ${product.name} - Updating...`);
        await client
          .patch(existing._id)
          .set({
            name: product.name,
            category: product.category,
            price: product.price,
            currency: product.currency,
            description: product.description,
            options: product.options,
            allowSpecialInstructions: product.allowSpecialInstructions,
            isBestSeller: product.isBestSeller,
            isFeatured: product.isFeatured,
          })
          .commit();
        console.log(`✅ Updated: ${product.name}\n`);
      } else {
        const doc = {
          _type: 'product',
          name: product.name,
          slug: { _type: 'slug', current: product.slug },
          category: product.category,
          price: product.price,
          currency: product.currency,
          description: product.description,
          options: product.options,
          allowSpecialInstructions: product.allowSpecialInstructions,
          isBestSeller: product.isBestSeller,
          isFeatured: product.isFeatured,
        };

        await client.create(doc);
        console.log(`✅ Created: ${product.name}\n`);
      }
    } catch (error) {
      console.error(`❌ Error with ${product.name}:`, error.message, '\n');
    }
  }

  console.log('🎉 Menú Económico import completed!');
  console.log('\n📝 Remember to add images to these products in Sanity Studio.');
}

// Run the import
importEconomicoMenu().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
