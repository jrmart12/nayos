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

// Menu data extracted from the image
const menuData = [
  {
    name: 'Pollo a Plancha',
    slug: 'pollo-a-plancha',
    category: 'pollo',
    price: 220,
    currency: 'HNL',
    description: 'Pollo a la plancha. Puedes elegir 1 complemento: puré de papas, papas fritas o tajadas de plátano',
    image: null, // You'll need to upload images separately
    options: [
      {
        name: 'Elige tu complemento',
        required: true,
        multiple: false,
        choices: [
          { label: 'Puré de Papas', extraPrice: 0 },
          { label: 'Papas Fritas', extraPrice: 0 },
          { label: 'Tajadas de Plátano', extraPrice: 0 },
        ],
      },
    ],
    allowSpecialInstructions: true,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    name: 'Fish Tacos',
    slug: 'fish-tacos',
    category: 'pescado',
    price: 210,
    currency: 'HNL',
    description: 'Tacos de pescado acompañados de deliciosos aderezos',
    image: null,
    options: [],
    allowSpecialInstructions: true,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    name: 'Fish Fingers',
    slug: 'fish-fingers',
    category: 'pescado',
    price: 200,
    currency: 'HNL',
    description: 'Deditos de pescado acompañados de deliciosos aderezos',
    image: null,
    options: [],
    allowSpecialInstructions: true,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    name: 'Costi-Ricas Fritas',
    slug: 'costi-ricas-fritas',
    category: 'carne-cerdo',
    price: 170,
    currency: 'HNL',
    description: 'Costillas de cerdo con tajadas de plátano maduro o verde, frijoles fritos y escabeche',
    image: null,
    options: [
      {
        name: 'Tipo de plátano',
        required: true,
        multiple: false,
        choices: [
          { label: 'Maduro', extraPrice: 0 },
          { label: 'Verde', extraPrice: 0 },
        ],
      },
    ],
    allowSpecialInstructions: true,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    name: 'Costi-Ricas BBQ',
    slug: 'costi-ricas-bbq',
    category: 'carne-cerdo',
    price: 175,
    currency: 'HNL',
    description: 'Costillas de cerdo BBQ. Elige maduro o verde, frijoles fritos y escabeche',
    image: null,
    options: [
      {
        name: 'Tipo de plátano',
        required: true,
        multiple: false,
        choices: [
          { label: 'Maduro', extraPrice: 0 },
          { label: 'Verde', extraPrice: 0 },
        ],
      },
    ],
    allowSpecialInstructions: true,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    name: 'Chuleta con Tajadas',
    slug: 'chuleta-con-tajadas',
    category: 'carne-cerdo',
    price: 175,
    currency: 'HNL',
    description: 'Chuleta de cerdo con tajadas de plátano, bañada en nuestra salsa de la casa, frijoles fritos y escabeche',
    image: null,
    options: [],
    allowSpecialInstructions: true,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    name: 'Camarones Empanizados',
    slug: 'camarones-empanizados',
    category: 'camarones',
    price: 300,
    currency: 'HNL',
    description: 'Camarones empanizados con escabeche de zanahoria y tajadas de plátano',
    image: null,
    options: [],
    allowSpecialInstructions: true,
    isBestSeller: false,
    isFeatured: true,
  },
];

// Boneless and Wings - with options for sizes and sauces
// Heat levels: 🌶️ = Suave, 🌶️🌶️ = Picante, 🌶️🌶️🌶️ = Muy Picante
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

// Wild Combo
const wildCombo = {
  name: 'Wild Combo 16 Boneless',
  slug: 'wild-combo-16-boneless',
  category: 'boneless',
  price: 390,
  currency: 'HNL',
  description: '16 boneless bañadas en 2 salsas diferentes con wild fries (2-3 salsas incluidas)',
  image: null,
  options: createSauceOptions(2),
  allowSpecialInstructions: true,
  isBestSeller: true,
  isFeatured: true,
};

// Wild Fries
const wildFriesPersonal = {
  name: 'Wild Fries Personal',
  slug: 'wild-fries-personal',
  category: 'papas-fritas',
  price: 90,
  currency: 'HNL',
  description: 'Papas fritas bañadas con queso cheddar y bacon - Porción personal',
  image: null,
  options: [],
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: false,
};

const wildFriesFamiliar = {
  name: 'Wild Fries Familiar',
  slug: 'wild-fries-familiar',
  category: 'papas-fritas',
  price: 160,
  currency: 'HNL',
  description: 'Papas fritas bañadas con queso cheddar y bacon - Porción familiar',
  image: null,
  options: [],
  allowSpecialInstructions: true,
  isBestSeller: false,
  isFeatured: false,
};

// Drinks
const bebidas = {
  name: 'Sodas o Jugos Personales',
  slug: 'sodas-jugos-personales',
  category: 'bebidas',
  price: 30,
  currency: 'HNL',
  description: 'Bebidas personales - sodas o jugos',
  image: null,
  options: [],
  allowSpecialInstructions: false,
  isBestSeller: false,
  isFeatured: false,
};

// Combine all products
const allProducts = [
  ...menuData,
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
  // Combos and Extras
  wildCombo,
  wildFriesPersonal,
  wildFriesFamiliar,
  bebidas,
];

async function uploadProducts() {
  console.log('Starting product upload to Sanity...\n');

  for (const product of allProducts) {
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
      console.log(`✅ Created: ${product.name} (ID: ${result._id})\n`);
    } catch (error) {
      console.error(`❌ Error creating ${product.name}:`, error.message, '\n');
    }
  }

  console.log('✅ Product upload completed!');
}

// Run the upload
uploadProducts().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
