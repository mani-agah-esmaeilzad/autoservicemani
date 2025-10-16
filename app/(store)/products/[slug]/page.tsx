import { notFound } from 'next/navigation';
import { findProductBySlug, listCategories, listReviews } from '@/lib/data';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = findProductBySlug(params.slug);
  return {
    title: product ? `${product.name} | Auto Service Mani` : 'محصول یافت نشد',
    description: product?.description
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = findProductBySlug(params.slug);
  const reviews = product ? listReviews(product.id) : [];
  const category = product ? listCategories().find((cat) => cat.id === product.categoryId) : undefined;

  if (!product) {
    notFound();
  }

  return (
    <div className="section">
      <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="card" style={{ background: '#f7f7f9', borderRadius: '24px' }}>
          <img src={product.image} alt={product.name} style={{ maxHeight: '360px', objectFit: 'contain', width: '100%' }} />
        </div>
        <div className="card" style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <span className="badge">{category?.name}</span>
            <h1 style={{ margin: '0.75rem 0' }}>{product.name}</h1>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.9 }}>{product.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <strong style={{ fontSize: '1.5rem' }}>{product.price.toLocaleString('fa-IR')} تومان</strong>
            <span style={{ color: 'var(--color-primary)' }}>موجودی: {product.inStock} عدد</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {product.tags.map((tag) => (
              <span key={tag} className="badge" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--color-accent)' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem', display: 'grid', gap: '1.5rem' }}>
        <div>
          <h2>نظرات مشتریان</h2>
          <p style={{ color: 'var(--color-muted)' }}>تجربه مشتریان واقعی از استفاده محصولات Auto Service Mani</p>
        </div>
        {reviews.length > 0 ? (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {reviews.map((review) => (
              <div key={review.id} className="card" style={{ border: '1px solid #eee', boxShadow: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{review.author}</strong>
                  <span style={{ color: 'var(--color-primary)' }}>⭐ {review.rating}</span>
                </div>
                <p style={{ color: 'var(--color-muted)' }}>{review.comment}</p>
                <span style={{ fontSize: '0.8rem', color: '#9b9da1' }}>{new Date(review.createdAt).toLocaleDateString('fa-IR')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">هنوز نظری برای این محصول ثبت نشده است.</div>
        )}
      </div>
    </div>
  );
}
