import type {
  Brand,
  Category,
  ChatMessage,
  ChatSession,
  Order,
  Product,
  Review,
  Service,
  SupportTicket,
  UserDashboard,
  UserNotification
} from './types';

interface DataStore {
  categories: Category[];
  products: Product[];
  services: Service[];
  reviews: Review[];
  orders: Order[];
  brands: Brand[];
  userDashboard: UserDashboard;
  aiSessions: ChatSession[];
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
        tags: ['synthetic', '5w30', 'premium'],
        sku: 'ASM-SHL-5W30-04',
        longDescription:
          'شل اولترا 5W-30 با فناوری PurePlus ترکیب روغن پایه سنتتیک را از گاز طبیعی تولید می‌کند تا اصطکاک و رسوب را به حداقل برساند. این روغن برای رانندگان حرفه‌ای که به دنبال حداکثر حفاظت در تمام فصول هستند ایده‌آل است.',
        highlights: [
          'حفاظت 65٪ بهتر در برابر سایش نسبت به استاندارد API SN',
          'پاک‌کنندگی فعال برای جلوگیری از تشکیل لجن',
          'کارکرد عالی در دماهای بسیار پایین و بسیار بالا',
          'کاهش مصرف سوخت تا 3٪ در آزمایش‌های شهری'
        ],
        gallery: [
          { src: '/images/products/shell-ultra.svg', alt: 'بطری روغن موتور شل اولترا 5W-30' },
          { src: '/images/products/placeholder.svg', alt: 'بسته‌بندی چهار لیتری شل اولترا' }
        ],
        specifications: [
          { label: 'ویسکوزیته', value: '5W-30' },
          { label: 'نوع پایه', value: 'تمام سنتتیک (PurePlus)' },
          { label: 'حجم', value: '4 لیتر' },
          { label: 'استانداردها', value: 'API SP، ACEA C3، approvals: MB 229.51, VW 504/507' }
        ],
        compatibility: [
          'موتورهای بنزینی و دیزلی سبک با فیلتر DPF',
          'خودروهای اروپایی نظیر مرسدس بنز، فولکس واگن، آئودی و پورشه',
          'موتورهای توربوشارژ و انژکتوری مدرن'
        ],
        warranty: 'ضمانت اصالت کالا + مهلت تست 7 روزه Auto Service Mani',
        shipping: 'ارسال اکسپرس تهران و کرج در همان روز، ارسال پستی سراسر کشور 2 تا 4 روز کاری',
        maintenanceTips: [
          'قبل از تعویض روغن موتور را پنج دقیقه روشن کنید تا گرم شود.',
          'فیلتر روغن را در هر بار تعویض، با نمونه اصلی جایگزین کنید.',
          'سطح روغن را هر 1500 کیلومتر با گیج کنترل کنید.'
        ],
        faqs: [
          {
            question: 'آیا این روغن برای موتورهای دارای فیلتر DPF مناسب است؟',
            answer: 'بله، فرمولاسیون کم‌خاکستر شل اولترا به‌طور کامل با استانداردهای ACEA C3 سازگار است و از فیلترهای DPF محافظت می‌کند.'
          },
          {
            question: 'هر چند کیلومتر نیاز به تعویض دارد؟',
            answer: 'برای اکثر خودروها هر 8 تا 10 هزار کیلومتر پیشنهاد می‌شود، اما حتما به دفترچه خودرو مراجعه کنید.'
          }
        ],
        questions: [
          {
            id: 'qa-1',
            author: 'سجاد خالقی',
            question: 'برای پژو 206 تیپ 5 مناسبه یا ویسکوزیته پایین‌تری نیاز دارم؟',
            answer:
              'برای موتور TU5 پژو 206، ویسکوزیته 5W-30 در مناطق معتدل بهترین گزینه است و با استاندارد PSA B71 2290 همخوانی دارد.',
            createdAt: '2024-02-10T10:15:00.000Z',
            votes: 8
          },
          {
            id: 'qa-2',
            author: 'مونا احمدی',
            question: 'میتونم با این روغن فاصله سرویس رو تا 12 هزار کیلومتر افزایش بدم؟',
            answer:
              'اگر عمدتاً رانندگی شهری و توقف و حرکت دارید، حداکثر 10 هزار کیلومتر پیشنهاد می‌شود تا سلامت موتور حفظ شود.',
            createdAt: '2024-02-18T08:55:00.000Z',
            votes: 3
          }
        ]
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
        tags: ['synthetic', '5w40'],
        sku: 'ASM-TTL-5W40-04',
        longDescription:
          'توتال کوارتز 9000 با فناوری Age Resistance سطح فیلم محافظ را در فشارهای بالا پایدار نگه می‌دارد. این روغن برای موتورهای توربو و مجهز به تزریق مستقیم طراحی شده است.',
        highlights: [
          'پایداری فیلم روغن در دمای بالا برای موتورهای توربوشارژ',
          'کاهش تشکیل رسوبات در سرسیلندر و توربو تا 35٪',
          'حفاظت عالی در استارت سرد',
          'مورد تایید گروه PSA، BMW LL-01 و مرسدس بنز'
        ],
        gallery: [
          { src: '/images/products/total-quartz.svg', alt: 'روغن موتور Total Quartz 9000 5W-40' },
          { src: '/images/products/placeholder.svg', alt: 'جزئیات درپوش توتال کوارتز' }
        ],
        specifications: [
          { label: 'ویسکوزیته', value: '5W-40' },
          { label: 'نوع پایه', value: 'تمام سنتتیک' },
          { label: 'حجم', value: '4 لیتر' },
          { label: 'استانداردها', value: 'API SN/CF، ACEA A3/B4' }
        ],
        compatibility: [
          'موتورهای توربوشارژ اروپایی و آسیایی',
          'خودروهای دیزلی سبک بدون فیلتر DPF',
          'پیشرانه‌های با کارکرد در دمای بالا'
        ],
        warranty: 'گارانتی اصالت + پلمپ شرکت سازنده',
        shipping: 'ارسال فوری تهران، تحویل درب منزل سایر شهرها 3 روز کاری',
        maintenanceTips: [
          'در هنگام تعویض حتما فیلتر هوا را نیز بازدید کنید.',
          'پس از 500 کیلومتر اول سطح روغن را بررسی کنید.',
          'در صورت رانندگی پرفشار، بازه تعویض را کاهش دهید.'
        ],
        faqs: [
          {
            question: 'برای موتور EF7 ایران‌خودرو مناسبه؟',
            answer: 'بله، ویسکوزیته 5W-40 برای EF7 توصیه شده و این محصول تاییدیه PSA را نیز دارد.'
          },
          {
            question: 'می‌توانم با این روغن در تابستان‌های جنوب کشور رانندگی کنم؟',
            answer: 'این روغن تحمل دمایی بالایی دارد و در گرمای شدید هم پایداری مناسبی فراهم می‌کند.'
          }
        ],
        questions: [
          {
            id: 'qa-3',
            author: 'حمید صبوری',
            question: 'برای 206 تیپ 2 که کارکرد بالایی دارد مناسب است؟',
            answer:
              'برای موتور TU3 اگر نشتی یا مصرف روغن دارید، ویسکوزیته 5W-40 انتخاب مطمئنی است و محافظت خوبی ارائه می‌دهد.',
            createdAt: '2024-01-29T14:05:00.000Z',
            votes: 4
          }
        ]
      },
      {
        id: 'prd-3',
        slug: 'mann-filter-w67',
        name: 'فیلتر روغن Mann W67',
        description: 'فیلتر روغن با کیفیت بالا برای جلوگیری از آلودگی و فرسودگی موتور.',
        price: 285000,
        brand: 'MANN-FILTER',
        image: '/images/products/mann-filter.svg',
        categoryId: 'cat-2',
        rating: 4.4,
        inStock: 42,
        tags: ['filter', 'engine'],
        sku: 'ASM-MAN-W67',
        longDescription:
          'فیلتر روغن Mann W67 از کاغذ سلولزی چندلایه با ظرفیت جذب آلودگی بالا بهره می‌برد و برای موتورهای خانواده TU و XU PSA مناسب است.',
        highlights: [
          'بازده فیلتراسیون 99٪ برای ذرات 10 میکرون',
          'دارای سوپاپ اطمینان و ضدبازگشت برای استارت سرد بهتر',
          'گسکت سیلیکونی مقاوم در برابر دما',
          'ساخت آلمان با کنترل کیفیت دقیق'
        ],
        gallery: [
          { src: '/images/products/mann-filter.svg', alt: 'فیلتر روغن Mann W67' },
          { src: '/images/products/placeholder.svg', alt: 'نمای نزدیک توری فیلتر Mann' }
        ],
        specifications: [
          { label: 'ارتفاع', value: '76 میلی‌متر' },
          { label: 'قطر رزوه', value: 'M20x1.5' },
          { label: 'فشار کارکرد', value: 'حداکثر 20 بار' },
          { label: 'کشور سازنده', value: 'آلمان' }
        ],
        compatibility: [
          'پژو 206، 207، 405 و پارس با موتور TU5',
          'رنو مگان 1600 و ال 90',
          'برخی مدل‌های هیوندای و کیا با موتور 1.6 لیتری'
        ],
        warranty: 'گارانتی اصالت فیزیکی و عملکرد 5000 کیلومتر',
        shipping: 'ارسال اقتصادی در بسته‌بندی محافظت‌شده',
        maintenanceTips: [
          'قبل از نصب، مقدار کمی روغن تمیز روی واشر بمالید.',
          'پس از تعویض، موتور را روشن کرده و برای نشتی بررسی کنید.',
          'فیلتر را هر بار با تعویض روغن جایگزین کنید.'
        ],
        faqs: [
          {
            question: 'با روغن‌های نیمه سنتتیک هم سازگار است؟',
            answer: 'بله، مدیا و واشرهای فیلتر برای هر نوع روغن موتور سازگار هستند.'
          }
        ],
        questions: [
          {
            id: 'qa-4',
            author: 'شایان رضوی',
            question: 'آیا برای رانا با موتور TU5 هم مناسب است؟',
            answer: 'بله، کد W67 دقیقاً با پایه فیلتر موتور TU5 تطابق دارد.',
            createdAt: '2024-02-01T12:12:00.000Z',
            votes: 6
          }
        ]
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
        tags: ['care', 'detail'],
        sku: 'ASM-ACR-INTKIT',
        longDescription:
          'کیت نظافت حرفه‌ای شامل پاک‌کننده چندمنظوره، محافظ داشبورد، اسپری ضدعفونی‌کننده و دو دستمال مایکروفایبر است تا کابین خودرو همیشه مانند روز اول بدرخشد.',
        highlights: [
          'فاقد سیلیکون و مناسب برای نمایشگرها و قطعات حساس',
          'ایجاد لایه محافظ در برابر UV روی داشبورد',
          'دارای عطر ملایم مرکباتی',
          'طراحی شده برای 12 سرویس کامل خودرو'
        ],
        gallery: [
          { src: '/images/products/interior-kit.svg', alt: 'کیت نظافت داخلی خودرو AutoCare' },
          { src: '/images/products/placeholder.svg', alt: 'محتویات کیت نظافت کابین' }
        ],
        specifications: [
          { label: 'تعداد اقلام', value: '4 عدد' },
          { label: 'کاربرد', value: 'تمیزکننده، محافظ و ضدعفونی‌کننده' },
          { label: 'کشور سازنده', value: 'ایران' },
          { label: 'مناسب برای', value: 'پلاستیک، چرم مصنوعی و قطعات فلزی داخل کابین' }
        ],
        compatibility: ['تمام خودروهای سواری و شاسی‌بلند', 'مناسب برای دیتیلینگ خانگی و کارواش حرفه‌ای'],
        warranty: 'ضمانت کیفیت 30 روزه و امکان بازگشت در صورت رضایت نداشتن',
        shipping: 'ارسال در بسته‌بندی ضد نشت همراه با بروشور فارسی',
        maintenanceTips: [
          'قبل از استفاده سطح را با دستمال خشک پاک کنید.',
          'محصول محافظ داشبورد را روی پارچه اسپری و سپس استفاده کنید.',
          'برای قطعات چرم طبیعی ابتدا در بخش کوچک تست بگیرید.'
        ],
        faqs: [
          {
            question: 'آیا برای صندلی چرمی مناسب است؟',
            answer: 'بله، تنها کافیست ابتدا در قسمت کوچکی تست کنید تا از سازگاری روکش مطمئن شوید.'
          }
        ],
        questions: [
          {
            id: 'qa-5',
            author: 'الهام مرادی',
            question: 'آیا این کیت شامل بوی خوشبوکننده هم هست؟',
            answer: 'خیر، اما اسپری ضدعفونی‌کننده دارای رایحه ملایم است و می‌توانید خوشبوکننده دلخواه جداگانه تهیه کنید.',
            createdAt: '2024-01-11T09:40:00.000Z',
            votes: 2
          }
        ]
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
        tags: ['accessory', 'battery'],
        sku: 'ASM-XPW-JUMP12',
        longDescription:
          'جامپ استارتر XPower با گیره‌های هوشمند و محافظت چندمرحله‌ای، امکان راه‌اندازی خودرو را در کمتر از 5 ثانیه فراهم می‌کند و به‌عنوان پاوربانک قدرتمند نیز کاربرد دارد.',
        highlights: [
          'قابلیت روشن کردن موتورهای تا حجم 4 لیتر بنزینی و 2.5 لیتر دیزلی',
          'دارای چراغ قوه سه حالته و حالت SOS',
          'درگاه USB-C با توان 45 وات برای شارژ سریع',
          'نمایشگر دیجیتال میزان باتری باقی‌مانده'
        ],
        gallery: [
          { src: '/images/products/jump-starter.svg', alt: 'جامپ استارتر هوشمند XPower' },
          { src: '/images/products/placeholder.svg', alt: 'نمایشگر دیجیتال جامپ استارتر' }
        ],
        specifications: [
          { label: 'ظرفیت باتری', value: '12000 میلی‌آمپر ساعت' },
          { label: 'جریان خروجی', value: 'اوج 800 آمپر' },
          { label: 'نوع درگاه', value: 'USB-C و USB-A' },
          { label: 'زمان شارژ', value: 'کمتر از 3 ساعت با شارژر سریع' }
        ],
        compatibility: [
          'تمام خودروهای سواری و کراس‌اوور با باتری 12 ولت',
          'موتورسیکلت، قایق و تجهیزات 12 ولتی',
          'شارژ اضطراری برای لپ‌تاپ و موبایل'
        ],
        warranty: 'گارانتی یک‌ساله تعویض Auto Service Mani',
        shipping: 'ارسال رایگان برای سفارش‌های بالای 2 میلیون تومان',
        maintenanceTips: [
          'ماهانه یک‌بار دستگاه را شارژ کامل کنید.',
          'در دمای کمتر از منفی 20 درجه نگهداری نشود.',
          'پس از هر استفاده کابل‌ها را تمیز و خشک کنید.'
        ],
        faqs: [
          {
            question: 'چند بار می‌توانم با یک شارژ کامل خودرو را روشن کنم؟',
            answer: 'برای موتور 1.8 لیتری، با شارژ کامل تا 20 بار امکان استارت وجود دارد.'
          }
        ],
        questions: [
          {
            id: 'qa-6',
            author: 'محمد اسدی',
            question: 'آیا برای خودروهای برقی هم کاربرد دارد؟',
            answer: 'این محصول برای خودروهای تمام‌برقی طراحی نشده و مخصوص سیستم‌های 12 ولتی است.',
            createdAt: '2024-02-05T17:25:00.000Z',
            votes: 1
          }
        ]
      },
      {
        id: 'prd-6',
        slug: 'castrol-magnatec-10w40',
        name: 'روغن موتور کاسترول مگناتک 10W-40',
        description: 'فرمول نیمه‌سنتتیک با مولکول‌های هوشمند برای محافظت مداوم از موتور.',
        price: 980000,
        brand: 'Castrol',
        image: '/images/products/placeholder.svg',
        categoryId: 'cat-1',
        rating: 4.5,
        inStock: 35,
        tags: ['10w40', 'semi-synthetic'],
        sku: 'ASM-CST-10W40',
        longDescription:
          'مگناتک با مولکول‌های هوشمند به قطعات فلزی می‌چسبد تا در لحظه استارت سرد از سایش جلوگیری کند. گزینه‌ای مطمئن برای خودروهای داخلی و اروپایی قدیمی‌تر.',
        highlights: [
          'محافظت فعال تا 50٪ سایش کمتر در استارت سرد',
          'ترکیب نیمه‌سنتتیک مناسب برای کارکردهای بالا',
          'سازگار با موتورهای دارای توربو قدیمی',
          'فرمول جدید با کاهش مصرف روغن'
        ],
        gallery: [{ src: '/images/products/placeholder.svg', alt: 'روغن موتور کاسترول مگناتک 10W-40' }],
        specifications: [
          { label: 'ویسکوزیته', value: '10W-40' },
          { label: 'نوع پایه', value: 'نیمه‌سنتتیک' },
          { label: 'حجم', value: '4 لیتر' },
          { label: 'استانداردها', value: 'API SN، ACEA A3/B4' }
        ],
        compatibility: [
          'موتورهای 8 و 16 سوپاپ داخلی',
          'خودروهای قدیمی اروپایی با کارکرد بالاتر',
          'موتورهای نیازمند روغن با ویسکوزیته بالاتر در هوای گرم'
        ],
        warranty: 'اصالت کالا و امکان بازگشت تا 7 روز',
        shipping: 'ارسال اقتصادی و امکان انتخاب زمان تحویل',
        maintenanceTips: [
          'برای خودروهای با کارکرد بالا هر 6 هزار کیلومتر تعویض شود.',
          'در صورت مصرف روغن، سطح را هر دو هفته بررسی کنید.',
          'فیلتر روغن مناسب را همراه سفارش انتخاب کنید.'
        ],
        faqs: [
          {
            question: 'برای سمند EF7 پیشنهاد می‌کنید؟',
            answer: 'برای EF7 ویسکوزیته 10W-40 تنها در مناطق بسیار گرم توصیه می‌شود؛ در غیر این صورت 5W-40 بهتر است.'
          }
        ],
        questions: []
      }
    ],
    services: [],
    reviews: [
      {
        id: 'rev-1',
        productId: 'prd-1',
        author: 'علی رستمی',
        rating: 5,
        comment: 'کیفیت روغن فوق‌العاده‌ست و صدای موتور رو کاملاً کم کرده.',
        createdAt: '2024-02-14T09:10:00.000Z'
      },
      {
        id: 'rev-2',
        productId: 'prd-2',
        author: 'مریم عباسی',
        rating: 4,
        comment: 'ارسال سریع بود و بسته‌بندی مناسبی داشت.',
        createdAt: '2024-01-22T15:32:00.000Z'
      },
      {
        id: 'rev-3',
        productId: 'prd-5',
        author: 'بهزاد کاظمی',
        rating: 5,
        comment: 'جامپ استارتر چند بار من رو از خاموشی وسط راه نجات داده، خیلی کاربردیه.',
        createdAt: '2023-12-18T19:05:00.000Z'
      },
      {
        id: 'rev-4',
        productId: 'prd-3',
        author: 'نیما فراهانی',
        rating: 4,
        comment: 'برای پژو 207 نصب کردم و کاملاً اندازه بود.',
        createdAt: '2024-02-02T11:44:00.000Z'
      },
      {
        id: 'rev-5',
        productId: 'prd-1',
        author: 'شقایق کرمی',
        rating: 5,
        comment: 'بعد از استفاده مصرف سوخت کمتر شد و موتور نرم‌تر کار می‌کنه.',
        createdAt: '2024-03-01T18:12:00.000Z'
      }
    ],
    orders: [],
    brands: [
      {
        id: 'brand-shell',
        name: 'Shell',
        logo: '/images/brands/shell.svg',
        country: 'هلند',
        founded: 1907,
        tagline: 'Technology that powers every journey'
      },
      {
        id: 'brand-total',
        name: 'TotalEnergies',
        logo: '/images/brands/total.svg',
        country: 'فرانسه',
        founded: 1924,
        tagline: 'Performance under every condition'
      },
      {
        id: 'brand-castrol',
        name: 'Castrol',
        logo: '/images/brands/castrol.svg',
        country: 'انگلستان',
        founded: 1899,
        tagline: 'It’s more than just oil. It’s liquid engineering.'
      },
      {
        id: 'brand-mann',
        name: 'MANN-FILTER',
        logo: '/images/brands/mann.svg',
        country: 'آلمان',
        founded: 1941,
        tagline: 'Perfect parts. Perfect service.'
      },
      {
        id: 'brand-bosch',
        name: 'Bosch',
        logo: '/images/brands/bosch.svg',
        country: 'آلمان',
        founded: 1886,
        tagline: 'Invented for life'
      },
      {
        id: 'brand-mobil',
        name: 'Mobil 1',
        logo: '/images/brands/mobil.svg',
        country: 'ایالات متحده',
        founded: 1974,
        tagline: 'Keeps engines running like new'
      },
      {
        id: 'brand-ngk',
        name: 'NGK',
        logo: '/images/brands/ngk.svg',
        country: 'ژاپن',
        founded: 1936,
        tagline: 'The ignition specialist'
      },
      {
        id: 'brand-autocare',
        name: 'AutoCare',
        logo: '/images/brands/autocare.svg',
        country: 'ایران',
        founded: 2012,
        tagline: 'Premium detailing solutions'
      }
    ],
    userDashboard: {
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
    },
    aiSessions: []
  };
}

export const dataStore = globalStore.__autoServiceData!;

export function listCategories() {
  return dataStore.categories;
}

export function listFeaturedCategories() {
  return dataStore.categories.filter((category) => category.featured);
}

export function listBrands() {
  return dataStore.brands;
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

export function listProductFaqs(productId: string) {
  const product = findProductBySlug(productId);
  return product?.faqs ?? [];
}

export function listProductQuestions(productId: string) {
  const product = findProductBySlug(productId);
  return product?.questions ?? [];
}

export function addProductQuestion(productId: string, question: string, author: string) {
  const product = findProductBySlug(productId);
  if (!product) return null;
  const newQuestion = {
    id: `qa-${Date.now()}`,
    author,
    question,
    createdAt: new Date().toISOString(),
    votes: 0
  } as Product['questions'][number];
  product.questions.unshift(newQuestion);
  return newQuestion;
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
    dataStore.products[index] = { ...dataStore.products[index], ...product };
    return dataStore.products[index];
  }
  dataStore.products.push(product);
  return product;
}

export function deleteProduct(productId: string) {
  dataStore.products = dataStore.products.filter((product) => product.id !== productId);
}

export function getUserDashboard(): UserDashboard {
  return dataStore.userDashboard;
}

export function listUserNotifications(): UserNotification[] {
  return dataStore.userDashboard.notifications;
}

export function markNotificationAsRead(notificationId: string) {
  const notification = dataStore.userDashboard.notifications.find((item) => item.id === notificationId);
  if (notification) {
    notification.read = true;
  }
  return notification;
}

export function listSupportTickets(): SupportTicket[] {
  return dataStore.userDashboard.tickets;
}

export function addTicketMessage(ticketId: string, message: ChatMessage) {
  const ticket = dataStore.userDashboard.tickets.find((item) => item.id === ticketId);
  if (!ticket) return null;
  ticket.messages.push({
    id: message.id,
    sender: message.role === 'assistant' ? 'agent' : 'user',
    message: message.content,
    createdAt: message.createdAt
  });
  ticket.updatedAt = message.createdAt;
  return ticket;
}

export function listAiSessions() {
  return dataStore.aiSessions;
}

export function getAiSession(sessionId: string) {
  return dataStore.aiSessions.find((session) => session.id === sessionId);
}

export function createAiSession(topic: string) {
  const now = new Date().toISOString();
  const normalizedTopic = topic.trim() || 'مشاوره فنی جدید';
  const sessionId = `ai-${Date.now()}`;
  const welcomeMessage: ChatMessage = {
    id: `${sessionId}-welcome`,
    role: 'assistant',
    content:
      'سلام! من دستیار فنی هوشمند Auto Service Mani هستم. مشکل فنی خودرو، سرویس دوره‌ای یا انتخاب قطعه را بپرس تا راهنمایی تخصصی دریافت کنی.',
    createdAt: now
  };

  const newSession: ChatSession = {
    id: sessionId,
    topic: normalizedTopic,
    lastActive: now,
    satisfaction: 100,
    messages: [welcomeMessage]
  };

  dataStore.aiSessions = [newSession, ...dataStore.aiSessions];
  return newSession;
}

export function appendAiMessage(sessionId: string, message: ChatMessage) {
  const sessionIndex = dataStore.aiSessions.findIndex((session) => session.id === sessionId);
  if (sessionIndex === -1) {
    return null;
  }

  const session = dataStore.aiSessions[sessionIndex];
  session.messages = [...session.messages, message];
  session.lastActive = message.createdAt;

  dataStore.aiSessions.splice(sessionIndex, 1);
  dataStore.aiSessions.unshift(session);

  return session;
}

export function updateAiSession(sessionId: string, updates: Partial<ChatSession>) {
  const sessionIndex = dataStore.aiSessions.findIndex((session) => session.id === sessionId);
  if (sessionIndex === -1) {
    return null;
  }

  const session = { ...dataStore.aiSessions[sessionIndex], ...updates };
  dataStore.aiSessions[sessionIndex] = session;
  dataStore.aiSessions.splice(sessionIndex, 1);
  dataStore.aiSessions.unshift(session);
  return session;
}
