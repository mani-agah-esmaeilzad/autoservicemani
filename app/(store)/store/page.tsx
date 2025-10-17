import ProductExplorer from "@/components/ProductExplorer";

export const metadata = {
  title: "فروشگاه آنلاین اتو سرویس مانی",
  description:
    "مشاهده و خرید اینترنتی تمام محصولات تخصصی نگهداری خودرو",
};

interface StorePageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function StorePage({ searchParams }: StorePageProps) {
  // ✅ dynamic import برای جلوگیری از ارور build
  const { listProducts, listCategories } = await import("@/lib/data");

  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  const initialQuery =
    typeof searchParams?.query === "string" ? searchParams.query : "";

  return (
    <div className="section">
      <div className="container store-container">
        <header className="store-header">
          <div>
            <span className="badge">فروشگاه آنلاین</span>
            <h1>مارکت تخصصی قطعات و مصرفی خودرو</h1>
          </div>
          <p>
            مجموعه کامل روغن‌ها، فیلترها و لوازم جانبی با امکان ارسال فوری،
            مشاوره فنی و ضمانت اصالت کالا.
          </p>
        </header>
        <ProductExplorer
          products={products}
          categories={categories}
          initialQuery={initialQuery}
        />
      </div>
    </div>
  );
}
