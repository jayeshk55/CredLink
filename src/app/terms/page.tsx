import React from 'react';

export default function TermsPage() {
  // Inline styles
  const page: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #EFF6FF 100%)'
  };
  const container: React.CSSProperties = {
    maxWidth: 960,
    margin: '0 auto',
    padding: '32px 16px'
  };
  const hero: React.CSSProperties = {
    background: 'linear-gradient(90deg, #2563EB, #1D4ED8)',
    color: '#FFFFFF',
    boxShadow: '0 12px 30px rgba(29,78,216,0.25)'
  };
  const heroInner: React.CSSProperties = {
    ...container,
    textAlign: 'center',
    paddingTop: 48,
    paddingBottom: 56
  };
  const heroTitle: React.CSSProperties = {
    fontSize: 40,
    fontWeight: 900,
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em'
  };
  const heroDesc: React.CSSProperties = {
    fontSize: 16,
    color: '#DBEAFE',
    margin: 0
  };

  const sectionCard: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    boxShadow: '0 10px 22px rgba(0,0,0,0.06)'
  };
  const sectionHeader: React.CSSProperties = {
    padding: '16px 20px',
    background: 'linear-gradient(90deg, #2563EB, #1D4ED8)',
    color: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    fontWeight: 800,
    fontSize: 18,
    margin: 0
  };
  const sectionBody: React.CSSProperties = { padding: 20 };
  const p: React.CSSProperties = {
    color: '#374151',
    lineHeight: 1.7,
    margin: '0 0 10px 0',
    fontSize: 14
  };
  const ul: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  };
  const li: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    color: '#374151',
    fontSize: 14
  };
  const dot: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: 9999,
    background: '#2563EB',
    marginTop: 6,
    flexShrink: 0
  };
  const grid: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
  const link: React.CSSProperties = { color: '#2563EB', textDecoration: 'none', fontWeight: 600 };

  return (
    <div style={page}>
      {/* Hero */}
      <div style={hero}>
        <div style={heroInner}>
          <h1 style={heroTitle}>Terms of Service</h1>
          <p style={heroDesc}>Please read these Terms carefully before using MyKard.</p>
        </div>
      </div>

      {/* Content */}
      <div style={container}>
        <div style={grid}>
          {/* 1. About MyKard */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>1. About MyKard</h3>
            <div style={sectionBody}>
              <p style={p}>MyKard is a digital identity and professional visibility platform that allows users to:</p>
              <ul style={ul}>
                {[
                  'Create a digital professional card',
                  'Share skills, portfolio, and experience',
                  'Generate a public profile and QR code',
                  'Search and connect with other professionals',
                  'Promote their profile using paid visibility options',
                  'Track analytics such as views, scans, and clicks'
                ].map((t, i) => (
                  <li key={i} style={li}><div style={dot} /><span>{t}</span></li>
                ))}
              </ul>
              <p style={p}>These Terms govern your usage of all features offered on MyKard.</p>
            </div>
          </div>

          {/* 2. Eligibility */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>2. Eligibility</h3>
            <div style={sectionBody}>
              <p style={p}>To use MyKard, you must:</p>
              <ul style={ul}>
                {[
                  'Be at least 16 years old',
                  'Provide accurate and truthful information',
                  'Not be banned by our platform',
                  'Comply with all laws in your region'
                ].map((t, i) => (
                  <li key={i} style={li}><div style={dot} /><span>{t}</span></li>
                ))}
              </ul>
              <p style={p}>If you create an account on behalf of a company, you confirm that you are authorized to do so.</p>
            </div>
          </div>

          {/* 3. Your MyKard Account */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>3. Your MyKard Account</h3>
            <div style={sectionBody}>
              <p style={p}>When you create an account, you must:</p>
              <ul style={ul}>
                {[
                  'Provide accurate information',
                  'Keep your login credentials secure',
                  'Not share your OTP with anyone',
                  'Be responsible for all activity under your account'
                ].map((t, i) => (
                  <li key={i} style={li}><div style={dot} /><span>{t}</span></li>
                ))}
              </ul>
              <p style={p}>If you suspect unauthorized access, inform us immediately at: <a href="mailto:hello@mykard.in" style={link}>hello@mykard.in</a></p>
              <p style={p}>We may suspend or terminate your account if you violate these Terms.</p>
            </div>
          </div>

          {/* 4. Acceptable Use Policy */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>4. Acceptable Use Policy</h3>
            <div style={sectionBody}>
              <p style={p}>You agree not to use MyKard for:</p>
              <ul style={ul}>
                {[
                  'Illegal activities',
                  'Fake profiles or misrepresentation',
                  'Uploading harmful, misleading, or abusive content',
                  'Attempting to hack, reverse engineer, or disrupt our services',
                  'Spamming users with unwanted messages',
                  'Posting copyrighted content without permission',
                  'Selling or transferring your account'
                ].map((t, i) => (
                  <li key={i} style={li}><div style={dot} /><span>{t}</span></li>
                ))}
              </ul>
              <p style={p}>We reserve the right to review and moderate profiles for safety and authenticity.</p>
            </div>
          </div>

          {/* 5. Your Content and Rights */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>5. Your Content and Rights</h3>
            <div style={sectionBody}>
              <p style={p}>You own the content you upload to MyKard. By posting content (text, images, links, certificates), you grant MyKard a non-exclusive license to:</p>
              <ul style={ul}>
                {[
                  'Display it publicly on your profile',
                  'Use it to provide platform services',
                  'Promote your profile (if you choose paid promotions)'
                ].map((t, i) => (
                  <li key={i} style={li}><div style={dot} /><span>{t}</span></li>
                ))}
              </ul>
              <p style={p}>We do not claim ownership of your content.</p>
            </div>
          </div>

          {/* 6. Public Profile Visibility */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>6. Public Profile Visibility</h3>
            <div style={sectionBody}>
              <p style={p}>When you publish your MyKard profile:</p>
              <ul style={ul}>
                {[
                  'Anyone can view it',
                  'It may appear in search results',
                  'It may be indexed by search engines like Google',
                  'People can follow, connect, or contact you',
                  'You may unpublish or delete your profile anytime'
                ].map((t, i) => (
                  <li key={i} style={li}><div style={dot} /><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </div>

          {/* 7. Paid Services and Promotions */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>7. Paid Services and Promotions</h3>
            <div style={sectionBody}>
              <p style={p}>MyKard offers paid features such as: Profile Boost / Featured Listings, Premium themes, Visibility promotions, Business pages (future feature)</p>
              <p style={{ ...p, marginTop: 8, fontWeight: 700, color: '#1F2937' }}>Payments</p>
              <ul style={ul}>
                {[
                  'Payments are processed securely via Razorpay/Stripe',
                  'We do not store your card details',
                  'All fees are non-refundable, except in cases of technical failure'
                ].map((t, i) => (
                  <li key={i} style={li}><div style={dot} /><span>{t}</span></li>
                ))}
              </ul>
              <p style={{ ...p, marginTop: 8, fontWeight: 700, color: '#1F2937' }}>Billing Issues</p>
              <p style={p}>If payment fails or is accidentally charged, email us within 48 hours.</p>
            </div>
          </div>

          {/* 8. Analytics and Insights */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>8. Analytics and Insights</h3>
            <div style={sectionBody}>
              <p style={p}>MyKard provides users with analytics such as: Profile views, QR scans, Click counts.</p>
              <p style={p}>These numbers are estimates based on internal tracking and may not be 100% precise.</p>
            </div>
          </div>

          {/* 9. Intellectual Property */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>9. Intellectual Property</h3>
            <div style={sectionBody}>
              <p style={p}>All MyKard content except user profiles is owned by BoostNow Solution LLP, including: Website design, Logo, Branding, Code, features, and functionality, Text, graphics, and layouts.</p>
              <p style={p}>You may not copy, distribute, resell, or reproduce our platform or content.</p>
            </div>
          </div>

          {/* 10. Third-Party Links */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>10. Third-Party Links</h3>
            <div style={sectionBody}>
              <p style={p}>Your MyKard profile may contain links to: LinkedIn, Google reviews, YouTube, Websites, Social media.</p>
              <p style={p}>We are not responsible for content on third-party sites, their privacy practices, or their availability or accuracy. You interact with external links at your own risk.</p>
            </div>
          </div>

          {/* 11. Suspension or Termination */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>11. Suspension or Termination</h3>
            <div style={sectionBody}>
              <p style={p}>We may suspend or delete accounts that: Post fake or harmful content, Violate our Terms, Engage in fraud or impersonation, Misuse paid promotion features, Harm other users.</p>
              <p style={p}>If your account is terminated: You lose access to your data, Your profile link becomes inactive. You may request account deletion anytime.</p>
            </div>
          </div>

          {/* 12. Disclaimers */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>12. Disclaimers</h3>
            <div style={sectionBody}>
              <p style={p}>MyKard provides services “as is” and “as available.” We do not guarantee that profiles will generate clients, unlimited visibility, perfect analytics accuracy, or continuous, uninterrupted service.</p>
              <p style={p}>We are not responsible for: Losses due to downtime, Errors caused by user actions, Third-party failures (hosting, payment gateway).</p>
            </div>
          </div>

          {/* 13. Limitation of Liability */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>13. Limitation of Liability</h3>
            <div style={sectionBody}>
              <p style={p}>To the maximum extent permitted by law: MyKard is not liable for business losses, data loss, revenue loss, or damages arising from use of the platform. Users are responsible for the accuracy and legality of their own content. MyKard does not mediate communication or disputes between users.</p>
            </div>
          </div>

          {/* 14. Data Privacy */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>14. Data Privacy</h3>
            <div style={sectionBody}>
              <p style={p}>Your use of the platform is also governed by our Privacy Policy, which explains how we collect and handle your data.</p>
              <p style={p}>Read it here: <a href="/privacy" style={link}>Privacy Policy</a></p>
            </div>
          </div>

          {/* 15. Changes to These Terms */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>15. Changes to These Terms</h3>
            <div style={sectionBody}>
              <p style={p}>We may modify these Terms anytime to: Add new features, Improve security, Comply with laws, Correct unclear statements. We will notify users of significant updates. Continued use of MyKard after changes means you accept the updated Terms.</p>
            </div>
          </div>

          {/* 16. Contact Us */}
          <div style={sectionCard}>
            <h3 style={sectionHeader}>16. Contact Us</h3>
            <div style={sectionBody}>
              <p style={p}>For questions or concerns:</p>
              <ul style={ul}>
                <li style={li}><div style={dot} /><span>Email: <a href="mailto:hello@mykard.in" style={link}>hello@mykard.in</a></span></li>
                <li style={li}><div style={dot} /><span>India</span></li>
                <li style={li}><div style={dot} /><span>Website: <a href="https://mykard.in" target="_blank" rel="noreferrer" style={link}>www.mykard.in</a></span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 }
