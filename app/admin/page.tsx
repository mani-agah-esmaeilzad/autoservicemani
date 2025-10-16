import { listAiSessions, listOrders, listProducts, listSupportTickets } from '@/lib/data';

export default function AdminDashboardPage() {
  const orders = listOrders();
  const products = listProducts();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const aiSessions = listAiSessions();
  const supportTickets = listSupportTickets();
  const averageSatisfaction =
    aiSessions.length > 0
      ? Math.round(
          aiSessions.reduce((sum, session) => sum + (session.satisfaction || 0), 0) /
            aiSessions.length
        )
      : 0;
  const totalAiMessages = aiSessions.reduce(
    (sum, session) => sum + session.messages.length,
    0
  );

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
        <div className="card">
          <span className="badge">رضایت دستیار هوشمند</span>
          <strong style={{ fontSize: '2rem' }}>{averageSatisfaction}%</strong>
          <p style={{ color: 'var(--color-muted)' }}>میانگین رضایت گفتگوهای Google AI</p>
        </div>
        <div className="card">
          <span className="badge">تیکت‌های باز</span>
          <strong style={{ fontSize: '2rem' }}>
            {supportTickets.filter((ticket) => ticket.status !== 'بسته شده').length}
          </strong>
          <p style={{ color: 'var(--color-muted)' }}>پیگیری‌های فعال مشتریان</p>
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

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <strong>آخرین گفتگوهای دستیار هوشمند</strong>
        {aiSessions.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>موضوع</th>
                <th>آخرین فعالیت</th>
                <th>تعداد پیام</th>
                <th>رضایت</th>
              </tr>
            </thead>
            <tbody>
              {aiSessions.slice(0, 5).map((session) => (
                <tr key={session.id}>
                  <td>{session.topic}</td>
                  <td>{new Date(session.lastActive).toLocaleString('fa-IR')}</td>
                  <td>{session.messages.length}</td>
                  <td>{session.satisfaction}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--color-muted)' }}>
            هنوز تعاملی با دستیار هوشمند ثبت نشده است.
          </p>
        )}
        <small style={{ color: 'var(--color-muted)' }}>
          مجموع پیام‌های رد و بدل شده: {totalAiMessages} پیام
        </small>
      </div>
    </div>
  );
}
