'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS, formatPrice } from '@/lib/data';

function StarRating({ val = 4.5 }) {
  return (
    <span className="stars" style={{ fontSize: 11 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: '#F59E0B' }}>{i <= Math.floor(val) ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

export default function AlertsPage() {
  const [wishIds, setWishIds] = useState([]);
  const [search, setSearch] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const [alertPrices, setAlertPrices] = useState({});
  const [toast, setToast] = useState('');
  const [tab, setTab] = useState('active');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    const w = JSON.parse(localStorage.getItem('bh_wish') || '[]');
    setWishIds(w);
    // Initialize alert prices
    const prices = {};
    w.forEach(id => {
      const p = PRODUCTS.find(prod => prod.id === id);
      if (p) prices[id] = Math.round(p.low * 1.05);
    });
    setAlertPrices(prices);
  }, []);

  const wishProducts = wishIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  const filtered = search.length > 1
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && !wishIds.includes(p.id)).slice(0, 6)
    : [];

  const addAlert = (productId) => {
    const newWish = [...wishIds, productId];
    setWishIds(newWish);
    localStorage.setItem('bh_wish', JSON.stringify(newWish));
    window.dispatchEvent(new Event('bh_wish_update'));
    const p = PRODUCTS.find(prod => prod.id === productId);
    if (p) setAlertPrices(prev => ({ ...prev, [productId]: Math.round(p.low * 1.05) }));
    setSearch('');
    setShowDrop(false);
    showToast('🔔 Alert added!');
  };

  const removeAlert = (productId) => {
    const newWish = wishIds.filter(id => id !== productId);
    setWishIds(newWish);
    localStorage.setItem('bh_wish', JSON.stringify(newWish));
    window.dispatchEvent(new Event('bh_wish_update'));
    showToast('🗑️ Alert removed');
  };

  const updateAlertPrice = (id, price) => {
    setAlertPrices(prev => ({ ...prev, [id]: price }));
    showToast('✅ Alert price updated!');
  };

  /* Simulated history */
  const alertHistory = [
    { emoji: '📱', name: 'iPhone 15 dropped to ₹67,999', time: '2 days ago', status: 'triggered' },
    { emoji: '🎧', name: 'Sony XM5 price alert set for ₹22,990', time: '1 week ago', status: 'waiting' },
    { emoji: '💻', name: 'MacBook Air M3 dropped below ₹1,00,000!', time: '3 weeks ago', status: 'triggered' },
    { emoji: '📺', name: 'Samsung 65" TV alert expired', time: '1 month ago', status: 'expired' },
  ];

  return (
    <>
      <Navbar />
      <div className="alerts-page">
        {/* Hero */}
        <div className="alerts-hero">
          <div className="alerts-hero-icon">🔔</div>
          <h1>Price Drop Alerts</h1>
          <p>Never miss a deal! Set your target price and get notified the moment it drops.</p>
          <div className="alerts-hero-stats">
            <div className="alerts-stat">
              <span className="alerts-stat-val">2.4M+</span>
              <span>Alerts Triggered</span>
            </div>
            <div className="alerts-stat-sep" />
            <div className="alerts-stat">
              <span className="alerts-stat-val">₹850CR</span>
              <span>Saved by Users</span>
            </div>
            <div className="alerts-stat-sep" />
            <div className="alerts-stat">
              <span className="alerts-stat-val">100+</span>
              <span>Stores Tracked</span>
            </div>
          </div>
        </div>

        {/* Add New Alert */}
        <div className="alerts-add-section">
          <div className="alerts-add-card">
            <h2>➕ Set a New Alert</h2>
            <p>Search for any product and set your target price</p>
            <div className="alerts-search-wrap" style={{ position: 'relative' }}>
              <div className="alerts-search-bar">
                <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowDrop(true); }}
                  onFocus={() => setShowDrop(true)}
                  placeholder="Search products to track..."
                />
              </div>
              {showDrop && filtered.length > 0 && (
                <div className="s-drop" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0 }}>
                  {filtered.map(p => (
                    <div key={p.id} className="sd-item" onClick={() => addAlert(p.id)}>
                      <div className="sd-ico">{p.emoji}</div>
                      <div>
                        <div className="sd-name">{p.name}</div>
                        <div className="sd-cat">{p.category} · {formatPrice(p.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="alerts-how">
          <h2>How Price Alerts Work</h2>
          <div className="alerts-how-grid">
            {[
              { icon: '🔍', step: '1', title: 'Find a Product', desc: 'Search or browse any product you want to track' },
              { icon: '🎯', step: '2', title: 'Set Target Price', desc: 'Enter the price at which you\'d like to be notified' },
              { icon: '📩', step: '3', title: 'Get Notified', desc: 'We\'ll alert you via email & app when the price drops' },
              { icon: '🛒', step: '4', title: 'Buy & Save', desc: 'Grab the deal before the price goes back up' },
            ].map(s => (
              <div key={s.step} className="alerts-how-card">
                <div className="alerts-how-num">{s.step}</div>
                <span className="alerts-how-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="alerts-tabs">
          <button className={`alerts-tab${tab === 'active' ? ' on' : ''}`} onClick={() => setTab('active')}>
            🔔 Active Alerts ({wishProducts.length})
          </button>
          <button className={`alerts-tab${tab === 'history' ? ' on' : ''}`} onClick={() => setTab('history')}>
            📋 History
          </button>
        </div>

        {/* Active Alerts */}
        {tab === 'active' && (
          <div className="alerts-list">
            {wishProducts.length === 0 ? (
              <div className="alerts-empty">
                <div style={{ fontSize: 64, marginBottom: 20 }}>🔕</div>
                <h3>No active alerts</h3>
                <p>Search for products above or browse deals to set your first price alert</p>
                <Link href="/deals" className="alerts-browse-btn">Browse Deals →</Link>
              </div>
            ) : (
              wishProducts.map(p => (
                <div key={p.id} className="alert-item-card">
                  <div className="alert-item-left">
                    <div className="alert-item-emoji">{p.emoji}</div>
                    <div className="alert-item-info">
                      <Link href={`/product/${p.id}`} className="alert-item-name">{p.name}</Link>
                      <div className="alert-item-meta">
                        <span className="alert-item-price">Current: <b>{formatPrice(p.price)}</b></span>
                        <span className="alert-item-low">All-time Low: <b style={{ color: 'var(--green)' }}>{formatPrice(p.low)}</b></span>
                      </div>
                      <div className="alert-item-rating">
                        <StarRating val={p.rating} />
                        <span>{p.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="alert-item-right">
                    <div className="alert-target">
                      <label>Alert when ≤</label>
                      <div className="alert-target-row">
                        <span>₹</span>
                        <input
                          type="number"
                          value={alertPrices[p.id] || ''}
                          onChange={e => setAlertPrices(prev => ({ ...prev, [p.id]: e.target.value }))}
                        />
                        <button onClick={() => updateAlertPrice(p.id, alertPrices[p.id])}>Set</button>
                      </div>
                    </div>
                    <button className="alert-remove-btn" onClick={() => removeAlert(p.id)} title="Remove alert">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div className="alerts-history">
            {alertHistory.map((h, i) => (
              <div key={i} className={`alert-hist-item ${h.status}`}>
                <div className="alert-hist-emoji">{h.emoji}</div>
                <div className="alert-hist-info">
                  <div className="alert-hist-name">{h.name}</div>
                  <div className="alert-hist-time">{h.time}</div>
                </div>
                <div className={`alert-hist-badge ${h.status}`}>
                  {h.status === 'triggered' && '✅ Triggered'}
                  {h.status === 'waiting' && '⏳ Waiting'}
                  {h.status === 'expired' && '⌛ Expired'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}
