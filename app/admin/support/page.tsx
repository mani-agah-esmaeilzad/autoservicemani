
export default async function AdminSupportPage() {
  const { listSupportTickets } = await import("@/lib/data");

  const tickets = await listSupportTickets();

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>پشتیبانی و تیکت‌ها</h1>
        <p style={{ color: 'var(--color-muted)' }}>نظارت بر درخواست‌های مشتریان و وضعیت پاسخگویی تیم فنی.</p>
      </header>

      <section className="card" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div>
          <span className="badge">تیکت فعال</span>
          <strong style={{ fontSize: '2rem' }}>{tickets.filter((ticket) => ticket.status !== 'بسته شده').length}</strong>
        </div>
        <div>
          <span className="badge">تیکت بسته شده</span>
          <strong style={{ fontSize: '2rem' }}>{tickets.filter((ticket) => ticket.status === 'بسته شده').length}</strong>
        </div>
        <div>
          <span className="badge">میانگین پیام</span>
          <strong style={{ fontSize: '2rem' }}>
            {(
              tickets.reduce((sum, ticket) => sum + ticket.messages.length, 0) /
              (tickets.length || 1)
            ).toFixed(1)}{' '}
            پیام
          </strong>
        </div>
      </section>

      <section className="card" style={{ display: 'grid', gap: '1rem' }}>
        <header>
          <h2>لیست تیکت‌ها</h2>
        </header>
        <div className="support-tickets">
          {tickets.map((ticket) => (
            <article key={ticket.id} className={`support-ticket support-ticket--${ticket.status.replace(/\s+/g, '-')}`}>
              <div className="support-ticket__header">
                <div>
                  <strong>{ticket.subject}</strong>
                  <span className={`priority priority--${ticket.priority}`}>{ticket.priority}</span>
                </div>
                <span className={`status-pill ${ticket.status === 'بسته شده' ? 'completed' : ticket.status === 'در حال بررسی' ? 'waiting' : 'cancelled'}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="support-ticket__body">
                {ticket.messages.slice(-2).map((message) => (
                  <div key={message.id} className={`support-ticket__message support-ticket__message--${message.sender}`}>
                    <span>{message.sender === 'user' ? 'مشتری' : 'کارشناس'}</span>
                    <p>{message.message}</p>
                    <small>{new Date(message.createdAt).toLocaleString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</small>
                  </div>
                ))}
              </div>
              <footer className="support-ticket__footer">
                <small>ایجاد: {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</small>
                <small>آخرین بروزرسانی: {new Date(ticket.updatedAt).toLocaleDateString('fa-IR')}</small>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
