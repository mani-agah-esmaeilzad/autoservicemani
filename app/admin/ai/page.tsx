import { listAiSessions } from '@/lib/data';

export default function AdminAiPage() {
  const sessions = listAiSessions();
  const totalMessages = sessions.reduce((sum, session) => sum + session.messages.length, 0);
  const averageSatisfaction =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, session) => sum + (session.satisfaction || 0), 0) /
            sessions.length
        )
      : 0;

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>مدیریت دستیار هوشمند</h1>
        <p style={{ color: 'var(--color-muted)' }}>
          نظارت بر عملکرد گفت‌وگوهای متصل به دستیار هوشمند و رصد رضایت کاربران.
        </p>
      </header>

      <section className="card" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div>
          <span className="badge">تعداد گفتگوها</span>
          <strong style={{ fontSize: '2rem' }}>{sessions.length}</strong>
          <p style={{ color: 'var(--color-muted)' }}>گفتگوهای ثبت‌شده در 30 روز اخیر</p>
        </div>
        <div>
          <span className="badge">میانگین رضایت</span>
          <strong style={{ fontSize: '2rem' }}>{averageSatisfaction}%</strong>
          <p style={{ color: 'var(--color-muted)' }}>بر اساس بازخورد داخلی کاربران</p>
        </div>
        <div>
          <span className="badge">کل پیام‌ها</span>
          <strong style={{ fontSize: '2rem' }}>{totalMessages}</strong>
          <p style={{ color: 'var(--color-muted)' }}>مجموع پیام‌های ارسال و دریافت‌شده</p>
        </div>
      </section>

      <section className="card" style={{ display: 'grid', gap: '1rem' }}>
        <header>
          <h2>جزئیات گفتگوها</h2>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>
            برای تحلیل دقیق‌تر، روی هر موضوع کلیک کنید و تاریخچه کامل را در داشبورد مشتری مشاهده نمایید.
          </p>
        </header>
        {sessions.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>موضوع گفتگو</th>
                <th>آخرین فعالیت</th>
                <th>تعداد پیام‌ها</th>
                <th>رضایت</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
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
          <p style={{ color: 'var(--color-muted)' }}>هنوز گفت‌وگوی فعالی برای نمایش وجود ندارد.</p>
        )}
      </section>

      <section className="card" style={{ display: 'grid', gap: '1rem' }}>
        <header>
          <h2>چک‌لیست راه‌اندازی دستیار هوشمند</h2>
        </header>
        <ul className="ai-admin-checklist">
          <li>تنظیم متغیر ASM_ASSISTANT_API_KEY در سرور، محدودسازی دامنه‌های مجاز و تست مدل Gemini 2.0 Flash.</li>
          <li>بازبینی پاسخ‌های نمونه برای اطمینان از تمرکز بر موضوعات فنی خودرو.</li>
          <li>ایجاد اسکریپت مانیتورینگ برای رصد خطاهای اتصال و هشدار خودکار.</li>
          <li>هماهنگی با تیم پشتیبانی برای رسیدگی دستی به گفتگوهای با رضایت پایین‌تر از ۷۰٪.</li>
        </ul>
      </section>
    </div>
  );
}
