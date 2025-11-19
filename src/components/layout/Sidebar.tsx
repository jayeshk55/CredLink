"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users2,
  Users,
  Search,
  Settings2,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import "./sidebar.css"; // 
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [pendingConnections, setPendingConnections] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);

  useEffect(() => {
    // Set mounted flag to ensure client-side only updates
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Fetch unread messages count for badge
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;
        const res = await fetch('/api/message/receive', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        const unread = (data.messages || []).filter((m: any) => m && (m.read === false || m.read === undefined)).length;
        setUnreadCount(unread);
      } catch (e) {
        // ignore
      }
    };

    fetchUnread();
  }, []);

  // Fetch pending connection requests count for badge
  useEffect(() => {
    let intervalId: any;
    const fetchPending = async () => {
      try {
        const res = await fetch('/api/users/connections?type=received', {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        const count = (data.requests || []).length;
        setPendingConnections(count);
      } catch (_) {
        // ignore
      }
    };

    fetchPending();
    // light polling to keep badge in sync
    intervalId = setInterval(fetchPending, 15000);
    // listen for manual refresh signals from pages (optional)
    const onUpdated = () => fetchPending();
    if (typeof window !== 'undefined') {
      window.addEventListener('connections-updated', onUpdated as any);
    }
    return () => {
      clearInterval(intervalId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('connections-updated', onUpdated as any);
      }
    };
  }, []);

  // Fetch contacts count for Contacts badge (matches Contacts page data source)
  useEffect(() => {
    let intervalId: any;
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        setContactsCount((data.contacts || []).length);
      } catch (_) {
        // ignore
      }
    };

    fetchContacts();
    intervalId = setInterval(fetchContacts, 20000);
    const onUpdated = () => fetchContacts();
    if (typeof window !== 'undefined') {
      window.addEventListener('contacts-updated', onUpdated as any);
    }
    return () => {
      clearInterval(intervalId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('contacts-updated', onUpdated as any);
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (e) {
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Messages", path: "/dashboard/messages", icon: <MessageSquare /> },
    { name: "Connections", path: "/dashboard/connections", icon: <Users2 /> },
    { name: "Contacts", path: "/dashboard/contacts", icon: <Users /> },
    { name: "Search", path: "/dashboard/search", icon: <Search /> },
  ];

  const bottomItems = [
    { name: "Settings", path: "/dashboard/settings", icon: <Settings2 /> },
    { name: "Help & Support", path: "/dashboard/support", icon: <HelpCircle /> },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMounted && isMobile && (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`mobileToggle ${isOpen ? 'mobileToggleOpen' : 'mobileToggleClosed'}`}
          whileTap={{ scale: 0.9 }}
          suppressHydrationWarning
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      )}

      {/* Overlay (for mobile) */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="mobileOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${isMobile ? (isOpen ? "open" : "closed") : ""}`}
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{ x: isMobile ? (isOpen ? 0 : -300) : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="sidebarHeader">
          <Link href="/" className="logoArea" style={{ paddingLeft: '2rem' }}>
            <Image
              src="/assets/mykard.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-36 h-36 object-contain"
              priority
              unoptimized
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="navMenu">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                href={item.path}
                key={item.name}
                className={`navItem ${isActive ? "activeNav" : ""}`}
              >
                <span className="navIcon">{item.icon}</span>
                <span>{item.name}</span>
                {item.name === "Messages" && unreadCount > 0 && pathname !== "/dashboard/messages" && (
                  <span className="navBadge">{unreadCount}</span>
                )}
                {item.name === "Connections" && pendingConnections > 0 && pathname !== "/dashboard/connections" && (
                  <span className="navBadge">{pendingConnections}</span>
                )}
                {item.name === "Contacts" && contactsCount > 0 && pathname !== "/dashboard/contacts" && (
                  <span className="navBadge">{contactsCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Links */}
        <div className="navFooter">
          {bottomItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                href={item.path}
                key={item.name}
                className={`footerLink ${isActive ? "activeNav" : ""}`}
              >
                <span className="navIcon">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button 
            className="footerLogout" 
            onClick={handleLogout}
            suppressHydrationWarning
          >
            <X />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
