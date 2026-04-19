import { Product, Review, Cart, Order, Shop, Category } from "./types";

/**
 * Returns the correct base URL for API calls.
 * On the client, it uses a local proxy to avoid CORS.
 * On the server, it uses the absolute URL.
 */
export const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use proxy to avoid CORS
    return "/remote-proxy/api";
  }
  
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app";
  const cleanUrl = envUrl.replace(/\/$/, "");
  return `${cleanUrl}/api`;
};

/**
 * Ensures images load correctly from the backend or CDN.
 */
export function formatImageUrl(url: string | null | undefined): string {
  if (!url) return "https://placehold.co/600x600/f4f4f5/999?text=No+Image";
  if (url.startsWith("http")) return url;
  
  const envUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app").replace(/\/$/, "");
  return `${envUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

export const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "Stationery", slug: "stationery" },
  { id: 2, name: "Fashion", slug: "fashion" },
  { id: 3, name: "Foods & drinks", slug: "foods-drinks" },
  { id: 4, name: "Electronics", slug: "electronics" },
  { id: 5, name: "Art", slug: "art" },
  { id: 6, name: "Books", slug: "books" },
  { id: 7, name: "Beauty", slug: "beauty" },
  { id: 8, name: "Services", slug: "services" },
];

/**
 * Helper for making authenticated requests to the API.
 * Enforces trailing slashes for Django production compatibility.
 */
async function authenticatedFetch(endpoint: string, token?: string | null, options: RequestInit = {}) {
  const baseUrl = getApiBaseUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ensure endpoint starts with / and ends with / (unless it has query params)
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  // Remove duplicate /api if present in endpoint
  if (cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.slice(4);
  }

  if (!cleanEndpoint.includes("?") && !cleanEndpoint.endsWith("/")) {
    cleanEndpoint = `${cleanEndpoint}/`;
  }

  const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  return response;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/categories/`);
    if (!response.ok) return FALLBACK_CATEGORIES;
    const data = await response.json();
    const cats = data.results || data;
    return cats.length > 0 ? cats : FALLBACK_CATEGORIES;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return FALLBACK_CATEGORIES;
  }
}

export async function createProduct(token: string, data: any): Promise<Product | null> {
  try {
    const response = await authenticatedFetch("products/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/products/${slug}/`, {
      next: { revalidate: 10 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

export async function getProducts(params?: Record<string, string>): Promise<Product[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await fetch(`${baseUrl}/products/${query}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getRelatedProducts(productId: number): Promise<Product[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/products/${productId}/related_products/`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error(`Error fetching related products for ${productId}:`, error);
    return [];
  }
}

export async function getReviews(productId: number, limit = 10, offset = 0): Promise<Review[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/reviews/?product=${productId}&limit=${limit}&offset=${offset}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error(`Error fetching reviews for ${productId}:`, error);
    return [];
  }
}

export async function getShops(): Promise<Shop[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/shops/`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    return [];
  }
}

export async function getShop(slug: string): Promise<Shop | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/shops/${slug}/`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Error fetching shop ${slug}:`, error);
    return null;
  }
}

export async function fetchMyShop(token: string): Promise<Shop | null> {
  try {
    const response = await authenticatedFetch("shops/", token);
    if (!response.ok) return null;
    const shops = await response.json();
    const shopList = shops.results || shops;
    return shopList[0] || null; 
  } catch (error) {
    console.error("Error fetching user shop:", error);
    return null;
  }
}

export async function createShop(token: string, data: any): Promise<Shop | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const isFormData = data instanceof FormData;
    
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${baseUrl}/shops/`, {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error creating shop:", error);
    return null;
  }
}

export async function updateShop(token: string, shopId: number, data: Partial<Shop>): Promise<Shop | null> {
  try {
    const response = await authenticatedFetch(`shops/${shopId}/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error updating shop:", error);
    return null;
  }
}

export async function fetchCart(token: string): Promise<Cart | null> {
  try {
    const timestamp = new Date().getTime();
    const response = await authenticatedFetch(`cart/my_cart/?t=${timestamp}`, token);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function addToCart(token: string, productId: number, quantity: number = 1): Promise<boolean> {
  try {
    const response = await authenticatedFetch("cart-items/", token, {
      method: "POST",
      body: JSON.stringify({ product: productId, quantity }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return false;
  }
}

export async function updateCartItem(token: string, itemId: number, quantity: number): Promise<boolean> {
  try {
    const response = await authenticatedFetch(`cart-items/${itemId}/`, token, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return false;
  }
}

export async function removeFromCart(token: string, itemId: number): Promise<boolean> {
  try {
    const response = await authenticatedFetch(`cart-items/${itemId}/`, token, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
}

export async function checkoutCart(token: string, phoneNumber: string): Promise<Order | null> {
  try {
    const response = await authenticatedFetch("cart/checkout/", token, {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Checkout failed");
    }
    return response.json();
  } catch (error) {
    console.error("Error during checkout:", error);
    throw error;
  }
}

export async function getOrderPaymentStatus(token: string, orderId: number): Promise<{ payment_status: string, status: string } | null> {
  try {
    const response = await authenticatedFetch(`orders/${orderId}/payment_status/`, token);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching order payment status:", error);
    return null;
  }
}

export async function submitReview(token: string, data: { product: number, rating: number, comment: string }): Promise<Review | null> {
  try {
    const response = await authenticatedFetch("reviews/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData[0] || errorData.detail || "Failed to submit review");
    }
    return response.json();
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
}

export async function fetchOrders(token: string): Promise<Order[]> {
  try {
    const response = await authenticatedFetch("orders/", token);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function fetchShopOrders(token: string): Promise<Order[]> {
  try {
    const response = await authenticatedFetch("orders/shop_orders/", token);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    return [];
  }
}
