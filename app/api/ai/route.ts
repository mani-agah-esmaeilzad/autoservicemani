import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { listBrands, listProducts, listServices } from '@/lib/data';

interface AiRequestBody {
  message?: string;
  history?: Array<{ role: string; content: string }>;
}

const FALLBACK_RESPONSES = [
  'برای انتخاب روغن مناسب حتما به دفترچه خودرو مراجعه کنید و در کنار آن به ویسکوزیته و تاییدیه‌های خودروساز توجه کنید.',
  'در صورت مشاهده افت سطح روغن، ابتدا نشتی‌ها را بررسی کنید و سپس فیلتر و تنفس موتور را کنترل نمایید.',
  'به خاطر داشته باشید که فیلتر مرغوب و تعویض به‌موقع آن به اندازه انتخاب روغن مناسب اهمیت دارد.'
];

async function buildFallbackAnswer(message: string) {
  const normalized = message.toLowerCase();
  const [products, services, brands] = await Promise.all([
    listProducts(),
    listServices(),
    listBrands()
  ]);

  if (normalized.includes('روغن') || normalized.includes('oil')) {
    const recommended = products
      .filter((product) => product.categoryId === 'cat-1')
      .slice(0, 3)
      .map(
        (product) =>
          `• ${product.name} (${product.brand}) — ویسکوزیته ${
            product.specifications.find((spec) => spec.label.includes('ویسکوزیته'))?.value ?? 'مشخص نشده'
          }, موجودی ${product.inStock} عدد`
      )
      .join('\n');

    return `با توجه به دیتابیس داخلی ما، سه گزینه پرفروش برای روغن موتور عبارت‌اند از:\n${recommended}\nبرای انتخاب نهایی حتما تاییدیه دفترچه خودرو را نیز بررسی کنید.`;
  }

  if (normalized.includes('فیلتر') || normalized.includes('filter')) {
    const filterProducts = products.filter((product) => product.categoryId === 'cat-2');
    return `برای فیلتر باکیفیت، برندهایی مانند ${filterProducts.map((item) => item.brand).join('، ')} پیشنهاد می‌شوند. هنگام نصب، اورینگ را با روغن تمیز آغشته کنید و پس از استارت، نشتی را بررسی نمایید.`;
  }

  if (normalized.includes('سرویس') || normalized.includes('service') || normalized.includes('پک')) {
    if (services.length > 0) {
      return `برای کامل کردن سبد خرید می‌توانید از پک‌های پیشنهادی ما استفاده کنید: ${services
        .map((service) => `${service.name} (${service.duration})`)
        .join('، ')}. هر پک شامل ترکیب هماهنگ روغن و فیلتر است.`;
    }
    return 'در حال حاضر پک آماده‌ای ثبت نشده است. می‌توانید با انتخاب روغن و فیلتر از فروشگاه سبد خود را بسازید.';
  }

  if (normalized.includes('برند') || normalized.includes('brand')) {
    return `در حال حاضر با برندهای معتبر ${brands.map((brand) => brand.name).join('، ')} همکاری داریم و تمامی کالاها با ضمانت اصالت عرضه می‌شوند.`;
  }

  const randomFallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  return `${randomFallback}\nاگر سوال دقیق‌تری دارید لطفاً جزئیات خودرو (مدل، سال ساخت، کارکرد) را اعلام کنید.`;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AiRequestBody;
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ error: 'پیام کاربر دریافت نشد.' }, { status: 400 });
  }

  const apiKey = process.env.ASM_ASSISTANT_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction:
          'شما دستیار هوشمند مانی اویل هستید. همیشه به فارسی پاسخ دهید و توصیه‌های ایمن و قابل اجرا برای انتخاب روغن، فیلتر و افزودنی ارائه کنید. در صورت نیاز مشتری را به کارشناسان انسانی ارجاع دهید.'
      });

      const historyEntries = (body.history ?? []).map((entry) => ({
        role: entry.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: entry.content }]
      }));

      const contents = [
        ...historyEntries,
        {
          role: 'user' as const,
          parts: [{ text: message }]
        }
      ];

      const result = await model.generateContent({ contents });
      const text = result.response?.text()?.trim();

      if (text) {
        return NextResponse.json({ reply: text });
      }
    } catch (error) {
      console.error('Intelligent assistant request failed:', error);
    }
  }

  const fallback = await buildFallbackAnswer(message);
  return NextResponse.json({ reply: fallback });
}
