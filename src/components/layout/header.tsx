"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User, LogOut, Menu, Bell } from "lucide-react"; // ✅ Added Menu icon for hamburger
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, checkAuth, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLgUp, setIsLgUp] = useState(false); // ✅ detect screen size

  // ✅ Detect large screen
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLgUp(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Ensure auth check runs on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Dynamic page title
  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean);
    if (path.length === 0) return "Home";
    const pageName = path[path.length - 1];
    return pageName.charAt(0).toUpperCase() + pageName.slice(1);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* HEADER WRAPPER */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end items-center h-16 relative">
            {/* RIGHT SIDE - Profile */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "32px",
              }}
            >
              <div className="relative">
                {isLgUp ? (
                  <motion.button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: user?.profileImage
                        ? "transparent"
                        : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      border: "2px solid white",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <User style={{ width: "16px", height: "16px", color: "white" }} />
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "9999px",
                      background:
                        "radial-gradient(120% 120% at 30% 20%, #60a5fa 0%, #2563eb 40%, #1e40af 100%)",
                      border: "1px solid rgba(147, 197, 253, 0.5)",
                      boxShadow:
                        "0 6px 18px rgba(37, 99, 235, 0.35), inset 0 0 12px rgba(147, 197, 253, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      cursor: "pointer",
                    }}
                    aria-label="Open profile menu"
                  >
                    <User style={{ width: "18px", height: "18px", color: "#ffffff" }} />
                  </motion.button>
                )}
                {/* DROPDOWN MENU - use same style on all screen sizes so it works reliably on mobile */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        right: "0",
                        marginTop: "8px",
                        width: "220px",
                        maxWidth: "calc(100vw - 32px)",
                        background: "rgba(255, 255, 255, 0.98)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(229, 231, 235, 0.5)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(147, 197, 253, 0.25) inset",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        zIndex: 9999,
                        transform: "translateX(-16px)",
                      }}
                    >
                      <Link
                        href="/dashboard/notifications"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px 16px",
                          margin: "6px 0",
                          fontSize: "14px",
                          color: "#374151",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                          borderRadius: "8px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#eff6ff";
                          e.currentTarget.style.color = "#1d4ed8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#374151";
                        }}
                      >
                        <Bell style={{ width: "16px", height: "16px" }} />
                        <span>Notifications</span>
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px 16px",
                          margin: "6px 0",
                          fontSize: "14px",
                          color: "#374151",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                          borderRadius: "8px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#eff6ff";
                          e.currentTarget.style.color = "#1d4ed8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#374151";
                        }}
                      >
                        <User style={{ width: "16px", height: "16px" }} />
                        <span>Account</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px 16px",
                          margin: "6px 0",
                          fontSize: "14px",
                          color: "#dc2626",
                          backgroundColor: "transparent",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          borderRadius: "8px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#fef2f2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <LogOut style={{ width: "16px", height: "16px" }} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: "8px", visibility: "hidden" }}></div>
      </header>
    </>
  );
}