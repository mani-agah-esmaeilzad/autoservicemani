import { getUserDashboard } from '@/lib/data';

export default function AccountPage() {
  const dashboard = getUserDashboard();
  const { profile, orders, notifications, tickets } = dashboard;

  return (
    <div className="section">
      <div className="container account-page">
        <header className="account-page__header">
          <div>
            <span className="badge">حساب کاربری من</span>
            <h1>خوش آمدید، {profile.name}</h1>
            <p>مدیریت سفارش‌ها، نوتیفیکیشن‌ها و ارتباط مستقیم با تیم پشتیبانی Auto Service Mani.</p>
          </div>
          <div className="account-page__membership">
            <span>{profile.membershipTier}</span>
            <strong>{profile.loyaltyPoints.toLocaleString('fa-IR')} امتیاز</strong>
          </div>
        </header>

        <section className="card account-overview">
          <div>
            <h2>اطلاعات تماس</h2>
            <p>{profile.email}</p>
            <p>{profile.phone}</p>
          </div>
          <div>
            <h2>خودروی ترجیحی</h2>
            <p>{profile.preferredVehicle}</p>
            <small>عضویت از {new Date(profile.joinDate).toLocaleDateString('fa-IR')}</small>
          </div>
          <div>
            <h2>آدرس اصلی</h2>
            <p>{profile.defaultAddress}</p>
          </div>
        </section>

        <section className="card account-orders">
          <header>
            <h2>سفارش‌های اخیر</h2>
            <span>{orders.length} سفارش</span>
          </header>
          <table className="table">
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
                  <td>
                    <span className={`status-pill ${order.status.includes('تکمیل') ? 'completed' : order.status.includes('لغو') ? 'cancelled' : 'waiting'}`}>
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

        <section className="card account-notifications">
          <header>
            <h2>نوتیفیکیشن‌ها</h2>
            <span>وضعیت ارسال‌ها و پیشنهادها</span>
          </header>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className={notification.read ? 'is-read' : ''}>
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                </div>
                <span>{new Date(notification.createdAt).toLocaleDateString('fa-IR')}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card account-tickets">
          <header>
            <h2>تیکت‌های پشتیبانی</h2>
            <span>پیگیری مکاتبات با تیم فنی</span>
          </header>
          <div className="account-tickets__list">
            {tickets.map((ticket) => (
              <article key={ticket.id}>
                <div className="account-tickets__meta">
                  <strong>{ticket.subject}</strong>
                  <span className={`priority priority--${ticket.priority}`}>{ticket.priority}</span>
                </div>
                <p>وضعیت: {ticket.status}</p>
                <small>
                  آخرین بروزرسانی: {new Date(ticket.updatedAt).toLocaleDateString('fa-IR')} • ایجاد شده در {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
                </small>
                <div className="account-tickets__messages">
                  {ticket.messages.map((message) => (
                    <div key={message.id} className={`account-tickets__message account-tickets__message--${message.sender}`}>
                      <span>{message.sender === 'user' ? 'شما' : 'کارشناس'}</span>
                      <p>{message.message}</p>
                      <small>{new Date(message.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
