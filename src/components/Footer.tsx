'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Twitter, Instagram, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import '../app/globals.css';
import { useState, useEffect } from 'react';

// Smooth scroll helper for in-page navigation without changing URL
const scrollToSection = (sectionId: string) => {
  if (typeof document === 'undefined') return;
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025); // Default to a reasonable year

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer style={{
      marginTop: 'auto',
      background: 'linear-gradient(180deg, rgba(0, 102, 255, 0.02) 0%, rgba(0, 102, 255, 0.08) 100%)',
      borderTop: '1px solid rgba(0, 102, 255, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: 'radial-gradient(circle at 2px 2px, #0066FF 1px, transparent 0)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 1.5rem 1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Top Section - Brand & CTA */}
        
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          {/* Quick Links Column */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '32px',
                height: '2px',
                background: 'linear-gradient(90deg, #0066FF 0%, transparent 100%)'
              }} />
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#2C3E50',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0
              }}>
                Quick Links
              </h4>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {[{ name: 'Home', path: '/' }, { name: 'Features', sectionId: 'build-credibility' }, { name: 'Search', sectionId: 'find-digital-card' }, { name: 'About Us', sectionId: 'what-is-digital-card' }]
                .map((link, idx) => (
                  link.path ? (
                    <Link
                      key={idx}
                      href={link.path}
                      style={{
                        color: '#6B7280',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#0066FF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6B7280';
                      }}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToSection(link.sectionId!)}
                      style={{
                        color: '#6B7280',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#0066FF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6B7280';
                      }}
                    >
                      {link.name}
                    </button>
                  )
                ))}
            </div>
          </div>
          {/* Support Column */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '32px',
                height: '2px',
                background: 'linear-gradient(90deg, #0066FF 0%, transparent 100%)'
              }} />
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#2C3E50',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0
              }}>
                Support
              </h4>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {[{"name": "Help Center", "path": "/help"}, {"name": "FAQ", "path": "/faq"}, {"name": "Terms of Service", "path": "/terms"}, {"name": "Privacy Policy", "path": "/privacy"}]
                .map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.path}
                    style={{
                      color: '#6B7280',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#0066FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6B7280';
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          </div>
          {/* Contact Column */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '32px',
                height: '2px',
                background: 'linear-gradient(90deg, #0066FF 0%, transparent 100%)'
              }} />
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#2C3E50',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0
              }}>
                Contact
              </h4>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {[{"Icon": Mail, "text": "@mykard.in", "href": "mailto:@mykard.in"},  {"Icon": MapPin, "text": "India", "href": "#"}]
                .map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    style={{
                      color: '#6B7280',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#0066FF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                  >
                    <item.Icon size={18} style={{ flexShrink: 0 }} />
                    {item.text}
                  </a>
                ))}
            </div>
          </div>
          {/* Social & Newsletter Column */}
          {/* <div> */}
            {/* <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}> */}
              {/* <div style={{
                width: '32px',
                height: '2px',
                background: 'linear-gradient(90deg, #0066FF 0%, transparent 100%)'
              }} /> */}
              {/* <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#2C3E50',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0
              }}>
                Connect
              </h4> */}
            {/* </div> */}
            
            {/* Social Icons */}
            {/* <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              {[{"Icon": Linkedin, "label": "LinkedIn", "url": "https://linkedin.com"}, {"Icon": Twitter, "label": "Twitter", "url": "https://twitter.com"}, {"Icon": Instagram, "label": "Instagram", "url": "https://instagram.com"}]
                .map(({
                  Icon,
                  label,
                  url
                }, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '44px',
                      height: '44px',
                      background: 'rgba(0, 102, 255, 0.1)',
                      color: '#0066FF',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      border: '1px solid rgba(0, 102, 255, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #0066FF 0%, #00D2FF 100%)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-3px) rotate(5deg)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 102, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 102, 255, 0.1)';
                      e.currentTarget.style.color = '#0066FF';
                      e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </a>
                ))}
            </div> */}
            {/* Newsletter */}
           
            {/* <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              maxWidth: '100%'
            }}>
              
              
            </div>
          </div> */}
        </div>
        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(0, 102, 255, 0.2)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0'
          }}>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: 0,
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Image
                src="/assets/headerlogo.png"
                alt="Logo"
                width={112}
                height={112}
                className="w-28 h-16 object-contain"
                priority
                unoptimized
              />
              powered by BoostNow
            </p>
            <p style={{
              fontSize: '0.95rem',
              color: '#6B7280',
              margin: 0
            }}>
              © {currentYear} BoostNow Solution LLP. All Rights Reserved.
            </p>
          </div>
          
          
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </footer>
  );
}
