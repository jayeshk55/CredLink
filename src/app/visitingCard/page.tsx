"use client";

import React, { useEffect, useState } from "react";

interface DigitalCardProps {
  name: string;
  title: string;
  company?: string;
  location: string;
  about: string;
  skills: string;
  portfolio: string;
  experience: string;
  photo?: string;
  cover?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
}

const DigitalCardPreview: React.FC<DigitalCardProps> = ({
  name = "",
  title = "",
  company = "",
  location = "",
  about = "Crafting engaging content & SEO strategies",
  skills = "SEO, Content Creation, Analytics, Social Media",
  portfolio = "[Link] Latest Campaigns",
  experience = "Lead SEO Specialist (2021-Present)",
  photo = "",
  cover = "",
  email = "",
  phone = "",
  linkedin = "",
  website = "",
}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "J";
  const parsedCompany = (() => {
    const atIndex = experience.indexOf('@');
    if (atIndex !== -1) {
      const afterAt = experience.slice(atIndex + 1).trim();
      const end = afterAt.indexOf('(');
      return (end !== -1 ? afterAt.slice(0, end) : afterAt).trim();
    }
    return '';
  })();
  const companyFinal = company && company.trim().length > 0 ? company : parsedCompany;

  type Section = 'Services' | 'Portfolio' | 'Skills' | 'Experience' | 'Review';
  const [activePanel, setActivePanel] = useState<Section | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
  const portfolioList = portfolio.split(',').map((s) => s.trim()).filter(Boolean);
  const experienceList = experience.split(',').map((s) => s.trim()).filter(Boolean);

  const renderItem = (title: string, subtitle?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}></div>
        <div>
          <div style={{ fontWeight: 700, color: '#111827' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#6B7280' }}>{subtitle}</div>}
        </div>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </div>
  );

  const renderPanelContent = (section: Section) => {
    if (section === 'Skills') {
      const items = skillsList.length ? skillsList : ['SEO Optimization (Advanced)', 'Content Strategy (Expert)', 'Analytics & Reporting'];
      return (
        <div style={{ padding: isMobile ? 12 : 16 }}>
          {items.map((it, idx) => renderItem(it))}
        </div>
      );
    }
    if (section === 'Services') {
      const items = ['SEO Audits', 'Slogan Content Campaigns'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it) => renderItem(it))}</div>;
    }
    if (section === 'Portfolio') {
      const items = portfolioList.length ? portfolioList : ['Case Study 1', 'Project X', 'Client Y'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it) => renderItem(it))}</div>;
    }
    if (section === 'Experience') {
      const items = experienceList.length ? experienceList : ['Senior Marketer (Present)', 'Marketing Executive'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it) => renderItem(it))}</div>;
    }
    if (section === 'Review') {
      const items = ['John transformed our online presence!', 'Happy Client'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it) => renderItem(it))}</div>;
    }
    return null;
  };

  return (
    <div style={{
      width: "360px",
      borderRadius: "28px",
      overflow: "hidden",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
      fontFamily: "system-ui, sans-serif",
      position: "relative",
      background: "#ffffff",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #f59e0b 0%, #f97316 45%, #ef4444 100%)",
        padding: "22px",
        color: "white",
        position: "relative",
      }}>
        <div style={{
          width: "100%",
          height: "92px",
          borderRadius: "14px",
          background: cover ? "transparent" : "rgba(255,255,255,0.15)",
          border: "2px solid rgba(255,255,255,0.7)",
          overflow: "hidden",
        }}>
          {cover && (
            <img src={cover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-44px" }}>
          <div style={{
            width: "104px",
            height: "104px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "5px solid #ffffff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            background: photo ? "transparent" : "#60A5FA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {photo ? (
              <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "36px", fontWeight: 800, color: "white" }}>{firstLetter}</span>
            )}
          </div>

          {name && <h3 style={{ margin: "14px 0 8px", fontSize: "26px", fontWeight: 800, color: "#FFFFFF" }}>{name}</h3>}
          {(title || companyFinal) && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center", color: "#ffffff", opacity: 0.95 }}>
              {title && <span style={{ fontSize: "14px", fontWeight: 700 }}>{title}</span>}
              {title && companyFinal && <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.8)" }} />}
              {companyFinal && <span style={{ fontSize: "14px", fontWeight: 700 }}>{companyFinal}</span>}
            </div>
          )}
          {location && <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#FFFFFF" }}>{location}</p>}

          {/* Social Row */}
          <div style={{ display: "flex", gap: "10px", marginTop: "2px" }}>
            {/* Mail */}
            <a href={`mailto:${email || 'example@mykard.com'}`} style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" opacity="0"/>
                <path d="M4 8l8 5 8-5"/>
                <rect x="4" y="6" width="16" height="12" rx="2" ry="2"/>
              </svg>
            </a>
            {/* Phone */}
            <a href={`tel:${phone || '+911234567890'}`} style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href={linkedin || 'https://mykard.com'} target="_blank" rel="noopener noreferrer" style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4zM8.5 8.5h3.8v1.98h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V23h-4v-6.3c0-1.5-.03-3.44-2.1-3.44-2.1 0-2.42 1.64-2.42 3.34V23h-4z"/></svg>
            </a>
            {/* Globe */}
            <a href={website || 'https://mykard.com'} target="_blank" rel="noopener noreferrer" style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 010 20a15.3 15.3 0 010-20z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "2px 20px 16px", background: "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)", color: "#FFFFFF", textAlign: "center" }}>
        <p style={{ fontSize: "13px", lineHeight: 1.6, margin: 0, color: "#FFFFFF", opacity: 1 }}>
          {about}
        </p>

        {/* Pills */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "12px" }}>
          {[
            { text: "Services" },
            { text: "Portfolio" },
            { text: "Skills" },
            { text: "Experience" },
            { text: "Review" },
          ].map((b) => (
            <button
              key={b.text}
              onClick={() => setActivePanel(b.text as Section)}
              style={{
                padding: "8px 14px",
                background: "#ffffff",
                color: "#374151",
                border: "none",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
              }}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>

      {activePanel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setActivePanel(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: isMobile ? '100%' : 520, height: isMobile ? '100%' : 'auto', maxHeight: isMobile ? '100%' : '80vh', background: '#fff', borderRadius: isMobile ? 0 : 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative' }}
          >
            <div style={{ background: 'linear-gradient(180deg, #f59e0b 0%, #f97316 45%, #ef4444 100%)', color: '#fff', padding: isMobile ? '16px' : '18px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{activePanel}</div>
            </div>
            <button onClick={() => setActivePanel(null)} aria-label="Close" style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: 9999, border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer' }}>×</button>
            <div style={{ padding: 16, background: isMobile ? '#f3f4f6' : '#fff', overflowY: 'auto', height: isMobile ? 'calc(100% - 72px)' : 'auto' }}>
              {renderPanelContent(activePanel)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function VisitingCardPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
      <DigitalCardPreview 
        name="John Doe"
        title="Digital Marketer"
        company="MyKard"
        location="Mumbai, India"
        about="Crafting engaging content & SEO strategies"
        skills="SEO, Content Creation, Analytics"
        portfolio="https://example.com/portfolio"
        experience="Lead Marketer @ MyKard (2023-Present)"
        photo=""
        cover=""
        email="john.doe@example.com"
        phone="+911234567890"
        linkedin="https://linkedin.com/in/johndoe"
        website="https://johndoe.com"
      />
    </div>
  );
}