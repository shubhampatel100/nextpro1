'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GIFT_CARDS } from '@/lib/data';

const GC_CATEGORIES = ['All', 'Shopping', 'Food', 'Entertainment', 'Travel'];

const GC_CATEGORY_MAP = {
  'Amazon Pay': 'Shopping',
  'Flipkart': 'Shopping',
  'PVR Cinemas': 'Entertainment',
  "Domino's": 'Food',
  'Myntra': 'Shopping',
  'Blinkit': 'Food',
  'Zepto': 'Food',
  'Nykaa': 'Shopping',
  'BookMyShow': 'Entertainment',
  'MakeMyTrip': 'Travel',
};

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'disc_high', label: 'Highest Discount' },
  { value: 'disc_low', label: 'Lowest Discount' },
  { value: 'name', label: 'Name A–Z' },
];

export default function GiftCardPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  let cards = GIFT_CARDS.filter(gc => {
    const matchCat = activeCat === 'All' || GC_CATEGORY_MAP[gc.name] === activeCat;
    const matchSearch = !search || gc.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sort === 'disc_high') cards = [...cards].sort((a, b) => parseFloat(b.off) - parseFloat(a.off));
  else if (sort === 'disc_low') cards = [...cards].sort((a, b) => parseFloat(a.off) - parseFloat(b.off));
  else if (sort === 'name') cards = [...cards].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Navbar />
      <div className="gc-page">
        {/* Hero */}
        <div className="gc-hero">
          <div className="gc-hero-pattern" />
          <div className="gc-hero-badge">🎁 Gift Cards</div>
          <h1>Save More with Gift Cards</h1>
          <p>Buy gift cards from 300+ top brands at discounted prices. Simple, flexible, and ready to use.</p>
          <div className="gc-search-bar">
            <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search gift cards (Amazon, Flipkart, Swiggy...)"
            />
          </div>
          <div className="gc-stats">
            <div className="gc-stat">
              <span className="gc-stat-val">300+</span>
              <span>Brands</span>
            </div>
            <div className="gc-stat-sep" />
            <div className="gc-stat">
              <span className="gc-stat-val">Up to 18%</span>
              <span>Discount</span>
            </div>
            <div className="gc-stat-sep" />
            <div className="gc-stat">
              <span className="gc-stat-val">Instant</span>
              <span>Delivery</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="gc-filters">
          <div className="gc-chips">
            {GC_CATEGORIES.map(c => (
              <button
                key={c}
                className={`chip${activeCat === c ? ' on' : ''}`}
                onClick={() => setActiveCat(c)}
              >
                {c === 'All' && '🔥 '}{c === 'Shopping' && '🛒 '}{c === 'Food' && '🍔 '}{c === 'Entertainment' && '🎬 '}{c === 'Travel' && '✈️ '}
                {c}
              </button>
            ))}
          </div>
          <div className="gc-sort">
            <span>Sort:</span>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* How It Works */}
        <div className="gc-how">
          <h2>How Gift Cards Work</h2>
          <div className="gc-how-steps">
            {[
              { icon: '🔍', title: 'Choose a Card', desc: 'Browse gift cards from your favorite brands' },
              { icon: '💳', title: 'Pay & Save', desc: 'Buy at a discounted price and save instantly' },
              { icon: '🎉', title: 'Redeem & Enjoy', desc: 'Use your gift card code on the brand\'s website' },
            ].map((s, i) => (
              <div key={i} className="gc-how-step">
                <div className="gc-how-num">{i + 1}</div>
                <span className="gc-how-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="gc-results">
          <div className="gc-results-head">
            <h2>Available Gift Cards</h2>
            <span className="gc-results-count">{cards.length} cards</span>
          </div>

          {cards.length === 0 ? (
            <div className="gc-empty">
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3>No gift cards found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="gc-grid">
              {cards.map(gc => (
                <div key={gc.name} className="gc-card">
                  <div className="gc-card-banner" style={{ background: gc.color === '#fff' ? 'linear-gradient(135deg, #f0f0f0, #e0e0e0)' : gc.color }}>
                    <span className="gc-card-emoji">{gc.emoji}</span>
                    <span className="gc-card-cat-tag">{GC_CATEGORY_MAP[gc.name]}</span>
                  </div>
                  <div className="gc-card-body">
                    <h3 className="gc-card-name">{gc.name} Gift Card</h3>
                    <div className="gc-card-type">{gc.type}</div>
                    <div className="gc-card-off">{gc.off}</div>
                    <div className="gc-card-denoms">
                      {['₹100', '₹500', '₹1000', '₹2000'].map(d => (
                        <span key={d} className="gc-denom">{d}</span>
                      ))}
                    </div>
                    <button className="gc-buy-btn" onClick={() => showToast(`🎁 ${gc.name} Gift Card added to cart!`)}>
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="gc-trust">
          {[
            { icon: '🔒', title: 'Secure Payments', desc: 'SSL encrypted transactions' },
            { icon: '⚡', title: 'Instant Delivery', desc: 'Get your code within minutes' },
            { icon: '🛡️', title: '100% Genuine', desc: 'All codes verified & legit' },
            { icon: '💬', title: '24/7 Support', desc: 'We\'re here to help anytime' },
          ].map(t => (
            <div key={t.title} className="gc-trust-item">
              <span className="gc-trust-icon">{t.icon}</span>
              <h4>{t.title}</h4>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}
