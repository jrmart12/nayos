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

// Updated sauces without emojis
const sauceMapping = {
  'Honey Hot 🌶️🌶️ Picante': 'Honey Hot - Picante',
  'Buffalo 🌶️🌶️ Picante': 'Buffalo - Picante',
  'Buffalo Parmesan 🌶️ Suave': 'Buffalo Parmesan - Suave',
  'Inferno BBQ 🌶️🌶️🌶️ Muy Picante': 'Inferno BBQ - Muy Picante',
  'Jalapeña 🌶️ Suave': 'Jalapeña - Suave',
  'Sweet Chili 🌶️ Suave': 'Sweet Chili - Suave',
};

async function updateSauces() {
  console.log('Fetching all products with sauce options...\n');

  // Fetch all products
  const products = await client.fetch(`*[_type == "product"]`);

  console.log(`Found ${products.length} products\n`);

  for (const product of products) {
    if (!product.options || product.options.length === 0) continue;

    let hasChanges = false;
    const updatedOptions = product.options.map(option => {
      if (option.choices && option.choices.length > 0) {
        const updatedChoices = option.choices.map(choice => {
          const oldLabel = choice.label;
          if (sauceMapping[oldLabel]) {
            hasChanges = true;
            console.log(`  Updating: "${oldLabel}" → "${sauceMapping[oldLabel]}"`);
            return { ...choice, label: sauceMapping[oldLabel] };
          }
          return choice;
        });
        return { ...option, choices: updatedChoices };
      }
      return option;
    });

    if (hasChanges) {
      console.log(`Updating product: ${product.name}...`);
      await client
        .patch(product._id)
        .set({ options: updatedOptions })
        .commit();
      console.log(`✅ Updated: ${product.name}\n`);
    }
  }

  console.log('✅ Sauce update completed!');
}

// Run the update
updateSauces().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
