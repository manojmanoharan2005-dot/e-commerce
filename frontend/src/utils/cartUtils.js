/**
 * Utility functions for cart normalization, price extraction, and totals calculation.
 */

export const getItemUnitPrice = (item) => {
  if (!item) return 0;
  const rawPrice = item.price ?? item.product?.price ?? item.unitPrice ?? 0;
  const num = Number(rawPrice);
  return isNaN(num) || !isFinite(num) ? 0 : num;
};

export const getItemQuantity = (item) => {
  if (!item) return 1;
  const rawQty = item.quantity ?? item.qty ?? 1;
  const num = Number(rawQty);
  return isNaN(num) || !isFinite(num) || num < 1 ? 1 : num;
};

export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num) || !isFinite(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const calculateCartTotals = (cart = []) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    return {
      itemsTotal: 0,
      totalQuantity: 0,
      itemCount: 0,
      discount: 0,
      shipping: 0,
      finalTotal: 0,
      isValid: false
    };
  }

  let itemsTotal = 0;
  let totalQuantity = 0;
  let hasValidPrices = true;

  for (const item of cart) {
    // Make sure we extract valid price even if item is nested
    const price = getItemUnitPrice(item);
    const qty = getItemQuantity(item);

    if (price <= 0 && (!item._id && !item.name)) {
      hasValidPrices = false;
    }

    itemsTotal += price * qty;
    totalQuantity += qty;
  }

  const isValid = !isNaN(itemsTotal) && isFinite(itemsTotal) && itemsTotal >= 0 && hasValidPrices;

  return {
    itemsTotal,
    totalQuantity,
    itemCount: cart.length,
    discount: 0,
    shipping: 0,
    finalTotal: itemsTotal,
    isValid
  };
};

export const normalizeCartItem = (productObj, qty = 1) => {
  if (!productObj || typeof productObj !== 'object') return null;

  const safePrice = Number(productObj.price ?? productObj.mrp ?? 0);
  const safeMrp = Number(productObj.mrp ?? safePrice);
  const safeStock = Number(productObj.stock ?? 99);

  return {
    _id: String(productObj._id || productObj.id || ''),
    name: String(productObj.name || 'Agri Product'),
    price: isNaN(safePrice) ? 0 : safePrice,
    mrp: isNaN(safeMrp) ? safePrice : safeMrp,
    imageUrl: String(productObj.imageUrl || ''),
    category: String(productObj.category || 'Organic'),
    unit: String(productObj.unit || 'unit'),
    stock: isNaN(safeStock) ? 99 : safeStock,
    quantity: Math.max(1, Number(qty) || 1)
  };
};
