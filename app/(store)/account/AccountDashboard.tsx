'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { UserDashboard } from '@/lib/types';
export const dynamic = "force-dynamic";

interface AccountDashboardProps {
  dashboard: UserDashboard;
}

export default function AccountDashboard({ dashboard }: AccountDashboardProps) {
  const { isAuthenticated, user } = useAuth();
  const profile = dashboard?.profile;
  const orders = dashboard?.orders ?? [];
  const notifications = dashboard?.notifications ?? [];
  const tickets = dashboard?.tickets ?? [];

  if (!isAuthenticated) {
    return (
      <div className="section">
        <div className="container account-page">
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <span className="badge">حساب کاربری</span>
            <h1>برای مشاهده داشبورد وارد شوید</h1>
            <p style={{ color: 'var(--color-muted)', maxWidth: '36rem', margin: '0 auto' }}>
              با ورود یا ثبت‌نام می‌توانید سفارش‌ها، تیکت‌های پشتیبانی و گفتگوهای دستیار هوشمند اتو سرویس مانی را در یک صفحه دنبال کنید.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <Link href="/login" className="btn btn-primary">
                ورود به حساب
              </Link>
              <Link href="/register" className="btn btn-ghost">
                ایجاد حساب جدید
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.name || profile?.name || 'کاربر ثبت‌نام شده';
  const membershipTier = profile?.membershipTier || 'سطح پایه';
  const loyaltyPoints = profile?.loyaltyPoints ?? 0;
  const preferredVehicle = profile?.preferredVehicle || 'ثبت نشده';
  const defaultAddress = profile?.defaultAddress || 'ثبت نشده';
  const joinDate = profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString('fa-IR') : 'ثبت نشده';
  const email = user?.email || profile?.email || '---';
  const phone = user?.phone || profile?.phone || '---';

  return (
    <div className="section">
      <div className="container account-page">
        <header className="account-page__header">
          <div>
            <span className="badge">حساب کاربری من</span>
            <h1>خوش آمدید، {displayName}</h1>
            <p>
              مدیریت سفارش‌ها، نوتیفیکیشن‌ها و ارتباط مستقیم با تیم پشتیبانی Auto Service Mani.
            </p>
          </div>
          <div className="account-page__membership">
            <span>{membershipTier}</span>
            <strong>{loyaltyPoints.toLocaleString('fa-IR')} امتیاز</strong>
          </div>
        </header>

        <section className="card account-overview">
          <div>
            <h2>اطلاعات تماس</h2>
            <p>{email}</p>
            <p>{phone}</p>
          </div>
          <div>
            <h2>خودروی ترجیحی</h2>
            <p>{preferredVehicle}</p>
            <small>عضویت از {joinDate}</small>
          </div>
          <div>
            <h2>آدرس اصلی</h2>
            <p>{defaultAddress}</p>
          </div>
        </section>

        <section className="card account-orders">
          <header>
            <h2>سفارش‌های اخیر</h2>
            <span>{orders.length} سفارش</span>
          </header>
          {orders.length > 0 ? (
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
                      <span
                        className={`status-pill ${
                          order.status.includes('تکمیل') ? 'completed' : order.status.includes('لغو') ? 'cancelled' : 'waiting'
                        }`}
                      >
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
        </section>

        <section className="card account-notifications">
          <header>
            <h2>نوتیفیکیشن‌ها</h2>
            <span>آخرین اطلاع‌رسانی‌های فروشگاه</span>
          </header>
          {notifications.length > 0 ? (
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
          ) : (
            <p style={{ color: 'var(--color-muted)' }}>اعلان جدیدی ثبت نشده است.</p>
          )}
        </section>

        <section className="card account-tickets">
          <header>
            <h2>تیکت‌های پشتیبانی</h2>
            <span>پیگیری مکاتبات با تیم فنی</span>
          </header>
          {tickets.length > 0 ? (
            <div className="account-tickets__list">
              {tickets.map((ticket) => (
                <article key={ticket.id}>
                  <div className="account-tickets__meta">
                    <strong>{ticket.subject}</strong>
                    <span className={`priority priority--${ticket.priority}`}>{ticket.priority}</span>
                  </div>
                  <p>وضعیت: {ticket.status}</p>
                  <small>
                    آخرین بروزرسانی: {new Date(ticket.updatedAt).toLocaleDateString('fa-IR')} • ایجاد شده در{' '}
                    {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
                  </small>
                  <div className="account-tickets__messages">
                    {ticket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`account-tickets__message account-tickets__message--${message.sender}`}
                      >
                        <span>{message.sender === 'user' ? 'شما' : 'کارشناس'}</span>
                        <p>{message.message}</p>
                        <small>
                          {new Date(message.createdAt).toLocaleTimeString('fa-IR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-muted)' }}>پیامی برای پشتیبانی ثبت نشده است.</p>
          )}
        </section>
      </div>
    </div>
  );
}
