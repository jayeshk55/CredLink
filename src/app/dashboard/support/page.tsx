"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Mail, HelpCircle } from "lucide-react";

// Add type definition for Lucide icons
interface LucideIconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  color?: string;
}

type ContactAction = {
  type: "link" | "button";
  label: string;
  href?: string;
};

type ContactOption = {
  title: string;
  description: string;
  icon: React.ComponentType<LucideIconProps>;
  accentColor: string;
  action: ContactAction;
};

type Faq = { q: string; a: string };

export default function SupportPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", topic: "", message: "" });
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const contactOptions = useMemo<ContactOption[]>(() => [
    {
      title: "Email Support",
      description:
        "Drop us a note and our customer success team will respond within one business day.",
      icon: Mail,
      accentColor: "#2563eb",
      action: { type: "link", label: "@mykard.in", href: "mailto:@mykard.in" },
    },
  ], []);

  const faqs = useMemo<Faq[]>(() => [
    {
      q: "What is MyKard?",
      a: "MyKard is a digital business card platform that allows users to create and share their professional profiles online. It provides a modern, customizable, and shareable way to represent oneself in the digital age.",
    },  
   {
      q: "How to create MyKard?",
      a: "To create MyKard, you can follow these steps: 1) Go to dashboard and click on create card button. 2) Fill the form with your details. 3) Click on create card button .And you will get your MyKard.",
    }, 
    {
      q: "How does MyKard works",
      a: "1)Create Your Profile – Add your professional details.2) Customize Your Card – Personalize with themes and logos.3)Share Anywhere – Use your link or QR code instantly.4)Track Insights – Monitor views, leads, and engagement.",
    },
   
    {
      q: "How can I search for a professional?",
      a: "In the Dashboard, use the Search feature at the top. You can search by name, category, or email to quickly find any professional profile.",
    },
    {
      q: "How can I see my connections?",
      a: "Go to your Dashboard and click on the Connections tab. You'll see all your active and pending connections in one place.",
    },

    {
      q: "How much does it cost to get started?",
      a: "You can get started for free with MyKard.Just click “Create Your Free Card Now” on the homepage to begin designing your digital card.",
    },
    {
      q: "How does MyKard help grow my professional network?",
      a: "MyKard helps you connect instantly through shareable QR or link — whether at events, meetings, or online.You can discover professionals, entrepreneurs, and creators nearby or in your industry, and stay connected effortlessly.",
    },
   

  ], []);

  const handleFaqToggle = useCallback((i: number) => {
    setActiveFaq((p) => (p === i ? null : i));
  }, []);

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((p) => ({ ...p, [name]: value }));
    },
    []
  );

  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("token", token);
    // Ensure backend receives x-user-id header expected by the API
    let userIdHeader: string | undefined = undefined;
    try {
      const meRes = await fetch('/api/user/me', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (meRes.ok) {
        const me = await meRes.json();
        if (me?.user?.id) userIdHeader = me.user.id;
      }
    } catch {}
    const res = await fetch("/api/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : '',
        ...(userIdHeader ? { 'x-user-id': userIdHeader } : {}),
      },
      body: JSON.stringify({
        message: formData.message,
        topic: formData.topic || "Other",
        status: "PENDING",
        read: false,
        tag: "SUPPORT"
      }),
    });
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      await new Promise((res) => setTimeout(res, 1500));
      const { name, email, topic, message } = formData;
      const subject = encodeURIComponent(`Support request${topic ? `: ${topic}` : ""}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);
      window.location.href = `mailto:@mykard.in?subject=${subject}&body=${body}`;
      setSubmitStatus("success");
      setTimeout(() => {
        setFormData({ name: "", email: "", topic: "", message: "" });
        setSubmitStatus("idle");
      }, 3000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handleKnowledgeBase = useCallback(() => {
    alert("Knowledge base coming soon! For now, check our FAQ section above.");
  }, []);

  return (
    <section style={S.container}>
      <div style={S.wrapper}>
        {/* ===== HERO ===== */}
        <header style={S.header}>
          <div style={S.heroBadge}>We're here to help</div>
          <h1 style={S.title}>MyKard Support & Help Centre</h1>
          <p style={S.subtitle}>
            Whether you’re building a digital identity, managing team memberships, or monitoring
            engagement analytics, the MyKard support team is ready around the clock to keep you moving forward.
          </p>
        </header>

        {/* ===== CONTACT CARDS ===== */}
        <div style={S.contactGrid}>
          {contactOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div key={opt.title} style={S.card}>
                <div style={S.iconCircle}>
                  <Icon size={32} color={opt.accentColor} />
                </div>
                <h3 style={S.cardTitle}>{opt.title}</h3>
                <p style={S.cardDesc}>{opt.description}</p>
                <a href={opt.action.href} style={{ ...S.button, background: "#1d4ed8" }}>
                  {opt.action.label}
                </a>
              </div>
            );
          })}
        </div>

        {/* ===== FAQ ===== */}
        <div style={S.faqSection}>
          <h2 style={S.sectionTitle}>Frequently Asked Questions</h2>
          <p style={S.sectionSubtitle}>
            Quick answers to the most common questions about your MyKard workspace and profile.
          </p>

          <div style={S.faqList}>
            {faqs.map((faq, i) => (
              <div key={i} style={S.faqCard}>
                <button style={S.faqButton} onClick={() => handleFaqToggle(i)}>
                  <span style={S.faqQ}>
                    <HelpCircle size={isMobile ? 18 : 20} style={{ color: '#2563eb', marginRight: 8, flexShrink: 0 }} />
                    {faq.q}
                  </span>
                  <span style={{ fontSize: 24, color: '#2563eb', transform: activeFaq === i ? 'rotate(45deg)' : 'none', transition: '0.2s' }}>+</span>
                </button>
                {activeFaq === i && <p style={S.faqA}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* ===== SUPPORT FORM ===== */}
        <div style={S.formSection}>
          <h2 style={S.sectionTitle}>Submit a Support Request</h2>
          <p style={S.sectionSubtitle}>
            Share a few details and we’ll reach back by email with the next steps.
          </p>
          <form onSubmit={handleFormSubmit} style={S.form}>
            <div style={S.formRow}>
              <div style={S.formGroup}>
                <label style={S.label}>Full name</label>
                <input name="name" required value={formData.name} onChange={handleFormChange} style={S.input} placeholder="Jane Matthews" />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Work email</label>
                <input name="email" required type="email" value={formData.email} onChange={handleFormChange} style={S.input} placeholder="jane@company.com" />
              </div>
            </div>

            <div style={S.formGroup}>
              <label style={S.label}>Topic</label>
              <select name="topic" required value={formData.topic} onChange={handleFormChange} style={S.input}>
                <option value="">Select a topic</option>
                <option>Account access</option>
                <option>Unable to share card</option>
                <option>Billing & invoicing</option>
                <option>Connections</option>
                <option>Analytics & reporting</option>
                <option>Other</option>
              </select>
            </div>

            <div style={S.formGroup}>
              <label style={S.label}>How can we help?</label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleFormChange}
                style={{ ...S.input, minHeight: 140, resize: "vertical" }}
                placeholder="Describe the issue, include relevant account links, and any deadlines."
              />
            </div>

            <div style={S.formFooter}>
              <p style={S.consentText}>By submitting, you consent to MyKard contacting you at the email provided.</p>
              <button type="submit" disabled={isSubmitting} style={S.submitBtn}>
                {isSubmitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>

        
        {/* ===== STATUS ===== */}
        {submitStatus === "success" && <div style={{ ...S.toast, background: "#10B981" }}>✅ Support request sent successfully!</div>}
        {submitStatus === "error" && <div style={{ ...S.toast, background: "#EF4444" }}>❌ Failed to send request. Please try again.</div>}

        {/* ===== CHAT MODAL ===== */}
        {showChatModal && (
          <div style={S.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowChatModal(false)}>
            <div style={S.modalCard}>
              <h3 style={S.modalTitle}>💬 Start Live Chat</h3>
              <p style={S.modalText}>
                Our live chat system is being upgraded. Please use the contact form or email us at @mykard.in.
              </p>
              <div style={S.modalActions}>
                <button style={S.submitBtn} onClick={() => setShowChatModal(false)}>Okay</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- INLINE STYLES ---------- */
const S: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(145deg, #f8faff 0%, #eef3ff 100%)",
    fontFamily: "Poppins, sans-serif",
    padding: "3rem 1rem",
    color: "#111827",
  },
  wrapper: { maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" },
  header: { textAlign: "center" },
  heroBadge: { background: "white", display: "inline-block", padding: "0.4rem 1rem", borderRadius: 20, color: "#2563eb", fontWeight: 600, fontSize: 14, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" },
  title: { fontSize: "2.3rem", fontWeight: 700, marginTop: 12 },
  subtitle: { color: "#6b7280", marginTop: 12, maxWidth: 700, marginInline: "auto", lineHeight: 1.6 },
  contactGrid: { display: "grid", gridTemplateColumns: "minmax(280px, 420px)", justifyContent: "center", gap: "1.5rem" },
  card: { background: "white", borderRadius: 18, padding: "1.8rem", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", alignItems: "center", transition: "0.3s" },
  iconCircle: { background: "#f9fafb", borderRadius: "50%", width: 70, height: 70, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  cardTitle: { fontSize: "1.2rem", fontWeight: 600 },
  cardDesc: { color: "#6b7280", margin: "0.5rem 0 1rem", textAlign: "center" },
  button: { 
    background: "#1d4ed8", 
    color: "#fff", 
    padding: "0.8rem 1.6rem", 
    border: "none", 
    borderRadius: 10, 
    fontWeight: 600, 
    cursor: "pointer", 
    transition: "0.3s" 
  },
  faqSection: { textAlign: "center" },
  sectionTitle: { fontSize: "1.6rem", fontWeight: 600 },
  sectionSubtitle: { color: "#6b7280", marginTop: 8, lineHeight: 1.5 },
  faqList: { marginTop: 24, display: "flex", flexDirection: "column", gap: 16 },
  faqCard: { background: "white", borderRadius: 14, padding: "1.2rem 1.5rem", boxShadow: "0 6px 15px rgba(0,0,0,0.05)", textAlign: "left" },
  faqButton: { background: "none", border: "none", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, fontWeight: 500, cursor: "pointer", minHeight: 56, textAlign: "left" },
  faqQ: { display: "flex", alignItems: "center", color: "#111827", flex: 1, textAlign: "left" },
  faqA: { color: "#6b7280", marginTop: 10, fontSize: 14, lineHeight: 1.6 },
  formSection: { background: "white", borderRadius: 20, padding: "2rem", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  formRow: { display: "flex", gap: 20, flexWrap: "wrap" },
  formGroup: { flex: 1, display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 500 },
  input: { padding: "0.8rem 1rem", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" },
  formFooter: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: "1px solid #e5e7eb", paddingTop: 16 },
  consentText: { fontSize: 13, color: "#6b7280" },
  submitBtn: { 
    background: "#1d4ed8", 
    color: "white", 
    padding: "0.8rem 1.8rem", 
    border: "none", 
    borderRadius: 10, 
    fontWeight: 600, 
    cursor: "pointer" 
  },
  ctaCard: { background: "white", borderRadius: 20, padding: "2rem", textAlign: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" },
  toast: { position: "fixed", top: 20, right: 20, color: "white", padding: "0.8rem 1.4rem", borderRadius: 8, fontWeight: 500, boxShadow: "0 6px 15px rgba(0,0,0,0.2)" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  modalCard: { background: "white", padding: "2rem", borderRadius: 16, maxWidth: 400, width: "90%", boxShadow: "0 15px 30px rgba(0,0,0,0.2)" },
  modalTitle: { fontSize: "1.4rem", fontWeight: 600, marginBottom: 10 },
  modalText: { color: "#6b7280", lineHeight: 1.5 },
  modalActions: { marginTop: 20, textAlign: "right" },
};
