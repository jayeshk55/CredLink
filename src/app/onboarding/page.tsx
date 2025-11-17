"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------
   COLORS & STYLES
   ------------------------------------------------- */
const colors = {
  primary: "#3B82F6",
  darkBlue: "#1E40AF",
  lightBlue: "#60A5FA",
  orange: "#FB923C",
  purple: "#8B5CF6",
  white: "#FFFFFF",
  lightGray: "#F3F4F6",
  mint: "#D1FAE5",
  textGray: "#4B5563",
  textLight: "#6B7280",
};

/* -------------------------------------------------
   DIGITAL CARD PREVIEW COMPONENT
   ------------------------------------------------- */
interface DigitalCardProps {
  name: string;
  phone: string;
  email: string;
  title: string;
  company?: string;
  location: string;
  about: string;
  skills: string;
  portfolio: string;
  experience: string;
  photo?: string;
}

const DigitalCardPreview: React.FC<DigitalCardProps> = ({
  name = "",
  phone = "",
  email = "",
  title = "",
  company = "",
  location = "",
  about = "Crafting engaging content & SEO strategies",
  skills = "SEO, Content Creation, Analytics, Social Media",
  portfolio = "[Link] Latest Campaigns",
  experience = "Lead SEO Specialist (2021-Present)",
  photo = "",
}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "J";
  const parsedCompany = (() => {
    // Try to extract company from experience like: "Role @ Company (Year-Year)"
    const atIndex = experience.indexOf('@');
    if (atIndex !== -1) {
      const afterAt = experience.slice(atIndex + 1).trim();
      const end = afterAt.indexOf('(');
      return (end !== -1 ? afterAt.slice(0, end) : afterAt).trim();
    }
    return '';
  })();
  const companyFinal = company && company.trim().length > 0 ? company : parsedCompany;
  return (
    <div
      style={{
        width: "360px",
        borderRadius: "28px",
        overflow: "hidden",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        background: "#ffffff",
      }}
    >
      {/* Header - Warm Orange/Red Gradient with cover */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(45, 111, 255, 1) 0%, #517cd7ff 45%, #00c0fd 100%)",
          padding: "22px",
          color: colors.white,
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "92px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.7)",
            overflow: "hidden",
          }}
        >
          {/* optional cover image could go here */}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-44px" }}>
          <div
            style={{
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
            }}
          >
            {photo ? (
              <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "36px", fontWeight: 800, color: "white" }}>{firstLetter}</span>
            )}
          </div>

          {name && (
            <h3 style={{ margin: "14px 0 8px", fontSize: "26px", fontWeight: 800, color: "#FFFFFF" }}>{name}</h3>
          )}
          {(title || companyFinal) && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center", color: "#ffffff", opacity: 0.95 }}>
              {title && <span style={{ fontSize: "14px", fontWeight: 700 }}>{title}</span>}
              {title && companyFinal && <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.8)" }} />}
              {companyFinal && <span style={{ fontSize: "14px", fontWeight: 700 }}>{companyFinal}</span>}
            </div>
          )}
          {location && (
            <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#FFFFFF" }}>{location}</p>
          )}

          {/* Social Row */}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            {/* Mail */}
            <div style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" opacity="0"/>
                <path d="M4 8l8 5 8-5"/>
                <rect x="4" y="6" width="16" height="12" rx="2" ry="2"/>
              </svg>
            </div>
            {/* Phone */}
            <div style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            {/* LinkedIn */}
            <div style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4zM8.5 8.5h3.8v1.98h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V23h-4v-6.3c0-1.5-.03-3.44-2.1-3.44-2.1 0-2.42 1.64-2.42 3.34V23h-4z"/></svg>
            </div>
            {/* Globe */}
            <div style={{ width: "40px", height: "40px", borderRadius: "9999px", background: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      <div style={{ padding: "8px 20px 16px", background: "linear-gradient(180deg, #00c0fd 0%, #00c0fd 100%)", color: "#FFFFFF", textAlign: "center" }}>
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
    </div>
  );
};

/* -------------------------------------------------
   PARTY POPUP COMPONENT
   ------------------------------------------------- */
interface PartyPopupProps {
  onClose: () => void;
}

const PartyPopup: React.FC<PartyPopupProps> = ({ onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px 40px',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Party Emoji */}
        <div style={{ fontSize: '64px', marginBottom: '24px' }}></div>
        
        {/* Message */}
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '16px',
          }}
        >
          Your card has been created and ready to share!
        </h2>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            marginTop: '24px',
            padding: '14px 48px',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------
   MAIN ONBOARDING PAGE
   ------------------------------------------------- */
const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [showPartyPopup, setShowPartyPopup] = useState(false);
  const [formData, setFormData] = useState({
    photo: "",
    photoFile: null as File | null,
    name: "",
    phone: "",
    email: "",
    title: "",
    company: "",
    location: "",
    about: "",
    skills: "",
    portfolio: "",
    experience: "",
  });
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const check = () => setIsLargeScreen(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Simple validation for phone number (10-15 digits)
    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleContinue = async() => {
    // Step 1: Full Name (Required)
    if (step === 1 && !formData.name.trim()) {
      alert('Please enter your full name to continue.');
      return;
    }
    
    // Step 2: Phone (Required)
    if (step === 2) {
      if (!formData.phone.trim()) {
        alert('Please enter your phone number to continue.');
        return;
      }
      if (!validatePhone(formData.phone)) {
        alert('Please enter a valid phone number.');
        return;
      }
    }
    
    // Step 3: Email (Required)
    if (step === 3) {
      if (!formData.email.trim()) {
        alert('Please enter your email address to continue.');
        return;
      }
      if (!validateEmail(formData.email)) {
        alert('Please enter a valid email address.');
        return;
      }
    }

    // All other steps are optional (4-10)
    if (step < 10) {
      setStep(step + 1);
    } else {
      // Final step - Create card
      try {
        // Create FormData for card creation
        const cardFormData = new FormData();
        
        // Required fields from signup
        cardFormData.append('fullName', formData.name || '');
        cardFormData.append('phone', formData.phone || '');
        cardFormData.append('email', formData.email || '');
        
        // Optional fields
        if (formData.title) cardFormData.append('title', formData.title);
        if (formData.company) cardFormData.append('company', formData.company);
        if (formData.location) cardFormData.append('location', formData.location);
        if (formData.about) cardFormData.append('bio', formData.about);
        
        // Combine skills, portfolio, and experience into description
        const descriptionParts = [];
        if (formData.skills) descriptionParts.push(`Skills: ${formData.skills}`);
        if (formData.portfolio) descriptionParts.push(`Portfolio: ${formData.portfolio}`);
        if (formData.experience) descriptionParts.push(`Experience: ${formData.experience}`);
        if (descriptionParts.length > 0) {
          cardFormData.append('description', descriptionParts.join('\n\n'));
        }
        
        // Set default card properties
        cardFormData.append('cardType', 'Personal');
        cardFormData.append('selectedDesign', 'Classic');
        cardFormData.append('selectedColor', '#145dfd');
        cardFormData.append('selectedFont', 'Arial, sans-serif');
        cardFormData.append('status', 'draft');
        
        // Handle profile image upload if provided
        if (formData.photoFile) {
          cardFormData.append('profileImage', formData.photoFile);
        } else if (formData.photo && formData.photo.startsWith('data:')) {
          try {
            const response = await fetch(formData.photo);
            const blob = await response.blob();
            const file = new File([blob], 'profile.jpg', { type: blob.type || 'image/jpeg' });
            cardFormData.append('profileImage', file);
          } catch (error) {
            console.error('Error processing profile image:', error);
          }
        }
        
        // Create card using card creation API
        const response = await fetch('/api/card/create', {
          method: 'POST',
          credentials: 'include',
          body: cardFormData,
        });
        
        const data = await response.json();
        console.log('Card creation response:', data);
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create card');
        }
        
        setShowPartyPopup(true);
      } catch(error: any) {
        console.error('Error creating card:', error);
        alert(error.message || 'Failed to create card. Please try again.');
      }
    }
  };

  const handlePopupClose = () => {
    setShowPartyPopup(false);
    router.push('/dashboard');
  };

  /* -------------------------------------------------
     RESPONSIVE STYLES
     ------------------------------------------------- */
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isLargeScreen ? 'row' : 'column',
    minHeight: '100vh',
    background: '#f8fafc',
  };

  const leftPanelStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: '0',
    background: '#E5E7EB',
    position: 'relative',
    overflow: 'hidden',
  };

  const rightPanelStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    background: '#ffffff',
    width: isLargeScreen ? 'auto' : '100%',
  };

  const fullImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    position: 'relative',
    zIndex: 10,
  };

  const inputStyle = (id: string) => ({
    width: '100%',
    border: 'none',
    borderBottom: '2px solid #D1D5DB',
    outline: 'none',
    fontSize: '18px',
    padding: '8px 0',
    marginBottom: '24px',
    background: 'transparent',
    transition: 'border-color 200ms',
    color: '#1F2937',
    ...(focusedInput === id ? { borderBottom: `2px solid ${colors.primary}` } : {}),
  });

  /* -------------------------------------------------
     STEP 0: WELCOME SCREEN
     ------------------------------------------------- */
  if (step === 0) {
    return (
      <div style={{
        ...containerStyle,
        height: '100dvh',
        minHeight: 'auto',
        overflow: 'hidden'
      }}>
        {/* LEFT – FULL SCREEN IMAGE (desktop only) */}
        {isLargeScreen && (
          <div style={leftPanelStyle}>
            <img
              src="/assets/Welcome0.png"
              alt="Collection of Digital Cards"
              style={fullImageStyle}
            />
          </div>
        )}

        {/* RIGHT – GET STARTED (always visible; sole content on mobile) */}
        <div
          style={{
            ...rightPanelStyle,
            flex: 1,
            width: '100%',
            minHeight: isLargeScreen ? undefined : '100dvh',
            justifyContent: 'center',
            padding: isLargeScreen ? '32px' : '24px',
          }}
        >
          <div style={{ maxWidth: '448px', textAlign: 'center', marginBottom: 0 }}>
  <h1
  style={{
    fontSize: "40px",
    fontWeight: "700",
    color: "#1F2937",
    display: "flex",
    alignItems: "flex-end",   
    justifyContent: "center",
    gap: "5px",
    whiteSpace: "nowrap",
    lineHeight: "1",
    marginBottom: "20px",      
  }}
>
  Welcome to
  <img
    src="/assets/myKard.png"
    alt="MyKard Logo"
    style={{
      height: "150px",        
      objectFit: "contain",
      marginBottom: "-50px", 
    }}
  />
</h1>
           <p
    style={{
      color: colors.textLight,
      margin: "0 0 32px",            
    }}
  >
    Build connections in your own unique way.
  </p>
            <button
              onClick={() => setStep(1)}
              style={{
                padding: '14px 36px',
                background: `linear-gradient(135deg, ${colors.orange} 0%, #F97316 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------
     STEPS 1–9: FORM + LIVE PREVIEW
     ------------------------------------------------- */
  return (
    <>
      <div style={containerStyle}>
        {/* LEFT: Digital Card Preview + Floating Shapes (Hidden on Mobile) */}
        <div style={leftPanelStyle}>
          {/* Floating 3D Shapes */}
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
              borderRadius: '20px',
              transform: 'rotate(-15deg)',
              boxShadow:
                '0 20px 60px rgba(59, 130, 246, 0.4), inset -5px -5px 20px rgba(0, 0, 0, 0.1), inset 5px 5px 20px rgba(255, 255, 255, 0.3)',
            }}
          ></div>

          <div
            style={{
              position: 'absolute',
              top: '40%',
              right: '15%',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
              borderRadius: '18px',
              transform: 'rotate(25deg)',
              boxShadow:
                '0 20px 60px rgba(168, 85, 247, 0.4), inset -5px -5px 20px rgba(0, 0, 0, 0.1), inset 5px 5px 20px rgba(255, 255, 255, 0.3)',
            }}
          ></div>

          <div
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '8%',
              width: '110px',
              height: '110px',
              background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
              borderRadius: '18px',
              transform: 'rotate(10deg)',
              boxShadow:
                '0 20px 60px rgba(34, 211, 238, 0.4), inset -5px -5px 20px rgba(0, 0, 0, 0.1), inset 5px 5px 20px rgba(255, 255, 255, 0.3)',
            }}
          ></div>

          <div
            style={{
              position: 'absolute',
              bottom: '8%',
              right: '5%',
              width: '130px',
              height: '130px',
              background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
              borderRadius: '20px',
              transform: 'rotate(-20deg)',
              boxShadow:
                '0 20px 60px rgba(251, 146, 60, 0.4), inset -5px -5px 20px rgba(0, 0, 0, 0.1), inset 5px 5px 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                width: '20px',
                height: '20px',
                color: 'white',
                fontSize: '20px',
                opacity: 0.9,
              }}
            >
              Sparkle
            </div>
          </div>

          {/* Card Preview */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            boxSizing: 'border-box',
          }}>
            <DigitalCardPreview
              name={formData.name}
              phone={formData.phone}
              email={formData.email}
              title={formData.title}
              company={formData.company}
              location={formData.location}
              about={formData.about}
              skills={formData.skills}
              portfolio={formData.portfolio}
              experience={formData.experience}
              photo={formData.photo}
            />
          </div>
        </div>

        {/* RIGHT: Form (Always Visible) */}
        <div style={rightPanelStyle}>
          <div style={{ maxWidth: '448px', width: '100%' }}>
            <h1
              style={{
                fontSize: '30px',
                fontWeight: '700',
                marginBottom: '24px',
                color: colors.primary,
              }}
            >
              {step === 1 && 'Full Name '}
              {step === 2 && 'Phone Number '}
              {step === 3 && 'Email Address '}
              {step === 4 && 'Professional Title'}
              {step === 5 && 'Company Name'}
              {step === 6 && 'Location'}
              {step === 7 && 'Profile Photo'}
              {step === 8 && 'About You'}
              {step === 9 && 'Skills'}
              {step === 10 && 'Review & Create'}
            </h1>

            {/* Form Fields */}
            {step === 1 && (
              <input
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
                style={inputStyle('name')}
                autoFocus
              />
            )}
            {step === 2 && (
              <input
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onFocus={() => setFocusedInput('phone')}
                onBlur={() => setFocusedInput(null)}
                style={inputStyle('phone')}
                type="tel"
                autoFocus
              />
            )}
            {step === 3 && (
              <input
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                style={inputStyle('email')}
                type="email"
                autoFocus
              />
            )}
            {step === 4 && (
              <input
                placeholder="Digital Marketer & Creator"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onFocus={() => setFocusedInput('title')}
                onBlur={() => setFocusedInput(null)}
                style={inputStyle('title')}
              />
            )}
            {step === 5 && (
              <input
                placeholder="Company (e.g., BoostNow LLP)"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                onFocus={() => setFocusedInput('company')}
                onBlur={() => setFocusedInput(null)}
                style={inputStyle('company')}
              />
            )}
            {step === 6 && (
              <input
                placeholder="Mumbai"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                onFocus={() => setFocusedInput('location')}
                onBlur={() => setFocusedInput(null)}
                style={inputStyle('location')}
              />
            )}
            {step === 7 && (
              <div style={{ textAlign: 'center' }}>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, photo: reader.result as string, photoFile: file });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="photo-upload"
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '3px dashed #D1D5DB',
                    cursor: 'pointer',
                    background: formData.photo ? 'transparent' : '#F3F4F6',
                    transition: 'all 200ms',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span
                        style={{
                          marginTop: '8px',
                          fontSize: '14px',
                          color: '#9CA3AF',
                        }}
                      >
                        Upload Photo
                      </span>
                    </>
                  )}
                </label>
              </div>
            )}
            {step === 8 && (
              <textarea
                placeholder="Crafting engaging content & SEO strategies"
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                onFocus={() => setFocusedInput('about')}
                onBlur={() => setFocusedInput(null)}
                style={{ ...inputStyle('about'), height: '120px', resize: 'none' }}
              />
            )}
            {step === 9 && (
              <input
                placeholder="SEO, Content Creation, Analytics, Social Media"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                onFocus={() => setFocusedInput('skills')}
                onBlur={() => setFocusedInput(null)}
                style={inputStyle('skills')}
              />
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Show Skip button for optional steps (4-9) */}
              {step >= 4 && step <= 9 && (
                <button
                  onClick={() => setStep(step + 1)}
                  style={{
                    flex: 1,
                    padding: '14px 0',
                    background: '#E5E7EB',
                    color: '#6B7280',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Skip
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={
                  (step === 1 && !formData.name.trim()) ||
                  (step === 2 && !formData.phone.trim()) ||
                  (step === 3 && !formData.email.trim())
                }
                style={{
                  flex: step >= 4 && step <= 9 ? 1 : 'auto',
                  width: step >= 4 && step <= 9 ? 'auto' : '100%',
                  padding: '14px 0',
                  background: (
                    (step === 1 && !formData.name.trim()) ||
                    (step === 2 && !formData.phone.trim()) ||
                    (step === 3 && !formData.email.trim())
                  )
                    ? '#D1D5DB'
                    : `linear-gradient(135deg, ${colors.primary}, ${colors.purple})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: (
                    (step === 1 && !formData.name.trim()) ||
                    (step === 2 && !formData.phone.trim()) ||
                    (step === 3 && !formData.email.trim())
                  )
                    ? 'not-allowed'
                    : 'pointer',
                  opacity: (
                    (step === 1 && !formData.name.trim()) ||
                    (step === 2 && !formData.phone.trim()) ||
                    (step === 3 && !formData.email.trim())
                  )
                    ? 0.6
                    : 1,
                }}
              >
                {step < 10 ? 'Continue' : 'Create Card'}
              </button>
            </div>

            {/* Progress Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "40px",
                    height: "4px",
                    borderRadius: "9999px",
                    backgroundColor: i <= step ? colors.primary : "#E5E7EB",
                    transition: "all 300ms",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Party Popup */}
      {showPartyPopup && <PartyPopup onClose={handlePopupClose} />}
    </>
  );
};

export default OnboardingPage;