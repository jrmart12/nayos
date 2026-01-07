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

// Sauces
const sauces = [
  'Honey Hot 🌶️🌶️ Picante',
  'Buffalo 🌶️🌶️ Picante',
  'Buffalo Parmesan 🌶️ Suave',
  'Inferno BBQ 🌶️🌶️🌶️ Muy Picante',
  'Jalapeña 🌶️ Suave',
  'Sweet Chili 🌶️ Suave',
  'Garlic Parmesan',
  'BBQ',
  'Honey Mustard',
];

// Helper function to create sauce options based on quantity
const createSauceOptions = (numSauces) => {
  const options = [];
  for (let i = 1; i <= numSauces; i++) {
    options.push({
      name: numSauces === 1 ? 'Elige tu salsa' : `Salsa ${i}`,
      required: true,
      multiple: false,
      choices: sauces.map((sauce) => ({ label: sauce, extraPrice: 0 })),
    });
  }
  return options;
};

// ==================== BONELESS CON PAPAS ====================
const boneless6Papas = {
  name: '6 Boneless con Papas',
  slug: '6-boneless-con-papas',
  category: 'boneless',
  price: 200,
  currency: 'HNL',
  description: '6 boneless de pollo bañados en tu salsa favorita con papas fritas (1 salsa incluida)',
  image: null,
  options: createSauceOptions(1),
  allowSpecialInstructions: true,
  isBestSeller: true,
  isFeatured: true,
};

const boneless12Papas = {
  name: '12 Boneless con Papas',
  slug: '12-boneless-con-papas',
  category: 'boneless',
  price: 300,
  currency: 'HNL',
  description: '12 boneless de pollo bañados en tus salsas favoritas con papas fritas (2 salsas incluidas)',
  image: null,
  options: createSauceOptions(2),
  allowSpecialInstructions: true,
  isBestSeller: true,
  isFeatured: true,
};

const boneless18Papas = {
  name: '18 Boneless con Papas',
  slug: '18-boneless-con-papas',
  category: 'boneless',
  price: 400,
  currency: 'HNL',
  description: '18 boneless de pollo bañados en tus salsas favoritas con papas fritas (3 salsas incluidas)',
  image: null,
  options: createSauceOptions(3),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const boneless24Papas = {
  name: '24 Boneless con Papas',
  slug: '24-boneless-con-papas',
  category: 'boneless',
  price: 570,
  currency: 'HNL',
  description: '24 boneless de pollo bañados en tus salsas favoritas con papas fritas (4 salsas incluidas)',
  image: null,
  options: createSauceOptions(4),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

// ==================== ALITAS CON PAPAS ====================
const alitas6Papas = {
  name: '6 Alitas con Papas',
  slug: '6-alitas-con-papas',
  category: 'alitas',
  price: 230,
  currency: 'HNL',
  description: '6 alitas de pollo bañadas en tu salsa favorita con papas fritas (1 salsa incluida)',
  image: null,
  options: createSauceOptions(1),
  allowSpecialInstructions: true,
  isBestSeller: true,
  isFeatured: true,
};

const alitas12Papas = {
  name: '12 Alitas con Papas',
  slug: '12-alitas-con-papas',
  category: 'alitas',
  price: 330,
  currency: 'HNL',
  description: '12 alitas de pollo bañadas en tus salsas favoritas con papas fritas (2 salsas incluidas)',
  image: null,
  options: createSauceOptions(2),
  allowSpecialInstructions: true,
  isBestSeller: true,
  isFeatured: true,
};

const alitas18Papas = {
  name: '18 Alitas con Papas',
  slug: '18-alitas-con-papas',
  category: 'alitas',
  price: 430,
  currency: 'HNL',
  description: '18 alitas de pollo bañadas en tus salsas favoritas con papas fritas (3 salsas incluidas)',
  image: null,
  options: createSauceOptions(3),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const alitas24Papas = {
  name: '24 Alitas con Papas',
  slug: '24-alitas-con-papas',
  category: 'alitas',
  price: 640,
  currency: 'HNL',
  description: '24 alitas de pollo bañadas en tus salsas favoritas con papas fritas (4 salsas incluidas)',
  image: null,
  options: createSauceOptions(4),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

// ==================== BONELESS CON WILD FRIES ====================
const boneless6WildFries = {
  name: '6 Boneless con Wild Fries',
  slug: '6-boneless-con-wild-fries',
  category: 'boneless',
  price: 230,
  currency: 'HNL',
  description: '6 boneless de pollo bañados en tu salsa favorita con wild fries (1 salsa incluida)',
  image: null,
  options: createSauceOptions(1),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const boneless12WildFries = {
  name: '12 Boneless con Wild Fries',
  slug: '12-boneless-con-wild-fries',
  category: 'boneless',
  price: 350,
  currency: 'HNL',
  description: '12 boneless de pollo bañados en tus salsas favoritas con wild fries (2 salsas incluidas)',
  image: null,
  options: createSauceOptions(2),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const boneless18WildFries = {
  name: '18 Boneless con Wild Fries',
  slug: '18-boneless-con-wild-fries',
  category: 'boneless',
  price: 510,
  currency: 'HNL',
  description: '18 boneless de pollo bañados en tus salsas favoritas con wild fries (3 salsas incluidas)',
  image: null,
  options: createSauceOptions(3),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const boneless24WildFries = {
  name: '24 Boneless con Wild Fries',
  slug: '24-boneless-con-wild-fries',
  category: 'boneless',
  price: 620,
  currency: 'HNL',
  description: '24 boneless de pollo bañados en tus salsas favoritas con wild fries (4 salsas incluidas)',
  image: null,
  options: createSauceOptions(4),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

// ==================== ALITAS CON WILD FRIES ====================
const alitas6WildFries = {
  name: '6 Alitas con Wild Fries',
  slug: '6-alitas-con-wild-fries',
  category: 'alitas',
  price: 260,
  currency: 'HNL',
  description: '6 alitas de pollo bañadas en tu salsa favorita con wild fries (1 salsa incluida)',
  image: null,
  options: createSauceOptions(1),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const alitas12WildFries = {
  name: '12 Alitas con Wild Fries',
  slug: '12-alitas-con-wild-fries',
  category: 'alitas',
  price: 380,
  currency: 'HNL',
  description: '12 alitas de pollo bañadas en tus salsas favoritas con wild fries (2 salsas incluidas)',
  image: null,
  options: createSauceOptions(2),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const alitas18WildFries = {
  name: '18 Alitas con Wild Fries',
  slug: '18-alitas-con-wild-fries',
  category: 'alitas',
  price: 540,
  currency: 'HNL',
  description: '18 alitas de pollo bañadas en tus salsas favoritas con wild fries (3 salsas incluidas)',
  image: null,
  options: createSauceOptions(3),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

const alitas24WildFries = {
  name: '24 Alitas con Wild Fries',
  slug: '24-alitas-con-wild-fries',
  category: 'alitas',
  price: 650,
  currency: 'HNL',
  description: '24 alitas de pollo bañadas en tus salsas favoritas con wild fries (4 salsas incluidas)',
  image: null,
  options: createSauceOptions(4),
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: true,
};

// All wings and boneless products
const wingsAndBonelessProducts = [
  // Boneless con Papas
  boneless6Papas,
  boneless12Papas,
  boneless18Papas,
  boneless24Papas,
  // Alitas con Papas
  alitas6Papas,
  alitas12Papas,
  alitas18Papas,
  alitas24Papas,
  // Boneless con Wild Fries
  boneless6WildFries,
  boneless12WildFries,
  boneless18WildFries,
  boneless24WildFries,
  // Alitas con Wild Fries
  alitas6WildFries,
  alitas12WildFries,
  alitas18WildFries,
  alitas24WildFries,
];

async function uploadProducts() {
  console.log('Starting wings and boneless upload to Sanity...\\n');

  for (const product of wingsAndBonelessProducts) {
    try {
      console.log(`Creating product: ${product.name}...`);

      const doc = {
        _type: 'product',
        name: product.name,
        slug: {
          _type: 'slug',
          current: product.slug,
        },
        category: product.category,
        price: product.price,
        currency: product.currency,
        description: product.description,
        options: product.options,
        allowSpecialInstructions: product.allowSpecialInstructions,
        isBestSeller: product.isBestSeller,
        isFeatured: product.isFeatured,
      };

      const result = await client.create(doc);
      console.log(`✅ Created: ${product.name} (ID: ${result._id})\\n`);
    } catch (error) {
      console.error(`❌ Error creating ${product.name}:`, error.message, '\\n');
    }
  }

  console.log('✅ Wings and Boneless upload completed!');
}

// Run the upload
uploadProducts().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
