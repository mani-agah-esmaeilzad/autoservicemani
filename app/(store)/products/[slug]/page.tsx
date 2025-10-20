import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCarousel from '@/components/ProductCarousel';
import ProductQuestions from '@/components/ProductQuestions';
import {
  findProductBySlug,
  listBrands,
  listCategories,
  listProducts,
  listProductsByCategory,
  listReviews,
  listServices
} from '@/lib/data';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await findProductBySlug(params.slug);
  return {
    title: product ? `${product.name} | Mani Oil` : 'محصول یافت نشد',
    description: product?.description
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await findProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [reviews, categories, brands, services] = await Promise.all([
    listReviews(product.id),
    listCategories(),
    listBrands(),
    listServices()
  ]);
  const category = categories.find((cat) => cat.id === product.categoryId);
  const brand = brands.find((item) => {
    const brandName = item.name.toLowerCase();
    const productBrand = product.brand.toLowerCase();
    return brandName.includes(productBrand) || productBrand.includes(brandName);
  });
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : product.rating;
  const primaryImage = product.gallery[0] ?? { src: product.image, alt: product.name };
  const relatedPool = category
    ? await listProductsByCategory(category.slug)
    : await listProducts();
  const relatedProducts = relatedPool.filter((item) => item.id !== product.id).slice(0, 8);
  const serviceHighlights = services.slice(0, 3);

  return (
    <div className="section">
      <div className="container product-page">
        <div className="product-page__gallery">
          <div className="product-page__gallery-main">
            <img src={primaryImage.src} alt={primaryImage.alt ?? product.name} />
          </div>
          <div className="product-page__thumbnails">
            {product.gallery.map((item, index) => (
              <div key={`${item.src}-${index}`} className="product-page__thumbnail">
                <img src={item.src} alt={item.alt} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-page__summary">
          <div className="product-page__breadcrumb">
            <span className="badge">{category?.name ?? 'دسته‌بندی'}</span>
            <span>{product.sku}</span>
          </div>
          <h1>{product.name}</h1>
          <p className="product-page__description">{product.longDescription}</p>

          <div className="product-page__meta">
            <span>برند: {product.brand}</span>
            <span>امتیاز کاربران: ⭐ {averageRating.toFixed(1)}</span>
            <span>تعداد نظرات: {reviews.length}</span>
          </div>

          <div className="product-page__assurance">
            <div>
              <strong>تحویل سریع</strong>
              <p>ارسال در کمتر از ۲۴ ساعت در تهران و ۳ روز کاری در سایر شهرها.</p>
            </div>
            <div>
              <strong>ضمانت اصالت</strong>
              <p>تمامی کالاها با گارانتی اصالت و تاریخ تولید جدید عرضه می‌شوند.</p>
            </div>
            <div>
              <strong>راهنمای تخصصی</strong>
              <p>دستیار هوشمند مانی اویل در انتخاب روغن و فیلتر سازگار با خودرو همراه شماست.</p>
            </div>
          </div>

          {brand && (
            <div className="product-page__brand">
              <img src={brand.logo} alt={`لوگوی ${brand.name}`} />
              <div>
                <strong>{brand.name}</strong>
                <span>{brand.tagline}</span>
                <small>
                  تاسیس {brand.founded} • {brand.country}
                </small>
              </div>
            </div>
          )}

          <div className="product-page__highlights">
            <h3>ویژگی‌های شاخص</h3>
            <ul>
              {product.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="product-page__metrics">
            <div>
              <strong>{product.inStock > 0 ? `${product.inStock} عدد` : 'ناموجود'}</strong>
              <span>موجودی فعلی انبار</span>
            </div>
            <div>
              <strong>{product.rating.toFixed(1)}</strong>
              <span>میانگین امتیاز کارشناسان</span>
            </div>
            <div>
              <strong>{product.compatibility.length}</strong>
              <span>مدل‌های تاییدشده سازگاری</span>
            </div>
          </div>

          <div className="product-page__purchase">
            <div>
              <strong className="product-page__price">{product.price.toLocaleString('fa-IR')} تومان</strong>
              <span className={product.inStock > 0 ? 'text-success' : 'text-danger'}>
                {product.inStock > 0 ? `موجودی انبار: ${product.inStock} عدد` : 'ناموجود'}
              </span>
            </div>
            <AddToCartButton product={product} />
          </div>

          <div className="product-page__shipping">
            <div>
              <strong>شرایط ارسال</strong>
              <p>{product.shipping}</p>
            </div>
            <div>
              <strong>گارانتی اصالت</strong>
              <p>{product.warranty}</p>
            </div>
          </div>

          <div className="product-page__cta-grid">
            <Link href="/services" className="product-page__cta">
              <span>مشاهده پک‌های پیشنهادی</span>
              <small>ترکیب‌های آماده شامل روغن، فیلتر و افزودنی</small>
            </Link>
            <Link href="/assistant" className="product-page__cta product-page__cta--ghost">
              <span>گفتگو با دستیار هوشمند</span>
              <small>سوال فنی داری؟ همین حالا بپرس.</small>
            </Link>
          </div>
        </div>
      </div>

      <div className="container product-page__details">
        <section className="card product-specs">
          <h2>مشخصات فنی</h2>
          <table>
            <tbody>
              {product.specifications.map((spec) => (
                <tr key={spec.label}>
                  <th>{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card product-compatibility">
          <h2>سازگاری و کاربرد</h2>
          <ul>
            {product.compatibility.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="card product-maintenance">
          <h2>نکات نگهداری</h2>
          <ul>
            {product.maintenanceTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        {serviceHighlights.length > 0 && (
          <section className="card product-services">
            <h2>پک‌های مکمل پیشنهادی</h2>
            <ul>
              {serviceHighlights.map((service) => (
                <li key={service.id}>
                  <div>
                    <strong>{service.name}</strong>
                    <p>{service.description}</p>
                  </div>
                  <span>
                    {service.price.toLocaleString('fa-IR')} تومان • {service.duration}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="container product-page__sections">
        <section className="card product-reviews">
          <header>
            <div>
              <h2>نظرات مشتریان</h2>
              <p>تجربه مشتریان واقعی از استفاده محصول</p>
            </div>
            <div className="product-reviews__summary">
              <strong>⭐ {averageRating.toFixed(1)}</strong>
              <span>{reviews.length} نظر ثبت شده</span>
            </div>
          </header>
          {reviews.length > 0 ? (
            <div className="product-reviews__list">
              {reviews.map((review) => (
                <article key={review.id} className="product-reviews__item">
                  <div className="product-reviews__item-header">
                    <strong>{review.author}</strong>
                    <span>⭐ {review.rating}</span>
                  </div>
                  <p>{review.comment}</p>
                  <small>{new Date(review.createdAt).toLocaleDateString('fa-IR')}</small>
                </article>
              ))}
            </div>
          ) : (
            <p className="product-reviews__empty">هنوز نظری برای این محصول ثبت نشده است.</p>
          )}
        </section>

        <section className="card product-faqs">
          <h2>سوالات متداول</h2>
          <div className="product-faqs__items">
            {product.faqs.map((faq, index) => (
              <details key={`${faq.question}-${index}`} open={index === 0}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="card product-questions-card">
          <ProductQuestions productId={product.slug} initialQuestions={product.questions} />
        </section>
      </div>

      {relatedProducts.length > 0 && (
        <ProductCarousel
          products={relatedProducts}
          title="کالاهای مکمل این محصول"
          description="گزیده‌ای از محصولات مرتبط برای تکمیل سبد خرید"
        />
      )}
    </div>
  );
}
