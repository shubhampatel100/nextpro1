'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS, formatPrice, STORE_COLORS } from '@/lib/data';

const LENS_CATEGORIES = [
  { icon: '💻', label: 'Electronics', count: 42 },
  { icon: '💄', label: 'Bath & Beauty', count: 38 },
  { icon: '💊', label: 'Diet & Supplements', count: 27 },
  { icon: '🐾', label: 'Pet Supplies', count: 19 },
  { icon: '📱', label: 'Smartphones', count: 56 },
  { icon: '🎧', label: 'Audio', count: 34 },
  { icon: '👟', label: 'Footwear', count: 45 },
  { icon: '🍳', label: 'Kitchen', count: 31 },
];

/* Simulated AI insights for products */
function getInsights(product) {
  const verdicts = [
    { score: 92, label: 'Excellent Value', color: '#16A34A' },
    { score: 85, label: 'Great Choice', color: '#16A34A' },
    { score: 78, label: 'Good Buy', color: '#F59E0B' },
    { score: 65, label: 'Average Deal', color: '#F59E0B' },
  ];
  const v = verdicts[product.id % verdicts.length];
  const pros = [
    'Great price compared to competitors',
    'High customer satisfaction rating',
    `${product.discount}% below MRP — genuine discount`,
    'Trusted seller with fast delivery',
  ];
  const cons = [
    'Price has been lower in the past',
    'Limited color/variant options',
    'May find better deals during sales',
  ];
  return { verdict: v, pros: pros.slice(0, 3), cons: cons.slice(0, 2) };
}

function StarRating({ val = 4.5 }) {
  return (
    <span className="stars" style={{ fontSize: 12 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: '#F59E0B' }}>{i <= Math.floor(val) ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

function InsightCard({ product }) {
  const { verdict, pros, cons } = getInsights(product);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="lens-card">
      <div className="lens-card-top">
        <div className="lens-card-img">
          <span>{product.emoji}</span>
        </div>
        <div className="lens-card-info">
          <Link href={`/product/${product.id}`} className="lens-card-name">{product.name}</Link>
          <div className="lens-card-rating">
            <StarRating val={product.rating} />
            <span>{product.rating}</span>
            <span className="lens-card-reviews">({product.reviews.toLocaleString('en-IN')})</span>
          </div>
          <div className="lens-card-prices">
            <span className="lens-card-price">{formatPrice(product.price)}</span>
            <span className="lens-card-mrp">{formatPrice(product.mrp)}</span>
            <span className="lens-card-disc">{product.discount}% off</span>
          </div>
        </div>
      </div>

      {/* AI Verdict */}
      <div className="lens-verdict" style={{ borderLeftColor: verdict.color }}>
        <div className="lens-verdict-head">
          <span className="lens-ai-badge">✨ AI LENS</span>
          <span className="lens-score" style={{ color: verdict.color }}>{verdict.score}/100</span>
        </div>
        <div className="lens-verdict-label" style={{ color: verdict.color }}>{verdict.label}</div>
        <p className="lens-verdict-desc">{product.desc}</p>
      </div>

      {/* Pros & Cons */}
      {expanded && (
        <div className="lens-proscons animate-fade">
          <div className="lens-pros">
            <div className="lens-pc-title">✅ Pros</div>
            {pros.map((p, i) => <div key={i} className="lens-pc-item pro">{p}</div>)}
          </div>
          <div className="lens-cons">
            <div className="lens-pc-title">⚠️ Cons</div>
            {cons.map((c, i) => <div key={i} className="lens-pc-item con">{c}</div>)}
          </div>
        </div>
      )}

      <div className="lens-card-actions">
        <button className="lens-expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Less Details ↑' : 'AI Analysis ↓'}
        </button>
        <Link href={`/product/${product.id}`} className="lens-view-btn">View Product →</Link>
      </div>
    </div>
  );
}

export default function LensPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCat === 'All' || p.category.toLowerCase().includes(activeCat.toLowerCase());
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <div className="lens-page">
        {/* Hero */}
        <div className="lens-hero">
          <div className="lens-hero-glow" />
          <div className="lens-hero-badge">✨ AI POWERED</div>
          <h1>Product Lens</h1>
          <p>AI insights, ratings, reviews & everything you need to know before you buy</p>
          <div className="lens-search-bar">
            <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search any product for AI insights..."
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="lens-cats">
          <div className="lens-cats-title">
            <h2>Browse Categories</h2>
            <p>Get AI-powered insights for any category</p>
          </div>
          <div className="lens-cats-grid">
            <div
              className={`lens-cat-chip${activeCat === 'All' ? ' on' : ''}`}
              onClick={() => setActiveCat('All')}
            >
              <span className="lens-cat-chip-icon">🔥</span>
              <span>All</span>
            </div>
            {LENS_CATEGORIES.map(c => (
              <div
                key={c.label}
                className={`lens-cat-chip${activeCat === c.label ? ' on' : ''}`}
                onClick={() => setActiveCat(c.label)}
              >
                <span className="lens-cat-chip-icon">{c.icon}</span>
                <span>{c.label}</span>
                <span className="lens-cat-count">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="lens-features">
          {[
            { icon: '🧠', title: 'Smart Review Summary', desc: 'AI analyzes thousands of reviews to give you the real picture' },
            { icon: '📊', title: 'Price Intelligence', desc: 'Know if the current price is genuine or inflated' },
            { icon: '⚖️', title: 'Pros & Cons', desc: 'Instant breakdown of what\'s great and what\'s not' },
            { icon: '🎯', title: 'Buy Recommendation', desc: 'Get a score-based verdict on whether to buy now or wait' },
          ].map(f => (
            <div key={f.title} className="lens-feat-card">
              <span className="lens-feat-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Product Insights */}
        <div className="lens-results">
          <div className="lens-results-head">
            <h2>Product Insights</h2>
            <span className="lens-results-count">{filtered.length} products analyzed</span>
          </div>
          <div className="lens-results-grid">
            {filtered.map(p => <InsightCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && (
            <div className="lens-empty">
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3>No products found</h3>
              <p>Try a different search term or category</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
