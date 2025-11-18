"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

/**
 * Single-file inline-styled Account Settings page
 * - All styles inlined in `S` style object
 * - Responsive via isMobile (window width <= 760)
 * - Hover effects via useHover
 */

/* ---------- helpers ---------- */
function useWindowWidth(breakpoint = 760) {
  // Use consistent initial state for SSR (default to desktop)
  const [width, setWidth] = useState<number>(1200);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted flag and initial width on client
    setIsMounted(true);
    setWidth(window.innerWidth);
    
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  
  // Return consistent values during SSR
  return { width, isMobile: isMounted ? width <= breakpoint : false };
}

function useHover() {
  const [hovered, setHovered] = useState(false);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);
  return { hovered, onMouseEnter, onMouseLeave };
}

/* ---------- design tokens & base styles ---------- */
const COLORS = {
  blue600: "#2563eb",
  blue500: "#1d4ed8",
  muted: "#64748b",
  text: "#0f172a",
  cardShadow: "0 6px 20px rgba(14, 30, 37, 0.06)",
};

const S: Record<string, React.CSSProperties> = {
  // page
  page: {
    minHeight: "100vh",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    background: "#ffffff",
    color: COLORS.text,
  },

  // hero
  hero: {
    padding: "36px 20px",
    background: "transparent",
    borderBottom: "1px solid rgba(15, 23, 42, 0.03)",
  },
  heroInner: {
    maxWidth: "100%",
    margin: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  heroInnerMobile: {
    flexDirection: "column",
    textAlign: "center",
  },
  heroText: { flex: 1 },

  title: {
    fontSize: "clamp(20px, 3.4vw, 34px)",
    margin: 0,
    fontWeight: 700,
    lineHeight: 1.05,
  },
  titleAccent: { color: COLORS.blue600 },
  lead: { marginTop: 10, color: COLORS.muted },

  heroCta: { display: "flex", gap: 12, alignItems: "center" },

  // buttons
  primaryBase: {
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 999,
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform .18s ease, box-shadow .18s ease",
    boxShadow: "0 8px 30px rgba(37,99,235,0.12)",
    background: `linear-gradient(90deg, ${COLORS.blue600}, ${COLORS.blue500})`,
  },
  primaryHover: {
    transform: "translateY(-3px)",
  },
  ghost: {
    background: "transparent",
    border: "1px solid rgba(15,23,42,0.06)",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
  },

  // container
  container: {
    maxWidth: 1000,
    margin: "36px 0",
    padding: "0 20px 80px",
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 20,
  },
  containerMobile: {
    padding: "0 12px 40px",
    gap: 16,
  },
  containerMobileOld: {
    paddingBottom: 40,
    gap: 14,
  },

  // card
  card: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: COLORS.cardShadow,
    padding: 20,
    transition: "transform .18s ease",
  },
  cardHover: { transform: "translateY(-3px)" },

  // profile card specifics
  profileCard: { display: "flex", alignItems: "center", gap: 18, padding: 18 },
  profileRow: { display: "flex", gap: 18, alignItems: "center", width: "100%" },
  profileRowMobile: { flexDirection: "column", alignItems: "flex-start", gap: 12 },

  avatarBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 170 },
  avatarBlockMobile: { width: "100%", flexDirection: "row", alignItems: "center", gap: 12 },

  avatarWrap: { position: "relative", display: "inline-block" },
  avatarWrapMobile: { marginRight: 8 },

  avatar: {
    width: 120,
    height: 120,
    objectFit: "cover",
    borderRadius: "50%",
    border: "4px solid rgba(37,99,235,0.08)",
    boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg,#eef6ff,#eaf9ff)",
    color: COLORS.blue600,
    fontWeight: 700,
    fontSize: 36,
    border: "4px solid rgba(37,99,235,0.06)",
  },

  uploadLabel: {
    position: "absolute",
    right: -6,
    bottom: -6,
    background: COLORS.blue600,
    color: "#fff",
    borderRadius: 999,
    padding: "8px 10px",
    fontSize: 12,
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(37,99,235,0.12)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },

  removePhotoBtn: {
    background: "transparent",
    border: "1px solid rgba(15,23,42,0.06)",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },

  // profile info
  profileInfo: { flex: 1 },
  name: { margin: 0, fontSize: 20, fontWeight: 700 },
  email: { color: COLORS.muted, marginTop: 6 },
  small: { color: COLORS.muted, marginTop: 8, fontSize: 13 },

  // form rows
  cardTitle: { fontSize: 16, margin: "0 0 12px", fontWeight: 700 },
  cardTitleDanger: { color: "#b91c1c", margin: "0 0 12px", fontWeight: 700 },

  formRow: {
    display: "flex",
    gap: 18,
    alignItems: "center",
    padding: "14px 0",
    borderTop: "1px solid rgba(15,23,42,0.03)",
  },
  formRowFirst: { borderTop: "none", paddingTop: 0 },
  formRowMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    padding: "12px 0",
  },

  formLabel: { width: 170, color: COLORS.muted, fontWeight: 600 },
  formLabelMobile: { 
    width: "100%", 
    marginBottom: 4 
  },

  formControl: { flex: 1, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  formControlMobile: {
    width: "100%",
    flexDirection: "column",
    gap: 8,
  },

  // inputs
  input: {
    width: "100%",
    maxWidth: 520,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    background: "#fff",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },
  inputMobile: {
    width: "100%",
    maxWidth: "100%",
  },
  inputFocus: {
    boxShadow: "0 6px 18px rgba(37,99,235,0.06)",
    borderColor: "rgba(37,99,235,0.16)",
  },
  inputDisabled: { color: "#94a3b8", background: "#f8fafc" },

  inputStatic: {
    width: "100%",
    maxWidth: 520,
    padding: "10px 12px",
    borderRadius: 8,
    background: "#f8fafc",
    border: "1px solid rgba(15,23,42,0.06)",
    color: "#94a3b8",
  },

  smallPreview: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed rgba(15,23,42,0.04)",
  },

  fileBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 8,
    background: "#f8fafc",
    color: COLORS.text,
    cursor: "pointer",
    fontWeight: 600,
    border: "1px solid rgba(15,23,42,0.08)",
    transition: "background .12s ease",
  },
  fileBtnHover: { background: "#f1f5f9" },

  smallBtn: {
    background: "transparent",
    border: "1px solid rgba(15,23,42,0.06)",
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },

  // password input container
  passwordInputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: 520,
  },
  passwordInputContainerMobile: {
    width: "100%",
    maxWidth: "100%",
  },
  passwordInput: {
    width: "100%",
    padding: "10px 40px 10px 12px", // Extra padding on right for eye icon
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    background: "#fff",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    cursor: "pointer",
    color: "#64748b",
    fontSize: 16,
    zIndex: 1,
  },

  // toggle (visual only)
  toggle: { position: "relative", width: 52, height: 28, display: "inline-block" },
  toggleSlider: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg,#e6eefb,#f0fbff)",
    borderRadius: 999,
    border: "1px solid rgba(15,23,42,0.04)",
  },
  toggleKnob: {
    content: '""',
    position: "absolute",
    top: 3,
    left: 3,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(2,6,23,0.08)",
    transition: "transform .18s ease",
  },

  // danger card
  dangerCard: { background: "linear-gradient(180deg,#fff4f4,#fffaf6)", border: "1px solid #ffd6d6" },
  dangerRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  logout: { background: "#f1f5f9", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer" },
  delete: {
    background: "#fff",
    color: "#ef4444",
    border: "1px solid #ef4444",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background .12s ease",
  },
  deleteHover: { background: "#fff5f5" },

  // modal
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(2,6,23,0.5)",
    zIndex: 60,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "clamp(300px,46vw,520px)",
    boxShadow: "0 20px 60px rgba(2,6,23,0.35)",
  },
  modalLarge: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "clamp(320px,80vw,720px)",
    boxShadow: "0 20px 60px rgba(2,6,23,0.35)",
  },
  modalActions: { display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 14 },

  // reasons list
  reasons: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginTop: 12, maxHeight: 260, overflow: "auto" },
  reasonsMobile: { gridTemplateColumns: "1fr" },
  reasonItem: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    background: "#fafafa",
    border: "1px solid rgba(15,23,42,0.02)",
    cursor: "pointer",
  },
  reasonActive: { background: "linear-gradient(90deg,#eef6ff,#f0fbff)", borderColor: "rgba(0,123,255,0.08)" },

  // save bar (fixed bottom)
  saveBar: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 12,
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none", // only inner controls receive pointer
  },
  saveButton: {
    pointerEvents: "auto",
    background: `linear-gradient(90deg, ${COLORS.blue600}, ${COLORS.blue500})`,
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 999,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 30px rgba(0,123,255,0.12)",
  },
};

/* ---------- constants ---------- */
const REASONS = [
  "I have a duplicate account",
  "I don't find the platform useful",
  "I'm concerned about privacy or data security",
  "I receive too many emails or notifications",
  "I'm switching to another platform",
  "I'm facing technical issues or bugs",
  "I created this account by mistake",
  "Other",
];

/* ---------- main component ---------- */
export default function AccountSettingsPage(): React.JSX.Element {
  const { checkAuth } = useAuth();

  // profile state
  const [accountPhoto, setAccountPhoto] = useState<string | null>(null);
  const [name, setName] = useState<string>("Yaasnick");
  const [email, setEmail] = useState<string>("yaasnick01@gmail.com");
  const [password, setPassword] = useState<string>("**********");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState<string>("");

  // modals / flows
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  const [deleteReasons, setDeleteReasons] = useState<string[]>([]);
  const [deletePassword, setDeletePassword] = useState<string>("");

  // responsive
  const { width, isMobile } = useWindowWidth(760);

  // hover hooks for a few interactive elements
  const primaryHover = useHover();
  const fileBtnHover = useHover();
  const deleteHover = useHover();
  const cardHover = useHover();

  // focus UI states for inputs (so we can show the focus style when active)
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // fetch profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const user = data.user ?? {};
        setName(user.fullName ?? "");
        setEmail(user.email ?? "");
        setPhoneNumber(user.phone ?? "");
        setAccountPhoto(user.profileImage ?? null);
      } catch (err) {
        // keep initial mock data if API fails
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // photo change: preview + upload
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // immediate preview
    const reader = new FileReader();
    reader.onload = () => setAccountPhoto(reader.result as string);
    reader.readAsDataURL(file);

    // upload to backend (Cloudinary handler)
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("userId", "currentUserId"); // Add user ID for database update
      fd.append("fullName", name); // Include current name for database sync
      
      const res = await fetch("/api/profile/upload-image", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setAccountPhoto(data.imageUrl);
        // refresh auth state so header/avatar update if needed
        setTimeout(async () => {
          await checkAuth();
        }, 300);
      } else {
        console.error("Upload failed:", data?.error);
        alert("Failed to upload image: " + (data?.error ?? "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Try again.");
    }
  };

  /**
   * SIMPLIFIED: Instantly removes the photo from the UI by setting state to null, 
   * no backend call or await needed.
   */
  const handleRemovePhoto = () => {
    setAccountPhoto(null);
    alert('Profile photo removed from UI.');
  };

  // Send OTP function
  const handleSendOTP = () => {
    toast.success("OTP sent to " + phoneNumber);
    setShowOtpModal(true);
  };

  // OTP verification function (always returns wrong)
  const handleVerifyOTP = (otpValue: string) => {
    if (otpValue.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }
    
    // Always show wrong OTP message
    setTimeout(() => {
      toast.error("Wrong OTP entered. Please try again.");
    }, 1000);
  };

  // Handle phone number editing
  const handleEditPhone = () => {
    setTempPhoneNumber(phoneNumber);
    setIsEditingPhone(true);
  };

  // Handle phone number save
  const handleSavePhone = async () => {
    if (!tempPhoneNumber.trim()) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(tempPhoneNumber.replace(/\s/g, ''))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      // Save phone number to backend
      const res = await fetch("/api/profile/update-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: tempPhoneNumber })
      });

      if (res.ok) {
        setPhoneNumber(tempPhoneNumber);
        setIsEditingPhone(false);
        setIsPhoneVerified(false); // Reset verification status
        toast.success("Phone number updated successfully");
      } else {
        toast.error("Failed to update phone number");
      }
    } catch (error) {
      console.error("Error updating phone:", error);
      toast.error("Failed to update phone number");
    }
  };

  // Handle cancel phone editing
  const handleCancelPhoneEdit = () => {
    setTempPhoneNumber("");
    setIsEditingPhone(false);
  };

  const handleDeleteReasonToggle = (reason: string) => {
    setDeleteReasons((prev) => (prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]));
  };

  const submitDeleteReasons = () => {
    if (deleteReasons.length === 0) return;
    setShowDeleteModal(false);
    setShowPasswordModal(true);
  };

  const finalizeDelete = async () => {
    if (!deletePassword) {
      alert("Please enter your password");
      return;
    }

    try {
      const response = await fetch('/api/auth/deactivate-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          password: deletePassword,
          reasons: deleteReasons
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to delete account');
        return;
      }

      setShowPasswordModal(false);
      setDeletePassword("");
      setDeleteReasons([]);
      
      alert("Your account has been deactivated successfully. You will be logged out.");
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Deactivate account error:', error);
      alert('Failed to deactivate account. Please try again.');
    }
  };

  const updateNameInDatabase = async (newName: string) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fullName: newName }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error('Name update failed:', error);
        return false;
      }
      setTimeout(() => { checkAuth(); }, 200);
      return true;
    } catch (err) {
      console.error('Name update error:', err);
      return false;
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      
      if (res.status === 200) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Password updated successfully!');
      } else if (res.status === 400) {
        toast.error('Invalid input or password mismatch');
      } else if (res.status === 401) {
        toast.error('Unauthorized request');
      } else if (res.status === 500) {
        toast.error('Something went wrong, please try again later');
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (e) {
      console.error('Change password error:', e);
      toast.error('Something went wrong, please try again later');
    }
  };

  /* ---------- small helpers for style merging ---------- */
  const merge = (...objs: Array<React.CSSProperties | false | null | undefined>) =>
    Object.assign({}, ...objs.filter(Boolean));

  return (
    <div style={S.page}>
      {/* HERO */}
      <section style={S.hero}>
        <div style={merge(S.heroInner, isMobile ? S.heroInnerMobile : undefined)}>
          <div style={S.heroText}>
            <h1 style={{
              fontSize: isMobile ? 24 : 28,
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              lineHeight: 1.05
            }}>
              Account <span style={S.titleAccent}>Settings</span>
            </h1>
            <p style={{
              fontSize: 16,
              color: "#4B5563",
              marginTop: 8
            }}>Update your profile, security settings and preferences.</p>
          </div>

          {/* Save Changes Button - Top Right */}
          <button
            style={{
              background: `linear-gradient(90deg, ${COLORS.blue600}, ${COLORS.blue500})`,
              color: '#fff',
              border: 'none',
              padding: isMobile ? '10px 16px' : '12px 24px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: isMobile ? 14 : 16,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              alignSelf: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => alert('All changes saved')}
            suppressHydrationWarning
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* MAIN */}
      <main style={merge(S.container, isMobile ? S.containerMobile : undefined)}>
        {/* Profile overview card */}
        <section
          aria-labelledby="profile-heading"
          style={merge(S.card, S.profileCard, cardHover.hovered ? S.cardHover : undefined)}
          onMouseEnter={cardHover.onMouseEnter}
          onMouseLeave={cardHover.onMouseLeave}
        >
          <div style={merge(S.profileRow, isMobile ? S.profileRowMobile : undefined)}>
            <div style={merge(S.avatarBlock, isMobile ? S.avatarBlockMobile : undefined)}>
              <div style={merge(S.avatarWrap, isMobile ? S.avatarWrapMobile : undefined)}>
                {accountPhoto ? (
                  <img src={accountPhoto} alt="profile" style={S.avatar} />
                ) : (
                  <div style={S.avatarPlaceholder}>{name?.charAt(0)?.toUpperCase() ?? "U"}</div>
                )}

                <label style={S.uploadLabel}>
                  <input
                    aria-label="Upload profile photo"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoChange}
                  />
                  <span style={{ fontSize: 12 }}>Change</span>
                </label>
              </div>

              {accountPhoto && (
                <button type="button" style={S.removePhotoBtn} onClick={handleRemovePhoto}>
                  Remove
                </button>
              )}
            </div>

            <div style={S.profileInfo}>
              <h2 style={S.name}>{name}</h2>
              <div style={S.email}>{email}</div>
              
            </div>
          </div>
        </section>

        {/* Form card */}
        <section style={S.card} aria-labelledby="settings-heading">
          <h3 id="settings-heading" style={{
            fontSize: 16,
            margin: "0 0 12px",
            fontWeight: 700,
            color: "#111827"
          }}>
            Personal Information
          </h3>

          {/* Name row */}
          <div style={merge(S.formRow, S.formRowFirst, isMobile ? S.formRowMobile : undefined)}>
            <label style={merge({
              width: 170,
              color: "#4B5563",
              fontWeight: 600,
              fontSize: 14
            }, isMobile ? S.formLabelMobile : undefined)}>Name</label>
            <div style={merge(S.formControl, isMobile ? S.formControlMobile : undefined)}>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => { setFocusedInput(null); updateNameInDatabase(name); }}
                style={merge(
                  S.input,
                  S.inputMobile,
                  focusedInput === "name" ? S.inputFocus : undefined
                )}
                aria-label="Name"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Account Photo row */}
          <div style={merge(S.formRow, isMobile ? S.formRowMobile : undefined)}>
            <label style={merge({
              width: 170,
              color: "#4B5563",
              fontWeight: 600,
              fontSize: 14
            }, isMobile ? S.formLabelMobile : undefined)}>Account Photo</label>
            <div style={merge(S.formControl, isMobile ? S.formControlMobile : undefined)}>
              <div style={S.smallPreview}>
                {accountPhoto ? (
                  <img src={accountPhoto} alt="small preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>No photo</div>
                )}
              </div>

              <label
                style={merge(S.fileBtn, fileBtnHover.hovered ? S.fileBtnHover : undefined)}
                onMouseEnter={fileBtnHover.onMouseEnter}
                onMouseLeave={fileBtnHover.onMouseLeave}
              >
                + Add Photo
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
              </label>
            </div>
          </div>

          {/* Email row */}
          <div style={merge(S.formRow, isMobile ? S.formRowMobile : undefined)}>
            <label style={merge({
              width: 170,
              color: "#4B5563",
              fontWeight: 600,
              fontSize: 14
            }, isMobile ? S.formLabelMobile : undefined)}>Email</label>
            <div style={merge(S.formControl, isMobile ? S.formControlMobile : undefined)}>
              <div style={S.inputStatic}>{email || "your@email.com"}</div>
            </div>
          </div>

          {/* Phone Number row */}
          <div style={merge(S.formRow, isMobile ? S.formRowMobile : undefined)}>
            <label style={merge({
              width: 170,
              color: "#4B5563",
              fontWeight: 600,
              fontSize: 14
            }, isMobile ? S.formLabelMobile : undefined)}>Phone Number</label>
            <div style={merge(S.formControl, isMobile ? S.formControlMobile : undefined)}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                
                {/* Phone number display or input */}
                {isEditingPhone ? (
                  // Phone number input mode
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input
                      type="tel"
                      value={tempPhoneNumber}
                      onChange={(e) => setTempPhoneNumber(e.target.value)}
                      placeholder="Enter phone number (e.g., +1234567890)"
                      onFocus={() => setFocusedInput("phone")}
                      onBlur={() => setFocusedInput(null)}
                      style={merge(
                        S.input,
                        S.inputMobile,
                        focusedInput === "phone" ? S.inputFocus : undefined
                      )}
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={handleSavePhone}
                        style={{
                          ...S.primaryBase,
                          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                          fontSize: "12px",
                          padding: "6px 12px"
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelPhoneEdit}
                        style={{
                          ...S.primaryBase,
                          background: "#6B7280",
                          fontSize: "12px",
                          padding: "6px 12px"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Phone number display mode
                  <>
                    {phoneNumber ? (
                      // When phone number exists
                      <div style={{
                        ...S.inputStatic,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span>{phoneNumber}</span>
                        {isPhoneVerified ? (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            background: "#D1FAE5",
                            color: "#065F46",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600
                          }}>
                            <FaCheckCircle style={{ fontSize: "12px" }} />
                            Verified
                          </div>
                        ) : (
                          <>
                            <div style={{
                              background: "#FEF3C7",
                              color: "#92400E",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 600
                            }}>
                              Not Verified
                            </div>
                            <button
                              onClick={handleEditPhone}
                              style={{
                                background: "none",
                                border: "1px solid #D1D5DB",
                                color: "#6B7280",
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: 500,
                                marginLeft: "auto"
                              }}
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      // When no phone number
                      <div style={{
                        ...S.inputStatic,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        <span>Not provided</span>
                        <button
                          onClick={handleEditPhone}
                          style={{
                            background: "none",
                            border: "1px solid #D1D5DB",
                            color: "#6B7280",
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: 500
                          }}
                        >
                          Add Phone
                        </button>
                      </div>
                    )}
                    
                    {/* Send OTP button */}
                    {phoneNumber && !isPhoneVerified && (
                      <button
                        onClick={handleSendOTP}
                        style={{
                          ...S.primaryBase,
                          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                          fontSize: "12px",
                          padding: "8px 16px",
                          alignSelf: "flex-start",
                          minWidth: "120px"
                        }}
                      >
                        Send OTP
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Password row */}
          <div style={merge(S.formRow, isMobile ? S.formRowMobile : undefined)}>
            <label style={merge({
              width: 170,
              color: "#4B5563",
              fontWeight: 600,
              fontSize: 14
            }, isMobile ? S.formLabelMobile : undefined)}>Password</label>
            <div style={merge(S.formControl, isMobile ? S.formControlMobile : undefined)}>
              {/* Current Password */}
              <div style={merge(S.passwordInputContainer, isMobile ? S.passwordInputContainerMobile : undefined)}>
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current password"
                  onFocus={() => setFocusedInput("currentPassword")}
                  onBlur={() => setFocusedInput(null)}
                  style={merge(
                    S.passwordInput,
                    focusedInput === "currentPassword" ? S.inputFocus : undefined
                  )}
                  aria-label="Current password"
                />
                <div
                  style={S.eyeIcon}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {/* New Password */}
              <div style={merge(S.passwordInputContainer, isMobile ? S.passwordInputContainerMobile : undefined)}>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  onFocus={() => setFocusedInput("newPassword")}
                  onBlur={() => setFocusedInput(null)}
                  style={merge(
                    S.passwordInput,
                    focusedInput === "newPassword" ? S.inputFocus : undefined
                  )}
                  aria-label="New password"
                />
                <div
                  style={S.eyeIcon}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {/* Confirm Password */}
              <div style={merge(S.passwordInputContainer, isMobile ? S.passwordInputContainerMobile : undefined)}>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  onFocus={() => setFocusedInput("confirmPassword")}
                  onBlur={() => setFocusedInput(null)}
                  style={merge(
                    S.passwordInput,
                    focusedInput === "confirmPassword" ? S.inputFocus : undefined
                  )}
                  aria-label="Confirm new password"
                />
                <div
                  style={S.eyeIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {/* Change Password Button */}
              <div style={{ display: "flex", justifyContent: "center", paddingRight: "1rem", marginTop: "8px" }}>
                <button 
                  className="change-password" 
                  style={S.smallBtn} 
                  onClick={changePassword}
                  suppressHydrationWarning
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Delete row */}
          <div style={merge(S.formRow, isMobile ? S.formRowMobile : undefined)}>
            <label style={merge({
              width: 170,
              color: "#4B5563",
              fontWeight: 600,
              fontSize: 14
            }, isMobile ? S.formLabelMobile : undefined)}>Deactivate</label>
            <div style={merge(S.formControl, isMobile ? S.formControlMobile : undefined)}>
              <button
                style={merge(S.delete, deleteHover.hovered ? S.deleteHover : undefined)}
                onMouseEnter={deleteHover.onMouseEnter}
                onMouseLeave={deleteHover.onMouseLeave}
                onClick={() => setShowDeleteModal(true)}
                suppressHydrationWarning
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={S.modalBackdrop}>
          <div style={S.modal}>
            <h4>Logout</h4>
            <p>Are you sure you want to logout?</p>
            <div style={S.modalActions}>
              <button style={S.ghost} onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button
                style={S.primaryBase}
                onClick={() => {
                  setShowLogoutModal(false);
                  alert("Logged out (mock)");
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Reasons Modal */}
      {showDeleteModal && (
        <div style={S.modalBackdrop}>
          <div style={S.modalLarge}>
            <h4>Why do you want to delete this account?</h4>

            <div style={merge(S.reasons, isMobile ? S.reasonsMobile : undefined)}>
              {REASONS.map((r) => {
                const active = deleteReasons.includes(r);
                return (
                  <label
                    key={r}
                    onClick={() => handleDeleteReasonToggle(r)}
                    style={merge(S.reasonItem, active ? S.reasonActive : undefined)}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => handleDeleteReasonToggle(r)}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ userSelect: "none" }}>{r}</span>
                  </label>
                );
              })}
            </div>

            <div style={S.modalActions}>
              <button
                style={S.ghost}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReasons([]);
                }}
              >
                Cancel
              </button>
              <button style={merge(S.primaryBase, deleteReasons.length === 0 ? { opacity: 0.5, cursor: "not-allowed" } : {})} onClick={submitDeleteReasons} disabled={deleteReasons.length === 0}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Confirmation Modal */}
      {showPasswordModal && (
        <div style={S.modalBackdrop}>
          <div style={S.modal}>
            <h4>Confirm Deletion</h4>
            <p>Enter your password to delete your account. Your data will be preserved but you won't be able to log in.</p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Password"
              onFocus={() => setFocusedInput("deletePassword")}
              onBlur={() => setFocusedInput(null)}
              style={merge(S.input, S.inputMobile, focusedInput === "deletePassword" ? S.inputFocus : undefined)}
            />
            <div style={S.modalActions}>
              <button style={S.ghost} onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button style={S.delete} onClick={finalizeDelete} disabled={!deletePassword}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <OTPModal
          phoneNumber={phoneNumber}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleVerifyOTP}
        />
      )}
    </div>
  );
}

// OTP Modal Component
function OTPModal({ phoneNumber, onClose, onVerify }: {
  phoneNumber: string;
  onClose: () => void;
  onVerify: (otp: string) => void;
}) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join("");
    setIsVerifying(true);
    onVerify(otpString);
    setTimeout(() => {
      setIsVerifying(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  const handleResend = () => {
    toast.success("OTP resent to " + phoneNumber);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px"
        }}>
          <h3 style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1F2937",
            margin: 0
          }}>
            Verify Phone Number
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              color: "#6B7280",
              cursor: "pointer",
              padding: "4px"
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px"
          }}>
            📱
          </div>
          
          <p style={{
            color: "#6B7280",
            fontSize: "14px",
            margin: "0 0 8px 0"
          }}>
            We've sent a 6-digit code to
          </p>
          
          <p style={{
            color: "#1F2937",
            fontSize: "16px",
            fontWeight: 600,
            margin: "0 0 24px 0"
          }}>
            {phoneNumber}
          </p>

          {/* OTP Inputs */}
          <div style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "24px"
          }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: digit ? "2px solid #2563EB" : "2px solid #E5E7EB",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1F2937",
                  outline: "none",
                  background: digit ? "#EFF6FF" : "white"
                }}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleSubmit}
            disabled={isVerifying || otp.join("").length !== 6}
            style={{
              width: "100%",
              background: (isVerifying || otp.join("").length !== 6) 
                ? "#9CA3AF" 
                : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: (isVerifying || otp.join("").length !== 6) ? "not-allowed" : "pointer",
              marginBottom: "16px"
            }}
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend */}
          <div style={{ fontSize: "14px", color: "#6B7280" }}>
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              style={{
                background: "none",
                border: "none",
                color: "#2563EB",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}