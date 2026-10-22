import Link from 'next/link';

export default function Footer() {
  const links = [
    {
      title: 'Products',
      items: ['Hot Deals', 'Price Drop alerts', 'Gift Cards', 'Referrals', 'Goodies'],
      hrefs: ['/deals', '/alerts', '/giftcard', '/refer', '/deals'],
    },
    {
      title: 'Price History Tracker',
      items: ['Amazon Price History Tracker', 'Flipkart Price History Tracker', 'Amazon Quiz Answers'],
      hrefs: ['/deals?store=amazon', '/deals?store=flipkart', '/deals'],
    },
    {
      title: 'Company',
      items: ['About', 'Contact Us', 'What We Do', 'How We Earn'],
      hrefs: ['#', '#', '#', '#'],
    },
    {
      title: 'Other',
      items: ['Supported Stores', 'Advertise With Us', 'Pricing Intelligence'],
      hrefs: ['#', '#', '#'],
    },
  ];

  const scrollLinks = [
    'Nykaa Gift Card', 'Shoppers Stop Gift Card', 'Steam Gift Card',
    'Tata Cliq Gift Card', 'Uber Gift Card', 'Zepto Gift Card',
    'Amazon Price History Tracker', 'Flipkart Price History',
  ];

  return (
    <footer className="footer">
      <div className="ft-content">
        {/* Top row */}
        <div className="ft-top">
          <div className="ft-logo">
            <div className="logo-icon" style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18 }}>H</div>
            <span className="logo-text">buyhatke</span>
          </div>
          <div className="ft-socials">
            {[
              { icon: '🌐', label: 'Facebook' }, { icon: '📷', label: 'Instagram' },
              { icon: '🐦', label: 'Twitter' }, { icon: '💼', label: 'LinkedIn' },
              { icon: '▶️', label: 'YouTube' }, { icon: '✈️', label: 'Telegram' },
            ].map(s => (
              <a key={s.label} href="#" className="ft-social" title={s.label}>{s.icon}</a>
            ))}
          </div>
        </div>

        {/* App buttons + link cols */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>Download our app</p>
            <div className="ft-apps">
              <button className="ft-app-btn">
                <span className="fa-icon">🍎</span>
                <div><div className="t1">Download on the</div><div className="t2">App Store</div></div>
              </button>
              <button className="ft-app-btn">
                <span className="fa-icon">🤖</span>
                <div><div className="t1">Get it on</div><div className="t2">Google Play</div></div>
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {['🇮🇳 India', '🌐 English'].map(item => (
                <button key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 999, color: '#fff', fontSize: 12, cursor: 'pointer' }}>
                  {item} ▾
                </button>
              ))}
            </div>
          </div>

          <div className="ft-cols">
            {links.map(col => (
              <div key={col.title}>
                <div className="ft-col-title">{col.title}</div>
                <ul className="ft-links">
                  {col.items.map((item, i) => (
                    <li key={item}><Link href={col.hrefs[i]}>{item}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll links */}
        <div className="ft-scroll">
          {scrollLinks.map(l => (
            <a key={l} href="#" className="ft-scroll-item">↗ {l}</a>
          ))}
        </div>

        {/* Bottom */}
        <div className="ft-bottom">
          <p>Buyhatke Internet Pvt Ltd. © 2012 – {new Date().getFullYear()}</p>
          <div className="ft-btm-links">
            <a href="#">Legal Terms</a>
            <a href="#">Privacy & Policies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
