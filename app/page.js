'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS, DEAL_CATEGORIES, GIFT_CARDS, formatPrice } from '@/lib/data';

/* ── Helpers ── */
const COMPARE_ITEMS = ['Compare Grocery', 'Compare Flights', 'Compare Everything', 'Compare Hotels', 'Compare Food', 'Compare Cabs'];
const COMPARE_CATS = [
  { icon: '🛒', label: 'Grocery Compare' },
  { icon: '✈️', label: 'Flight Compare' },
  { icon: '🏨', label: 'Hotel Compare' },
  { icon: '🚕', label: 'Ride Compare' },
  { icon: '🍔', label: 'Food Compare' },
];
const WHY_ITEMS = [
  { icon: '📊', title: 'Real-time Price Tracking', desc: 'Monitor prices across 100+ stores automatically. Get notified the moment prices drop.' },
  { icon: '🔔', title: 'Smart Price Alerts', desc: 'Set your target price and we will alert you via email or app when the price drops.' },
  { icon: '📈', title: 'Price History Charts', desc: 'View complete price history for any product. Know if today\'s price is really a deal.' },
  { icon: '🛡️', title: 'Verified Deals Only', desc: 'Our AI scans and verifies deals to show you only genuine discounts worth buying.' },
];
const FAQS = [
  { q: 'What is LowPrice?', a: 'LowPrice is India\'s leading price comparison and price tracking platform. We track prices across 100+ online stores like Amazon, Flipkart, Meesho and more to help you find the best deals.' },
  { q: 'How does price tracking work?', a: 'Simply search for any product on LowPrice, and we will show you its complete price history across all stores. You can set a target price and get an instant alert when it drops.' },
  { q: 'Is LowPrice free to use?', a: 'Yes! LowPrice is completely free. We earn a small commission from stores when you purchase through our links, which helps us keep the service free for everyone.' },
  { q: 'Which stores does LowPrice support?', a: 'We support 100+ stores including Amazon, Flipkart, Meesho, Myntra, Croma, Nykaa, Tata Cliq, BigBasket, Blinkit, and many more.' },
  { q: 'How do I set a price drop alert?', a: 'Go to any product page, enter your target price in the "Set price drop alert" box, and click the alert button. You\'ll get notified as soon as the price drops to your target.' },
];
const LENS_CATS = [
  { icon: '💻', label: 'Electronics' },
  { icon: '💄', label: 'Bath & Beauty' },
  { icon: '💊', label: 'Diet & Supplements' },
  { icon: '🐾', label: 'Pet Supplies' },
];

function StarRating({ val = 4.5 }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i}>{i <= Math.floor(val) ? '★' : i - val < 1 ? '⯨' : '☆'}</span>
      ))}
    </span>
  );
}

/* ── HERO SEARCH ── */
function HeroSearch() {
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const [listening, setListening] = useState(false);
  const wrapRef = useRef(null);
  const router = useRouter();

  const filtered = q.length > 1
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShow(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) { router.push(`/deals?q=${encodeURIComponent(q.trim())}`); setShow(false); }
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in your browser.');
      return;
    }
    const rec = new window.webkitSpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = e => {
      const t = e.results[0][0].transcript;
      setQ(t); setShow(true);
      router.push(`/deals?q=${encodeURIComponent(t)}`);
    };
    rec.start();
  };

  return (
    <div className="hs-wrap" ref={wrapRef}>
      <form onSubmit={handleSearch} className="hs-box">
        <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setShow(true); }}
          onFocus={() => setShow(true)}
          placeholder="Search or paste any Zivame link for the best price"
        />
        <div className="hs-divider" />
        <div className="hs-stores">
          <span>supports</span>
          <div className="slogo a">A</div>
          <div className="slogo f">F</div>
          <div className="slogo m">M</div>
        </div>
        <button type="button" className={`btn-mic${listening ? ' on' : ''}`} onClick={startVoice} title="Voice search">
          🎤
        </button>
      </form>

      {show && filtered.length > 0 && (
        <div className="s-drop">
          {filtered.map(p => (
            <div key={p.id} className="sd-item" onClick={() => { router.push(`/product/${p.id}`); setShow(false); setQ(''); }}>
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
  );
}

/* ── COMPARE SECTION (animated) ── */
function CompareSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % COMPARE_ITEMS.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="compare-sec">
      <div className="compare-card">
        <div className="compare-left">
          <div className="compare-tip">Compare prices across flights, grocery, cabs & more.</div>
          <ul className="compare-list">
            {COMPARE_ITEMS.map((item, i) => (
              <li key={item} className={`compare-li${i === active ? ' on' : ''}`} onClick={() => setActive(i)}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="compare-vline" />
        <div className="compare-right">
          <div className="compare-cats">
            {COMPARE_CATS.map(c => (
              <div key={c.label} className="cc-card">
                <span className="cc-icon">{c.icon}</span>
                <span className="cc-label">{c.label}</span>
                <div className="cc-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CATEGORY DEAL PANEL ── */
function DealPanel({ cat }) {
  const prods = cat.ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  return (
    <div className="cat-panel">
      <div className="cpp-head">
        <span className="cpp-title">{cat.title}</span>
        <Link href="/deals" className="cpp-more">More &gt;</Link>
      </div>
      <div className="prods-grid">
        {prods.map(p => (
          <Link key={p.id} href={`/product/${p.id}`} className="p-card">
            <div className="p-img">
              <span className="p-emoji">{p.emoji}</span>
            </div>
            <span className="disc-badge">{p.discount}% off</span>
            <div className="p-store">
              <span className={`si-xs ${p.store[0]}`}>{p.store[0].toUpperCase()}</span>
              {formatPrice(p.price)}
            </div>
          </Link>
        ))}
      </div>
      <Link href="/deals" className="panel-btn">More deals →</Link>
    </div>
  );
}

/* ── FAQ ── */
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-sec">
      <h2>Frequently Asked Questions</h2>
      {FAQS.map((faq, i) => (
        <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
          <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
            {faq.q}
            <span className="faq-ico">+</span>
          </button>
          <div className="faq-a"><p>{faq.a}</p></div>
        </div>
      ))}
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">✨ Price History &amp; Tracker</div>
        <h1>Compare prices &amp; track drops across 100+ stores</h1>
        <p className="hero-sub">Save instantly, everytime you shop!</p>
        <HeroSearch />
        <div className="stats-bar">
          <div className="stat-item"><div className="stat-ico">🛡️</div><span><span className="stat-val">8M+</span> Active Users</span></div>
          <div className="stat-sep" />
          <div className="stat-item"><div className="stat-ico">🛡️</div><span><span className="stat-val">₹10K CR</span> Cash Saved</span></div>
          <div className="stat-sep" />
          <div className="stat-item"><div className="stat-ico">🛡️</div><span><span className="stat-val">100K+</span> Trusted Stores</span></div>
        </div>
        <div className="tip-bar">
          💡 <b>Find Best Price</b> by adding <a href="#">lowprice.com/</a> before any product link • Works with <a href="#">Zivame</a>
        </div>
      </section>

      {/* COMPARE */}
      <CompareSection />

      {/* FEATURE BANNERS */}
      <div className="feat-banners">
        <div className="feat-card feat-spend">
          <div>
            <div className="feat-title">Spend Lens</div>
            <div className="feat-pts">
              <div className="feat-pt">🗂️ View all your spending across 100+ stores in one place</div>
              <div className="feat-pt">📊 Get a breakdown of your top spending categories</div>
            </div>
          </div>
          <button className="btn-feat">Connect &amp; Track Spend →</button>
        </div>
        <div className="feat-card feat-gifts">
          <div>
            <div className="feat-big">SAVE MORE WITH GIFT CARDS</div>
            <div className="feat-sm">300+ Top Brands</div>
          </div>
          <Link href="/giftcard" className="btn-feat-out">Explore Gift Cards →</Link>
        </div>
        <div className="feat-card feat-refer">
          <div>
            <div style={{ fontSize: 14, color: '#86efac', fontWeight: 600, marginBottom: 4 }}>₹20.2K+ won in rewards till now</div>
            <div className="feat-title">Refer Once. Earn Everytime When They Shop!</div>
          </div>
          <button className="btn-feat">Refer &amp; Earn →</button>
        </div>
      </div>

      {/* PRODUCT LENS */}
      <div className="plens">
        <div className="plens-card">
          <div className="plens-info">
            <div className="plens-badge">AI POWERED</div>
            <div className="plens-title">BUY SMARTER WITH PRODUCT LENS</div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '0 12px', maxWidth: 280 }}>
            AI insights, ratings, reviews &amp; everything you need to know about a product before you buy.
          </div>
          <div className="plens-cats">
            {LENS_CATS.map(c => (
              <Link key={c.label} href="/deals" className="plcat" style={{ textDecoration: 'none' }}>
                <span className="plcat-icon">{c.icon}</span>
                <span className="plcat-label">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* DEALS */}
      <div className="deals-wrap">
        <div className="deals-heading">
          <h2>Big savings for you</h2>
          <p>Deals in the categories you shop, priced against their own history</p>
        </div>
        <div className="cat-panels">
          {DEAL_CATEGORIES.slice(0, 6).map(cat => (
            <DealPanel key={cat.title} cat={cat} />
          ))}
        </div>
      </div>

      {/* WHY */}
      <div className="why-sec">
        <h2>Why use LowPrice?</h2>
        <p>Join 8 million+ smart shoppers who save every day</p>
        <div className="why-grid">
          {WHY_ITEMS.map(w => (
            <div key={w.title} className="why-card">
              <div className="why-ico">{w.icon}</div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GIFT CARDS PREVIEW */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Gift Cards</h2>
            <p style={{ fontSize: 14, color: 'var(--text-light)', marginTop: 4 }}>Gift cards from leading brands. Simple, flexible, and ready to use</p>
          </div>
          <Link href="/giftcard" style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {GIFT_CARDS.slice(0, 5).map(gc => (
            <div key={gc.name} style={{ background: '#fff', borderRadius: 'var(--r-md)', padding: 14, boxShadow: 'var(--sh)', border: '1px solid var(--border)', textAlign: 'center', cursor: 'pointer', transition: 'var(--t)' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <div style={{ width: '100%', aspectRatio: '4/2.5', background: gc.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                {gc.emoji}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{gc.name} Gift Card</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{gc.type}</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{gc.off}</div>
              <button style={{ marginTop: 10, width: '100%', padding: '8px', background: '#F5F3FF', border: 'none', borderRadius: 'var(--r-sm)', fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}>Buy Now</button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <FAQ />

      <Footer />

      {/* Back to top */}
      <BackToTop />
    </>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const s = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, []);
  return (
    <button className={`btt${show ? ' show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
  );
}
