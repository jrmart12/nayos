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

// Updated sauces with heat indicators (emojis only)
const updatedSauces = [
  'Honey Hot 🌶️🌶️',
  'Buffalo 🌶️🌶️',
  'Buffalo Parmesan 🌶️',
  'Inferno BBQ 🌶️🌶️🌶️',
  'Jalapeña 🌶️',
  'Sweet Chili 🌶️',
  'Garlic Parmesan',
  'BBQ',
  'Honey Mustard',
];

async function updateSauceOptions() {
  console.log('Fetching products with sauce options...\n');

  // Find all products that have sauce options
  const products = await client.fetch(`
    *[_type == "product" && defined(options)] {
      _id,
      name,
      options
    }
  `);

  console.log(`Found ${products.length} products with options\n`);

  for (const product of products) {
    let updated = false;
    const updatedOptions = product.options.map((option) => {
      // Check if this is a sauce selection option
      if (
        option.name.includes('salsa') ||
        option.name.includes('Salsa') ||
        (option.choices && option.choices.some((c) => c.label.toLowerCase().includes('bbq') || c.label.toLowerCase().includes('buffalo')))
      ) {
        console.log(`Updating sauces for: ${product.name}`);
        updated = true;
        
        return {
          ...option,
          choices: updatedSauces.map((sauce) => ({ label: sauce, extraPrice: 0 })),
        };
      }
      return option;
    });

    if (updated) {
      try {
        await client.patch(product._id).set({ options: updatedOptions }).commit();
        console.log(`✅ Updated: ${product.name}\n`);
      } catch (error) {
        console.error(`❌ Error updating ${product.name}:`, error.message, '\n');
      }
    }
  }

  console.log('✅ Sauce options update completed!');
}

// Run the update
updateSauceOptions().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
