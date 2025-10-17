
export default async function AdminOrdersPage() {
  const { listOrders } = await import('@/lib/data'); 
  const orders = await listOrders();

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>مدیریت سفارش‌ها</h1>
        <p style={{ color: 'var(--color-muted)' }}>پیگیری وضعیت سفارش‌های آنلاین و خدمات حضوری</p>
      </header>

      {orders.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>کد سفارش</th>
              <th>مشتری</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>مبلغ</th>
              <th>اقلام</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
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
                <td>
                  <ul style={{ margin: 0, paddingInlineStart: '1.25rem', color: 'var(--color-muted)' }}>
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        {item.productId} × {item.quantity} = {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="card">هیچ سفارشی ثبت نشده است.</div>
      )}
    </div>
  );
}
