/**
 * Centralized AgriStore Local Product Image Mapping System
 * Serves images locally from inside the project (/images/products/...)
 * Eliminates all external runtime network image requests.
 */

// 1. Exact Product Name Mapping
export const exactProductImageMap = {
  // Organic
  'Vermicompost Organic Fertilizer': '/images/products/organic/vermicompost-organic.svg',
  'Vermicompost Premium (10 kg)': '/images/products/organic/vermicompost-organic.svg',
  'Neem Gold Organic Fertilizer': '/images/products/organic/vermicompost-organic.svg',
  'Bone Meal Organic NPK': '/images/products/organic/vermicompost-organic.svg',
  'Compost Plus Organic 187': '/images/products/organic/vermicompost-organic.svg',
  'Soil Boost Organic 031': '/images/products/organic/vermicompost-organic.svg',

  // Liquid / Fertilizers
  'Seaweed Extract Liquid Fertilizer': '/images/products/fertilizers/seaweed-liquid.svg',
  'Urea N46 (Granular)': '/images/products/fertilizers/fertilizer-fallback.svg',
  'DAP Diammonium Phosphate': '/images/products/fertilizers/fertilizer-fallback.svg',
  'NPK 19-19-19 Water Soluble': '/images/products/fertilizers/fertilizer-fallback.svg',

  // Bio-Fertilizer
  'Rhizobium Bio-Fertilizer': '/images/products/organic/vermicompost-organic.svg',
  'Mycorrhiza Root Booster': '/images/products/organic/vermicompost-organic.svg',
  'Azotobacter Bio-Nitrogen Fixer': '/images/products/organic/vermicompost-organic.svg',

  // Seeds
  'Hybrid Tomato Seeds (F1)': '/images/products/seeds/seed-fallback.svg',
  'BT Cotton Hybrid Seeds': '/images/products/seeds/seed-fallback.svg',
  'Paddy IR-64 Certified Seeds': '/images/products/seeds/seed-fallback.svg',

  // Pesticides & Crop Protection
  'Chlorpyrifos 20% EC': '/images/products/pesticide/pesticide-fallback.svg',
  'Mancozeb 75% WP Fungicide': '/images/products/pesticide/pesticide-fallback.svg',
  'Imidacloprid 17.8% SL Insecticide': '/images/products/pesticide/pesticide-fallback.svg',

  // Equipment & Tools
  'Knapsack Sprayer 16L Battery': '/images/products/equipment/sprayer-kit.svg',
  'Sprayer Kit Equipment 096': '/images/products/equipment/sprayer-kit.svg',
  'Farm Utility Pack Equipment 048': '/images/products/equipment/farm-utility-pack.svg',
  'Precision Applicator Equipment 024': '/images/products/equipment/precision-applicator.svg',
  'Precision Applicator Equipment 084': '/images/products/equipment/precision-applicator.svg',
  'Heavy Duty Wheelbarrow Equipment 012': '/images/products/equipment/wheelbarrow.svg',
  'Garden Tool Kit Equipment 018': '/images/products/equipment/farm-utility-pack.svg',
  'Digital Soil pH & Moisture Meter': '/images/products/equipment/soil-ph-meter.svg',
  'Hand Cultivator Set (5-Piece)': '/images/products/equipment/farm-utility-pack.svg',
  'Water Pump Equipment 051': '/images/products/equipment/sprayer-kit.svg',
  'Drip Irrigation Kit Equipment 067': '/images/products/equipment/sprayer-kit.svg'
};

// 2. Category Fallback Mapping
export const categoryImageFallbackMap = {
  Seeds: '/images/products/seeds/seed-fallback.svg',
  Organic: '/images/products/organic/vermicompost-organic.svg',
  Fertilizer: '/images/products/fertilizers/fertilizer-fallback.svg',
  Pesticide: '/images/products/pesticide/pesticide-fallback.svg',
  'Bio-Fertilizer': '/images/products/organic/vermicompost-organic.svg',
  Equipment: '/images/products/equipment/sprayer-kit.svg',
  Chemical: '/images/products/pesticide/pesticide-fallback.svg',
  Irrigation: '/images/products/equipment/sprayer-kit.svg',
  Tools: '/images/products/equipment/farm-utility-pack.svg'
};

/**
 * Get local product image URL for any product object or name string.
 * Ensures 0 external network requests during runtime.
 */
export const getLocalProductImage = (product = {}) => {
  const name = typeof product === 'string' ? product : product?.name || '';
  const category = typeof product === 'object' ? product?.category || product?.type || '' : '';

  // 1. Direct exact match in local product map
  if (name && exactProductImageMap[name]) {
    return exactProductImageMap[name];
  }

  // 2. Name Keyword Match
  const lower = name.toLowerCase();
  if (lower.includes('seaweed') || lower.includes('liquid') || lower.includes('tonic')) {
    return '/images/products/fertilizers/seaweed-liquid.svg';
  }
  if (lower.includes('vermicompost') || lower.includes('neem') || lower.includes('compost') || lower.includes('soil boost')) {
    return '/images/products/organic/vermicompost-organic.svg';
  }
  if (lower.includes('sprayer') || lower.includes('knapsack')) {
    return '/images/products/equipment/sprayer-kit.svg';
  }
  if (lower.includes('applicator') || lower.includes('spreader')) {
    return '/images/products/equipment/precision-applicator.svg';
  }
  if (lower.includes('wheelbarrow')) {
    return '/images/products/equipment/wheelbarrow.svg';
  }
  if (lower.includes('ph') || lower.includes('meter')) {
    return '/images/products/equipment/soil-ph-meter.svg';
  }
  if (lower.includes('utility') || lower.includes('tool')) {
    return '/images/products/equipment/farm-utility-pack.svg';
  }
  if (lower.includes('seed') || lower.includes('paddy') || lower.includes('hybrid') || lower.includes('cotton') || lower.includes('tomato')) {
    return '/images/products/seeds/seed-fallback.svg';
  }
  if (lower.includes('pesticide') || lower.includes('insecticide') || lower.includes('fungicide') || strokeMatch(lower, ['chlorpyrifos', 'mancozeb', 'imidacloprid'])) {
    return '/images/products/pesticide/pesticide-fallback.svg';
  }

  // 3. Category Fallback Match
  if (category && categoryImageFallbackMap[category]) {
    return categoryImageFallbackMap[category];
  }

  // 4. Default Fallback
  return '/images/products/organic/vermicompost-organic.svg';
};

const strokeMatch = (str, keywords) => keywords.some((kw) => str.includes(kw));
