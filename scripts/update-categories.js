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

// Category mapping from old to new
const categoryMap = {
  'other': {
    'Pollo a Plancha': 'pollo',
    'Fish Tacos': 'pescado',
    'Fish Fingers': 'pescado',
    'Costi-Ricas Fritas': 'carne-cerdo',
    'Costi-Ricas BBQ': 'carne-cerdo',
    'Chuleta con Tajadas': 'carne-cerdo',
    'Camarones Empanizados': 'camarones',
  },
  'wings': 'alitas',
  'fries': 'papas-fritas',
  'drinks': 'bebidas',
};

async function updateCategories() {
  console.log('Fetching all products...\n');

  const products = await client.fetch(`
    *[_type == "product"] {
      _id,
      name,
      category
    }
  `);

  console.log(`Found ${products.length} products\n`);

  for (const product of products) {
    let newCategory = product.category;

    // Handle 'other' category products - map based on name
    if (product.category === 'other' && categoryMap.other[product.name]) {
      newCategory = categoryMap.other[product.name];
    }
    // Handle simple mapping for other categories
    else if (categoryMap[product.category]) {
      newCategory = categoryMap[product.category];
    }

    if (newCategory !== product.category) {
      try {
        await client.patch(product._id).set({ category: newCategory }).commit();
        console.log(`✅ Updated: ${product.name} (${product.category} → ${newCategory})`);
      } catch (error) {
        console.error(`❌ Error updating ${product.name}:`, error.message);
      }
    } else {
      console.log(`⏭️  Skipped: ${product.name} (already ${newCategory})`);
    }
  }

  console.log('\n✅ Category update completed!');
}

// Run the update
updateCategories().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
