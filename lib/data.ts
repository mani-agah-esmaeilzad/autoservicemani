import { Prisma } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';
import { getPrismaClient } from './prisma';
import type {
  Brand,
  Category,
  CategoryInput,
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
let fallbackCategories: Category[] = [];

function isPrismaUnavailableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ['P2021', 'P1000', 'P1001', 'P1010', 'P1011', 'P1012', 'P1013'].includes(error.code);
  }

  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  );
}

async function withTableFallback<T>(
  operation: (client: PrismaClient) => Promise<T>,
  fallback: T
): Promise<T> {
  const client = getPrismaClient();

  if (!client) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Prisma client unavailable. Returning fallback result.');
    } else {
      console.error('Prisma client unavailable. Returning fallback result.');
    }
    return fallback;
  }

  try {
    return await operation(client);
  } catch (error) {
    if (isPrismaUnavailableError(error)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Prisma is unavailable, returning fallback result.', error);
      } else {
        console.error('Prisma is unavailable, returning fallback result.');
      }
      return fallback;
    }
    throw error;
  }
}

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[ـ]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

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

function normalizeCategory(record: Prisma.CategoryGetPayload<{}>): Category {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description: record.description ?? '',
    image: record.image ?? '',
    featured: record.featured
  };
}

export async function listCategories(): Promise<Category[]> {
  return withTableFallback(async (client) => {
    const records = await client.category.findMany({
      orderBy: { name: 'asc' }
    });
    const categories = records.map((category) => normalizeCategory(category));
    fallbackCategories = categories.map((category) => ({ ...category }));
    return categories;
  }, fallbackCategories.map((category) => ({ ...category })));
}

export async function listFeaturedCategories(): Promise<Category[]> {
  return withTableFallback(async (client) => {
    const records = await client.category.findMany({
      where: { featured: true },
      orderBy: { name: 'asc' }
    });
    return records.map((category) => normalizeCategory(category));
  }, fallbackCategories.filter((category) => category.featured));
}

export async function upsertCategory(input: CategoryInput): Promise<Category> {
  const normalizedName = input.name?.trim();
  if (!normalizedName) {
    throw new Error('CATEGORY_NAME_REQUIRED');
  }

  const normalizedSlug = slugify(input.slug?.trim() || normalizedName) || `category-${Date.now()}`;
  const normalizedDescription = input.description?.trim() ?? '';
  const normalizedImage = input.image?.trim() ?? '';
  const identifier = input.id ?? `cat-${Date.now()}`;

  if (
    fallbackCategories.some(
      (category) => category.slug === normalizedSlug && category.id !== identifier
    )
  ) {
    throw new Error('CATEGORY_SLUG_EXISTS');
  }

  const prepared: Category = {
    id: identifier,
    slug: normalizedSlug,
    name: normalizedName,
    description: normalizedDescription,
    image: normalizedImage,
    featured: Boolean(input.featured)
  };

  const saved = await withTableFallback(
    async (client) => {
      const record = await client.category.upsert({
        where: { id: prepared.id },
        update: {
          slug: prepared.slug,
          name: prepared.name,
          description: prepared.description,
          image: prepared.image,
          featured: prepared.featured ?? false
        },
        create: {
          id: prepared.id,
          slug: prepared.slug,
          name: prepared.name,
          description: prepared.description,
          image: prepared.image,
          featured: prepared.featured ?? false
        }
      });
      return normalizeCategory(record);
    },
    prepared
  );

  fallbackCategories = fallbackCategories
    .filter((category) => category.id !== saved.id)
    .concat({ ...saved })
    .sort((a, b) => a.name.localeCompare(b.name, 'fa')); // ensure consistent order offline

  return saved;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await withTableFallback(
    async (client) => {
      await client.category.delete({ where: { id: categoryId } });
    },
    undefined
  );

  fallbackCategories = fallbackCategories.filter((category) => category.id !== categoryId);
}

export async function findCategoryBySlug(slug: string): Promise<Category | null> {
  const normalizedSlug = slugify(slug);
  if (!normalizedSlug) {
    return null;
  }

  const fallbackCategory = fallbackCategories.find((category) => category.slug === normalizedSlug) ?? null;

  const category = await withTableFallback(
    async (client) => {
      const record = await client.category.findUnique({ where: { slug: normalizedSlug } });
      return record ? normalizeCategory(record) : null;
    },
    fallbackCategory
  );

  if (category) {
    const exists = fallbackCategories.some((item) => item.id === category.id);
    if (!exists) {
      fallbackCategories = [...fallbackCategories, { ...category }].sort((a, b) =>
        a.name.localeCompare(b.name, 'fa')
      );
    }
  }

  return category;
}

export async function listBrands(): Promise<Brand[]> {
  return withTableFallback(async (client) => {
    const records = await client.brand.findMany({
      orderBy: { name: 'asc' }
    });
    return records.map(normalizeBrand);
  }, []);
}

export async function listProducts(): Promise<Product[]> {
  return withTableFallback(async (client) => {
    const records = await client.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { brandRef: true }
    });
    return records.map(normalizeProduct);
  }, []);
}

export async function listProductsByCategory(slug: string): Promise<Product[]> {
  const normalizedSlug = slugify(slug);

  return withTableFallback(async (client) => {
    const category = await client.category.findUnique({ where: { slug: normalizedSlug } });
    if (!category) {
      return [];
    }
    const records = await client.product.findMany({
      where: { categoryId: category.id },
      orderBy: { createdAt: 'desc' },
      include: { brandRef: true }
    });
    return records.map(normalizeProduct);
  }, []);
}

export async function findProductBySlug(slug: string): Promise<Product | null> {
  return withTableFallback(async (client) => {
    const record = await client.product.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { brandRef: true }
    });
    return record ? normalizeProduct(record) : null;
  }, null);
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
  return withTableFallback(async (client) => {
    const record = await client.product.findFirst({
      where: { OR: [{ slug: productId }, { id: productId }] },
      select: { id: true, questions: true }
    });
    if (!record) {
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

    const existingQuestions = normalizeQuestions(record.questions);
    const updatedQuestions = [...existingQuestions, newQuestion] as unknown as Prisma.InputJsonValue;

    await client.product.update({
      where: { id: record.id },
      data: {
        questions: updatedQuestions
      }
    });

    return newQuestion;
  }, null);
}

export async function listOrders(): Promise<Order[]> {
  return withTableFallback(async (client) => {
    const records = await client.order.findMany({ orderBy: { createdAt: 'desc' } });
    return records.map(normalizeOrder);
  }, []);
}

export async function createOrder(order: Order): Promise<Order> {
  return withTableFallback(
    async (client) => {
      const record = await client.order.create({
        data: {
          id: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          total: order.total,
          status: order.status,
          items: toJsonValue(order.items)
        }
      });
      return normalizeOrder(record);
    },
    order
  );
}

export async function upsertProduct(product: Product): Promise<Product> {
  return withTableFallback(async (client) => {
    const record = await client.product.upsert({
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
        gallery: toJsonValue(product.gallery),
        specifications: toJsonValue(product.specifications),
        compatibility: product.compatibility,
        warranty: product.warranty,
        shipping: product.shipping,
        maintenanceTips: product.maintenanceTips,
        faqs: toJsonValue(product.faqs),
        questions: toJsonValue(product.questions)
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
        gallery: toJsonValue(product.gallery),
        specifications: toJsonValue(product.specifications),
        compatibility: product.compatibility,
        warranty: product.warranty,
        shipping: product.shipping,
        maintenanceTips: product.maintenanceTips,
        faqs: toJsonValue(product.faqs),
        questions: toJsonValue(product.questions)
      }
    });

    return normalizeProduct({ ...record, brandRef: null });
  }, product);
}

export async function deleteProduct(productId: string): Promise<void> {
  await withTableFallback(
    async (client) => {
      await client.product.delete({ where: { id: productId } });
    },
    undefined
  );
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
