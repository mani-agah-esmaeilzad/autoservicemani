

export default async function AdminCustomersPage() {
  const { getUserDashboard, listOrders } = await import("@/lib/data");

  const [dashboard, orders] = await Promise.all([getUserDashboard(), listOrders()]);

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>مدیریت مشتریان</h1>
        <p style={{ color: 'var(--color-muted)' }}>پایش اطلاعات پروفایل، سفارش‌ها و امتیازات وفاداری کاربران.</p>
      </header>

      <section className="card" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div>
          <span className="badge">کاربر فعال</span>
          <h2>{dashboard.profile.name}</h2>
          <p style={{ color: 'var(--color-muted)' }}>{dashboard.profile.email}</p>
        </div>
        <div>
          <strong style={{ fontSize: '1.8rem' }}>{dashboard.orders.length}</strong>
          <p style={{ color: 'var(--color-muted)' }}>سفارش ثبت شده</p>
        </div>
        <div>
          <strong style={{ fontSize: '1.8rem' }}>{dashboard.profile.loyaltyPoints.toLocaleString('fa-IR')}</strong>
          <p style={{ color: 'var(--color-muted)' }}>امتیاز باشگاه مشتریان</p>
        </div>
      </section>

      <section className="card" style={{ display: 'grid', gap: '1rem' }}>
        <header>
          <h2>جدول سفارشات مشتریان اخیر</h2>
          <span>{orders.length} سفارش کل</span>
        </header>
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ display: 'grid', gap: '1rem' }}>
        <header>
          <h2>آخرین نوتیفیکیشن‌های ارسال شده</h2>
        </header>
        <ul className="admin-notifications">
          {dashboard.notifications.map((notification) => (
            <li key={notification.id}>
              <div>
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
              </div>
              <span>{new Date(notification.createdAt).toLocaleDateString('fa-IR')}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
