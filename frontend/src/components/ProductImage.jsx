import { useState, useEffect } from 'react';
import { toSafeImageUrl } from '../utils/imageUrl';

/**
 * Realistic Agriculture Product Package Fallbacks (SVG)
 * Rendered on clean #F8FAF8 / light neutral background with object-contain styling.
 * Differentiates across Organic, Chemical, Bio-Fertilizers, Liquids, Seeds, Pesticides, Fungicides, Equipment, Irrigation, etc.
 */

// 1. Organic Compost & Vermicompost Sack
const OrganicFertilizerBag = ({ name }) => (
  <svg className="w-full h-full max-h-[160px] drop-shadow-md select-none" viewBox="0 0 200 240" fill="none">
    <ellipse cx="100" cy="225" rx="68" ry="9" fill="#000000" fillOpacity="0.08" />
    <path
      d="M35 50 C35 45 40 40 50 40 L150 40 C160 40 165 45 165 50 L175 200 C177 215 165 220 150 220 L50 220 C35 220 23 215 25 200 Z"
      fill="url(#organicBagGrad)"
      stroke="#CBD5E1"
      strokeWidth="2"
    />
    <rect x="30" y="32" width="140" height="14" rx="3" fill="#15803D" stroke="#166534" strokeWidth="1.5" />
    <path d="M35 39 H165" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 3" />
    <path d="M35 50 L45 210" stroke="#E2E8F0" strokeWidth="2" />
    <path d="M165 50 L155 210" stroke="#E2E8F0" strokeWidth="2" />
    
    <rect x="42" y="75" width="116" height="95" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
    <rect x="42" y="75" width="116" height="28" rx="8" fill="#0F382C" />
    <text x="100" y="94" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" letterSpacing="1">
      BIO ORGANIC
    </text>

    <circle cx="100" cy="125" r="16" fill="#DCFCE7" />
    <path d="M100 133 V118 M100 124 C94 120 90 125 90 125 M100 121 C106 117 110 122 110 122" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

    <text x="100" y="153" textAnchor="middle" fill="#1E293B" fontSize="9" fontWeight="800">
      {name?.slice(0, 18) || 'ORGANIC COMPOST'}
    </text>
    <text x="100" y="163" textAnchor="middle" fill="#16A34A" fontSize="7" fontWeight="700">
      100% NATURAL SOIL ENRICHER
    </text>

    <rect x="65" y="185" width="70" height="18" rx="4" fill="#15803D" />
    <text x="100" y="197" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="800">
      ORGANIC CERTIFIED
    </text>

    <defs>
      <linearGradient id="organicBagGrad" x1="30" y1="40" x2="170" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F8FAFC" />
        <stop offset="0.6" stopColor="#F1F5F9" />
        <stop offset="1" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
  </svg>
);

// 2. Chemical Fertilizer Sack (Urea, DAP, NPK)
const ChemicalFertilizerBag = ({ name }) => (
  <svg className="w-full h-full max-h-[160px] drop-shadow-md select-none" viewBox="0 0 200 240" fill="none">
    <ellipse cx="100" cy="225" rx="68" ry="9" fill="#000000" fillOpacity="0.08" />
    <path
      d="M35 50 C35 45 40 40 50 40 L150 40 C160 40 165 45 165 50 L175 200 C177 215 165 220 150 220 L50 220 C35 220 23 215 25 200 Z"
      fill="url(#chemBagGrad)"
      stroke="#94A3B8"
      strokeWidth="2"
    />
    <rect x="30" y="32" width="140" height="14" rx="3" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="1.5" />
    <path d="M35 39 H165" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 3" />
    
    <rect x="42" y="75" width="116" height="95" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
    <rect x="42" y="75" width="116" height="28" rx="8" fill="#1E3A8A" />
    <text x="100" y="94" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" letterSpacing="1">
      AGRO CHEMICAL
    </text>

    {/* Chemical emblem */}
    <circle cx="100" cy="125" r="16" fill="#DBEAFE" />
    <path d="M93 125 H107 M100 118 V132" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />

    <text x="100" y="153" textAnchor="middle" fill="#1E293B" fontSize="9" fontWeight="800">
      {name?.slice(0, 18) || 'NPK FERTILIZER'}
    </text>
    <text x="100" y="163" textAnchor="middle" fill="#2563EB" fontSize="7" fontWeight="700">
      HIGH YIELD FORMULA
    </text>

    <rect x="65" y="185" width="70" height="18" rx="4" fill="#1E40AF" />
    <text x="100" y="197" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="800">
      50 KG NET
    </text>

    <defs>
      <linearGradient id="chemBagGrad" x1="30" y1="40" x2="170" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EFF6FF" />
        <stop offset="0.6" stopColor="#DBEAFE" />
        <stop offset="1" stopColor="#BFDBFE" />
      </linearGradient>
    </defs>
  </svg>
);

// 3. Liquid Fertilizer / Seaweed Extract Bottle
const LiquidBottleVisual = ({ name }) => (
  <svg className="w-full h-full max-h-[160px] drop-shadow-md select-none" viewBox="0 0 200 240" fill="none">
    <ellipse cx="100" cy="222" rx="45" ry="8" fill="#000000" fillOpacity="0.08" />
    <rect x="86" y="20" width="28" height="16" rx="3" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" />
    <path d="M86 26 H114" stroke="#FFFFFF" strokeWidth="1.5" />
    <rect x="89" y="36" width="22" height="20" fill="#E2E8F0" stroke="#CBD5E1" />

    <path
      d="M89 56 C70 62 60 75 60 90 L60 205 C60 215 70 220 100 220 C130 220 140 215 140 205 L140 90 C140 75 130 62 111 56 Z"
      fill="url(#bottleGrad)"
      stroke="#CBD5E1"
      strokeWidth="2"
    />

    <path d="M140 95 C158 95 160 140 140 145" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M140 95 C158 95 160 140 140 145" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" fill="none" />

    <rect x="66" y="95" width="68" height="100" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
    <rect x="66" y="95" width="68" height="24" rx="6" fill="#0284C7" />
    <text x="100" y="111" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800">
      LIQUID FORMULA
    </text>

    <path d="M100 130 C100 130 90 145 90 152 C90 158 94 162 100 162 C106 162 110 158 110 152 C110 145 100 130 100 130 Z" fill="#0EA5E9" />

    <text x="100" y="177" textAnchor="middle" fill="#1E293B" fontSize="8" fontWeight="700">
      {name?.slice(0, 16) || 'LIQUID AGRI'}
    </text>
    <text x="100" y="187" textAnchor="middle" fill="#0284C7" fontSize="7" fontWeight="600">
      1 LITER CONCENTRATE
    </text>

    <defs>
      <linearGradient id="bottleGrad" x1="60" y1="56" x2="140" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="0.6" stopColor="#F1F5F9" />
        <stop offset="1" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
  </svg>
);

// 4. Bio-Fertilizer Culture Jar/Packet (Rhizobium, Azotobacter, Mycorrhiza)
const BioFertilizerVisual = ({ name }) => (
  <svg className="w-full h-full max-h-[160px] drop-shadow-md select-none" viewBox="0 0 200 240" fill="none">
    <ellipse cx="100" cy="222" rx="48" ry="8" fill="#000000" fillOpacity="0.08" />
    <rect x="75" y="25" width="50" height="20" rx="4" fill="#047857" stroke="#065F46" strokeWidth="1.5" />
    <rect x="60" y="45" width="80" height="170" rx="14" fill="url(#bioGrad)" stroke="#A7F3D0" strokeWidth="2" />
    
    <rect x="68" y="75" width="64" height="110" rx="8" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
    <rect x="68" y="75" width="64" height="25" rx="8" fill="#059669" />
    <text x="100" y="91" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900">
      BIO CULTURE
    </text>

    <circle cx="100" cy="125" r="15" fill="#D1FAE5" />
    <path d="M96 121 C96 121 100 117 104 121 C108 125 104 129 100 129 C96 129 92 125 96 121 Z" fill="#10B981" />

    <text x="100" y="157" textAnchor="middle" fill="#065F46" fontSize="8" fontWeight="800">
      {name?.slice(0, 15) || 'BIO FERTILIZER'}
    </text>
    <text x="100" y="168" textAnchor="middle" fill="#047857" fontSize="7" fontWeight="600">
      LIVE INOCULANT
    </text>

    <defs>
      <linearGradient id="bioGrad" x1="60" y1="45" x2="140" y2="215" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ECFDF5" />
        <stop offset="0.7" stopColor="#D1FAE5" />
        <stop offset="1" stopColor="#A7F3D0" />
      </linearGradient>
    </defs>
  </svg>
);

// 5. Seed Packet Pouch (Hybrid Seeds, Paddy, Tomato, Vegetables)
const SeedPacketVisual = ({ name }) => (
  <svg className="w-full h-full max-h-[160px] drop-shadow-md select-none" viewBox="0 0 200 240" fill="none">
    <ellipse cx="100" cy="220" rx="55" ry="8" fill="#000000" fillOpacity="0.08" />
    <rect x="45" y="35" width="110" height="180" rx="10" fill="url(#seedGrad)" stroke="#FDBA74" strokeWidth="2" />
    <path d="M45 55 H155 M45 195 H155" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="3 3" />

    <rect x="52" y="60" width="96" height="34" rx="6" fill="#EA580C" />
    <text x="100" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" letterSpacing="1">
      HYBRID SEEDS
    </text>
    <text x="100" y="88" textAnchor="middle" fill="#FFEDD5" fontSize="7" fontWeight="700">
      HIGH GERMINATION 98%
    </text>

    <circle cx="100" cy="130" r="22" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    <path d="M100 142 C100 130 92 122 92 122 C92 122 100 124 100 135 C100 124 108 122 108 122 C108 122 100 130 100 142 Z" fill="#D97706" />

    <text x="100" y="167" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="800">
      {name?.slice(0, 16) || 'CERTIFIED SEEDS'}
    </text>
    <text x="100" y="178" textAnchor="middle" fill="#9A3412" fontSize="7" fontWeight="600">
      TREATED & LAB TESTED
    </text>

    <defs>
      <linearGradient id="seedGrad" x1="45" y1="35" x2="155" y2="215" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF7ED" />
        <stop offset="0.7" stopColor="#FFEDD5" />
        <stop offset="1" stopColor="#FED7AA" />
      </linearGradient>
    </defs>
  </svg>
);

// 6. Crop Protection & Pesticide Spray Bottle
const CropProtectionVisual = ({ name }) => (
  <svg className="w-full h-full max-h-[160px] drop-shadow-md select-none" viewBox="0 0 200 240" fill="none">
    <ellipse cx="100" cy="220" rx="50" ry="8" fill="#000000" fillOpacity="0.08" />
    <rect x="84" y="25" width="32" height="18" rx="4" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />

    <path
      d="M86 43 L86 65 C70 72 62 85 62 105 L62 205 C62 215 72 220 100 220 C128 220 138 215 138 205 L138 105 C138 85 130 72 114 65 L114 43 Z"
      fill="url(#pestGrad)"
      stroke="#CBD5E1"
      strokeWidth="2"
    />

    <rect x="68" y="100" width="64" height="95" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
    <rect x="68" y="100" width="64" height="24" rx="6" fill="#BE123C" />
    <text x="100" y="116" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900">
      CROP PROTECT
    </text>

    <path d="M100 132 L110 136 V146 C110 152 100 157 100 157 C100 157 90 152 90 146 V136 Z" fill="#FFE4E6" stroke="#E11D48" strokeWidth="1.5" />

    <text x="100" y="172" textAnchor="middle" fill="#1E293B" fontSize="8" fontWeight="800">
      {name?.slice(0, 16) || 'INSECTICIDE'}
    </text>
    <text x="100" y="182" textAnchor="middle" fill="#9F1239" fontSize="7" fontWeight="700">
      FAST ACTING FORMULA
    </text>

    <defs>
      <linearGradient id="pestGrad" x1="62" y1="43" x2="138" y2="220" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#F1F5F9" />
      </linearGradient>
    </defs>
  </svg>
);

// 7. Fungicide & Chemical Jar Visual
const FungicideVisual = ({ name }) => (
  <svg className="w-full h-full max-h-[160px] drop-shadow-md select-none" viewBox="0 0 200 240" fill="none">
    <ellipse cx="100" cy="220" rx="52" ry="8" fill="#000000" fillOpacity="0.08" />
    <rect x="70" y="30" width="60" height="22" rx="4" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
    <rect x="58" y="52" width="84" height="155" rx="10" fill="url(#fungiGrad)" stroke="#CBD5E1" strokeWidth="2" />

    <rect x="66" y="85" width="68" height="95" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    <rect x="66" y="85" width="68" height="24" rx="6" fill="#D97706" />
    <text x="100" y="101" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900">
      FUNGICIDE
    </text>

    <circle cx="100" cy="132" r="14" fill="#FEF3C7" />
    <path d="M94 132 H106 M100 126 V138" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />

    <text x="100" y="162" textAnchor="middle" fill="#78350F" fontSize="8" fontWeight="800">
      {name?.slice(0, 16) || 'CROP SHIELD'}
    </text>

    <defs>
      <linearGradient id="fungiGrad" x1="58" y1="52" x2="142" y2="207" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" />
        <stop offset="1" stopColor="#FEF3C7" />
      </linearGradient>
    </defs>
  </svg>
);

// 8. Farm Equipment & Knapsack Sprayer Visual
const EquipmentVisual = ({ name }) => (
  <svg className="w-full h-full max-h-[160px] drop-shadow-md select-none" viewBox="0 0 200 240" fill="none">
    <ellipse cx="100" cy="218" rx="60" ry="10" fill="#000000" fillOpacity="0.08" />

    <rect x="55" y="60" width="90" height="145" rx="20" fill="url(#equipGrad)" stroke="#0284C7" strokeWidth="2.5" />
    <rect x="75" y="42" width="50" height="20" rx="5" fill="#0369A1" />

    <path d="M145 100 L175 60 L180 180" stroke="#334155" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="180" cy="180" r="5" fill="#EF4444" />

    <path d="M65 60 V195 M135 60 V195" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />

    <text x="100" y="130" textAnchor="middle" fill="#0369A1" fontSize="10" fontWeight="900">
      FARM TOOL
    </text>
    <text x="100" y="145" textAnchor="middle" fill="#1E293B" fontSize="8" fontWeight="800">
      {name?.slice(0, 16) || 'AGRICULTURAL MACHINE'}
    </text>

    <defs>
      <linearGradient id="equipGrad" x1="55" y1="60" x2="145" y2="205" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0F2FE" />
        <stop offset="1" stopColor="#BAE6FD" />
      </linearGradient>
    </defs>
  </svg>
);

// 9. Drip & Irrigation Equipment Visual
const IrrigationVisual = ({ name }) => (
  <svg className="w-full h-full max-h-[160px] drop-shadow-md select-none" viewBox="0 0 200 240" fill="none">
    <ellipse cx="100" cy="215" rx="65" ry="10" fill="#000000" fillOpacity="0.08" />

    <circle cx="100" cy="130" r="65" stroke="#1E293B" strokeWidth="18" fill="none" />
    <circle cx="100" cy="130" r="45" stroke="#0F172A" strokeWidth="14" fill="none" />
    <circle cx="100" cy="130" r="28" stroke="#38BDF8" strokeWidth="8" fill="none" />

    <rect x="90" y="55" width="20" height="30" rx="4" fill="#0EA5E9" />
    <path d="M100 45 L100 55" stroke="#0284C7" strokeWidth="4" />

    <text x="100" y="134" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900">
      DRIP AGRI
    </text>
  </svg>
);

/**
 * Determine which realistic SVG visual to show based on product name and category
 */
const renderRealisticVisual = (name = '', category = '') => {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  // 1. Liquids / Seaweed / Tonics
  if (n.includes('seaweed') || n.includes('liquid') || n.includes('tonic') || (n.includes('spray') && !n.includes('sprayer'))) {
    return <LiquidBottleVisual name={name} />;
  }

  // 2. Seeds
  if (c.includes('seed') || n.includes('seed') || n.includes('paddy') || n.includes('hybrid') || n.includes('tomato') || n.includes('cotton')) {
    return <SeedPacketVisual name={name} />;
  }

  // 3. Bio-Fertilizers
  if (c.includes('bio') || n.includes('rhizobium') || n.includes('azotobacter') || n.includes('mycorrhiza') || n.includes('psb') || n.includes('trichoderma')) {
    return <BioFertilizerVisual name={name} />;
  }

  // 4. Pesticides & Insecticides
  if (c.includes('pesticide') || n.includes('pesticide') || n.includes('insecticide') || n.includes('chlorpyrifos') || n.includes('imidacloprid')) {
    return <CropProtectionVisual name={name} />;
  }

  // 5. Fungicides
  if (n.includes('fungicide') || n.includes('mancozeb') || n.includes('bavistin') || n.includes('copper')) {
    return <FungicideVisual name={name} />;
  }

  // 6. Equipment & Sprayers
  if (c.includes('equipment') || n.includes('sprayer') || n.includes('machine') || n.includes('tool') || n.includes('cutter') || n.includes('pump') || n.includes('meter')) {
    return <EquipmentVisual name={name} />;
  }

  // 7. Irrigation
  if (c.includes('irrigation') || n.includes('drip') || n.includes('pipe') || n.includes('nozzle') || n.includes('sprinkler')) {
    return <IrrigationVisual name={name} />;
  }

  // 8. Chemical Fertilizers
  if (c.includes('chemical') || n.includes('urea') || n.includes('dap') || n.includes('npk') || n.includes('potash')) {
    return <ChemicalFertilizerBag name={name} />;
  }

  // 9. Organic Fertilizers / Vermicompost / Neem
  return <OrganicFertilizerBag name={name} />;
};

const ProductImage = ({
  src,
  images,
  alt,
  productName,
  category,
  type,
  className = '',
  aspect = 'aspect-square'
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Extract safe image URL from src or images array
  const safeSrc = toSafeImageUrl(src || images);
  const displayName = productName || alt || '';

  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src, images]);

  // If no valid URL or image fails loading, render clean realistic package visual on light neutral background
  if (!safeSrc || error) {
    return (
      <div
        className={`relative overflow-hidden bg-[#F8FAF8] border border-slate-200/60 rounded-2xl flex items-center justify-center p-4 sm:p-5 select-none ${aspect} ${className}`}
      >
        <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          {renderRealisticVisual(displayName, category || type)}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F8FAF8] border border-slate-200/60 rounded-2xl flex items-center justify-center p-3 sm:p-4 ${aspect} ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center z-10 rounded-2xl">
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-emerald-500 animate-spin" />
        </div>
      )}
      <img
        src={safeSrc}
        alt={displayName || 'Product image'}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-contain max-h-full max-w-full transition-all duration-300 group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default ProductImage;
