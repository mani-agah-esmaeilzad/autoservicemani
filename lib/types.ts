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
  sku: string;
  longDescription: string;
  highlights: string[];
  gallery: ProductMedia[];
  specifications: ProductSpecification[];
  compatibility: string[];
  warranty: string;
  shipping: string;
  maintenanceTips: string[];
  faqs: ProductFAQ[];
  questions: ProductQuestion[];
}

export interface ProductMedia {
  src: string;
  alt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductQuestion {
  id: string;
  author: string;
  question: string;
  answer?: string;
  createdAt: string;
  votes: number;
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

export interface Brand {
  id: string;
  name: string;
  logo: string;
  country: string;
  founded: number;
  tagline: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipTier: string;
  loyaltyPoints: number;
  preferredVehicle: string;
  defaultAddress: string;
  joinDate: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system' | 'support';
  createdAt: string;
  read: boolean;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'در انتظار پاسخ' | 'در حال بررسی' | 'بسته شده';
  priority: 'کم' | 'متوسط' | 'فوری';
  createdAt: string;
  updatedAt: string;
  messages: SupportTicketMessage[];
}

export interface UserDashboard {
  profile: UserProfile;
  orders: Array<{
    id: string;
    status: string;
    total: number;
    createdAt: string;
  }>;
  notifications: UserNotification[];
  tickets: SupportTicket[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  topic: string;
  lastActive: string;
  satisfaction: number;
  messages: ChatMessage[];
}
