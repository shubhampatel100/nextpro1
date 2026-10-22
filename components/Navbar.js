'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/lib/data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navQ, setNavQ] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');
  const router = useRouter();
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateWish = () => {
      const w = JSON.parse(localStorage.getItem('bh_wish') || '[]');
      setWishCount(w.length);
    };
    updateWish();
    window.addEventListener('bh_wish_update', updateWish);
    return () => window.removeEventListener('bh_wish_update', updateWish);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filtered = navQ.length > 1
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(navQ.toLowerCase())).slice(0, 5)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (navQ.trim()) {
      router.push(`/deals?q=${encodeURIComponent(navQ.trim())}`);
      setShowDrop(false);
      setNavQ('');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const navLinks = [
    { href: '/deals', label: 'Deals', icon: '🛍️' },
    { href: '/compare', label: 'Compare', icon: '⚖️' },
    { href: '/lens', label: 'Lens', icon: '✨' },
    { href: '/giftcard', label: 'Gift card', icon: '🎁' },
    { href: '/alerts', label: 'Alerts', icon: '🔔' },
    { href: '/refer', label: 'Refer & win', icon: '🎁' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="top-bar">
        <span>The Only extension You Need for Sales. We&apos;ll mark the deals that are genuinely worth it.</span>
        <span className="scan-btn">🌐 Scan Deals Instantly</span>
        <div className="tb-right">
          <span>🇮🇳 India</span>
          <span>🌐 English</span>
        </div>
      </div>

      {/* Header */}
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <nav className="nav-wrap">
          <Link href="/" className="logo">
            <div className="logo-icon">H</div>
            <span className="logo-text">buyhatke</span>
          </Link>

          <ul className="nav-items">
            {navLinks.map(l => (
              <li key={l.href}>
                <Link href={l.href}>
                  <span className="ni">{l.icon}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            {/* Nav search */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <form onSubmit={handleSearch} className="nav-search">
                <svg width="14" height="14" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input
                  value={navQ}
                  onChange={e => { setNavQ(e.target.value); setShowDrop(true); }}
                  onFocus={() => setShowDrop(true)}
                  placeholder="Find best prices"
                />
              </form>
              {showDrop && filtered.length > 0 && (
                <div className="s-drop" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0 }}>
                  {filtered.map(p => (
                    <div key={p.id} className="sd-item" onClick={() => {
                      router.push(`/product/${p.id}`);
                      setShowDrop(false); setNavQ('');
                    }}>
                      <div className="sd-ico">{p.emoji}</div>
                      <div>
                        <div className="sd-name">{p.name}</div>
                        <div className="sd-cat">{p.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn-icon" title="Wishlist" onClick={() => router.push('/deals')}>
              <span style={{ position: 'relative' }}>
                ❤️
                {wishCount > 0 && (
                  <span style={{ position: 'absolute', top: -6, right: -8, background: '#EF4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wishCount}
                  </span>
                )}
              </span>
            </button>

            <button className="btn-login" onClick={() => setShowModal(true)}>Login</button>
          </div>
        </nav>
      </header>

      {/* Login Modal */}
      <div className={`modal-overlay${showModal ? ' open' : ''}`} onClick={() => setShowModal(false)}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="modal-hd">
            <h3>Login to BuyHatke</h3>
            <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
          </div>
          <input className="modal-inp" type="email" placeholder="Email address" />
          <input className="modal-inp" type="password" placeholder="Password" />
          <button className="btn-modal-ok" onClick={() => {
            setShowModal(false);
            showToast('✅ Logged in successfully!');
          }}>Continue</button>
          <div className="modal-or">OR</div>
          <button className="btn-google" onClick={() => {
            setShowModal(false);
            showToast('✅ Signed in with Google!');
          }}>
            <span style={{ fontSize: 18 }}>G</span> Continue with Google
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}
