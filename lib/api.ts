import { Product, Review, Cart, Order, Shop, Category } from "./types";

/**
 * Industry Standard API Configuration
 * On the client: use /remote-proxy to avoid CORS.
 * On the server: use the absolute production URL.
 */
export const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app";
  return envUrl.replace(/\/$/, "");
};

/**
 * Formats image URLs to handle CDN or relative API paths.
 */
export function formatImageUrl(url: string | null | undefined): string {
  if (!url) return "https://placehold.co/600x600/f4f4f5/999?text=No+Image";
  if (url.startsWith("http")) return url;
  
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app").replace(/\/$/, "");
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function apiRequest(endpoint: string, options: RequestInit = {}, token?: string | null) {
  const baseUrl = getApiBaseUrl();
  
  // 1. Clean the endpoint
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  
  // 2. Add /api/ if missing
  if (!cleanEndpoint.startsWith("api/")) {
    cleanEndpoint = `api/${cleanEndpoint}`;
  }

  // 3. Handle query params and trailing slash
  const [basePath, query] = cleanEndpoint.split("?");
  const pathWithSlash = basePath.endsWith("/") ? basePath : `${basePath}/`;
  
  // 4. Build final URL
  const finalUrl = `${baseUrl}/${pathWithSlash}${query ? `?${query}` : ""}`;

  if (typeof window !== "undefined") {
    console.log(`🚀 [API] ${options.method || 'GET'} -> ${finalUrl}`);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(finalUrl, { ...options, headers });
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiRequest("categories");
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data;
  } catch {
    return [];
  }
}

export async function getProducts(params?: Record<string, string>): Promise<Product[]> {
  try {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    const res = await apiRequest(`products${query}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data;
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await apiRequest(`products/${slug}`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(productId: number): Promise<Product[]> {
  try {
    const res = await apiRequest(`products/${productId}/related_products`);
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export async function getReviews(productId: number, limit?: number, offset?: number): Promise<Review[]> {
  try {
    let query = `product=${productId}`;
    if (limit !== undefined) query += `&limit=${limit}`;
    if (offset !== undefined) query += `&offset=${offset}`;
    
    const res = await apiRequest(`reviews?${query}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data;
  } catch {
    return [];
  }
}

export async function getShops(): Promise<Shop[]> {
  try {
    const res = await apiRequest("shops");
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data;
  } catch {
    return [];
  }
}

export async function getShop(slug: string): Promise<Shop | null> {
  try {
    const res = await apiRequest(`shops/${slug}`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// --- Authenticated Services ---

export async function fetchMyShop(token: string): Promise<Shop | null> {
  try {
    const res = await apiRequest("shops", {}, token);
    if (!res.ok) return null;
    const data = await res.json();
    const list = data.results || data;
    return list[0] || null;
  } catch {
    return null;
  }
}

export async function createShop(token: string, data: FormData | any): Promise<Shop | null> {
  try {
    const isFormData = data instanceof FormData;
    const headers: Record<string, string> = isFormData ? {} : { "Content-Type": "application/json" };
    
    const res = await apiRequest("shops", {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    }, token);

    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function updateShop(token: string, slug: string, data: FormData | any): Promise<Shop | null> {
  try {
    const isFormData = data instanceof FormData;
    const headers: Record<string, string> = isFormData ? {} : { "Content-Type": "application/json" };
    
    const res = await apiRequest(`shops/${slug}`, {
      method: "PATCH",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    }, token);

    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function createProduct(token: string, data: FormData | any): Promise<Product | null> {
  try {
    const isFormData = data instanceof FormData;
    const headers: Record<string, string> = isFormData ? {} : { "Content-Type": "application/json" };
    
    const res = await apiRequest("products", {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    }, token);

    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function fetchCart(token: string): Promise<Cart | null> {
  try {
    const res = await apiRequest("cart/my_cart", { cache: 'no-store' }, token);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export interface AddToCartResult {
  success: boolean;
  status?: number;
  message?: string;
}

function extractApiErrorMessage(errorData: unknown): string | undefined {
  if (typeof errorData === "string") {
    return errorData;
  }

  if (Array.isArray(errorData)) {
    const first = errorData[0];
    return typeof first === "string" ? first : undefined;
  }

  if (errorData && typeof errorData === "object") {
    const errorObj = errorData as Record<string, unknown>;

    if (typeof errorObj.detail === "string") {
      return errorObj.detail;
    }

    const firstValue = Object.values(errorObj)[0];
    if (typeof firstValue === "string") {
      return firstValue;
    }
    if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
      return firstValue[0];
    }
  }

  return undefined;
}

export async function addToCart(token: string, productId: number, quantity: number = 1): Promise<AddToCartResult> {
  try {
    const res = await apiRequest("cart-items", {
      method: "POST",
      body: JSON.stringify({ product: productId, quantity }),
    }, token);

    if (res.ok) {
      return { success: true };
    }

    let message: string | undefined;
    try {
      const errorData = await res.json();
      message = extractApiErrorMessage(errorData);
    } catch {
      message = undefined;
    }

    return {
      success: false,
      status: res.status,
      message,
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      message: "Could not add item to cart. Please try again.",
    };
  }
}

export async function updateCartItem(token: string, itemId: number, quantity: number): Promise<boolean> {
  try {
    const res = await apiRequest(`cart-items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }, token);
    return res.ok;
  } catch {
    return false;
  }
}

export async function removeFromCart(token: string, itemId: number): Promise<boolean> {
  try {
    const res = await apiRequest(`cart-items/${itemId}`, { method: "DELETE" }, token);
    return res.ok;
  } catch {
    return false;
  }
}

export async function checkoutCart(token: string, phoneNumber: string): Promise<Order | null> {
  const res = await apiRequest("cart/checkout", {
    method: "POST",
    body: JSON.stringify({ phone_number: phoneNumber }),
  }, token);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Checkout failed");
  }
  return await res.json();
}

export async function fetchOrders(token: string): Promise<Order[]> {
  try {
    const res = await apiRequest("orders", {}, token);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data;
  } catch {
    return [];
  }
}

export async function fetchShopOrders(token: string): Promise<Order[]> {
  try {
    const res = await apiRequest("orders/shop_orders", {}, token);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data;
  } catch {
    return [];
  }
}

export async function submitReview(token: string, productId: number, rating: number, comment: string): Promise<boolean> {
  try {
    const res = await apiRequest("reviews", {
      method: "POST",
      body: JSON.stringify({ product: productId, rating, comment }),
    }, token);

    return res.ok;
  } catch {
    return false;
  }
}

export async function getOrderPaymentStatus(token: string, orderId: number) {
  const res = await apiRequest(`orders/${orderId}/payment_status`, {}, token);
  return res.ok ? await res.json() : null;
}
