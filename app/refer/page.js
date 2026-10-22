'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const REWARDS_TIERS = [
  { tier: 'Bronze', referrals: '1–5', reward: '₹50 per referral', icon: '🥉', color: '#CD7F32' },
  { tier: 'Silver', referrals: '6–15', reward: '₹75 per referral', icon: '🥈', color: '#C0C0C0' },
  { tier: 'Gold', referrals: '16–30', reward: '₹100 per referral', icon: '🥇', color: '#FFD700' },
  { tier: 'Diamond', referrals: '31+', reward: '₹150 per referral + bonuses', icon: '💎', color: '#B9F2FF' },
];

const LEADERBOARD = [
  { name: 'Priya S.', city: 'Mumbai', referrals: 142, earned: '₹18,500' },
  { name: 'Rahul K.', city: 'Delhi', referrals: 98, earned: '₹12,400' },
  { name: 'Sneha M.', city: 'Bangalore', referrals: 87, earned: '₹10,800' },
  { name: 'Amit D.', city: 'Pune', referrals: 65, earned: '₹8,200' },
  { name: 'Kavya R.', city: 'Chennai', referrals: 54, earned: '₹6,750' },
];

const FAQS = [
  { q: 'How does the referral program work?', a: 'Share your unique referral link with friends. When they sign up and make their first purchase through LowPrice, both of you earn rewards!' },
  { q: 'How much can I earn per referral?', a: 'You earn ₹50–₹150 per successful referral depending on your tier. Plus, you earn a percentage every time your referred friend shops through LowPrice.' },
  { q: 'When do I get my rewards?', a: 'Rewards are credited within 48 hours of your friend\'s first purchase being confirmed. You can withdraw to your bank account or use them as LowPrice credits.' },
  { q: 'Is there a limit on referrals?', a: 'No! There\'s no limit on how many friends you can refer. The more you refer, the higher your tier and the more you earn per referral.' },
  { q: 'How do I track my referrals?', a: 'You can track all your referrals, pending rewards, and earnings in real-time on this page after logging in.' },
];

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const referCode = 'LOWP' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referLink = `https://lowprice.com/invite/${referCode}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(referLink);
    setCopied(true);
    showToast('🔗 Referral link copied!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="refer-page">
        {/* Hero */}
        <div className="refer-hero">
          <div className="refer-hero-confetti" />
          <div className="refer-hero-badge">🎁 Refer & Win</div>
          <h1>Refer Once. Earn Everytime They Shop!</h1>
          <p>Share LowPrice with friends and earn rewards every time they save money</p>
          <div className="refer-hero-stats">
            <div className="refer-stat">
              <span className="refer-stat-val">₹20.2K+</span>
              <span>Won in Rewards</span>
            </div>
            <div className="refer-stat-sep" />
            <div className="refer-stat">
              <span className="refer-stat-val">15K+</span>
              <span>Active Referrers</span>
            </div>
            <div className="refer-stat-sep" />
            <div className="refer-stat">
              <span className="refer-stat-val">₹150</span>
              <span>Max Per Referral</span>
            </div>
          </div>
        </div>

        {/* Referral Code Box */}
        <div className="refer-code-section">
          <div className="refer-code-card">
            <h2>Your Referral Link</h2>
            <p>Share this link with friends — you both earn rewards!</p>
            <div className="refer-code-box">
              <div className="refer-link-display">
                <span className="refer-link-text">{referLink}</span>
              </div>
              <button className={`refer-copy-btn${copied ? ' copied' : ''}`} onClick={copyLink}>
                {copied ? '✅ Copied!' : '📋 Copy Link'}
              </button>
            </div>
            <div className="refer-code-label">
              Your Code: <span className="refer-code-val">{referCode}</span>
            </div>
            <div className="refer-share-btns">
              <button className="refer-share-btn wa" onClick={() => showToast('📱 Opening WhatsApp...')}>
                📱 WhatsApp
              </button>
              <button className="refer-share-btn tw" onClick={() => showToast('🐦 Opening Twitter...')}>
                🐦 Twitter
              </button>
              <button className="refer-share-btn fb" onClick={() => showToast('📘 Opening Facebook...')}>
                📘 Facebook
              </button>
              <button className="refer-share-btn tg" onClick={() => showToast('✈️ Opening Telegram...')}>
                ✈️ Telegram
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="refer-how">
          <h2>How It Works</h2>
          <div className="refer-how-steps">
            {[
              { icon: '🔗', title: 'Share Your Link', desc: 'Send your unique referral link to friends via WhatsApp, social media, or email' },
              { icon: '👋', title: 'Friend Signs Up', desc: 'Your friend creates a free LowPrice account using your link' },
              { icon: '🛒', title: 'They Shop & Save', desc: 'When they make their first purchase through LowPrice, you both earn rewards' },
              { icon: '💰', title: 'You Earn Forever', desc: 'Earn a percentage every time your referred friend shops — forever!' },
            ].map((s, i) => (
              <div key={i} className="refer-step">
                <div className="refer-step-num">{i + 1}</div>
                <div className="refer-step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < 3 && <div className="refer-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Tiers */}
        <div className="refer-tiers">
          <h2>Reward Tiers</h2>
          <p>The more friends you refer, the more you earn per referral!</p>
          <div className="refer-tiers-grid">
            {REWARDS_TIERS.map(t => (
              <div key={t.tier} className="refer-tier-card" style={{ borderTopColor: t.color }}>
                <span className="refer-tier-icon">{t.icon}</span>
                <h3>{t.tier}</h3>
                <div className="refer-tier-refs">{t.referrals} referrals</div>
                <div className="refer-tier-reward">{t.reward}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="refer-leaderboard">
          <h2>🏆 Top Referrers</h2>
          <p>Join the leaderboard and win bonus rewards!</p>
          <div className="refer-lb-table">
            <div className="refer-lb-header">
              <span>#</span>
              <span>Name</span>
              <span>City</span>
              <span>Referrals</span>
              <span>Earned</span>
            </div>
            {LEADERBOARD.map((l, i) => (
              <div key={i} className={`refer-lb-row${i < 3 ? ' top' : ''}`}>
                <span className="refer-lb-rank">
                  {i === 0 && '🥇'}{i === 1 && '🥈'}{i === 2 && '🥉'}{i > 2 && (i + 1)}
                </span>
                <span className="refer-lb-name">{l.name}</span>
                <span className="refer-lb-city">{l.city}</span>
                <span className="refer-lb-refs">{l.referrals}</span>
                <span className="refer-lb-earned">{l.earned}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="refer-faq">
          <h2>Frequently Asked Questions</h2>
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item${faqOpen === i ? ' open' : ''}`}>
              <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                {faq.q}
                <span className="faq-ico">+</span>
              </button>
              <div className="faq-a"><p>{faq.a}</p></div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}
