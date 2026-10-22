'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS, formatPrice, STORE_COLORS } from '@/lib/data';

const COMPARE_CATS = [
  { icon: '🛒', label: 'Grocery', desc: 'Compare grocery prices across BigBasket, Blinkit, Zepto & more' },
  { icon: '✈️', label: 'Flights', desc: 'Find the cheapest flights across MakeMyTrip, Ixigo, Goibibo' },
  { icon: '🏨', label: 'Hotels', desc: 'Compare hotel rates across OYO, MakeMyTrip, Booking.com' },
  { icon: '🚕', label: 'Cabs', desc: 'Compare ride prices across Uber, Ola, Rapido & more' },
  { icon: '🍔', label: 'Food', desc: 'Compare food delivery prices across Swiggy, Zomato, EatSure' },
];

const PRODUCT_CATS = ['All', ...new Set(PRODUCTS.map(p => p.category))];

function StarRating({ val = 4.5 }) {
  return (
    <span className="stars" style={{ fontSize: 13 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: '#F59E0B' }}>{i <= Math.floor(val) ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

export default function ComparePage() {
  const [activeCat, setActiveCat] = useState('Grocery');
  const [filterCat, setFilterCat] = useState('All');
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [slot3, setSlot3] = useState(null);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [search3, setSearch3] = useState('');
  const [drop1, setDrop1] = useState(false);
  const [drop2, setDrop2] = useState(false);
  const [drop3, setDrop3] = useState(false);

  const filteredProducts = PRODUCTS.filter(p =>
    filterCat === 'All' || p.category === filterCat
  );

  const getFiltered = (q) =>
    filteredProducts.filter(p => q.length > 0 && p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6);

  const slots = [slot1, slot2, slot3];
  const activeSlots = slots.filter(Boolean);

  const renderSelector = (slot, setSlot, search, setSearch, drop, setDrop, idx) => (
    <div className="cmp-selector" key={idx}>
      {slot ? (
        <div className="cmp-selected">
          <div className="cmp-sel-emoji">{slot.emoji}</div>
          <div className="cmp-sel-name">{slot.name}</div>
          <div className="cmp-sel-price">{formatPrice(slot.price)}</div>
          <button className="cmp-sel-remove" onClick={() => { setSlot(null); setSearch(''); }}>✕</button>
        </div>
      ) : (
        <div className="cmp-search-wrap">
          <div className="cmp-add-icon">+</div>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setDrop(true); }}
            onFocus={() => setDrop(true)}
            placeholder="Search product to add..."
            className="cmp-search-inp"
          />
          {drop && getFiltered(search).length > 0 && (
            <div className="cmp-drop">
              {getFiltered(search).map(p => (
                <div key={p.id} className="cmp-drop-item" onClick={() => {
                  setSlot(p); setSearch(''); setDrop(false);
                }}>
                  <span className="cmp-drop-emoji">{p.emoji}</span>
                  <div>
                    <div className="cmp-drop-name">{p.name}</div>
                    <div className="cmp-drop-meta">{p.category} · {formatPrice(p.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const comparisonRows = [
    { label: 'Price', render: p => <span style={{ fontSize: 18, fontWeight: 800 }}>{formatPrice(p.price)}</span> },
    { label: 'MRP', render: p => <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{formatPrice(p.mrp)}</span> },
    { label: 'Discount', render: p => <span className="disc-chip">↓ {p.discount}% OFF</span> },
    { label: 'Rating', render: p => <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><StarRating val={p.rating} /> <span style={{ fontWeight: 600 }}>{p.rating}</span></div> },
    { label: 'Reviews', render: p => <span>{p.reviews.toLocaleString('en-IN')} reviews</span> },
    { label: 'Category', render: p => <span className="prod-tag">{p.category}</span> },
    { label: 'Best Store', render: p => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 20, height: 20, borderRadius: 4, background: STORE_COLORS[p.store]?.bg || '#999', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900 }}>
          {STORE_COLORS[p.store]?.label}
        </span>
        {p.store.charAt(0).toUpperCase() + p.store.slice(1)}
      </div>
    )},
    { label: 'Lowest Price', render: p => <span style={{ color: 'var(--green)', fontWeight: 700 }}>{formatPrice(p.low)}</span> },
    { label: 'Highest Price', render: p => <span style={{ color: 'var(--red)', fontWeight: 700 }}>{formatPrice(p.high)}</span> },
  ];

  return (
    <>
      <Navbar />
      <div className="cmp-page">
        {/* Hero */}
        <div className="cmp-hero">
          <div className="cmp-hero-badge">⚖️ Compare Everything</div>
          <h1>Compare Prices Across Platforms</h1>
          <p>Find the best deal by comparing prices across 100+ stores, flights, hotels, cabs & food delivery</p>
        </div>

        {/* Category Cards */}
        <div className="cmp-cats">
          {COMPARE_CATS.map(c => (
            <div
              key={c.label}
              className={`cmp-cat-card${activeCat === c.label ? ' on' : ''}`}
              onClick={() => setActiveCat(c.label)}
            >
              <span className="cmp-cat-icon">{c.icon}</span>
              <span className="cmp-cat-label">{c.label}</span>
              <p className="cmp-cat-desc">{c.desc}</p>
              <div className="cmp-cat-arrow">→</div>
            </div>
          ))}
        </div>

        {/* Product Comparison Tool */}
        <div className="cmp-tool">
          <div className="cmp-tool-head">
            <div>
              <h2>Product Comparison</h2>
              <p>Select up to 3 products to compare side-by-side</p>
            </div>
            <div className="cmp-cat-filter">
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Category:</span>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                {PRODUCT_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Selectors */}
          <div className="cmp-slots">
            {renderSelector(slot1, setSlot1, search1, setSearch1, drop1, setDrop1, 0)}
            <div className="cmp-vs">VS</div>
            {renderSelector(slot2, setSlot2, search2, setSearch2, drop2, setDrop2, 1)}
            <div className="cmp-vs">VS</div>
            {renderSelector(slot3, setSlot3, search3, setSearch3, drop3, setDrop3, 2)}
          </div>

          {/* Comparison Table */}
          {activeSlots.length >= 2 && (
            <div className="cmp-table-wrap animate-fade">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    {activeSlots.map(p => (
                      <th key={p.id}>
                        <span className="cmp-th-emoji">{p.emoji}</span>
                        <span className="cmp-th-name">{p.name.length > 25 ? p.name.slice(0, 25) + '…' : p.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(row => (
                    <tr key={row.label}>
                      <td className="cmp-td-label">{row.label}</td>
                      {activeSlots.map(p => (
                        <td key={p.id}>{row.render(p)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="cmp-td-label">Action</td>
                    {activeSlots.map(p => (
                      <td key={p.id}>
                        <Link href={`/product/${p.id}`} className="cmp-view-btn">View Details →</Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeSlots.length < 2 && (
            <div className="cmp-empty">
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚖️</div>
              <h3>Select at least 2 products to compare</h3>
              <p>Search and add products above to see a detailed side-by-side comparison</p>
            </div>
          )}
        </div>

        {/* Quick Compare Suggestions */}
        <div className="cmp-suggestions">
          <h3>Popular Comparisons</h3>
          <div className="cmp-sugg-grid">
            {[
              { a: PRODUCTS[0], b: PRODUCTS[1], label: 'iPhone 15 vs Galaxy S24 Ultra' },
              { a: PRODUCTS[4], b: PRODUCTS[19], label: 'MacBook Air M3 vs IdeaPad Slim 3' },
              { a: PRODUCTS[2], b: PRODUCTS[5], label: 'Sony WH-1000XM5 vs boAt Airdopes 141' },
              { a: PRODUCTS[8], b: PRODUCTS[7], label: 'Philips Air Fryer vs Prestige Kettle' },
            ].map((pair, i) => (
              <div key={i} className="cmp-sugg-card" onClick={() => { setSlot1(pair.a); setSlot2(pair.b); setSlot3(null); }}>
                <div className="cmp-sugg-emojis">
                  <span>{pair.a.emoji}</span>
                  <span className="cmp-sugg-vs">⚡</span>
                  <span>{pair.b.emoji}</span>
                </div>
                <div className="cmp-sugg-label">{pair.label}</div>
                <div className="cmp-sugg-action">Compare →</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
