import { Product, Review } from "./types";

const API_BASE_URL = "https://api.sokoline.app/api";

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}/`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

export async function getRelatedProducts(productId: number): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/related_products/`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error(`Error fetching related products for ${productId}:`, error);
    return [];
  }
}

export async function getReviews(productId: number, limit = 10, offset = 0): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/?product=${productId}&limit=${limit}&offset=${offset}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data; // Handle paginated response
  } catch (error) {
    console.error(`Error fetching reviews for ${productId}:`, error);
    return [];
  }
}
