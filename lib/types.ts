export interface Variant {
  id: number;
  name: string;
  price: string;
  stock: number;
  image: string;
  attributes: Record<string, string>;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  images: { id: number; image: string; alt_text: string }[];
  category: string;
  shop: string;
  variants: Variant[];
  avg_rating: number;
  review_count: number;
}

export interface Review {
  id: number;
  product: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
