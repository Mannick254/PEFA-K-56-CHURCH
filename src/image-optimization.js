import { supabase } from './supabaseClient';

export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) {
    return null;
  }

  const { width, height, quality } = options;
  const url = new URL(imageUrl);
  const params = url.searchParams;

  if (width) {
    params.set('w', width);
  }

  if (height) {
    params.set('h', height);
  }

  if (quality) {
    params.set('q', quality);
  }

  return url.toString();
};
