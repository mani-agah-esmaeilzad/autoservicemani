import { listOrders, listProducts } from '@/lib/data';

export default function AdminDashboardPage() {
  const orders = listOrders();
  const products = listProducts();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>داشبورد مدیریتی</h1>
        <p style={{ color: 'var(--color-muted)' }}>نمای کلی از عملکرد فروشگاه و خدمات</p>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card">
          <span className="badge">سفارشات امروز</span>
          <strong style={{ fontSize: '2rem' }}>{orders.length}</strong>
          <p style={{ color: 'var(--color-muted)' }}>تعداد کل سفارش‌های ثبت شده</p>
        </div>
        <div className="card">
          <span className="badge">درآمد کل</span>
          <strong style={{ fontSize: '2rem' }}>{revenue.toLocaleString('fa-IR')} تومان</strong>
          <p style={{ color: 'var(--color-muted)' }}>مجموع درآمد ثبت شده</p>
        </div>
        <div className="card">
          <span className="badge">تعداد محصولات</span>
          <strong style={{ fontSize: '2rem' }}>{products.length}</strong>
          <p style={{ color: 'var(--color-muted)' }}>محصولات فعال در فروشگاه</p>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <strong>آخرین سفارش‌ها</strong>
        {orders.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>کد سفارش</th>
                <th>مشتری</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>
                    <span className={`status-pill ${order.status === 'تکمیل شده' ? 'completed' : order.status === 'در انتظار' ? 'waiting' : 'cancelled'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
                  <td>{order.total.toLocaleString('fa-IR')} تومان</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--color-muted)' }}>هنوز سفارشی ثبت نشده است.</p>
        )}
      </div>
    </div>
  );
}
