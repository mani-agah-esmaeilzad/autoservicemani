import type { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import type {
  Brand,
  Category,
  ChatMessage,
  ChatSession,
  Order,
  Product,
  ProductFAQ,
  ProductMedia,
  ProductQuestion,
  ProductSpecification,
  Review,
  Service,
  SupportTicket,
  UserDashboard,
  UserNotification
} from './types';

const defaultServices: Service[] = [
  {
    id: 'svc-oil-change',
    name: 'سرویس تعویض روغن و فیلتر',
    description: 'تعویض روغن موتور به همراه فیلتر روغن، هوا و کابین با استفاده از تجهیزات استاندارد.',
    duration: '60 دقیقه',
    price: 350000
  },
  {
    id: 'svc-diagnostic',
    name: 'عیب‌یابی تخصصی موتور و گیربکس',
    description: 'بررسی کامل سیستم برقی، موتور و گیربکس با استفاده از دستگاه دیاگ نسل جدید.',
    duration: '90 دقیقه',
    price: 480000
  },
  {
    id: 'svc-detailing',
    name: 'پکیج کامل دیتیلینگ بدنه و کابین',
    description: 'شست‌وشو، پولیش و واکس تخصصی به همراه نانو سرامیک محافظ برای ظاهر بی‌نقص خودرو.',
    duration: '4 ساعت',
    price: 1850000
  }
];

const emptyDashboard: UserDashboard = {
  profile: {
    id: '',
    name: '',
    email: '',
    phone: '',
    membershipTier: 'سطح پایه',
    loyaltyPoints: 0,
    preferredVehicle: '',
    defaultAddress: '',
    joinDate: ''
  },
  orders: [],
  notifications: [],
  tickets: []
};

let supportTickets: SupportTicket[] = [];
let aiSessions: ChatSession[] = [];

function parseJsonArray<T>(value: Prisma.JsonValue | null | undefined): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  return [];
}

function normalizeGallery(value: Prisma.JsonValue | null | undefined, fallback: ProductMedia): ProductMedia[] {
  const items = parseJsonArray<ProductMedia>(value);
  if (items.length > 0) {
    return items.map((item) => ({
      src: item.src,
      alt: item.alt ?? fallback.alt
    }));
  }
  return [fallback];
}

function normalizeSpecifications(value: Prisma.JsonValue | null | undefined): ProductSpecification[] {
  return parseJsonArray<ProductSpecification>(value).map((spec) => ({
    label: spec.label,
    value: spec.value
  }));
}

function normalizeFaqs(value: Prisma.JsonValue | null | undefined): ProductFAQ[] {
  return parseJsonArray<ProductFAQ>(value).map((faq) => ({
    question: faq.question,
    answer: faq.answer
  }));
}

function normalizeQuestions(value: Prisma.JsonValue | null | undefined): ProductQuestion[] {
  return parseJsonArray<ProductQuestion>(value).map((question) => ({
    id: question.id,
    author: question.author,
    question: question.question,
    answer: question.answer,
    createdAt: question.createdAt,
    votes: question.votes ?? 0
  }));
}

function normalizeProduct(record: Prisma.ProductGetPayload<{ include: { brandRef: true } }>): Product {
  const primaryImage: ProductMedia = {
    src: record.image ?? '/images/products/placeholder.svg',
    alt: record.name
  };

  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description: record.description ?? '',
    price: record.price,
    brand: record.brand,
    image: primaryImage.src,
    categoryId: record.categoryId,
    rating: record.rating,
    inStock: record.inStock,
    tags: record.tags ?? [],
    sku: record.sku,
    longDescription: record.longDescription ?? record.description ?? '',
    highlights: record.highlights ?? [],
    gallery: normalizeGallery(record.gallery, primaryImage),
    specifications: normalizeSpecifications(record.specifications),
    compatibility: record.compatibility ?? [],
    warranty: record.warranty ?? '',
    shipping: record.shipping ?? '',
    maintenanceTips: record.maintenanceTips ?? [],
    faqs: normalizeFaqs(record.faqs),
    questions: normalizeQuestions(record.questions)
  };
}

function normalizeBrand(record: Prisma.BrandGetPayload<{}>): Brand {
  return {
    id: record.id,
    name: record.name,
    logo: record.logo ?? '',
    country: record.country ?? '',
    founded: record.founded ?? 0,
    tagline: record.tagline ?? ''
  };
}

function normalizeOrder(record: Prisma.OrderGetPayload<{}>): Order {
  const items = Array.isArray(record.items)
    ? (record.items as Order['items'])
    : [];

  return {
    id: record.id,
    customerName: record.customerName,
    customerEmail: record.customerEmail,
    total: record.total,
    status: record.status as Order['status'],
    createdAt: record.createdAt.toISOString(),
    items
  };
}

export async function listCategories(): Promise<Category[]> {
  const records = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
  return records.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? '',
    image: category.image ?? '',
    featured: category.featured
  }));
}

export async function listFeaturedCategories(): Promise<Category[]> {
  const records = await prisma.category.findMany({
    where: { featured: true },
    orderBy: { name: 'asc' }
  });
  return records.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? '',
    image: category.image ?? '',
    featured: category.featured
  }));
}

export async function listBrands(): Promise<Brand[]> {
  const records = await prisma.brand.findMany({
    orderBy: { name: 'asc' }
  });
  return records.map(normalizeBrand);
}

export async function listProducts(): Promise<Product[]> {
  const records = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { brandRef: true }
  });
  return records.map(normalizeProduct);
}

export async function listProductsByCategory(slug: string): Promise<Product[]> {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) {
    return [];
  }
  const records = await prisma.product.findMany({
    where: { categoryId: category.id },
    orderBy: { createdAt: 'desc' },
    include: { brandRef: true }
  });
  return records.map(normalizeProduct);
}

export async function findProductBySlug(slug: string): Promise<Product | null> {
  const record = await prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: { brandRef: true }
  });
  return record ? normalizeProduct(record) : null;
}

export async function listServices(): Promise<Service[]> {
  return defaultServices;
}

export async function listReviews(_productId: string): Promise<Review[]> {
  return [];
}

export async function listProductFaqs(productId: string): Promise<ProductFAQ[]> {
  const product = await findProductBySlug(productId);
  return product?.faqs ?? [];
}

export async function listProductQuestions(productId: string): Promise<ProductQuestion[]> {
  const product = await findProductBySlug(productId);
  return product?.questions ?? [];
}

export async function addProductQuestion(
  productId: string,
  question: string,
  author: string
): Promise<ProductQuestion | null> {
  const product = await findProductBySlug(productId);
  if (!product) {
    return null;
  }

  const newQuestion: ProductQuestion = {
    id: `qa-${Date.now()}`,
    author,
    question,
    answer: '',
    createdAt: new Date().toISOString(),
    votes: 0
  };

  await prisma.product.update({
    where: { id: product.id },
    data: {
      questions: [...product.questions, newQuestion]
    }
  });

  return newQuestion;
}

export async function listOrders(): Promise<Order[]> {
  const records = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  return records.map(normalizeOrder);
}

export async function createOrder(order: Order): Promise<Order> {
  const record = await prisma.order.create({
    data: {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      status: order.status,
      items: order.items
    }
  });
  return normalizeOrder(record);
}

export async function upsertProduct(product: Product): Promise<Product> {
  const record = await prisma.product.upsert({
    where: { id: product.id },
    update: {
      slug: product.slug,
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      price: product.price,
      brand: product.brand,
      image: product.image,
      categoryId: product.categoryId,
      rating: product.rating,
      inStock: product.inStock,
      tags: product.tags,
      sku: product.sku,
      highlights: product.highlights,
      gallery: product.gallery,
      specifications: product.specifications,
      compatibility: product.compatibility,
      warranty: product.warranty,
      shipping: product.shipping,
      maintenanceTips: product.maintenanceTips,
      faqs: product.faqs,
      questions: product.questions
    },
    create: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      price: product.price,
      brand: product.brand,
      image: product.image,
      categoryId: product.categoryId,
      rating: product.rating,
      inStock: product.inStock,
      tags: product.tags,
      sku: product.sku,
      highlights: product.highlights,
      gallery: product.gallery,
      specifications: product.specifications,
      compatibility: product.compatibility,
      warranty: product.warranty,
      shipping: product.shipping,
      maintenanceTips: product.maintenanceTips,
      faqs: product.faqs,
      questions: product.questions
    }
  });

  return normalizeProduct({ ...record, brandRef: null });
}

export async function deleteProduct(productId: string): Promise<void> {
  await prisma.product.delete({ where: { id: productId } });
}

export async function getUserDashboard(): Promise<UserDashboard> {
  return emptyDashboard;
}

export async function listUserNotifications(): Promise<UserNotification[]> {
  return [];
}

export async function markNotificationAsRead(): Promise<UserNotification | null> {
  return null;
}

export async function listSupportTickets(): Promise<SupportTicket[]> {
  return supportTickets;
}

export async function addTicketMessage(ticketId: string, message: ChatMessage): Promise<SupportTicket | null> {
  const ticket = supportTickets.find((item) => item.id === ticketId);
  if (!ticket) {
    return null;
  }

  ticket.messages.push({
    id: message.id,
    sender: message.role === 'assistant' ? 'agent' : 'user',
    message: message.content,
    createdAt: message.createdAt
  });
  ticket.updatedAt = message.createdAt;

  return ticket;
}

export async function listAiSessions(): Promise<ChatSession[]> {
  return aiSessions;
}

export async function getAiSession(sessionId: string): Promise<ChatSession | undefined> {
  return aiSessions.find((session) => session.id === sessionId);
}

export async function createAiSession(topic: string): Promise<ChatSession> {
  const now = new Date().toISOString();
  const normalizedTopic = topic.trim() || 'مشاوره فنی جدید';
  const sessionId = `ai-${Date.now()}`;
  const welcomeMessage: ChatMessage = {
    id: `${sessionId}-welcome`,
    role: 'assistant',
    content: 'سلام! من دستیار هوشمند اتو سرویس مانی هستم. مشکل فنی خودرو را بپرس تا بهترین راهکار را پیشنهاد دهم.',
    createdAt: now
  };

  const newSession: ChatSession = {
    id: sessionId,
    topic: normalizedTopic,
    lastActive: now,
    satisfaction: 100,
    messages: [welcomeMessage]
  };

  aiSessions = [newSession, ...aiSessions];
  return newSession;
}

export async function appendAiMessage(sessionId: string, message: ChatMessage): Promise<ChatSession | null> {
  const sessionIndex = aiSessions.findIndex((session) => session.id === sessionId);
  if (sessionIndex === -1) {
    return null;
  }

  const session = { ...aiSessions[sessionIndex] };
  session.messages = [...session.messages, message];
  session.lastActive = message.createdAt;

  aiSessions.splice(sessionIndex, 1);
  aiSessions = [session, ...aiSessions];

  return session;
}

export async function updateAiSession(
  sessionId: string,
  updates: Partial<ChatSession>
): Promise<ChatSession | null> {
  const sessionIndex = aiSessions.findIndex((session) => session.id === sessionId);
  if (sessionIndex === -1) {
    return null;
  }

  const session = { ...aiSessions[sessionIndex], ...updates };
  aiSessions.splice(sessionIndex, 1, session);
  return session;
}
