export default function AccountPage() {
  const orders = [
    { id: 'ord-1024', status: 'در انتظار', total: 2350000, createdAt: '1402/09/21' },
    { id: 'ord-1023', status: 'تکمیل شده', total: 1840000, createdAt: '1402/08/12' }
  ];

  return (
    <div className="section">
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <header>
          <h1>حساب کاربری</h1>
          <p style={{ color: 'var(--color-muted)' }}>مدیریت سفارش‌ها، آدرس‌ها و اطلاعات شخصی</p>
        </header>

        <div className="card" style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <strong>اطلاعات کاربری</strong>
            <p style={{ color: 'var(--color-muted)' }}>علی رضایی | ali@example.com | 09120000000</p>
          </div>
          <div>
            <strong>آدرس پیش‌فرض</strong>
            <p style={{ color: 'var(--color-muted)' }}>تهران، خیابان ستارخان، خیابان خودرو، پلاک 12</p>
          </div>
        </div>

        <div className="card">
          <strong>سفارش‌های اخیر</strong>
          <table className="table" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>کد سفارش</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.status}</td>
                  <td>{order.createdAt}</td>
                  <td>{order.total.toLocaleString('fa-IR')} تومان</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
