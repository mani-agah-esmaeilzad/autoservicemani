import { NextRequest, NextResponse } from 'next/server';
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

function buildFallbackAnswer(message: string) {
  const normalized = message.toLowerCase();
  const products = listProducts();
  const services = listServices();
  const brands = listBrands();

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

  if (normalized.includes('سرویس') || normalized.includes('service')) {
    return `پکیج‌های خدمات حضوری ما شامل: ${services.map((service) => `${service.name} (${service.duration})`).join('، ')} است. می‌توانید از طریق پنل کاربری زمان رزرو را مشخص کنید.`;
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

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...(body.history ?? []).map((item) => ({ role: item.role, parts: [{ text: item.content }] })),
              { role: 'user', parts: [{ text: `${message}\nفقط درباره راهکارهای فنی خودرو پاسخ بده.` }] }
            ]
          })
        }
      );

      const payload = await response.json();
      const reply = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return NextResponse.json({ reply });
      }
    } catch (error) {
      console.error('Google AI request failed:', error);
    }
  }

  const fallback = buildFallbackAnswer(message);
  return NextResponse.json({ reply: fallback });
}
