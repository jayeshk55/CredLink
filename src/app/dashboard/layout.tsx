"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/header";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/use-auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { checkAuth } = useAuth();

  const [isLgUp, setIsLgUp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------- CHECK AUTH ---------------- */
  useEffect(() => {
    checkAuth();
  }, []);

  /* ---------------- BREAKPOINT CHECK ---------------- */
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLgUp(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ---------------- RESET SCROLL ON PAGE CHANGE ---------------- */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

 // Pages that require FULL WIDTH with 0 padding like Create page
const noPaddingPages = [
  "/dashboard/create",
  "/dashboard/edit",
  "/dashboard/search",
  "/dashboard/connections",
];

const isNoPaddingPage = noPaddingPages.includes(pathname);

const mainStyle: React.CSSProperties = isMobile && isNoPaddingPage
  ? {
      paddingTop: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
      paddingBottom: "60px", // required for floating navbar
      margin: "0px",
      background: "transparent",
    }
  : {
      paddingTop: "8px",
      paddingLeft: "12px",
      paddingRight: "12px",
      paddingBottom: "60px",
      background: "transparent",
    };


  return (
    <div
      className="h-screen overflow-x-hidden"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* FIXED SIDEBAR (Always below header) */}
      <div className="fixed left-0 top-0 h-full w-72 z-40">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="h-full flex flex-col"
        style={{
          marginLeft: isLgUp ? "18rem" : "0",
          transition: "margin-left 0.3s ease",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
      >
        {/* FIXED HEADER (Always above main, below sidebar) */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <Header />
        </header>

        {/* PAGES */}
        <main className="flex-1 overflow-y-auto" style={mainStyle}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
