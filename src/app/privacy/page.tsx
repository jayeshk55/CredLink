"use client";
import React, { useEffect, useState } from 'react';

type SectionItem = {
  subtitle?: string;
  description?: string;
  items?: string[];
};

type Section = {
  title: string;
  content: SectionItem[];
};

export default function PrivacyPage() {
  const [vw, setVw] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;

  const sections: Section[] = [
    {
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "To Create and Display Your Digital Card",
          description:
            "We use your profile information to build your digital identity, display it if you choose to publish, and generate your unique link and QR code."
        },
        {
          subtitle: "To Improve Your Visibility",
          description:
            "We show your profile in search results, place you in relevant categories, and enable paid promotions for top visibility."
        },
        {
          subtitle: "To Facilitate Networking",
          description:
            "We allow others to follow you, send connection requests, contact you, and notify you of new leads/messages."
        },
        {
          subtitle: "To Provide Analytics",
          description:
            "We show analytics like profile views, QR scans, and link clicks, and may send weekly summary emails (optional)."
        },
        {
          subtitle: "To Ensure Safety & Compliance",
          description:
            "We detect fake or fraudulent profiles, verify identities, prevent spam/misuse, and comply with legal obligations."
        }
      ]
    },
    {
      title: "Who Can See Your Information",
      content: [
        {
          subtitle: "Public Information (Visible on Your Profile)",
          description: "Only if you choose to publish your profile:",
          items: [
            "Name, photo, designation",
            "Professional details, services & portfolio links",
            "Reviews, experience, certificates",
            "Profile theme and layout"
          ]
        },
        {
          subtitle: "Private Information (Not Public)",
          items: [
            "Phone number (unless you choose to show it)",
            "Email address, OTP details",
            "Payment information",
            "Messages and connection data",
            "Admin moderation records"
          ]
        }
      ]
    },
    {
      title: "How We Share Your Information",
      content: [
        {
          subtitle: "We Never Sell Your Personal Information",
          description: "We may share data only with:",
          items: [
            "Trusted Service Providers (hosting, OTP, payment gateways, email, analytics)",
            "Legal Compliance (if required by law)",
            "Consent-Based Sharing (if you opt-in for promotions or indexing)"
          ]
        }
      ]
    },
    {
      title: "Data Security Measures",
      content: [
        {
          items: [
            "HTTPS encryption, secure servers, and encryption at rest",
            "OTP-based authentication, firewalls, malware scanning",
            "Role-based admin access and regular security audits",
            "Target uptime: 99.5%"
          ]
        }
      ]
    },
    {
      title: "Your Rights",
      content: [
        {
          description: "You have the right to:",
          items: [
            "Edit or delete your profile",
            "Request a copy of your data",
            "Request complete deletion",
            "Disable promotional emails",
            "Withdraw consent anytime"
          ]
        }
      ]
    }
  ];

  const pageWrap: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #EFF6FF 100%)'
  };
  const container: React.CSSProperties = { maxWidth: isTablet ? 900 : 960, margin: '0 auto', padding: isMobile ? '20px 14px' : '32px 16px' };

  const heroBar: React.CSSProperties = {
    background: 'linear-gradient(90deg, #2563EB, #1D4ED8 50%, #1E40AF)',
    color: '#FFF',
    boxShadow: '0 12px 30px rgba(29,78,216,0.35)'
  };
  const heroInner: React.CSSProperties = { ...container, paddingTop: isMobile ? 28 : 48, paddingBottom: isMobile ? 36 : 64 };
  const heroRow: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 12 : 16, textAlign: 'center' };

  const heroTitle: React.CSSProperties = { fontSize: isMobile ? 28 : isTablet ? 34 : 40, fontWeight: 800, margin: isMobile ? '8px 0' : '0 0 8px 0' };

  const heroDesc: React.CSSProperties = { color: '#DBEAFE', fontSize: isMobile ? 14 : 16, margin: isMobile ? '0 0 10px 0' : '0 0 12px 0' };
  const heroMetaRow: React.CSSProperties = { display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 8 : 24, fontSize: isMobile ? 12 : 13, alignItems: isMobile ? 'center' : 'flex-start' };
  const metaDot: React.CSSProperties = { width: 8, height: 8, background: '#93C5FD', borderRadius: 9999 };

  const card: React.CSSProperties = {
    background: '#FFF',
    borderRadius: 12,
    boxShadow: '0 10px 22px rgba(0,0,0,0.06)',
    border: '1px solid #E5E7EB'
  };
  const cardPad: React.CSSProperties = { padding: isMobile ? 16 : 24 };

  const cardHeader: React.CSSProperties = {
    padding: '16px 24px',
    background: 'linear-gradient(90deg, #2563EB, #1D4ED8)',
    color: '#FFF',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  };
  const cardTitle: React.CSSProperties = { fontSize: 20, fontWeight: 700, margin: 0 };
  const sectionGap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 24 };

  const itemSubtitle: React.CSSProperties = { fontWeight: 700, color: '#1D4ED8', fontSize: isMobile ? 12 : 13, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '6px 0' };
  const pText: React.CSSProperties = { color: '#374151', fontSize: isMobile ? 13 : 14, lineHeight: 1.7, margin: '0 0 8px 0' };
  const ulReset: React.CSSProperties = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: isMobile ? 6 : 8 };
  const liRow: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 10, color: '#374151', fontSize: isMobile ? 13 : 14 };
  const liDot: React.CSSProperties = { width: 8, height: 8, marginTop: 6, background: '#2563EB', borderRadius: 9999, flexShrink: 0 };

  const twoCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24, marginTop: isMobile ? 16 : 24 };

  const contactBand: React.CSSProperties = { background: 'linear-gradient(90deg, #2563EB, #1D4ED8)', color: '#FFF', borderRadius: 12, padding: isMobile ? 20 : 28, boxShadow: '0 16px 32px rgba(37,99,235,0.35)', marginTop: isMobile ? 20 : 24 };
  const contactHead: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, marginBottom: isMobile ? 10 : 12 };

  const contactGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr', gap: isMobile ? 12 : 16 };
  const contactCard: React.CSSProperties = { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 10, padding: isMobile ? 14 : 16, textDecoration: 'none', color: '#FFF' };
  const contactRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 };

  const footer: React.CSSProperties = { background: '#111827', color: '#9CA3AF', marginTop: 48 };
  const footerInner: React.CSSProperties = { ...container, textAlign: 'center', paddingTop: 24, paddingBottom: 24 };

  return (
    <div style={pageWrap}>
      <div style={heroBar}>
        <div style={heroInner}>
          <div style={heroRow}>
            <div style={{ flex: 1 }}>
              <h1 style={heroTitle}>Privacy Policy</h1>
              <p style={heroDesc}>Your privacy matters to us. Learn how we protect and manage your data on MyKard.</p>

              <div style={heroMetaRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={metaDot} />
                  <span>Effective Date: <strong>[19/11/25]</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={metaDot} />
                  <span>Company: <strong>MyKard</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={container}>
        <div style={{ ...card, borderLeft: '4px solid #2563EB', marginBottom: isMobile ? 16 : 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: isMobile ? 16 : 24 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, margin: '0 0 8px 0', color: '#111827' }}>About This Policy</h2>
              <p style={pText}>MyKard ("we", "our", "us") is a digital identity, professional networking, and visibility platform. We allow users to create a digital professional card, showcase their skills, connect with others, and promote their profiles. We respect your privacy and are fully committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, protect, share, and manage your information when you use MyKard.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {sections.map((section, idx) => {
            return (
              <div key={idx} style={card}>
                <div style={cardHeader}>
                  <h3 style={{ ...cardTitle, fontSize: isMobile ? 18 : 20 }}>{section.title}</h3>

                </div>
                <div style={cardPad}>

                  <div style={sectionGap}>
                    {section.content.map((item, i) => (
                      <div key={i}>
                        {item.subtitle ? <div style={itemSubtitle}>{item.subtitle}</div> : null}
                        {item.description ? <p style={pText}>{item.description}</p> : null}
                        {item.items ? (
                          <ul style={ulReset}>
                            {item.items.map((txt: string, n: number) => (
                              <li key={n} style={liRow}>
                                <div style={liDot} />
                                <span>{txt}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={twoCol}>
          <div style={{ ...card, background: 'linear-gradient(135deg, #F0F7FF, #FFFFFF)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24, paddingBottom: 0 }}>
              <h3 style={{ ...cardTitle, color: '#111827' }}>Data Retention</h3>
            </div>
            <div style={cardPad}>
              <ul style={ulReset}>

                {[
                  'Active accounts → retained until deleted',
                  'Messages/logs → limited retention for integrity',
                  'Payment records → per legal requirements',
                  'Deleted profiles → removed within 30–90 days',
                ].map((t, i) => (
                  <li key={i} style={liRow}><div style={liDot} /><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ ...card, background: 'linear-gradient(135deg, #F0F7FF, #FFFFFF)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24, paddingBottom: 0 }}>
              <h3 style={{ ...cardTitle, color: '#111827' }}>Children's Privacy</h3>
            </div>
            <div style={cardPad}>
              <p style={pText}>MyKard is not for users under 16 years. We do not knowingly collect information from minors. If collected unknowingly, contact us for removal.</p>
            </div>
          </div>

          <div style={{ ...card, background: 'linear-gradient(135deg, #F0F7FF, #FFFFFF)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24, paddingBottom: 0 }}>
              <h3 style={{ ...cardTitle, color: '#111827' }}>International Data Transfer</h3>
            </div>
            <div style={cardPad}>
              <p style={pText}>If you access MyKard from outside India, your data may be processed on servers in India or other regions. We follow the same privacy standards regardless of region.</p>
            </div>
          </div>

          <div style={{ ...card, background: 'linear-gradient(135deg, #F0F7FF, #FFFFFF)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24, paddingBottom: 0 }}>
              <h3 style={{ ...cardTitle, color: '#111827' }}>Policy Updates</h3>
            </div>
            <div style={cardPad}>
              <p style={pText}>We may update this policy to improve clarity, add features, or comply with regulations. We will notify users of major changes via email or on-site notification.</p>
            </div>
          </div>
        </div>

        <div style={contactBand}>
          <div style={contactHead}>
            <h3 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Contact Us</h3>
          </div>
          <p style={{ color: '#D1E5FF', margin: '0 0 16px 0' }}>For questions or requests related to privacy, reach out to us:</p>
          <div style={contactGrid}>
            <a href="mailto:hellosupport@mykard.in" style={contactCard}>
              <div style={contactRow}>
                <div>
                  <div style={{ fontSize: 12, color: '#DBEAFE' }}>Email</div>
                  <div style={{ fontWeight: 600 }}>hellosupport@mykard.in</div>
                </div>
              </div>
            </a>
            <div style={contactCard}>
              <div style={contactRow}>
                <div>
                  <div style={{ fontSize: 12, color: '#DBEAFE' }}>Location</div>
                  <div style={{ fontWeight: 600 }}>India</div>
                </div>
              </div>
            </div>
            <a href="https://mykard.in" target="_blank" rel="noreferrer" style={contactCard}>
              <div style={contactRow}>
                <div>
                  <div style={{ fontSize: 12, color: '#DBEAFE' }}>Website</div>
                  <div style={{ fontWeight: 600 }}>www.mykard.in</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <footer style={footer}>
        <div style={footerInner}>
          <p style={{ margin: 0 }}> 2025 My Kard All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}