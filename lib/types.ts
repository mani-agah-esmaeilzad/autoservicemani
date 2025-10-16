export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  image: string;
  categoryId: string;
  rating: number;
  inStock: number;
  tags: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'در انتظار' | 'تکمیل شده' | 'لغو شده';
  createdAt: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}
