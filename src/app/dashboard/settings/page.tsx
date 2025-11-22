
 
 "use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import "./account-settings.css";

/**
 * Account Settings Page
 * - All styles moved to account-settings.css
 * - Duplicate Account Photo section removed
 */

/* ---------- helpers ---------- */
function useWindowWidth(breakpoint = 760) {
  const [width, setWidth] = useState<number>(1200);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setWidth(window.innerWidth);
    
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  
  return { width, isMobile: isMounted ? width <= breakpoint : false };
}

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
  const [hasPassword, setHasPassword] = useState<boolean>(true);

  // modals / flows
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState<boolean>(false);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] = useState<boolean>(false);
  const [showDeactivateSuccessModal, setShowDeactivateSuccessModal] = useState<boolean>(false);
  const [deactivateErrorMessage, setDeactivateErrorMessage] = useState<string>('');
  const [showDeactivateErrorModal, setShowDeactivateErrorModal] = useState<boolean>(false);

  // responsive
  const { width, isMobile } = useWindowWidth(760);

  // focus UI states for inputs
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
        setHasPassword(user.hasPassword ?? true);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUserProfile();
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
      fd.append("userId", "currentUserId");
      fd.append("fullName", name);
      
      const res = await fetch("/api/profile/upload-image", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setAccountPhoto(data.imageUrl);
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

  const handleRemovePhoto = () => {
    setAccountPhoto(null);
    alert('Profile photo removed from UI.');
  };

  // Send OTP function
  const handleSendOTP = () => {
    toast.success("OTP sent to " + phoneNumber);
    setShowOtpModal(true);
  };

  // OTP verification function
  const handleVerifyOTP = (otpValue: string) => {
    if (otpValue.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }
    
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

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(tempPhoneNumber.replace(/\s/g, ''))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const res = await fetch("/api/profile/update-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: tempPhoneNumber })
      });

      if (res.ok) {
        setPhoneNumber(tempPhoneNumber);
        setIsEditingPhone(false);
        setIsPhoneVerified(false);
        toast.success("Phone number updated successfully");
      } else {
        toast.error("Failed to update phone number");
      }
    } catch (error) {
      console.error("Error updating phone:", error);
      toast.error("Failed to update phone number");
    }
  };

  const handleCancelPhoneEdit = () => {
    setTempPhoneNumber("");
    setIsEditingPhone(false);
  };

  const handleDeactivateAccount = async () => {
    try {
      const response = await fetch('/api/auth/deactivate-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        setDeactivateErrorMessage(data.error || 'Failed to deactivate account');
        setShowDeactivateErrorModal(true);
        setShowDeactivateConfirm(false);
        return;
      }

      setShowDeactivateConfirm(false);
      setShowDeactivateSuccessModal(true);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Deactivate account error:', error);
      setDeactivateErrorMessage('Failed to deactivate account. Please try again.');
      setShowDeactivateErrorModal(true);
      setShowDeactivateConfirm(false);
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
        setShowPasswordSuccessModal(true);
      } else if (res.status === 400) {
        toast.error('Invalid input or password mismatch');
      } else if (res.status === 401) {
        toast.error('Current password is incorrect');
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

  return (
    <div className="account-settings-page">
      {/* HERO */}
      <section className="hero-section">
        <div className={`hero-inner ${isMobile ? 'mobile' : ''}`}>
          <div className="hero-text">
            <h1 className={`hero-title ${isMobile ? 'mobile' : 'desktop'}`}>
              Account <span className="hero-title-accent">Settings</span>
            </h1>
            <p className="hero-lead">Update your profile, security settings and preferences.</p>
          </div>

          {/* Save Changes Button - Top Right */}
          <button
            className={`btn-primary ${isMobile ? 'mobile' : 'desktop'}`}
            onClick={() => alert('All changes saved')}
            suppressHydrationWarning
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* MAIN */}
      <main className={`settings-container ${isMobile ? 'mobile' : ''}`}>
        {/* Profile overview card */}
        <section aria-labelledby="profile-heading" className="settings-card profile-card">
          <div className={`profile-row ${isMobile ? 'mobile' : ''}`}>
            <div className={`avatar-block ${isMobile ? 'mobile' : ''}`}>
              <div className={`avatar-wrap ${isMobile ? 'mobile' : ''}`}>
                {accountPhoto ? (
                  <img src={accountPhoto} alt="profile" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">{name?.charAt(0)?.toUpperCase() ?? "U"}</div>
                )}

                <label className="upload-label">
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
                <button type="button" className="remove-photo-btn" onClick={handleRemovePhoto}>
                  Remove
                </button>
              )}
            </div>

            <div className="profile-info">
              <h2 className="profile-name">{name}</h2>
              <div className="profile-email">{email}</div>
            </div>
          </div>
        </section>

        {/* Form card */}
        <section className="settings-card" aria-labelledby="settings-heading">
          <h3 id="settings-heading" className="card-title">
            Personal Information
          </h3>

          {/* Name row */}
          <div className={`form-row form-row-first ${isMobile ? 'mobile' : ''}`}>
            <label className={`form-label ${isMobile ? 'mobile' : ''}`}>Name</label>
            <div className={`form-control ${isMobile ? 'mobile' : ''}`}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => { setFocusedInput(null); updateNameInDatabase(name); }}
                className={`form-input ${isMobile ? 'mobile' : ''}`}
                aria-label="Name"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Email row */}
          <div className={`form-row ${isMobile ? 'mobile' : ''}`}>
            <label className={`form-label ${isMobile ? 'mobile' : ''}`}>Email</label>
            <div className={`form-control ${isMobile ? 'mobile' : ''}`}>
              <div className="input-static">{email || "your@email.com"}</div>
            </div>
          </div>

          {/* Phone Number row */}
          <div className={`form-row ${isMobile ? 'mobile' : ''}`}>
            <label className={`form-label ${isMobile ? 'mobile' : ''}`}>Phone Number</label>
            <div className={`form-control ${isMobile ? 'mobile' : ''}`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                
                {isEditingPhone ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input
                      type="tel"
                      value={tempPhoneNumber}
                      onChange={(e) => setTempPhoneNumber(e.target.value)}
                      placeholder="Enter phone number (e.g., +1234567890)"
                      onFocus={() => setFocusedInput("phone")}
                      onBlur={() => setFocusedInput(null)}
                      className={`form-input ${isMobile ? 'mobile' : ''}`}
                    />
                    <div className="phone-edit-actions">
                      <button onClick={handleSavePhone} className="phone-save-btn">
                        Save
                      </button>
                      <button onClick={handleCancelPhoneEdit} className="phone-cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {phoneNumber ? (
                      <div className="input-static" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{phoneNumber}</span>
                        {isPhoneVerified ? (
                          <div className="phone-status-verified">
                            <FaCheckCircle style={{ fontSize: "12px" }} />
                            Verified
                          </div>
                        ) : (
                          <>
                            <div className="phone-status-unverified">
                              Not Verified
                            </div>
                            <button onClick={handleEditPhone} className="phone-edit-btn">
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="input-static" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>Not provided</span>
                        <button onClick={handleEditPhone} className="phone-add-btn">
                          Add Phone
                        </button>
                      </div>
                    )}
                    
                    {phoneNumber && !isPhoneVerified && (
                      <button onClick={handleSendOTP} className="send-otp-btn">
                        Send OTP
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Password row */}
          {hasPassword && (
          <div className={`form-row ${isMobile ? 'mobile' : ''}`}>
            <label className={`form-label ${isMobile ? 'mobile' : ''}`}>Password</label>
            <div className={`form-control ${isMobile ? 'mobile' : ''}`}>
              {/* Current Password */}
              <div className={`password-input-container ${isMobile ? 'mobile' : ''}`}>
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current password"
                  onFocus={() => setFocusedInput("currentPassword")}
                  onBlur={() => setFocusedInput(null)}
                  className="password-input"
                  aria-label="Current password"
                />
                <div className="eye-icon" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {/* New Password */}
              <div className={`password-input-container ${isMobile ? 'mobile' : ''}`}>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  onFocus={() => setFocusedInput("newPassword")}
                  onBlur={() => setFocusedInput(null)}
                  className="password-input"
                  aria-label="New password"
                />
                <div className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {/* Confirm Password */}
              <div className={`password-input-container ${isMobile ? 'mobile' : ''}`}>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  onFocus={() => setFocusedInput("confirmPassword")}
                  onBlur={() => setFocusedInput(null)}
                  className="password-input"
                  aria-label="Confirm new password"
                />
                <div className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {/* Change Password Button */}
              <div className="change-password-container">
                <button className="btn-small" onClick={changePassword} suppressHydrationWarning>
                  Change Password
                </button>
              </div>
            </div>
          </div>
          )}

          {/* OAuth User Info */}
          {!hasPassword && (
          <div className={`form-row ${isMobile ? 'mobile' : ''}`}>
            <label className={`form-label ${isMobile ? 'mobile' : ''}`}>Authentication</label>
            <div className={`form-control ${isMobile ? 'mobile' : ''}`}>
              <div className="oauth-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Signed in with Google
              </div>
            </div>
          </div>
          )}

          {/* Deactivate row */}
          <div className={`form-row ${isMobile ? 'mobile' : ''}`}>
            <label className={`form-label ${isMobile ? 'mobile' : ''}`}>Deactivate</label>
            <div className={`form-control ${isMobile ? 'mobile' : ''}`}>
              <button
                className="btn-delete"
                onClick={() => setShowDeactivateConfirm(true)}
                suppressHydrationWarning
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4 style={{ color: "#ef4444", marginBottom: "16px" }}>Deactivate Account</h4>
            <p style={{ color: "#4B5563", marginBottom: "24px" }}>
              Are you sure you want to deactivate your account? Your data will be preserved but you won't be able to log in.
            </p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowDeactivateConfirm(false)}>
                Cancel
              </button>
              <button className="btn-delete" onClick={handleDeactivateAccount}>
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Success Modal */}
      {showPasswordSuccessModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px', color: '#10b981' }}>
                Password Updated Successfully!
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Your password has been changed successfully. You can now use your new password to login.
              </p>
              <button 
                className="btn-primary" 
                onClick={() => setShowPasswordSuccessModal(false)}
                style={{ width: '100%', padding: '12px' }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Success Modal */}
      {showDeactivateSuccessModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>👋</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>
                Account Deactivated
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Your account has been deactivated successfully. You will be redirected to the home page shortly.
              </p>
              <div style={{ 
                background: '#f3f4f6', 
                padding: '12px', 
                borderRadius: '8px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Redirecting in 2 seconds...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Error Modal */}
      {showDeactivateErrorModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '400px', padding: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px', color: '#ef4444' }}>
                Deactivation Failed
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                {deactivateErrorMessage}
              </p>
              <button 
                className="btn-primary" 
                onClick={() => setShowDeactivateErrorModal(false)}
                style={{ width: '100%', padding: '12px' }}
              >
                Close
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
    <div className="otp-modal-backdrop">
      <div className="otp-modal">
        <div className="otp-header">
          <h3 className="otp-title">Verify Phone Number</h3>
          <button onClick={onClose} className="otp-close-btn">×</button>
        </div>

        <div className="otp-content">
          <div className="otp-icon">📱</div>
          
          <p className="otp-text">We've sent a 6-digit code to</p>
          <p className="otp-phone">{phoneNumber}</p>

          {/* OTP Inputs */}
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`otp-input ${digit ? 'filled' : ''}`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleSubmit}
            disabled={isVerifying || otp.join("").length !== 6}
            className="otp-verify-btn"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend */}
          <div className="otp-resend-text">
            Didn't receive the code?{" "}
            <button onClick={handleResend} className="otp-resend-btn">
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 