'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS, STORE_COLORS, formatPrice } from '@/lib/data';

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Audio', 'TVs', 'Kitchen', 'Accessories', 'Cameras', 'Tablets', 'Footwear', 'Appliances', 'Storage'];
const STORES = ['Amazon', 'Flipkart', 'Meesho', 'Myntra'];
const DISCOUNTS = ['10% & above', '20% & above', '30% & above', '50% & above'];

function StarRating({ val = 4.5, size = 11 }) {
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: '#F59E0B' }}>{i <= Math.floor(val) ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

function WishBtn({ productId }) {
  const [wished, setWished] = useState(false);
  useEffect(() => {
    const w = JSON.parse(localStorage.getItem('bh_wish') || '[]');
    setWished(w.includes(productId));
  }, [productId]);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const w = JSON.parse(localStorage.getItem('bh_wish') || '[]');
    let nw;
    if (w.includes(productId)) { nw = w.filter(id => id !== productId); }
    else { nw = [...w, productId]; }
    localStorage.setItem('bh_wish', JSON.stringify(nw));
    setWished(!wished);
    window.dispatchEvent(new Event('bh_wish_update'));
  };

  return (
    <button className={`dc-wish${wished ? ' on' : ''}`} onClick={toggle} title={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
      {wished ? '❤️' : '🤍'}
    </button>
  );
}

function DealsContent() {
  const searchParams = useSearchParams();
  const queryQ = searchParams.get('q') || '';
  const queryStore = searchParams.get('store') || '';

  const [search, setSearch] = useState(queryQ);
  const [selCat, setSelCat] = useState('All');
  const [selStores, setSelStores] = useState(queryStore ? [queryStore.charAt(0).toUpperCase() + queryStore.slice(1)] : []);
  const [selDisc, setSelDisc] = useState('');
  const [sort, setSort] = useState('discount');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const minDisc = selDisc ? parseInt(selDisc) : 0;

  let results = PRODUCTS.filter(p => {
    const matchQ = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selCat === 'All' || p.category === selCat;
    const matchStore = selStores.length === 0 || selStores.some(s => p.store === s.toLowerCase() || p.store.includes(s.toLowerCase()));
    const matchDisc = p.discount >= minDisc;
    return matchQ && matchCat && matchStore && matchDisc;
  });

  if (sort === 'discount') results = [...results].sort((a, b) => b.discount - a.discount);
  else if (sort === 'price_asc') results = [...results].sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') results = [...results].sort((a, b) => b.price - a.price);
  else if (sort === 'rating') results = [...results].sort((a, b) => b.rating - a.rating);

  const toggleStore = (s) => {
    setSelStores(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div className="deals-page">
      {/* Hero */}
      <div className="deals-hero">
        <div>
          <h1>🔥 Hot Deals Today</h1>
          <p>Handpicked deals with verified discounts — all priced against their history</p>
        </div>
        <div className="chip-row">
          {CATEGORIES.slice(0, 7).map(c => (
            <button key={c} className={`chip${selCat === c ? ' on' : ''}`} onClick={() => setSelCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="dl-layout">
        {/* Sidebar */}
        <aside className="filters-side">
          <div className="fside-head">
            <span>Filters</span>
            <button onClick={() => { setSelCat('All'); setSelStores([]); setSelDisc(''); setSearch(''); }}>Clear all</button>
          </div>

          {/* Search */}
          <div className="fg">
            <div className="fg-title">Search</div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text)' }}
            />
          </div>

          {/* Category */}
          <div className="fg">
            <div className="fg-title">Category</div>
            <div className="f-opts">
              {CATEGORIES.map(c => (
                <label key={c} className="f-opt">
                  <input type="radio" name="cat" checked={selCat === c} onChange={() => setSelCat(c)} />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Store */}
          <div className="fg">
            <div className="fg-title">Store</div>
            <div className="f-opts">
              {STORES.map(s => (
                <label key={s} className="f-opt">
                  <input type="checkbox" checked={selStores.includes(s)} onChange={() => toggleStore(s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>

          {/* Discount */}
          <div className="fg">
            <div className="fg-title">Discount</div>
            <div className="f-opts">
              {DISCOUNTS.map(d => (
                <label key={d} className="f-opt">
                  <input type="radio" name="disc" checked={selDisc === d.split('%')[0]} onChange={() => setSelDisc(d.split('%')[0])} />
                  {d}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="deals-main">
          <div className="dl-toolbar">
            <p className="dl-count">Showing <span>{results.length}</span> deals</p>
            <div className="dl-sort">
              <span style={{ fontSize: 13, color: 'var(--text-med)' }}>Sort by:</span>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="discount">Best Discount</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Best Rating</option>
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No deals found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="deals-grid">
              {results.map(p => (
                <Link key={p.id} href={`/product/${p.id}`} className="deal-card">
                  <div className="dc-img">
                    <span style={{ fontSize: 80, lineHeight: 1 }}>{p.emoji}</span>
                    <span className="dc-badge">{p.discount}% off</span>
                    <WishBtn productId={p.id} />
                  </div>
                  <div className="dc-info">
                    <div className="dc-title">{p.name}</div>
                    <div className="dc-rating">
                      <StarRating val={p.rating} />
                      <span>({p.reviews.toLocaleString('en-IN')})</span>
                    </div>
                    <div className="dc-pr-row">
                      <span className="dc-price">{formatPrice(p.price)}</span>
                      <span className="dc-mrp">{formatPrice(p.mrp)}</span>
                    </div>
                    <div className="dc-store">
                      <span style={{ width: 14, height: 14, background: STORE_COLORS[p.store]?.bg || '#999', borderRadius: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 900, color: '#fff' }}>
                        {STORE_COLORS[p.store]?.label || '?'}
                      </span>
                      {p.store.charAt(0).toUpperCase() + p.store.slice(1)}
                    </div>
                  </div>
                  <button className="btn-track" onClick={(e) => { e.preventDefault(); showToast('🔔 Price alert set!'); }}>
                    🔔 Track Price
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </div>
  );
}

export default function DealsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading deals…</div>}>
        <DealsContent />
      </Suspense>
      <Footer />
    </>
  );
}
