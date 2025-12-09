"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Users,
  Settings,
  BarChart3,
  Shield,
  Menu,
  X,
  LifeBuoy ,
  LogOut,
  Home,
  
  Layers,
  Tag
} from "lucide-react";
import styles from "./admin.module.css";

interface AdminData {
  id: string;
  role: string;
  permissions: string[];
}

const allNavigation = [
  { name: "Dashboard", href: "/admin", icon: Home, permission: null },
  { name: "Users", href: "/admin/users", icon: Users, permission: "MANAGE_USERS" },
  { name: "Manage Admins", href: "/admin/manage-admins", icon: Shield, permission: "MANAGE_ADMINS" },
  // { name: "Profiles", href: "/admin/profiles", icon: Users, permission: "MANAGE_PROFILES" },
  { name: "Categories", href: "/admin/categories", icon: Tag, permission: "MANAGE_CATEGORIES" },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3, permission: "VIEW_ANALYTICS" },
   { name: "Support", href: "/admin/support", icon: LifeBuoy , permission: null },
  { name: "Settings", href: "/admin/settings", icon: Settings, permission: "MANAGE_SETTINGS" },
 ];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [navigation, setNavigation] = useState<typeof allNavigation>(allNavigation);
   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const constrainedWidthPages: string[] = [];
  const shouldConstrainWidth = constrainedWidthPages.some((page) =>
    pathname.startsWith(page)
  );

  useEffect(() => {
    checkAuth(); 
  }, []);


useEffect(() => {
  setShowLogoutConfirm(false);
}, [pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/me");
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);

        const filteredNav = allNavigation.filter((item) => {
          if (!item.permission) return true;
          if (data.admin.role === "SUPER_ADMIN") return true;
          return data.admin.permissions.includes(item.permission);
        });
        setNavigation(filteredNav);
      } else {
        setNavigation(allNavigation);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setNavigation(allNavigation);
    }
  };

    const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/access/secure-4095");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (pathname === "/admin/login" || pathname === "/admin/access/secure-4095") return <>{children}</>;

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <Shield />
            </div>
            <span className={styles.logoText}>MyKard Admin</span>
          </Link>
          
          {/* Mobile close button */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className={styles.closeButton}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className={styles.navMenu}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.activeNav : ""}`}
              >
                <Icon className={styles.navIcon} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className={styles.navFooter}>
            {/* <Link href="/" className={styles.footerLink}>
              <Home /> Back to Site
            </Link> */}

             <button
              onClick={() => setShowLogoutConfirm(true)}
              className={styles.footerLogout}
            >
              <LogOut /> Sign Out
            </button>

            {admin && (
              <div className={styles.adminInfo}>
                <div className={styles.adminBadge}>
                  {admin.role === "SUPER_ADMIN"
                    ? "SA"
                    : admin.role === "ADMIN"
                    ? "A"
                    : "S"}
                </div>
                <div>
                  <p className={styles.adminName}>Admin Panel</p>
                  <p className={styles.adminRole}>{admin.role.replace("_", " ")}</p>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainArea}>
        <header className={styles.topBar}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={styles.menuButton}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          
          <div className={styles.activeStatus}>
            <div className={styles.statusDot}></div>
            <span>Admin Panel Active</span>
          </div>
        </header>

        <main className={`${styles.content} ${shouldConstrainWidth ? styles.constrained : ""}`}>
          {children}
        </main>
      </div>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
 {showLogoutConfirm && (
        <div className={styles.logoutModalOverlay}>
          <div className={styles.logoutModal}>
            <h3>Are you sure you want to log out?</h3>

            <div className={styles.logoutActions}>
              <button onClick={handleLogout} className={styles.logoutYes}>
                Yes, Log Out
              </button>

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={styles.logoutNo}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
    
  );
}
