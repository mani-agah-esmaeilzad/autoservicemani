import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AddToCartButton from "@/components/AddToCartButton";
import ProductQuestions from "@/components/ProductQuestions";

interface ProductPageProps {
  params: { slug: string };
}
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  // ✅ dynamic import فقط زمان اجرا
  const { findProductBySlug } = await import("@/lib/data");
  const product = await findProductBySlug(params.slug);
  return {
    title: product ? `${product.name} | Auto Service Mani` : "محصول یافت نشد",
    description: product?.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // ✅ تمام ایمپورت‌های سروری باید داخل تابع باشن
  const { findProductBySlug, listBrands, listCategories, listReviews } =
    await import("@/lib/data");

  const product = await findProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [reviews, categories, brands] = await Promise.all([
    listReviews(product.id),
    listCategories(),
    listBrands(),
  ]);

  const category = categories.find((cat) => cat.id === product.categoryId);
  const brand = brands.find((item) => {
    const brandName = item.name.toLowerCase();
    const productBrand = product.brand.toLowerCase();
    return (
      brandName.includes(productBrand) || productBrand.includes(brandName)
    );
  });

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : product.rating;

  const primaryImage = product.gallery[0] ?? {
    src: product.image,
    alt: product.name,
  };

  return (
    <div className="section">
      <div className="container product-page">
        {/* 🖼 گالری */}
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

        {/* 🧾 جزئیات */}
        <div className="product-page__summary">
          <div className="product-page__breadcrumb">
            <span className="badge">{category?.name ?? "دسته‌بندی"}</span>
            <span>{product.sku}</span>
          </div>
          <h1>{product.name}</h1>
          <p className="product-page__description">{product.longDescription}</p>

          <div className="product-page__meta">
            <span>برند: {product.brand}</span>
            <span>امتیاز کاربران: ⭐ {averageRating.toFixed(1)}</span>
            <span>تعداد نظرات: {reviews.length}</span>
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

          <div className="product-page__purchase">
            <div>
              <strong className="product-page__price">
                {product.price.toLocaleString("fa-IR")} تومان
              </strong>
              <span
                className={
                  product.inStock > 0 ? "text-success" : "text-danger"
                }
              >
                {product.inStock > 0
                  ? `موجودی انبار: ${product.inStock} عدد`
                  : "ناموجود"}
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
        </div>
      </div>

      {/* 🔧 مشخصات و جزئیات */}
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
      </div>

      {/* 💬 نظرات و سوالات */}
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
                  <small>
                    {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                  </small>
                </article>
              ))}
            </div>
          ) : (
            <p className="product-reviews__empty">
              هنوز نظری برای این محصول ثبت نشده است.
            </p>
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
          <ProductQuestions
            productId={product.slug}
            initialQuestions={product.questions}
          />
        </section>
      </div>
    </div>
  );
}
