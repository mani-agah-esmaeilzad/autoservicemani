import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: { slug: string };
}
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  // ✅ dynamic import برای جلوگیری از ارور build
  const { listCategories } = await import("@/lib/data");
  const categories = await listCategories();
  const category = categories.find((item) => item.slug === params.slug);

  return {
    title: category
      ? `${category.name} | اتو سرویس مانی`
      : "دسته‌بندی فروشگاه",
    description: category?.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // ✅ dynamic import فقط در زمان اجرا، نه در زمان build
  const { listCategories, listProductsByCategory } = await import("@/lib/data");

  const categories = await listCategories();
  const category = categories.find((item) => item.slug === params.slug);
  const products = await listProductsByCategory(params.slug);

  if (!category) {
    return (
      <div className="section">
        <div className="container">
          <h1>دسته‌بندی یافت نشد</h1>
          <p>دسته‌بندی مورد نظر شما در سیستم ثبت نشده است.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ display: "grid", gap: "1.5rem" }}>
        <header style={{ display: "grid", gap: "0.75rem" }}>
          <h1>{category.name}</h1>
          <p style={{ color: "var(--color-muted)", margin: 0 }}>
            {category.description}
          </p>
        </header>
        {products.length > 0 ? (
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card">محصولی در این دسته‌بندی موجود نیست.</div>
        )}
      </div>
    </div>
  );
}
