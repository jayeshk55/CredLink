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
  Bell,
} from "lucide-react";
import "./sidebar.css"; // 
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [pendingConnections, setPendingConnections] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

    useEffect(() => {
    // Set mounted flag to ensure client-side only updates
    setIsMounted(true);
  }, []);

  // 👇 ADD THIS — Sidebar listens for header hamburger toggle
  useEffect(() => {
    const toggle = () => setIsOpen(prev => !prev);
    window.addEventListener("toggle-sidebar", toggle);

    return () => window.removeEventListener("toggle-sidebar", toggle);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Fetch unread messages count for badge (kept in sync via events + light polling)
  useEffect(() => {
    let intervalId: any;

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
        const inboxMessages = data.messages || [];
        const sentMessages = data.sentMessages || [];

        const inboxBySender = new Map<string, any[]>();
        (inboxMessages as any[]).forEach((m: any) => {
          if (!m || !m.senderId) return;
          const arr = inboxBySender.get(m.senderId) || [];
          arr.push(m);
          inboxBySender.set(m.senderId, arr);
        });

        const sentByReceiver = new Map<string, any[]>();
        (sentMessages as any[]).forEach((m: any) => {
          if (!m || !m.receiverId) return;
          const arr = sentByReceiver.get(m.receiverId) || [];
          arr.push(m);
          sentByReceiver.set(m.receiverId, arr);
        });

        let readPointers: Record<string, string> = {};
        try {
          const stored = localStorage.getItem('dashboard-message-read-pointers');
          if (stored) readPointers = JSON.parse(stored);
        } catch {
          readPointers = {};
        }

        const allPartyIds = new Set<string>([
          ...Array.from(inboxBySender.keys()),
          ...Array.from(sentByReceiver.keys()),
        ]);

        let totalUnread = 0;

        for (const partyId of allPartyIds) {
          const inboxForParty = inboxBySender.get(partyId) || [];
          const sentForParty = sentByReceiver.get(partyId) || [];

          const combined = [
            ...inboxForParty.map((m: any) => ({
              date: m.createdAt || m.date || new Date().toISOString(),
              direction: 'in' as const,
            })),
            ...sentForParty.map((m: any) => ({
              date: m.createdAt || m.date || new Date().toISOString(),
              direction: 'out' as const,
            })),
          ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          if (!combined.length) continue;

          const readPointer = readPointers[partyId];
          const lastReadAt = readPointer ? new Date(readPointer).getTime() : 0;

          const incomingCount = combined
            .filter(item => item.direction === 'in' && new Date(item.date).getTime() > lastReadAt)
            .length;

          if (incomingCount > 0) {
            totalUnread += incomingCount;
          }
        }

        setUnreadCount(totalUnread);
      } catch (e) {
        // ignore
      }
    };

    fetchUnread();

    const handleMessagesUpdated = () => {
      fetchUnread();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('messages-updated', handleMessagesUpdated as any);
      window.addEventListener('message-sent', handleMessagesUpdated as any);
      window.addEventListener('message-read', handleMessagesUpdated as any);
    }

    intervalId = setInterval(fetchUnread, 15000);

    return () => {
      clearInterval(intervalId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('messages-updated', handleMessagesUpdated as any);
        window.removeEventListener('message-sent', handleMessagesUpdated as any);
        window.removeEventListener('message-read', handleMessagesUpdated as any);
      }
    };
  }, []);

  // Fetch notifications count for Notifications badge
  useEffect(() => {
    let intervalId: any;

    const computeCount = (list: any[]) => {
      let cleared: string[] = [];
      try {
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem('dashboard-cleared-notifications');
          if (stored) cleared = JSON.parse(stored);
        }
      } catch {
        cleared = [];
      }
      const clearedSet = new Set(cleared || []);
      return list.filter((n: any) => !clearedSet.has(n.id)).length;
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data?.notifications) ? data.notifications : [];
        setNotificationsCount(computeCount(list));
      } catch (_) {
        // ignore
      }
    };

    fetchNotifications();
    intervalId = setInterval(fetchNotifications, 20000);

    const onUpdated = () => {
      fetchNotifications();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('notifications-updated', onUpdated as any);
    }

    return () => {
      clearInterval(intervalId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('notifications-updated', onUpdated as any);
      }
    };
  }, []);

  // Fetch pending connection requests count for badge
  useEffect(() => {
    let intervalId: any;

    const computePending = (requests: any[]) => {
      let cleared: string[] = [];
      try {
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem('dashboard-cleared-notifications');
          if (stored) cleared = JSON.parse(stored);
        }
      } catch {
        cleared = [];
      }

      const clearedSet = new Set(cleared || []);
      return requests.filter((r: any) => !clearedSet.has(`conn-${r.id}`)).length;
    };

    const fetchPending = async () => {
      try {
        const res = await fetch('/api/users/connections?type=received', {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        const requests = Array.isArray(data.requests) ? data.requests : [];
        setPendingConnections(computePending(requests));
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

    const computeUnseenContacts = (contacts: any[]) => {
      let lastOpened = 0;
      try {
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem('dashboard-contacts-last-opened');
          if (stored) {
            lastOpened = new Date(stored).getTime();
          }
        }
      } catch {
        lastOpened = 0;
      }

      if (!lastOpened) {
        return contacts.length;
      }

      return contacts.filter((c: any) => {
        const createdAt = c.createdAt || c.created_at || c.date;
        if (!createdAt) return true;
        const createdTime = new Date(createdAt).getTime();
        if (Number.isNaN(createdTime)) return true;
        return createdTime > lastOpened;
      }).length;
    };

    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data.contacts) ? data.contacts : [];
        setContactsCount(computeUnseenContacts(list));
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
    // { name: "Notifications", path: "/dashboard/notifications", icon: <Bell /> },
    { name: "Messages", path: "/dashboard/messages", icon: <MessageSquare /> },
    { name: "Connections", path: "/dashboard/connections", icon: <Users2 /> },
    { name: "Contacts", path: "/dashboard/contacts", icon: <Users /> },
    { name: "Search", path: "/dashboard/search", icon: <Search /> },
  ];

  // Sidebar footer items removed on desktop; these options live in the header dropdown / other UI
  const bottomItems: any[] = [];

  return (
    <>
      {/* Mobile Menu Button (only when sidebar is closed) 
      {isMounted && !isOpen && (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={"mobileToggle mobileToggleClosed"}
          whileTap={{ scale: 0.9 }}
          suppressHydrationWarning
        >
          <Menu size={22} />
        </motion.button>
      )}
*/}
      {/* Overlay (for mobile sidebar) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobileOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar (desktop / slide-in) */}
      <motion.aside
        className={`sidebar ${isOpen ? "open" : "closed"}`}
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
                onClick={() => {
                  setIsOpen(false);
                }}
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
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <span className="navIcon">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="bottomNav">
        <Link
          href="/dashboard"
          className={`bottomNavItem ${pathname === "/dashboard" ? "bottomNavItemActive" : ""}`}
        >
          <span className="bottomNavIcon">
            <LayoutDashboard />
          </span>
        </Link>

        <Link
          href="/dashboard/messages"
          className={`bottomNavItem ${pathname === "/dashboard/messages" ? "bottomNavItemActive" : ""}`}
        >
          <span className="bottomNavIcon">
            <MessageSquare />
            {unreadCount > 0 && pathname !== "/dashboard/messages" && (
              <span className="bottomNavBadge">{unreadCount}</span>
            )}
          </span>
        </Link>

        <Link
          href="/dashboard/connections"
          className={`bottomNavItem ${pathname === "/dashboard/connections" ? "bottomNavItemActive" : ""}`}
        >
          <span className="bottomNavIcon">
            <Users2 />
            {pendingConnections > 0 && pathname !== "/dashboard/connections" && (
              <span className="bottomNavBadge">{pendingConnections}</span>
            )}
          </span>
        </Link>

        <Link
          href="/dashboard/contacts"
          className={`bottomNavItem ${pathname === "/dashboard/contacts" ? "bottomNavItemActive" : ""}`}
        >
          <span className="bottomNavIcon">
            <Users />
            {contactsCount > 0 && pathname !== "/dashboard/contacts" && (
              <span className="bottomNavBadge">{contactsCount}</span>
            )}
          </span>
        </Link>

        <Link
          href="/dashboard/search"
          className={`bottomNavItem ${pathname === "/dashboard/search" ? "bottomNavItemActive" : ""}`}
        >
          <span className="bottomNavIcon">
            <Search />
          </span>
        </Link>
      </nav>
    </>
  );
};

export default Sidebar;
