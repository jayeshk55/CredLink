"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Key,
  User,
  Mail,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import styles from "./settings.module.css";

interface AdminData {
  id: string;
  email: string;
  fullName: string;
  role: "Super Admin" | "Admin" | "Sub Admin";
  lastLogin?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ROLE_PERMISSIONS = {
  "Super Admin": ["Dashboard", "User Management", "Settings", "Reports", "Billing"],
  Admin: ["Dashboard", "User Management", "Reports"],
  "Sub Admin": ["Dashboard"],
} as const;

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mock: AdminData = {
      id: "1",
      email: "admin@credlink.com",
      fullName: "Admin User",
      role: "Admin",
    };
    setAdmin(mock);
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/.test(password);

    if (password.length < minLength) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!hasUpperCase) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!hasLowerCase) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!hasNumbers) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    return { valid: true };
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate all fields are filled
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        throw new Error('All fields are required');
      }

      // Check if new password and confirm password match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New password and confirm password do not match');
      }

      // Validate password strength
      const passwordValidation = validatePassword(passwordData.newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Make API call to change password
      const response = await fetch('/api/admin/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      // Clear form on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Show success message
      toast.success('Password updated successfully!');
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.message || 'Failed to update password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const ProfileSection = () => (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>Profile</h2>
      <div className={styles.profileInfo}>
        <div className={styles.infoItem}>
          <User size={16} />
          {admin?.fullName}
        </div>
        <div className={styles.infoItem}>
          <Mail size={16} />
          {admin?.email}
        </div>
        <div className={styles.infoItem}>
          <Shield size={16} />
          {admin?.role}
        </div>
      </div>

      <div className={styles.permissions}>
        <h3>Access Permissions</h3>
        <ul>
          {admin &&
            ROLE_PERMISSIONS[admin.role].map((p) => (
              <li key={p}>
                <span className={styles.dot}></span>
                {p}
              </li>
            ))}
        </ul>
      </div>
    </section>
  );

  const PasswordSection = () => (
    <section className={`${styles.card} ${styles.passwordCard}`}>
      <h2 className={styles.sectionTitle}>
        <Key size={16} /> Change Password
      </h2>

      <form onSubmit={handlePasswordChange} className={styles.form}>
        {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => (
          <div key={field}>
            <label className={styles.label}>
              {field === "currentPassword"
                ? "Current Password"
                : field === "newPassword"
                ? "New Password"
                : "Confirm Password"}
            </label>
            <div className={styles.passwordField}>
              <input
                type={show[field] ? "text" : "password"}
                value={passwordData[field]}
                onChange={(e) => setPasswordData((s) => ({ ...s, [field]: e.target.value }))}
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
                className={styles.eyeBtn}
              >
                {show[field] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}
        <div className={styles.actions}>
          <button type="submit" disabled={saving} className={styles.primaryBtn}>
            {saving && <Loader2 className={styles.loader} />}
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );

  if (loading) return <div className={styles.loading}>Loading…</div>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <header className={styles.header}>
          
          <div>
            <h1 className={styles.title}>Admin Settings</h1>
            <p className={styles.subtitle}>Manage security and user access</p>
          </div>
        </header>
        {isMobile ? (
          <>
            <ProfileSection />
            <PasswordSection />
          </>
        ) : (
          <div className={styles.grid}>
            <ProfileSection />
            <PasswordSection />
          </div>
        )}
      </div>
    </div>
  );
}
