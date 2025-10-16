import type { Category, Order, Product, Review, Service } from './types';

interface DataStore {
  categories: Category[];
  products: Product[];
  services: Service[];
  reviews: Review[];
  orders: Order[];
}

const globalStore = globalThis as unknown as { __autoServiceData?: DataStore };

if (!globalStore.__autoServiceData) {
  globalStore.__autoServiceData = {
    categories: [
      {
        id: 'cat-1',
        slug: 'engine-oils',
        name: 'روغن موتور',
        description: 'انواع روغن موتور مناسب خودروهای داخلی و وارداتی.',
        image: '/images/categories/engine-oil.svg',
        featured: true
      },
      {
        id: 'cat-2',
        slug: 'filters',
        name: 'فیلترها',
        description: 'فیلتر هوا، روغن و کابین با کیفیت اصلی.',
        image: '/images/categories/filter.svg',
        featured: true
      },
      {
        id: 'cat-3',
        slug: 'car-care',
        name: 'مراقبت خودرو',
        description: 'مواد مصرفی و پاک‌کننده‌های تخصصی بدنه و کابین.',
        image: '/images/categories/car-care.svg'
      },
      {
        id: 'cat-4',
        slug: 'accessories',
        name: 'لوازم جانبی',
        description: 'لوازم جانبی کاربردی برای تجربه رانندگی بهتر.',
        image: '/images/categories/accessories.svg'
      }
    ],
    products: [
      {
        id: 'prd-1',
        slug: 'shell-ultra-5w30',
        name: 'روغن موتور شل اولترا 5W-30',
        description:
          'روغن سینتتیک با فناوری PurePlus برای عملکرد بهینه موتور و کاهش مصرف سوخت.',
        price: 1480000,
        brand: 'Shell',
        image: '/images/products/shell-ultra.svg',
        categoryId: 'cat-1',
        rating: 4.8,
        inStock: 24,
        tags: ['synthetic', '5w30', 'premium']
      },
      {
        id: 'prd-2',
        slug: 'total-quartz-9000-5w40',
        name: 'روغن موتور توتال کوارتز 9000 5W-40',
        description:
          'مناسب برای موتورهای پیشرفته با محافظت عالی در شرایط سخت رانندگی.',
        price: 1265000,
        brand: 'Total',
        image: '/images/products/total-quartz.svg',
        categoryId: 'cat-1',
        rating: 4.6,
        inStock: 18,
        tags: ['synthetic', '5w40']
      },
      {
        id: 'prd-3',
        slug: 'mann-filter-w67',
        name: 'فیلتر روغن Mann W67',
        description: 'فیلتر روغن با کیفیت بالا برای جلوگیری از آلودگی و فرسودگی موتور.',
        price: 285000,
        brand: 'Mann',
        image: '/images/products/mann-filter.svg',
        categoryId: 'cat-2',
        rating: 4.4,
        inStock: 42,
        tags: ['filter', 'engine']
      },
      {
        id: 'prd-4',
        slug: 'interior-detail-kit',
        name: 'کیت نظافت داخلی حرفه‌ای',
        description: 'ست کامل تمیزکننده‌های کابین به همراه دستمال میکروفایبر.',
        price: 540000,
        brand: 'AutoCare',
        image: '/images/products/interior-kit.svg',
        categoryId: 'cat-3',
        rating: 4.3,
        inStock: 30,
        tags: ['care', 'detail']
      },
      {
        id: 'prd-5',
        slug: 'car-battery-booster',
        name: 'جامپ استارتر هوشمند خودرو',
        description: 'جامپ استارتر پرتابل با چراغ قوه و پاوربانک 12000 میلی‌آمپری.',
        price: 2150000,
        brand: 'XPower',
        image: '/images/products/jump-starter.svg',
        categoryId: 'cat-4',
        rating: 4.7,
        inStock: 12,
        tags: ['accessory', 'battery']
      }
    ],
    services: [
      {
        id: 'srv-1',
        name: 'تعویض روغن حرفه‌ای',
        description: 'تعویض روغن با دستگاه تمام اتوماتیک و استفاده از روغن اورجینال.',
        duration: '45 دقیقه',
        price: 320000
      },
      {
        id: 'srv-2',
        name: 'بازرسی فنی کامل',
        description: 'بازرسی سیستم ترمز، تعلیق و مایعات حیاتی خودرو توسط متخصصین.',
        duration: '60 دقیقه',
        price: 450000
      },
      {
        id: 'srv-3',
        name: 'تنظیم موتور و دیاگ',
        description: 'عیب‌یابی رایانه‌ای و تنظیم دقیق موتور برای عملکرد ایده‌آل.',
        duration: '75 دقیقه',
        price: 670000
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        productId: 'prd-1',
        author: 'علی رستمی',
        rating: 5,
        comment: 'کیفیت روغن فوق‌العاده‌ست و صدای موتور رو کاملاً کم کرده.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rev-2',
        productId: 'prd-2',
        author: 'مریم عباسی',
        rating: 4,
        comment: 'ارسال سریع بود و بسته‌بندی مناسبی داشت.',
        createdAt: new Date().toISOString()
      }
    ],
    orders: []
  };
}

export const dataStore = globalStore.__autoServiceData!;

export function listCategories() {
  return dataStore.categories;
}

export function listFeaturedCategories() {
  return dataStore.categories.filter((category) => category.featured);
}

export function listProducts() {
  return dataStore.products;
}

export function listProductsByCategory(slug: string) {
  const category = dataStore.categories.find((cat) => cat.slug === slug);
  if (!category) return [];
  return dataStore.products.filter((product) => product.categoryId === category.id);
}

export function findProductBySlug(slug: string) {
  return dataStore.products.find((product) => product.slug === slug || product.id === slug);
}

export function listServices() {
  return dataStore.services;
}

export function listReviews(productId: string) {
  return dataStore.reviews.filter((review) => review.productId === productId);
}

export function listOrders() {
  return dataStore.orders;
}

export function createOrder(order: Order) {
  dataStore.orders.unshift(order);
  return order;
}

export function upsertProduct(product: Product) {
  const index = dataStore.products.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    dataStore.products[index] = product;
  } else {
    dataStore.products.push(product);
  }
  return product;
}

export function deleteProduct(productId: string) {
  dataStore.products = dataStore.products.filter((product) => product.id !== productId);
}
