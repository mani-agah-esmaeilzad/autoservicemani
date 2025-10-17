export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const { listOrders, listProducts } = await import('@/lib/data');
  const [orders, products] = await Promise.all([listOrders(), listProducts()]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  const topProducts = products.slice(0, 3);

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>گزارش‌ها و تحلیل</h1>
        <p style={{ color: 'var(--color-muted)' }}>تحلیل عملکرد فروش و موجودی</p>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="card">
          <strong>کل درآمد</strong>
          <div style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{revenue.toLocaleString('fa-IR')} تومان</div>
        </div>
        <div className="card">
          <strong>میانگین ارزش سفارش</strong>
          <div style={{ fontSize: '2rem', marginTop: '0.5rem' }}>
            {orders.length > 0 ? Math.round(revenue / orders.length).toLocaleString('fa-IR') : 0} تومان
          </div>
        </div>
        <div className="card">
          <strong>تعداد محصولات فعال</strong>
          <div style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{products.length}</div>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <strong>پرفروش‌ترین محصولات</strong>
        <table className="table">
          <thead>
            <tr>
              <th>نام محصول</th>
              <th>برند</th>
              <th>موجودی فعلی</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.inStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
