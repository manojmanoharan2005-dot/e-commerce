/**
 * Safe image URL extractor that supports string URLs, arrays of images,
 * and handles percent encoding safely.
 */
export const toSafeImageUrl = (rawImageInput) => {
  if (!rawImageInput) return '';

  let url = '';

  if (typeof rawImageInput === 'string') {
    url = rawImageInput;
  } else if (Array.isArray(rawImageInput) && rawImageInput.length > 0) {
    url = typeof rawImageInput[0] === 'string' ? rawImageInput[0] : rawImageInput[0]?.url || rawImageInput[0]?.src || '';
  } else if (typeof rawImageInput === 'object') {
    url = rawImageInput.url || rawImageInput.src || rawImageInput.secure_url || '';
  }

  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  // Prevent dev-server URI parse crashes for URLs containing invalid percent escapes.
  return trimmed.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
};
