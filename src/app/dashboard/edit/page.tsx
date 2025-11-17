'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// ====================================================================
// START: DigitalCardPreview Component (Modified to accept theme)
// ====================================================================

interface DigitalCardProps {
  name: string;
  title: string;
  company?: string;
  location: string;
  about: string;
  skills: string;
  portfolio: string;
  experience: string;
  services: string; // Added prop
  review: string; // Added prop
  photo?: string | null;
  cover?: string | null;
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  themeColor1: string; // Changed to themeColor1
  themeColor2: string; // New prop for second color
  fontFamily: string; 
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
  services = "SEO Audits, Slogan Content Campaigns", // Added
  review = "John transformed our online presence!, Happy Client", // Added
  photo = "",
  cover = "",
  email = "",
  phone = "",
  linkedin = "",
  website = "",
  themeColor1, 
  themeColor2, 
  fontFamily, 
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

  // Updated to use props
  const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
  const portfolioList = portfolio.split(',').map((s) => s.trim()).filter(Boolean);
  const experienceList = experience.split(',').map((s) => s.trim()).filter(Boolean);
  const servicesList = services.split(',').map((s) => s.trim()).filter(Boolean);
  const reviewList = review.split(',').map((s) => s.trim()).filter(Boolean);

  const renderItem = (title: string, subtitle?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: themeColor1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>★</div>
        <div>
          <div style={{ fontWeight: 700, color: '#111827' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#6B7280' }}>{subtitle}</div>}
        </div>
      </div>
    </div>
  );

  const renderPanelContent = (section: Section) => {
    if (section === 'Skills') {
      const items = skillsList.length ? skillsList : ['SEO Optimization (Advanced)', 'Content Strategy (Expert)', 'Analytics & Reporting'];
      return (
        <div style={{ padding: isMobile ? 12 : 16 }}>
          {items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}
        </div>
      );
    }
    if (section === 'Services') {
      // Changed to use prop
      const items = servicesList.length ? servicesList : ['SEO Audits', 'Slogan Content Campaigns'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Portfolio') {
      const items = portfolioList.length ? portfolioList : ['Case Study 1', 'Project X', 'Client Y'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Experience') {
      const items = experienceList.length ? experienceList : ['Senior Marketer (Present)', 'Marketing Executive'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Review') {
      // Changed to use prop
      const items = reviewList.length ? reviewList : ['John transformed our online presence!', 'Happy Client'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    return null;
  };

  return (
    <div style={{
      width: "360px",
      borderRadius: "28px",
      overflow: "hidden",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
      fontFamily: fontFamily, 
      position: "relative",
      background: `linear-gradient(135deg, ${themeColor1} 0%, ${themeColor2} 100%)`,
    }}>
      {/* Header */}
      <div style={{
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
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}> 
            {/* Mail */}
            <div
              onClick={() => {
                if (email) window.location.href = `mailto:${email}`;
                else window.location.href = 'mailto:example@MyKard.com';
              }}
              style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", cursor: "pointer" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" opacity="0"/>
                <path d="M4 8l8 5 8-5"/>
                <rect x="4" y="6" width="16" height="12" rx="2" ry="2"/>
              </svg>
            </div>
            
            <a href={`tel:${phone || '+911234567890'}`} style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href={linkedin || 'https://linkedin.com'} target="_blank" rel="noopener noreferrer" style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4zM8.5 8.5h3.8v1.98h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V23h-4v-6.3c0-1.5-.03-3.44-2.1-3.44-2.1 0-2.42 1.64-2.42 3.34V23h-4z"/></svg>
            </a>
            {/* Globe */}
            <div
              onClick={() => window.open(website || 'https://MyKard.com', '_blank', 'noopener noreferrer')}
              style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", cursor: "pointer" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 010 20a15.3 15.3 0 010-20z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 16px", color: "#FFFFFF", textAlign: "center" }}>
        <p style={{ fontSize: "13px", lineHeight: 1.6, margin: 0, color: "#FFFFFF", opacity: 1 }}>
          {about}
        </p>

        {/* Pills */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "16px" }}>
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
                background: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              }}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>

      {activePanel && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }} onClick={() => setActivePanel(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: isMobile ? '100%' : 'calc(100% - 24px)', maxWidth: 520, height: isMobile ? '100%' : 'auto', maxHeight: isMobile ? '100%' : '80%', background: '#fff', borderRadius: isMobile ? 0 : 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative' }}
          >
            <div style={{ background: `linear-gradient(135deg, ${themeColor1} 0%, ${themeColor2} 100%)`, color: '#fff', padding: isMobile ? '16px' : '18px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{activePanel}</div>
            </div>
            <button onClick={() => setActivePanel(null)} aria-label="Close" style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: 9999, border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer', zIndex: 10 }}>×</button>
            <div style={{ padding: 16, background: isMobile ? '#f3f4f6' : '#fff', overflowY: 'auto', height: isMobile ? 'calc(100% - 72px)' : 'auto' }}>
              {renderPanelContent(activePanel)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ====================================================================
// START: Template-Specific Card Components
// ====================================================================

// Flat Template
const FlatCardPreview: React.FC<DigitalCardProps> = ({
  name = "", title = "", company = "", location = "", about = "", photo = "", cover = "",
  email = "", phone = "", linkedin = "", website = "", themeColor1, themeColor2, fontFamily,
  skills = "", portfolio = "", experience = "", services = "", review = ""
}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "J";
  
  type Section = 'Services' | 'Portfolio' | 'Skills' | 'Experience' | 'Review';
  const [activePanel, setActivePanel] = useState<Section | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Updated to use props
  const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
  const portfolioList = portfolio.split(',').map((s) => s.trim()).filter(Boolean);
  const experienceList = experience.split(',').map((s) => s.trim()).filter(Boolean);
  const servicesList = services.split(',').map((s) => s.trim()).filter(Boolean);
  const reviewList = review.split(',').map((s) => s.trim()).filter(Boolean);

  const renderItem = (title: string, subtitle?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: themeColor1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>★</div>
        <div>
          <div style={{ fontWeight: 700, color: '#111827' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#6B7280' }}>{subtitle}</div>}
        </div>
      </div>
    </div>
  );

  const renderPanelContent = (section: Section) => {
    if (section === 'Skills') {
      const items = skillsList.length ? skillsList : ['SEO Optimization (Advanced)', 'Content Strategy (Expert)', 'Analytics & Reporting'];
      return (
        <div style={{ padding: isMobile ? 12 : 16 }}>
          {items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}
        </div>
      );
    }
    if (section === 'Services') {
      const items = servicesList.length ? servicesList : ['SEO Audits', 'Slogan Content Campaigns'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Portfolio') {
      const items = portfolioList.length ? portfolioList : ['Case Study 1', 'Project X', 'Client Y'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Experience') {
      const items = experienceList.length ? experienceList : ['Senior Marketer (Present)', 'Marketing Executive'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Review') {
      const items = reviewList.length ? reviewList : ['John transformed our online presence!', 'Happy Client'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    return null;
  };
  
  return (
    <div style={{
      width: "360px", borderRadius: "12px", overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)", fontFamily: fontFamily,
      background: `linear-gradient(135deg, ${themeColor1} 0%, ${themeColor2} 100%)`, border: `3px solid ${themeColor1}`,
      position: 'relative'
    }}>
      {/* Cover Image Section */}
      <div style={{
        width: "100%", height: "120px", overflow: "hidden",
        backgroundImage: cover ? "none" : `linear-gradient(135deg, ${themeColor1}, ${themeColor2})`,
        backgroundSize: cover ? "cover" : "auto",
        backgroundPosition: cover ? "center" : "initial",
        backgroundColor: cover ? "transparent" : "transparent"
      }}>
        {cover && (
          <img src={cover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>
      <div style={{ padding: "24px", textAlign: "center" }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "12px", overflow: "hidden",
          margin: "0 auto 16px", background: photo ? "transparent" : themeColor1,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {photo ? (
            <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "32px", fontWeight: 700, color: "white" }}>{firstLetter}</span>
          )}
        </div>
        {name && <h3 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#FFFFFF" }}>{name}</h3>}
        {title && <p style={{ margin: "0 0 4px", fontSize: "16px", color: "#FFFFFF", fontWeight: 600, opacity: 0.95 }}>{title}</p>}
        {company && <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#FFFFFF" }}>{company}</p>}
        {location && <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#FFFFFF" }}>{location}</p>}
        <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#FFFFFF", margin: "0 0 20px", opacity: 0.9 }}>{about}</p>
        
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <a href={`mailto:${email}`} style={{
            width: "40px", height: "40px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
            border: "1px solid rgba(255, 255, 255, 0.4)"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="4" y="6" width="16" height="12" rx="2" ry="2"/>
              <path d="M4 8l8 5 8-5"/>
            </svg>
          </a>
          <a href={`tel:${phone}`} style={{
            width: "40px", height: "40px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
            border: "1px solid rgba(255, 255, 255, 0.4)"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.63A2 2 0 01 3.08 2h3a2 2 0 01 2 1.72 12.84 12.84 0 00 .7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 00 6 6l1.27-1.27a2 2 0 01 2.11-.45 12.84 12.84 0 00 2.81.7A2 2 0 01 22 16.92z"/>
            </svg>
          </a>
          <a href={linkedin} style={{
            width: "40px", height: "40px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
            border: "1px solid rgba(255, 255, 255, 0.4)"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4zM8.5 8.5h3.8v1.98h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V23h-4v-6.3c0-1.5-.03-3.44-2.1-3.44-2.1 0-2.42 1.64-2.42 3.34V23h-4z"/>
            </svg>
          </a>
          <a href={website} style={{
            width: "40px", height: "40px", borderRadius: "9999px", background: "rgba(255, 255, 255, 0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
            border: "1px solid rgba(255, 255, 255, 0.4)"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 010 20a15.3 15.3 0 010-20z"/>
            </svg>
          </a>
        </div>

        {/* Pills Section */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "16px" }}>
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
                background: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              }}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>

      {activePanel && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }} onClick={() => setActivePanel(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              width: isMobile ? '100%' : 'calc(100% - 24px)',
              maxWidth: 520,
              maxHeight: isMobile ? '100%' : '80%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ padding: isMobile ? 12 : 16, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 700 }}>{activePanel}</h3>
              <button onClick={() => setActivePanel(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9CA3AF' }}>×</button>
            </div>
            <div style={{ maxHeight: isMobile ? 'calc(80vh - 60px)' : 400, overflow: 'auto' }}>
              {renderPanelContent(activePanel)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modern Template
const ModernCardPreview: React.FC<DigitalCardProps> = ({
  name = "", title = "", company = "", location = "", about = "", photo = "", cover = "",
  email = "", phone = "", linkedin = "", website = "", themeColor1, themeColor2, fontFamily,
  skills = "", portfolio = "", experience = "", services = "", review = ""
}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "J";
  
  type Section = 'Services' | 'Portfolio' | 'Skills' | 'Experience' | 'Review';
  const [activePanel, setActivePanel] = useState<Section | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Updated to use props
  const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
  const portfolioList = portfolio.split(',').map((s) => s.trim()).filter(Boolean);
  const experienceList = experience.split(',').map((s) => s.trim()).filter(Boolean);
  const servicesList = services.split(',').map((s) => s.trim()).filter(Boolean);
  const reviewList = review.split(',').map((s) => s.trim()).filter(Boolean);

  const renderItem = (title: string, subtitle?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: themeColor1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>★</div>
        <div>
          <div style={{ fontWeight: 700, color: '#111827' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#6B7280' }}>{subtitle}</div>}
        </div>
      </div>
    </div>
  );

  const renderPanelContent = (section: Section) => {
    if (section === 'Skills') {
      const items = skillsList.length ? skillsList : ['SEO Optimization (Advanced)', 'Content Strategy (Expert)', 'Analytics & Reporting'];
      return (
        <div style={{ padding: isMobile ? 12 : 16 }}>
          {items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}
        </div>
      );
    }
    if (section === 'Services') {
      const items = servicesList.length ? servicesList : ['SEO Audits', 'Slogan Content Campaigns'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Portfolio') {
      const items = portfolioList.length ? portfolioList : ['Case Study 1', 'Project X', 'Client Y'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Experience') {
      const items = experienceList.length ? experienceList : ['Senior Marketer (Present)', 'Marketing Executive'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Review') {
      const items = reviewList.length ? reviewList : ['John transformed our online presence!', 'Happy Client'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    return null;
  };
  
  return (
    <div style={{
      width: "360px", borderRadius: "20px", overflow: "hidden",
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)", fontFamily: fontFamily,
      background: `linear-gradient(135deg, ${themeColor1} 0%, ${themeColor2} 100%)`,
      border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", position: 'relative'
    }}>
      {/* Cover Image Section */}
      <div style={{
        width: "100%", height: "140px", overflow: "hidden",
        backgroundImage: cover ? "none" : `linear-gradient(135deg, ${themeColor1}, ${themeColor2})`,
        backgroundSize: cover ? "cover" : "auto",
        backgroundPosition: cover ? "center" : "initial",
        backgroundColor: cover ? "transparent" : "transparent",
        borderRadius: "20px 20px 0 0"
      }}>
        {cover && (
          <img src={cover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>
      <div style={{ padding: "28px", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden",
            background: photo ? "transparent" : `linear-gradient(135deg, ${themeColor1}, ${themeColor2})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `2px solid ${themeColor1}40`
          }}>
            {photo ? (
              <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>{firstLetter}</span>
            )}
          </div>
          <div>
            {name && <h3 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: "#FFFFFF" }}>{name}</h3>}
            {title && <p style={{ margin: "0 0 2px", fontSize: "14px", color: "#FFFFFF", fontWeight: 600, opacity: 0.95 }}>{title}</p>}
            {company && <p style={{ margin: "0", fontSize: "13px", color: "#FFFFFF" }}>{company}</p>}
          </div>
        </div>
        
        {location && <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={themeColor1} strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {location}
        </p>}
        
        <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#FFFFFF", margin: "0 0 24px", opacity: 0.9 }}>{about}</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <a href={`mailto:${email}`} style={{
            padding: "12px", borderRadius: "12px", background: `${themeColor1}10`,
            border: `1px solid ${themeColor1}30`, textDecoration: "none",
            display: "flex", alignItems: "center", gap: "8px", color: "#FFFFFF", fontSize: "12px", fontWeight: 600
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="6" width="16" height="12" rx="2" ry="2"/>
              <path d="M4 8l8 5 8-5"/>
            </svg>
            Email
          </a>
          <a href={`tel:${phone}`} style={{
            padding: "12px", borderRadius: "12px", background: `${themeColor1}10`,
            border: `1px solid ${themeColor1}30`, textDecoration: "none",
            display: "flex", alignItems: "center", gap: "8px", color: "#FFFFFF", fontSize: "12px", fontWeight: 600
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ marginRight: 2 }}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
            Call
          </a>
          <a href={linkedin} style={{
            padding: "12px", borderRadius: "12px", background: `${themeColor1}10`,
            border: `1px solid ${themeColor1}30`, textDecoration: "none",
            display: "flex", alignItems: "center", gap: "8px", color: "#FFFFFF", fontSize: "12px", fontWeight: 600
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: 2 }}>
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4zM8.5 8.5h3.8v1.98h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V23h-4v-6.3c0-1.5-.03-3.44-2.1-3.44-2.1 0-2.42 1.64-2.42 3.34V23h-4z"/>
            </svg>
            LinkedIn
          </a>
          <a href={website} style={{
            padding: "12px", borderRadius: "12px", background: `${themeColor1}10`,
            border: `1px solid ${themeColor1}30`, textDecoration: "none",
            display: "flex", alignItems: "center", gap: "8px", color: "#FFFFFF", fontSize: "12px", fontWeight: 600
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 010 20a15.3 15.3 0 010-20z"/>
            </svg>
            Website
          </a>
        </div>

        {/* Pills Section */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "16px" }}>
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
                background: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              }}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>

      {activePanel && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }} onClick={() => setActivePanel(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              width: isMobile ? '100%' : 'calc(100% - 24px)',
              maxWidth: 520,
              maxHeight: isMobile ? '100%' : '80%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ padding: isMobile ? 12 : 16, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 700 }}>{activePanel}</h3>
              <button onClick={() => setActivePanel(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9CA3AF' }}>×</button>
            </div>
            <div style={{ maxHeight: isMobile ? 'calc(80vh - 60px)' : 400, overflow: 'auto' }}>
              {renderPanelContent(activePanel)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sleek Template
const SleekCardPreview: React.FC<DigitalCardProps> = ({
  name = "", title = "", company = "", location = "", about = "", photo = "", cover = "",
  email = "", phone = "", linkedin = "", website = "", themeColor1, themeColor2, fontFamily,
  skills = "", portfolio = "", experience = "", services = "", review = ""
}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "J";
  
  type Section = 'Services' | 'Portfolio' | 'Skills' | 'Experience' | 'Review';
  const [activePanel, setActivePanel] = useState<Section | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Updated to use props
  const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
  const portfolioList = portfolio.split(',').map((s) => s.trim()).filter(Boolean);
  const experienceList = experience.split(',').map((s) => s.trim()).filter(Boolean);
  const servicesList = services.split(',').map((s) => s.trim()).filter(Boolean);
  const reviewList = review.split(',').map((s) => s.trim()).filter(Boolean);

  const renderItem = (title: string, subtitle?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: themeColor1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>★</div>
        <div>
          <div style={{ fontWeight: 700, color: '#111827' }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#6B7280' }}>{subtitle}</div>}
        </div>
      </div>
    </div>
  );

  const renderPanelContent = (section: Section) => {
    if (section === 'Skills') {
      const items = skillsList.length ? skillsList : ['SEO Optimization (Advanced)', 'Content Strategy (Expert)', 'Analytics & Reporting'];
      return (
        <div style={{ padding: isMobile ? 12 : 16 }}>
          {items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}
        </div>
      );
    }
    if (section === 'Services') {
      const items = servicesList.length ? servicesList : ['SEO Audits', 'Slogan Content Campaigns'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Portfolio') {
      const items = portfolioList.length ? portfolioList : ['Case Study 1', 'Project X', 'Client Y'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Experience') {
      const items = experienceList.length ? experienceList : ['Senior Marketer (Present)', 'Marketing Executive'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    if (section === 'Review') {
      const items = reviewList.length ? reviewList : ['John transformed our online presence!', 'Happy Client'];
      return <div style={{ padding: isMobile ? 12 : 16 }}>{items.map((it, idx) => <div key={idx}>{renderItem(it)}</div>)}</div>;
    }
    return null;
  };
  
  return (
    <div style={{
      width: "360px", borderRadius: "4px", overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", fontFamily: fontFamily,
      backgroundImage: `linear-gradient(135deg, ${themeColor1} 0%, ${themeColor2} 100%)`, border: `1px solid #e5e5e5`, position: 'relative'
    }}>
      <div style={{
        height: "120px", 
        backgroundImage: cover ? `url(${cover})` : `linear-gradient(135deg, ${themeColor1}, ${themeColor2})`,
        backgroundSize: cover ? "cover" : "auto",
        backgroundPosition: cover ? "center" : "initial",
        position: "relative", display: "flex", alignItems: "flex-end", padding: "20px"
      }}>
        {/* Overlay for better text readability when cover image is present */}
        {cover && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)"
          }}></div>
        )}
        <div style={{
          width: "60px", height: "60px", borderRadius: "2px", overflow: "hidden",
          background: photo ? "transparent" : "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid rgba(255,255,255,0.3)", position: "relative", zIndex: 2
        }}>
          {photo ? (
            <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>{firstLetter}</span>
          )}
        </div>
        <div style={{ marginLeft: "16px", color: "white", position: "relative", zIndex: 2 }}>
          {name && <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>{name}</h3>}
          {title && <p style={{ margin: "0", fontSize: "13px", opacity: 0.9, color: "#FFFFFF" }}>{title}</p>}
        </div>
      </div>
      
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          {company && <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#FFFFFF", fontWeight: 500 }}>{company}</p>}
          {location && <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#FFFFFF" }}>{location}</p>}
          <p style={{ fontSize: "12px", lineHeight: 1.5, color: "#FFFFFF", margin: "0", opacity: 0.9 }}>{about}</p>
        </div>
        
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
          <div style={{ display: "flex", gap: "1px" }}>
            <a href={`mailto:${email}`} style={{
              flex: 1, padding: "10px", background: themeColor1, textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 600
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ marginRight: 6 }}>
                <rect x="4" y="6" width="16" height="12" rx="2" ry="2"/>
                <path d="M4 8l8 5 8-5"/>
              </svg>
            </a>
            <a href={`tel:${phone}`} style={{
              flex: 1, padding: "10px", background: themeColor1, textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 600
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ marginRight: 6 }}>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.63A2 2 0 013.08 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </a>
            <a href={linkedin} style={{
              flex: 1, padding: "10px", background: themeColor1, textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 600
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: 6 }}>
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4zM8.5 8.5h3.8v1.98h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V23h-4v-6.3c0-1.5-.03-3.44-2.1-3.44-2.1 0-2.42 1.64-2.42 3.34V23h-4z"/>
              </svg>
            </a>
            <a href={website} style={{
              flex: 1, padding: "10px", background: themeColor1, textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: 600
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ marginRight: 6 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 010 20a15.3 15.3 0 010-20z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Pills Section */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "16px", padding: "0 20px" }}>
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
                background: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              }}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>

      {activePanel && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }} onClick={() => setActivePanel(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              width: isMobile ? '100%' : 'calc(100% - 24px)',
              maxWidth: 520,
              maxHeight: isMobile ? '100%' : '80%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ padding: isMobile ? 12 : 16, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, color: '#111827', fontWeight: 700 }}>{activePanel}</h3>
              <button onClick={() => setActivePanel(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9CA3AF' }}>×</button>
            </div>
            <div style={{ maxHeight: isMobile ? 'calc(80vh - 60px)' : 400, overflow: 'auto' }}>
              {renderPanelContent(activePanel)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ====================================================================
// START: EditPage Component
// ====================================================================

// Define interface for the new fields
interface ExtraField {
  id: number;
  name: string;
  link: string;
}

const EditPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState('Display');
  const [selectedColor1, setSelectedColor1] = useState('#145dfd');
  const [selectedColor2, setSelectedColor2] = useState('#145dfd');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailLink, setEmailLink] = useState('');
  const [phoneLink, setPhoneLink] = useState('');
  const [selectedDesign, setSelectedDesign] = useState('Classic');
  const [prefix, setPrefix] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [accreditations, setAccreditations] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [maidenName, setMaidenName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [company, setCompany] = useState('MyKard'); // Added default
  const [headline, setHeadline] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [selectedFont, setSelectedFont] = useState('Arial, sans-serif');
  const [cardName, setCardName] = useState('');
  const [cardType, setCardType] = useState('Personal');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [cardLocation, setCardLocation] = useState('California, USA');
  
  const [about, setAbout] = useState('A modern digital visiting card for software designer showcasing professional details, social links, and portfolio');

  const [skills, setSkills] = useState('SEO, Content Creation, Analytics');
  const [portfolio, setPortfolio] = useState('Case Study 1, Project X');
  const [experience, setExperience] = useState('Lead Marketer @ MyKard (2023-Present)');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/yaasnick');
  const [website, setWebsite] = useState('https://yaasnick.com');
  const [services, setServices] = useState('SEO Audits, Slogan Content Campaigns');
  const [reviews, setReviews] = useState('John transformed our online presence!, Happy Client');

  const [customTypes, setCustomTypes] = useState<string[]>([]);
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);
  const [customTypeInput, setCustomTypeInput] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLink, setNewFieldLink] = useState('');
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [displayTypes, setDisplayTypes] = useState<string[]>(['Classic']);
  const [existingCardId, setExistingCardId] = useState<string | null>(null);

  const hexToRgb = (hex: string) => {
    if (!hex || hex.length < 4) hex = '#145DFD';
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  const initialRgb1 = hexToRgb(selectedColor1);
  const [rValue1, setRValue1] = useState(initialRgb1.r);
  const [gValue1, setGValue1] = useState(initialRgb1.g);
  const [bValue1, setBValue1] = useState(initialRgb1.b);
  const [hexValue1, setHexValue1] = useState(selectedColor1);

  const initialRgb2 = hexToRgb(selectedColor2); 
  const [rValue2, setRValue2] = useState(initialRgb2.r);
  const [gValue2, setGValue2] = useState(initialRgb2.g);
  const [bValue2, setBValue2] = useState(initialRgb2.b);
  const [hexValue2, setHexValue2] = useState(selectedColor2);

  React.useEffect(() => {
    const newRgb1 = hexToRgb(selectedColor1);
    if (newRgb1) {
      setRValue1(newRgb1.r);
      setGValue1(newRgb1.g);
      setBValue1(newRgb1.b);
      setHexValue1(selectedColor1);
    }
  }, [selectedColor1]);

  React.useEffect(() => { 
    const newRgb2 = hexToRgb(selectedColor2);
    if (newRgb2) {
      setRValue2(newRgb2.r);
      setGValue2(newRgb2.g);
      setBValue2(newRgb2.b);
      setHexValue2(selectedColor2);
    }
  }, [selectedColor2]);

  useEffect(() => {
    const fetchCardData = async () => {
      if (!cardId) return;

      try {
        setIsLoading(true);
        console.log('🔍 Fetching card for edit:', cardId);
        
        const response = await fetch(`/api/card/${cardId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch card');
        }

        const data = await response.json();
        
        if (data.success && data.card) {
          console.log('✅ Loaded card for editing:', data.card);
          const card = data.card;
          
          setFirstName(card.fullName || card.firstName || '');
          setMiddleName(card.middleName || '');
          setLastName(card.lastName || '');
          setPrefix(card.prefix || '');
          setSuffix(card.suffix || '');
          setPreferredName(card.preferredName || '');
          setMaidenName(card.maidenName || '');
          setPronouns(card.pronouns || '');
          setEmail(card.email || '');
          setPhone(card.phone || '');
          setEmailLink(card.emailLink || '');
          setPhoneLink(card.phoneLink || '');
          setTitle(card.title || '');
          setCompany(card.company || '');
          setDepartment(card.department || '');
          setAffiliation(card.affiliation || '');
          setHeadline(card.headline || '');
          setAccreditations(card.accreditations || '');
          setCardLocation(card.location || '');
          setAbout(card.bio || card.about || card.description || '');
          setSkills(card.skills || '');
          setPortfolio(card.portfolio || '');
          setExperience(card.experience || '');
          setServices(card.services || '');
          setReviews(card.reviews || card.review || '');
          setLinkedin(card.linkedinUrl || card.linkedin || '');
          setWebsite(card.websiteUrl || card.website || '');
          setProfileImage(card.profileImage || card.photo || null);
          setBannerImage(card.coverImage || card.cover || card.bannerImage || null);
          setSelectedDesign(card.selectedDesign || 'Classic');
          setSelectedColor1(card.selectedColor || card.selectedColor1 || '#145dfd');
          setSelectedColor2(card.selectedColor2 || '#145dfd');
          setSelectedFont(card.selectedFont || 'Arial, sans-serif');
          setCardName(card.cardName || '');
          setCardType(card.cardType || 'Personal');
          setExistingCardId(card.id);
          
          toast.success('Card loaded for editing');
        } else {
          toast.error('Card not found');
        }
      } catch (error: any) {
        console.error('❌ Error loading card:', error);
        toast.error(error.message || 'Failed to load card');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardData();
  }, [cardId]);

  const handleRChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const r = Number(e.target.value);
    if (!isNaN(r) && r >= 0 && r <= 255) {
      setRValue1(r);
      const newHex = rgbToHex(r, gValue1, bValue1);
      setHexValue1(newHex);
      setSelectedColor1(newHex);
    }
  };

  const handleGChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const g = Number(e.target.value);
    if (!isNaN(g) && g >= 0 && g <= 255) {
      setGValue1(g);
      const newHex = rgbToHex(rValue1, g, bValue1);
      setHexValue1(newHex);
      setSelectedColor1(newHex);
    }
  };

  const handleBChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const b = Number(e.target.value);
    if (!isNaN(b) && b >= 0 && b <= 255) {
      setBValue1(b);
      const newHex = rgbToHex(rValue1, gValue1, b);
      setHexValue1(newHex);
      setSelectedColor1(newHex);
    }
  };

  const handleHexChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value.toUpperCase();
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    
    if (/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
        setHexValue1(hex);
        const newRgb = hexToRgb(hex);
        if(newRgb) {
            setRValue1(newRgb.r);
            setGValue1(newRgb.g);
            setBValue1(newRgb.b);
            setSelectedColor1(hex);
        }
    }
  };

  const handleColorInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    setHexValue1(hex);
    const newRgb = hexToRgb(hex);
    setRValue1(newRgb.r);
    setGValue1(newRgb.g);
    setBValue1(newRgb.b);
    setSelectedColor1(hex);
  };

  const handleRChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const r = Number(e.target.value);
    if (!isNaN(r) && r >= 0 && r <= 255) {
      setRValue2(r);
      const newHex = rgbToHex(r, gValue2, bValue2);
      setHexValue2(newHex);
      setSelectedColor2(newHex);
    }
  };

  const handleGChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const g = Number(e.target.value);
    if (!isNaN(g) && g >= 0 && g <= 255) {
      setGValue2(g);
      const newHex = rgbToHex(rValue2, g, bValue2);
      setHexValue2(newHex);
      setSelectedColor2(newHex);
    }
  };

  const handleBChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const b = Number(e.target.value);
    if (!isNaN(b) && b >= 0 && b <= 255) {
      setBValue2(b);
      const newHex = rgbToHex(rValue2, gValue2, b);
      setHexValue2(newHex);
      setSelectedColor2(newHex);
    }
  };

  const handleHexChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value.toUpperCase();
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    
    if (/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
        setHexValue2(hex);
        const newRgb = hexToRgb(hex);
        if(newRgb) {
            setRValue2(newRgb.r);
            setGValue2(newRgb.g);
            setBValue2(newRgb.b);
            setSelectedColor2(hex);
        }
    }
  };

  const handleColorInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    setHexValue2(hex);
    const newRgb = hexToRgb(hex);
    setRValue2(newRgb.r);
    setGValue2(newRgb.g);
    setBValue2(newRgb.b);
    setSelectedColor2(hex);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleAddField = () => {
    if (newFieldName.trim()) {
      const newField: ExtraField = {
        id: Date.now(),
        name: newFieldName,
        link: newFieldLink,
      };
      setExtraFields([...extraFields, newField]);
      setNewFieldName('');
      setNewFieldLink('');
      setIsModalOpen(false);
    }
  };

  const handleDeleteField = (id: number) => {
    setExtraFields(extraFields.filter(field => field.id !== id));
  };

  const handleExtraFieldChange = (id: number, value: string) => {
    setExtraFields(extraFields.map(field =>
      field.id === id ? { ...field, link: value } : field
    ));
  };

  // Card Type helper functions
  const builtInTypes = ['Personal', 'Professional', 'Business', 'Company', 'Creator', 'Influencer'];
  
  const handleAddCustomType = () => {
    if (customTypeInput.trim() && !builtInTypes.includes(customTypeInput.trim()) && !customTypes.includes(customTypeInput.trim())) {
      setCustomTypes([...customTypes, customTypeInput.trim()]);
      setCardType(customTypeInput.trim());
      setCustomTypeInput('');
      setShowCustomTypeInput(false);
    }
  };

  const getAllCardTypes = () => {
    return [...builtInTypes, ...customTypes];
  };

  const handleSaveCard = async () => {
    try {
      setIsSaving(true);

      const fullName = `${prefix} ${firstName} ${middleName} ${lastName} ${suffix}`.trim();
      const finalName = cardName || fullName;
      
      if (!finalName) {
        setIsPopupOpen(true);
        setPopupMessage('Please enter at least your first name or a card name.');
        setIsSaving(false);
        return;
      }

      const formData = new FormData();
      
      formData.append('fullName', finalName);
      if (firstName) formData.append('firstName', firstName);
      if (middleName) formData.append('middleName', middleName);
      if (lastName) formData.append('lastName', lastName);
      if (prefix) formData.append('prefix', prefix);
      if (suffix) formData.append('suffix', suffix);
      if (preferredName) formData.append('preferredName', preferredName);
      if (maidenName) formData.append('maidenName', maidenName);
      if (pronouns) formData.append('pronouns', pronouns);
      if (title) formData.append('title', title);
      if (company) formData.append('company', company);
      if (department) formData.append('department', department);
      if (affiliation) formData.append('affiliation', affiliation);
      if (headline) formData.append('headline', headline);
      if (accreditations) formData.append('accreditations', accreditations);
      if (email) formData.append('email', email);
      if (phone) formData.append('phone', phone);
      if (emailLink) formData.append('emailLink', emailLink);
      if (phoneLink) formData.append('phoneLink', phoneLink);
      if (cardLocation) formData.append('location', cardLocation);
      if (linkedin) formData.append('linkedinUrl', linkedin);
      if (website) formData.append('websiteUrl', website);
      if (cardName) formData.append('cardName', cardName);
      if (cardType) formData.append('cardType', cardType);
      if (selectedDesign) formData.append('selectedDesign', selectedDesign);
      if (selectedColor1) formData.append('selectedColor', selectedColor1);
      if (selectedColor2) formData.append('selectedColor2', selectedColor2);
      if (selectedFont) formData.append('selectedFont', selectedFont);
      if (about) formData.append('bio', about);
      if (skills) formData.append('skills', skills);
      if (portfolio) formData.append('portfolio', portfolio);
      if (experience) formData.append('experience', experience);
      if (services) formData.append('services', services);
      if (reviews) formData.append('review', reviews);
      
      formData.append('status', 'draft');

      // Add image files if they exist
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      
      if (bannerImageFile) {
        formData.append('bannerImage', bannerImageFile);
      }

      // Determine if we're updating or creating
      const isUpdating = existingCardId || cardId;
      const endpoint = isUpdating 
        ? `/api/card/update/${existingCardId || cardId}` 
        : '/api/card/create';
      const method = isUpdating ? 'PATCH' : 'POST';

      console.log(`${isUpdating ? '🔄 Updating' : '✨ Creating'} card...`);

      // Make API call
      const response = await fetch(endpoint, {
        method: method,
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isUpdating ? 'update' : 'create'} card`);
      }

      // Success!
      setExistingCardId(data.card.id);
      setIsPopupOpen(true);
      setPopupMessage(isUpdating ? 'Card updated successfully! ' : 'Card created successfully! ');
      
      // If we just created a card, update the URL to include the ID
      if (!isUpdating && data.card.id) {
        router.push(`/dashboard/edit?id=${data.card.id}`);
      }

    } catch (error: any) {
      console.error('Error saving card:', error);
      setIsPopupOpen(true);
      setPopupMessage(error.message || 'Failed to save card. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete card function
  const handleDeleteCard = async () => {
    if (!existingCardId && !cardId) {
      toast.error('No card to delete');
      return;
    }

    try {
      setIsDeleting(true);
      console.log('🗑️ Deleting card:', existingCardId || cardId);

      const response = await fetch('/api/card/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: existingCardId || cardId
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete card');
      }

      // Success!
      toast.success('Card deleted successfully! 🗑️');
      setIsDeleteConfirmOpen(false);
      
      // Redirect to dashboard after successful deletion
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error deleting card:', error);
      toast.error(error.message || 'Failed to delete card. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to render the appropriate template based on selectedDesign
  const renderTemplatePreview = () => {
    const commonProps = {
      name: cardName || `${prefix} ${firstName} ${middleName} ${lastName} ${suffix}`.trim(),
      title,
      company,
      location: cardLocation,
      about,
      skills,
      portfolio,
      experience,
      services,
      review: reviews,
      photo: profileImage,
      cover: bannerImage,
      email,
      phone,
      linkedin,
      website,
      themeColor1: selectedColor1,
      themeColor2: selectedColor2,
      fontFamily: selectedFont,
      cardType,
    };

    switch (selectedDesign) {
      case 'Flat':
        return <FlatCardPreview {...commonProps} />;
      case 'Modern':
        return <ModernCardPreview {...commonProps} />;
      case 'Sleek':
        return <SleekCardPreview {...commonProps} />;
      case 'Classic':
      default:
        return <DigitalCardPreview {...commonProps} />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Display':
        return (
          <>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Design</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                {[ 'Classic', 'Flat', 'Modern', 'Sleek'].map((design, index) => (
                  <div
                    key={design}
                    onClick={() => {
                      setSelectedDesign(design);
                      // Add to displayTypes array if not already present
                      if (!displayTypes.includes(design)) {
                        setDisplayTypes([...displayTypes, design]);
                      }
                    }}
                    style={{
                      border: design === selectedDesign ? `2px solid ${selectedColor1}` : '1px solid #ddd',
                      borderRadius: '10px',
                      padding: '10px',
                      width: 'calc(50% - 5px)',
                      minWidth: '80px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: 'white'
                    }}
                  >
                    
                    <div style={{
                      width: '100%',
                      maxWidth: '80px',
                      height: '50px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      margin: '0 auto 10px auto',
                      position: 'relative',
                      overflow: 'hidden',
                      background: design === 'Classic' ? `linear-gradient(135deg, ${selectedColor1} 0%, ${selectedColor2} 100%)` : 
                                 design === 'Flat' ? 'white' :
                                 design === 'Modern' ? `linear-gradient(145deg, ${selectedColor1}15, ${selectedColor2}15)` :
                                 design === 'Sleek' ? `linear-gradient(135deg, ${selectedColor1}, ${selectedColor2})` :
                                 design === 'Blend' ? 'white' : '#dcdcdc',
                      border: design === 'Flat' ? `2px solid ${selectedColor1}` : 
                             design === 'Sleek' ? 'none' : '1px solid #eee'
                    }}>
                      {design === 'Classic' && (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                        }}>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            position: 'absolute',
                            bottom: '8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            border: '1px solid rgba(255,255,255,0.8)',
                          }}></div>
                        </div>
                      )}
                      {design === 'Flat' && (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '2px',
                            backgroundColor: selectedColor1,
                          }}></div>
                          <div style={{
                            width: '20px',
                            height: '2px',
                            backgroundColor: '#ddd',
                            borderRadius: '1px'
                          }}></div>
                          <div style={{
                            width: '16px',
                            height: '1px',
                            backgroundColor: '#eee',
                          }}></div>
                        </div>
                      )}
                      {design === 'Modern' && (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px'
                        }}>
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${selectedColor1}, ${selectedColor2})`,
                          }}></div>
                          <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px'
                          }}>
                            <div style={{
                              width: '100%',
                              height: '2px',
                              backgroundColor: '#333',
                              borderRadius: '1px'
                            }}></div>
                            <div style={{
                              width: '80%',
                              height: '1px',
                              backgroundColor: '#999',
                            }}></div>
                          </div>
                        </div>
                      )}
                      {design === 'Sleek' && (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div style={{
                            height: '60%',
                            background: `linear-gradient(135deg, ${selectedColor1}, ${selectedColor2})`,
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '4px'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              borderRadius: '1px',
                              marginRight: '2px'
                            }}></div>
                          </div>
                          <div style={{
                            height: '40%',
                            backgroundColor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1px'
                          }}>
                            <div style={{ width: '8px', height: '4px', backgroundColor: selectedColor1, fontSize: '4px' }}></div>
                            <div style={{ width: '8px', height: '4px', backgroundColor: selectedColor1, fontSize: '4px' }}></div>
                          </div>
                        </div>
                      )}
                      {design === 'Blend' && (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                          background: `linear-gradient(135deg, ${selectedColor1}20, ${selectedColor2}20)`,
                          borderRadius: '8px'
                        }}>
                          <div style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${selectedColor1}, ${selectedColor2})`,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            border: '1px solid white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}></div>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: '#555' }}>{design}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                Cover Image
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="banner-image-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setBannerImage(URL.createObjectURL(file));
                      setBannerImageFile(file);
                    }
                  }}
                />
                <button
                  onClick={() => document.getElementById('banner-image-upload')?.click()}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    fontSize: '14px',
                    color: '#555',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    outline: 'none',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  Add Cover Image
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                Profile Photo
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  id="profile-media-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setProfileImageFile(file);
                      setProfileImage(URL.createObjectURL(file));
                    }
                  }}
                />
                <button
                  onClick={() => document.getElementById('profile-media-upload')?.click()}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    fontSize: '14px',
                    color: '#555',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    outline: 'none',
                    flex: '1',
                    minWidth: '150px',
                    justifyContent: 'center'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  Add Photo or Video
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                Color
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Color 1 */}
                <div style={{ marginBottom: '15px'}}>
                  <h4 style={{fontSize: '16px', marginBottom: '10px', color: '#333'}}>Color 1</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="color"
                      value={hexValue1}
                      onChange={handleColorInputChange1}
                      style={{ width: '50px', height: '30px', border: 'none', padding: '0' }}
                    />
                    <span style={{ fontSize: '14px', color: '#555' }}>Select Color 1</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: '1', minWidth: '60px' }}>
                      <label style={{ fontSize: '14px', color: '#555' }}>R:</label>
                      <input
                        type="number"
                        value={rValue1}
                        onChange={handleRChange1}
                        min="0"
                        max="255"
                        style={{
                          width: '100%',
                          padding: '6px',
                          fontSize: '14px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: '1', minWidth: '60px' }}>
                      <label style={{ fontSize: '14px', color: '#555' }}>G:</label>
                      <input
                        type="number"
                        value={gValue1}
                        onChange={handleGChange1}
                        min="0"
                        max="255"
                        style={{
                          width: '100%',
                          padding: '6px',
                          fontSize: '14px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: '1', minWidth: '60px' }}>
                      <label style={{ fontSize: '14px', color: '#555' }}>B:</label>
                      <input
                        type="number"
                        value={bValue1}
                        onChange={handleBChange1}
                        min="0"
                        max="255"
                        style={{
                          width: '100%',
                          padding: '6px',
                          fontSize: '14px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '14px', color: '#555' }}>Hex:</label>
                    <input
                      type="text"
                      value={hexValue1}
                      onChange={handleHexChange1}
                      maxLength={7}
                      style={{
                        flex: '1',
                        padding: '8px',
                        fontSize: '14px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Color 2 */}
                <div style={{ marginBottom: '15px'}}>
                  <h4 style={{fontSize: '16px', marginBottom: '10px', color: '#333'}}>Color 2</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="color"
                      value={hexValue2}
                      onChange={handleColorInputChange2}
                      style={{ width: '50px', height: '30px', border: 'none', padding: '0' }}
                    />
                    <span style={{ fontSize: '14px', color: '#555' }}>Select Color 2</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: '1', minWidth: '60px' }}>
                      <label style={{ fontSize: '14px', color: '#555' }}>R:</label>
                      <input
                        type="number"
                        value={rValue2}
                        onChange={handleRChange2}
                        min="0"
                        max="255"
                        style={{
                          width: '100%',
                          padding: '6px',
                          fontSize: '14px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: '1', minWidth: '60px' }}>
                      <label style={{ fontSize: '14px', color: '#555' }}>G:</label>
                      <input
                        type="number"
                        value={gValue2}
                        onChange={handleGChange2}
                        min="0"
                        max="255"
                        style={{
                          width: '100%',
                          padding: '6px',
                          fontSize: '14px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: '1', minWidth: '60px' }}>
                      <label style={{ fontSize: '14px', color: '#555' }}>B:</label>
                      <input
                        type="number"
                        value={bValue2}
                        onChange={handleBChange2}
                        min="0"
                        max="255"
                        style={{
                          width: '100%',
                          padding: '6px',
                          fontSize: '14px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '14px', color: '#555' }}>Hex:</label>
                    <input
                      type="text"
                      value={hexValue2}
                      onChange={handleHexChange2}
                      maxLength={7}
                      style={{
                        flex: '1',
                        padding: '8px',
                        fontSize: '14px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Font</h3>
              <div style={{ position: 'relative', width: '100%' }}>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    appearance: 'none',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {['Arial, sans-serif', 'Verdana, sans-serif', 'Tahoma, sans-serif', 'Georgia, serif', 'Times New Roman, serif', 'Courier New, monospace', 'Lucida Console, monospace', 'Garamond, serif', 'Palatino, serif', 'Impact, sans-serif'].map(font => (
                    <option key={font} value={font}>{font.split(',')[0]}</option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: selectedColor1
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </>
        );
      case 'Information':
        return (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Personal</h3>
            {[
              { label: 'Prefix', value: prefix, setter: setPrefix },
              { label: 'First Name', value: firstName, setter: setFirstName },
              { label: 'Middle Name', value: middleName, setter: setMiddleName },
              { label: 'Last Name', value: lastName, setter: setLastName },
              { label: 'Suffix', value: suffix, setter: setSuffix },
              // { label: 'Accreditations', value: accreditations, setter: setAccreditations },
              // { label: 'Preferred Name', value: preferredName, setter: setPreferredName },
              // { label: 'Maiden Name', value: maidenName, setter: setMaidenName },
              // { label: 'Pronouns', value: pronouns, setter: setPronouns },
              // { label: 'Affiliation', value: affiliation, setter: setAffiliation },
              { label: 'Title', value: title, setter: setTitle },
              // { label: 'Department', value: department, setter: setDepartment },
              { label: 'Company', value: company, setter: setCompany },
              // { label: 'Headline', value: headline, setter: setHeadline },
              { label: 'Location', value: cardLocation, setter: setCardLocation }
            ].map(field => (
              <div key={field.label} style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px' }}>{field.label}</label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    backgroundColor: field.label === 'First Name' ? '#f8f8f8' : 'white',
                    color: '#555',
                    outline: 'none'
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Description</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Enter a brief description for your card"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  color: '#555',
                  outline: 'none'
                }}
              />
            </div>
            
            {/* --- FIELDS MOVED TO "Fields" TAB --- */}


            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Upload Document</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="resume-upload"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setResumeFile(e.target.files[0]);
                  }
                }}
              />
              <button
                onClick={() => document.getElementById('resume-upload')?.click()}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px 15px',
                  fontSize: '14px',
                  color: '#555',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  outline: 'none',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="17" x2="12" y2="11"></line><line x1="9" y1="14" x2="12" y2="11"></line><line x1="15" y1="14" x2="12" y2="11"></line></svg>
                {resumeFile ? resumeFile.name : 'Upload Document'}
              </button>
            </div>

          </div>
        );
      case 'Fields':
        return (
          <div>
            <div style={{ marginBottom: '30px', border: '1px solid #eee', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0', color: '#333' }}>Additional Fields <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal' }}>(?)</span></h3>
              </div>

              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  {/* <span style={{ cursor: 'grab', color: '#aaa' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </span> */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Email
                  </span>
                  {/* blank space */}
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8f8f8',
                    color: '#555',
                    outline: 'none',
                    marginBottom: '10px'
                  }}
                />
                {/* <input
                  type="text"
                  placeholder="Link Box"
                  value={emailLink}
                  onChange={(e) => setEmailLink(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                /> */}
              </div>

              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  {/* <span style={{ cursor: 'grab', color: '#aaa' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </span> */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Phone
                  </span>
                  {/* blank space */}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f8f8', flex: '1', minWidth: '150px' }}>
                    <span style={{ marginRight: '8px' }}>🇮🇳</span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '14px',
                        color: '#555',
                        flex: '1',
                        width: '100%'
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="# Extension"
                    value={phoneLink}
                    onChange={(e) => setPhoneLink(e.target.value)}
                    style={{
                      width: '100px',
                      minWidth: '80px',
                      padding: '10px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>
                {/* <input
                  type="text"
                  placeholder="Link Box"
                  value={phoneLink}
                  onChange={(e) => setPhoneLink(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                /> */}
              </div>

              {/* ====================================================== */}
              {/* START: Added Fields (Services, Skills, etc.)          */}
              {/* ====================================================== */}

              {/* Services */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  {/* <span style={{ cursor: 'grab', color: '#aaa' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </span> */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Services
                  </span>
                  <button 
                    onClick={() => { setIsPopupOpen(true); setPopupMessage('By adding a comma, you can add another thing in the field'); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'inherit' }}>i</span>
                  </button>
                </div>
                <textarea
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="e.g. SEO Audits, Content Campaigns"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Portfolio */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    {/* <span style={{ cursor: 'grab', color: '#aaa' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </span> */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Portfolio
                  </span>
                  <button 
                    onClick={() => { setIsPopupOpen(true); setPopupMessage('By adding a comma, you can add another thing in the field'); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'inherit' }}>i</span>
                  </button>
                </div>
                <textarea
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="e.g. Case Study 1, Project X"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Skills */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  {/* <span style={{ cursor: 'grab', color: '#aaa' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </span> */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Skills
                  </span>
                  <button 
                    onClick={() => { setIsPopupOpen(true); setPopupMessage('By adding a comma, you can add another thing in the field'); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'inherit' }}>i</span>
                  </button>
                </div>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. SEO, Content Creation, Analytics"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Experience */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  {/* <span style={{ cursor: 'grab', color: '#aaa' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </span> */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Experience
                  </span>
                  <button 
                    onClick={() => { setIsPopupOpen(true); setPopupMessage('By adding a comma, you can add another thing in the field'); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'inherit' }}>i</span>
                  </button>
                </div>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. Lead Marketer @ MyKard (2023-Present)"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Review */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  {/* <span style={{ cursor: 'grab', color: '#aaa' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </span> */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Review
                  </span>
                  <button 
                    onClick={() => { setIsPopupOpen(true); setPopupMessage('By adding a comma, you can add another thing in the field'); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'inherit' }}>i</span>
                  </button>
                </div>
                <textarea
                  value={reviews}
                  onChange={(e) => setReviews(e.target.value)}
                  placeholder="e.g. Great work!, Happy Client"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* LinkedIn */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  {/* <span style={{ cursor: 'grab', color: '#aaa' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </span> */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    LinkedIn
                  </span>
                  {/* blank space */}
                </div>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="e.g. https://linkedin.com/in/..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Website */}
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  {/* <span style={{ cursor: 'grab', color: '#aaa' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </span> */}
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Website
                  </span>
                  {/* blank space */}
                </div>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://my-portfolio.com"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* ====================================================== */}
              {/* END: Added Fields                                    */}
              {/* ====================================================== */}


              {/* --- NEWLY ADDED: Render Extra Fields --- */}
              {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0', color: '#333' }}>Additional Fields <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal' }}>(?)</span></h3>
              </div>
              {extraFields.map((field) => (
                <div key={field.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ cursor: 'grab', color: '#aaa' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedColor1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      {field.name}
                    </span>
                    <span onClick={() => handleDeleteField(field.id)} style={{ cursor: 'pointer', color: '#888' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Link Box"
                    value={field.link}
                    onChange={(e) => handleExtraFieldChange(field.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              ))} */}
              {/* --- END Render Extra Fields --- */}


              {/* --- NEWLY ADDED: Add Field Button --- */}
              {/* <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  backgroundColor: 'transparent',
                  border: `1px dashed ${selectedColor1}`,
                  color: selectedColor1,
                  borderRadius: '8px',
                  padding: '10px 15px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  outline: 'none',
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '10px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Field
              </button> */}
              {/* --- END Add Field Button --- */}

            </div>
          </div>
        );
      case 'Card':
        return (
          <div>
            <div style={{
              backgroundColor: '#e0f7fa',
              border: '1px solid #b2ebf2',
              borderRadius: '8px',
              padding: '10px 15px',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#00796b',
              fontSize: '13px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              This field does not appear on the card.
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: '1px solid #145dfd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Card Type</label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: 'white',
                  appearance: 'none',
                }}
              >
                <option value="">Select card type...</option>
                {getAllCardTypes().map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              
              {/* Custom Type Input */}
              {!showCustomTypeInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomTypeInput(true)}
                  style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    color: selectedColor1 || '#2563eb',
                    background: 'transparent',
                    border: `1px solid ${selectedColor1 || '#2563eb'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  + Add custom type
                </button>
              ) : (
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={customTypeInput}
                    onChange={(e) => setCustomTypeInput(e.target.value)}
                    placeholder="Enter custom type..."
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      fontSize: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomType}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      color: 'white',
                      background: selectedColor1 || '#2563eb',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomTypeInput(false);
                      setCustomTypeInput('');
                    }}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      color: '#666',
                      background: 'transparent',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f0f2f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #145dfd',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading your profile...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5', 
      padding: '10px', 
      boxSizing: 'border-box',
      gap: '15px'
    }}>
      <style>{`
        @media (min-width: 768px) {
          .container {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          .card-preview {
            position: sticky !important;
            top: 20px !important;
            max-width: 350px !important;
          }
        }
      `}</style>

      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div className="card-preview" style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
            {renderTemplatePreview()}
        </div>
        {/* ==================================================================== */}
        {/* END: Card Preview Section                                          */}
        {/* ==================================================================== */


        <div className="edit-panel" style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '20px', overflowX: 'auto' }}>
            {['Display', 'Information', 'Fields', 'Card'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 15px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab ? `2px solid ${selectedColor1}` : 'none',
                  color: activeTab === tab ? selectedColor1 : '#777',
                  outline: 'none',
                  marginRight: '10px',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {renderContent()}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button 
              type="button"
              onClick={() => router.push('/dashboard')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#555',
                cursor: 'pointer',
                outline: 'none',
                flex: '1',
                minWidth: '100px'
              }}
            >
              Cancel
            </button>
            {/* Show delete button only when editing existing card */}
            {(existingCardId || cardId) && (
              <div 
                onClick={() => {
                  console.log('🗑️ DIV Delete clicked - opening custom dialog');
                  setIsDeleteConfirmOpen(true);
                }}
                style={{
                  backgroundColor: isDeleting ? '#999' : '#dc3545',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'white',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  flex: '1',
                  minWidth: '100px',
                  textAlign: 'center',
                  userSelect: 'none'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </div>
            )}
            <button 
              type="button"
              onClick={handleSaveCard}
              disabled={isSaving}
              style={{
                backgroundColor: isSaving ? '#999' : selectedColor1,
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                outline: 'none',
                flex: '1',
                minWidth: '100px'
              }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>}
      </div>

      {/* Modal for adding a new field */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Add Custom Field</h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Field Name</label>
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="e.g. GitHub"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Link Box</label>
              <input
                type="text"
                value={newFieldLink}
                onChange={(e) => setNewFieldLink(e.target.value)}
                placeholder="e.g. https://..."
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '8px 15px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#555',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddField}
                style={{
                  backgroundColor: selectedColor1,
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 15px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- END Modal --- */}

      {isPopupOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            zIndex: 1001,
            textAlign: 'center',
            maxWidth: '300px',
          }}
          onClick={() => setIsPopupOpen(false)}
        >
          <p style={{ margin: '0 0 15px', fontSize: '15px', color: '#333' }}>{popupMessage}</p>
          <button
            onClick={() => setIsPopupOpen(false)}
            style={{
              backgroundColor: selectedColor1,
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Got it!
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setIsDeleteConfirmOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '20px' }}>
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#dc3545" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ margin: '0 auto 15px' }}
              >
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              <h3 style={{ margin: '0 0 10px', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                Delete Card
              </h3>
              <p style={{ margin: '0', fontSize: '15px', color: '#666', lineHeight: 1.5 }}>
                Are you sure you want to delete this card? This action cannot be undone.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isDeleting}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#555',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  minWidth: '100px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCard}
                disabled={isDeleting}
                style={{
                  backgroundColor: isDeleting ? '#999' : '#dc3545',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'white',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  minWidth: '100px'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading editor...</p>
    </div>
  </div>
);

// Wrapper component with Suspense boundary
const EditPageWrapper = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditPage />
    </Suspense>
  );
};

export default EditPageWrapper;