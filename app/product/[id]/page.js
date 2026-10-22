'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS, genHistory, STORE_COLORS, formatPrice } from '@/lib/data';

/* ── Speedometer Gauge (Canvas) ── */
function Gauge({ score = 75 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h - 8, r = h - 16;
    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.lineWidth = 14;
    const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    grad.addColorStop(0, '#EF4444');
    grad.addColorStop(0.4, '#F59E0B');
    grad.addColorStop(1, '#16A34A');
    ctx.strokeStyle = grad;
    ctx.lineCap = 'round';
    ctx.stroke();
    // Needle
    const angle = Math.PI + (score / 100) * Math.PI;
    const nx = cx + (r - 6) * Math.cos(angle);
    const ny = cy + (r - 6) * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1F2937';
    ctx.lineCap = 'round';
    ctx.stroke();
    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#1F2937';
    ctx.fill();
    // Labels
    ctx.font = '9px Inter, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'center';
    ctx.fillText('0', cx - r + 4, cy + 14);
    ctx.fillText('100', cx + r - 4, cy + 14);
  }, [score]);
  return <canvas ref={ref} width={120} height={68} />;
}

/* ── Price History Chart (using Chart.js) ── */
function PriceChart({ product }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  const [period, setPeriod] = useState('Max');

  const allHistory = genHistory(product.high, product.low, product.price);

  const getSlice = () => {
    if (period === '1 Month') return { labels: allHistory.labels.slice(-1), data: allHistory.data.slice(-1) };
    if (period === '3 Month') return { labels: allHistory.labels.slice(-3), data: allHistory.data.slice(-3) };
    return allHistory;
  };

  useEffect(() => {
    let destroyed = false;
    import('chart.js').then(({ Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip }) => {
      if (destroyed) return;
      Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      const canvas = ref.current;
      if (!canvas) return;
      const { labels, data } = getSlice();
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 280);
      gradient.addColorStop(0, 'rgba(239,68,68,0.3)');
      gradient.addColorStop(0.5, 'rgba(251,191,36,0.1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      chartRef.current = new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            data,
            fill: true,
            backgroundColor: gradient,
            borderColor: '#EF4444',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#EF4444',
            pointBorderWidth: 2,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => '₹' + ctx.raw.toLocaleString('en-IN'),
              },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: {
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                font: { size: 11 },
                callback: v => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v),
              },
            },
          },
        },
      });
    });
    return () => { destroyed = true; if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [period, product.id]);

  return (
    <div className="ph-sec">
      <div className="ph-card">
        <div className="ph-head">
          <h3>Price History</h3>
          <div className="period-fs">
            {['1 Month', '3 Month', 'Max'].map(p => (
              <button key={p} className={`period-f${period === p ? ' on' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
        </div>
        <div style={{ height: 280, position: 'relative' }}>
          <canvas ref={ref} />
        </div>
      </div>
    </div>
  );
}

/* ── Store key → CSS class ── */
function storeClass(key) {
  return key === 'amazon' ? 'a' : key === 'flipkart' ? 'f' : key === 'meesho' ? 'm' : 'c';
}

/* ── Star rating ── */
function Stars({ val = 4.5 }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: '#F59E0B' }}>{i <= Math.floor(val) ? '★' : i - val < 1 ? '⭐' : '☆'}</span>
      ))}
    </span>
  );
}

/* ── DEAL SCANNER BOX ── */
function DealScanner({ product }) {
  const [tab, setTab] = useState('Price Drop');
  const [period, setPeriod] = useState('1 Week');
  const [alertPrice, setAlertPrice] = useState(product.price.toString());
  const [toast, setToast] = useState('');
  const score = Math.min(100, Math.round((1 - (product.price - product.low) / (product.high - product.low)) * 100));

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  return (
    <div className="scanner-box">
      <div className="deal-tabs">
        {['Deal Scanner', 'Price Drop'].map(t => (
          <button key={t} className={`deal-tab${tab === t ? ' on' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Deal Scanner' ? (
        <>
          <div className="buy-title">Should you buy now?</div>
          <div className="time-fs">
            {['2-3 Days', '1 Week', '1 Month'].map(p => (
              <button key={p} className={`time-f${period === p ? ' on' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <div className="gauge-wrap">
            <div>
              <Gauge score={score} />
              <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 10, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 8, height: 8, background: '#EF4444', borderRadius: 2, display: 'inline-block' }} /> Bad Time
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 8, height: 8, background: '#16A34A', borderRadius: 2, display: 'inline-block' }} /> Good Time
                </span>
              </div>
            </div>
            <div className="recom">
              <div className="recom-lbl">Our Recommendation</div>
              <div className="recom-val">{score >= 65 ? '✅ Go Ahead & Buy now' : score >= 40 ? '⏳ Wait a bit' : '❌ Bad Time to Buy'}</div>
              <div className="recom-sub">{score >= 65 ? 'Optimal price point' : 'Price might drop further'}</div>
            </div>
          </div>

          <div className="price-stats">
            <div className="pstat">
              <div className="pstat-lbl">Highest Price ↑</div>
              <div className="pstat-val">{formatPrice(product.high)}</div>
            </div>
            <div className="pstat">
              <div className="pstat-lbl">Average Price ↕</div>
              <div className="pstat-val">{formatPrice(product.avg)}</div>
            </div>
            <div className="pstat">
              <div className="pstat-lbl">Lowest Price ↓</div>
              <div className="pstat-val" style={{ color: 'var(--green)' }}>{formatPrice(product.low)}</div>
            </div>
            <div className="pstat hi">
              <div className="pstat-lbl">⭐ GIF 2025 Price</div>
              <div className="pstat-val">{formatPrice(Math.round(product.avg * 1.05))}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="buy-title">Set Price Drop Alert</div>
          <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 14 }}>
            Get notified when the price drops to your target.
          </p>
          <div className="price-stats">
            <div className="pstat">
              <div className="pstat-lbl">Current Price</div>
              <div className="pstat-val">{formatPrice(product.price)}</div>
            </div>
            <div className="pstat">
              <div className="pstat-lbl">All-time Low</div>
              <div className="pstat-val" style={{ color: 'var(--green)' }}>{formatPrice(product.low)}</div>
            </div>
          </div>
        </>
      )}

      <div className="alert-sec">
        <div className="alert-lbl">Set price drop alert to buy later</div>
        <div className="alert-row">
          <div className="alert-inp-wrap">
            <span>🔔</span>
            <input value={alertPrice} onChange={e => setAlertPrice(e.target.value)} type="number" />
          </div>
          <button className="btn-alert" onClick={() => showToast('🔔 Alert set for ' + formatPrice(Number(alertPrice)) + '!')}>
            Set Price Alert
          </button>
        </div>
        <button className="btn-buy-full" onClick={() => showToast('🛒 Redirecting to store...')}>
          Buy on {product.store.charAt(0).toUpperCase() + product.store.slice(1)}
        </button>
      </div>

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </div>
  );
}

/* ── RELATED PRODUCTS ── */
function RelatedProducts({ current }) {
  const related = PRODUCTS.filter(p => p.category === current.category && p.id !== current.id).slice(0, 4);
  if (related.length === 0) return null;
  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 20px 32px' }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Related Products</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {related.map(p => (
          <Link key={p.id} href={`/product/${p.id}`} style={{ background: '#fff', borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--sh)', cursor: 'pointer', textDecoration: 'none', color: 'inherit', transition: 'var(--t)', display: 'block' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}>
            <div style={{ background: '#F9F9FF', fontSize: 60, padding: 20, textAlign: 'center', aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.emoji}</div>
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 800 }}>{formatPrice(p.price)}</span>
                <span style={{ fontSize: 11, background: '#DCFCE7', color: '#16A34A', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{p.discount}% off</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function ProductPage() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === Number(id));
  const [toast, setToast] = useState('');
  const [thumbIdx, setThumbIdx] = useState(0);
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: 1320, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>😕</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Product not found</h1>
          <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>The product you are looking for does not exist or may have been removed.</p>
          <Link href="/deals" style={{ background: 'var(--primary)', color: '#fff', padding: '12px 24px', borderRadius: 'var(--r)', fontWeight: 700, textDecoration: 'none' }}>Browse Deals</Link>
        </div>
        <Footer />
      </>
    );
  }

  const thumbEmojis = ['🔍', '📦', '📋', '🎁', '💡', '⭐', '🌟'];

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/deals">{product.category}</Link>
        <span>/</span>
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{product.name.slice(0, 40)}…</span>
      </div>

      {/* Search bar on product page */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--r-f)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--sh)', border: '1.5px solid var(--border)' }}>
          <svg width="14" height="14" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder={`Paste a ${product.store.charAt(0).toUpperCase() + product.store.slice(1)} link or Search a Product`}
            style={{ flex: 1, fontSize: 14, color: 'var(--text)', background: 'none' }} />
          <button style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>🎤</button>
        </div>
      </div>

      {/* Main 3-col layout */}
      <div className="prod-layout">
        {/* Gallery */}
        <div className="prod-gallery">
          <div className="main-img" style={{ fontSize: 100 + thumbIdx * 2 }}>
            {product.emoji}
          </div>
          <div className="thumb-row">
            {thumbEmojis.slice(0, 6).map((em, i) => (
              <div key={i} className={`thumb${thumbIdx === i ? ' on' : ''}`} onClick={() => setThumbIdx(i)}>
                {em}
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="prod-info">
          <div className="prod-store-badge">
            <span>{STORE_COLORS[product.store]?.label || '?'}</span>
            {product.store.charAt(0).toUpperCase() + product.store.slice(1)}
          </div>
          <h1 className="prod-title">{product.name}</h1>
          <div className="prod-rating">
            <Stars val={product.rating} />
            <span className="r-val">{product.rating}</span>
            <span className="r-cnt">({product.reviews.toLocaleString('en-IN')} reviews)</span>
          </div>
          <p className="prod-desc">{product.desc}</p>
          <div className="prod-tags">
            {product.tags?.map(t => <span key={t} className="prod-tag">{t}</span>)}
          </div>

          <div className="prod-price-block">
            <span className="cur-price">{formatPrice(product.price)}</span>
            <span className="orig-price">{formatPrice(product.mrp)}</span>
            <div className="disc-chip">↓ {product.discount}% OFF</div>
          </div>

          <div className="act-row">
            <button className="btn-share2" onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('🔗 Link copied!'); }}>
              📤 Share
            </button>
            <button className="btn-share2" onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('🔗 Copied!'); }}>
              📋 Copy
            </button>
            <button className="btn-buy-main" onClick={() => showToast('🛒 Redirecting to ' + product.store + '...')}>
              Buy on {product.store.charAt(0).toUpperCase() + product.store.slice(1)}
            </button>
          </div>

          <div className="comp-stores-title">Compare {product.stores.length} Available Price{product.stores.length > 1 ? 's' : ''}</div>
          {product.stores.map(s => (
            <div key={s.name} className="store-row" onClick={() => showToast(`🛒 Going to ${s.name}...`)}>
              <div className="srow-left">
                <div className={`srow-ico ${storeClass(s.key)}`}>{STORE_COLORS[s.key]?.label}</div>
                <div>
                  <div className="srow-name">{s.name}</div>
                  <div className="srow-del">✅ {s.delivery}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="srow-price">{formatPrice(s.price)}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>›</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scanner Box */}
        <DealScanner product={product} />
      </div>

      {/* Price History Chart */}
      <PriceChart product={product} />

      {/* Related Products */}
      <RelatedProducts current={product} />

      <Footer />

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}
