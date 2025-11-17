"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import styles from "./search.module.css";
import { Modal } from "@/components/ui/modal";
import { useSearchParams } from "next/navigation";

type Profile = {
  id: string;
  username: string;
  name: string;
  city: string;
  company?: string;
  designation?: string;
  category?: string;
  verified?: boolean;
  reviews?: number;
  views?: number;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  
  // Dummy data for testing when API returns empty results
  const dummyProfiles: Profile[] = [
    { id: "1", username: "arnav_wasnik", name: "Arnav Wasnik", designation: "Frontend Developer", company: "BoostNow Solutions", city: "Nagpur", category: "Technology", verified: true, views: 245 },
    { id: "2", username: "sarthak_patil", name: "Sarthak Patil", designation: "Backend Engineer", company: "CredLink", city: "Pune", category: "Engineering", verified: true, views: 189 },
    { id: "3", username: "rohan_sharma", name: "Rohan Sharma", designation: "UI/UX Designer", company: "FigmaWorks", city: "Mumbai", category: "Design", verified: true, views: 312 }
  ];
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [connectionName, setConnectionName] = useState("");
  const [connectingUserId, setConnectingUserId] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [acceptedConnections, setAcceptedConnections] = useState<Set<string>>(new Set());

  // Initialize search query from URL (?q=...)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/profile/getuser", {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        
        // Map database fields to frontend Profile type
        const mappedProfiles: Profile[] = (data.users || []).map((user: any) => ({
          id: user.id,
          username: user.username || "user",
          name: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User",
          city: user.location || "Unknown",
          company: user.company || undefined,
          designation: user.title || undefined,
          category: user.department || undefined,
          verified: user.status === "active",
          reviews: 0, // Not in schema
          views: user.views || 0,
        }));

        // Use dummy data if API returns empty results
        if (mappedProfiles.length === 0) {
          setProfiles(dummyProfiles);
        } else {
          setProfiles(mappedProfiles);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        // Use dummy data on error as fallback
        setProfiles(dummyProfiles);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Prefetch connection statuses for current user
  useEffect(() => {
    const loadConnectionStatuses = async () => {
      try {
        // Accepted connections
        const acceptedRes = await fetch('/api/users/connections?type=accepted', { credentials: 'include' });
        if (acceptedRes.ok) {
          const { requests } = await acceptedRes.json();
          const ids = new Set<string>((requests || []).map((r: any) => r.user?.id).filter(Boolean));
          setAcceptedConnections(ids);
        }
        // Pending requests sent by me
        const sentRes = await fetch('/api/users/connections?type=sent', { credentials: 'include' });
        if (sentRes.ok) {
          const { requests } = await sentRes.json();
          const ids = new Set<string>((requests || []).map((r: any) => r.receiver?.id).filter(Boolean));
          setSentRequests(ids);
        }
      } catch (e) {
        console.error('Failed to load connection statuses', e);
      }
    };
    loadConnectionStatuses();

    const handler = () => loadConnectionStatuses();
    if (typeof window !== 'undefined') {
      window.addEventListener('connections-updated', handler);
      return () => window.removeEventListener('connections-updated', handler);
    }
  }, []);

  const handleConnect = async (userId: string, name: string) => {
    try {
      setConnectingUserId(userId);
      const response = await fetch("/api/users/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiverId: userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to connect");
      }

      setConnectionName(name);
      setShowModal(true);
      setSentRequests(prev => new Set([...prev, userId]));
      toast.success(`Connection request sent to ${name}!`);
    } catch (error: any) {
      console.error("Connection error:", error);
      toast.error(error.message || "Failed to send connection request");
    } finally {
      setConnectingUserId(null);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [profiles]);

  const hasQuery = query.trim().length > 0;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return profiles.filter((p) => {
      const hay = `${p.name} ${p.designation ?? ""} ${p.company ?? ""} ${p.category ?? ""} ${p.city}`.toLowerCase();

      if (q && !hay.includes(q)) return false;
      if (category && p.category !== category) return false;

      return true;
    }).slice(0, 6);
  }, [query, category, profiles]);

  return (
    <div className={styles.container}>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Connection Request Sent"
        message={
          <>Your connection request has been sent to <span style={{ fontWeight: 600, color: "#111827" }}>{connectionName}</span>. They will be notified and can accept or reject your request.</>
        }
        primaryText="Close"
      />


      {/* HEADER */}
      <div className="mb-8">
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>Search Professionals</h1>
        <p style={{ fontSize: 16, color: "#4B5563", marginTop: 8 }}>Find and connect with experts across industries</p>
        
        {/* SEARCH BAR WITH INLINE FILTERS */}
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06)",
              padding: 16,
              marginBottom: 16,
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94A3B8" }} />
                <input
                  type="text"
                  placeholder="Search by name, skills, company, or city..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full"
                  style={{
                    padding: "10px 14px 10px 40px",
                    fontSize: 14,
                    border: "1px solid #CBD5E1",
                    borderRadius: 8,
                    outline: "none",
                  }}
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  padding: "10px 16px",
                  fontSize: 14,
                  border: "1px solid #CBD5E1",
                  borderRadius: 8,
                  outline: "none",
                  backgroundColor: "#FFFFFF",
                  color: "#0F172A",
                }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* RESULTS */}
        <div className={styles.resultsContainer}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {hasQuery && (
                <p className={styles.resultsCount}>
                  Showing <span>{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
                </p>
              )}

              <div className={styles.cardGrid}>
            {filtered.map((p, index) => (
              <article 
                key={`${p.username}-${index}`} 
                className={styles.profileCard}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardHeader}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>{p.name.charAt(0)}</div>
                      <div>
                        <h3 className={styles.userName}>
                          {p.name}
                        </h3>
                        {p.designation && (
                          <p className={styles.userDesignation}>{p.designation}</p>
                        )}
                        <p className={styles.userCity}>📍 {p.city}</p>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleConnect(p.id, p.name); }} 
                      disabled={connectingUserId === p.id || sentRequests.has(p.id) || acceptedConnections.has(p.id)}
                      className={`${styles.connectBtn} ${(sentRequests.has(p.id) || acceptedConnections.has(p.id)) ? styles.connectBtnSent : ''}`}
                      style={(sentRequests.has(p.id) || acceptedConnections.has(p.id)) ? { 
                        backgroundColor: '#9CA3AF', 
                        color: '#ffffff',
                        cursor: 'not-allowed'
                      } : {}}
                    >
                      {acceptedConnections.has(p.id) ? "Connected" : (connectingUserId === p.id ? "Connecting..." : (sentRequests.has(p.id) ? "Sent" : "Connect"))}
                    </button>
                  </div>


                </div>
              </article>
            ))}
              </div>

              {hasQuery && filtered.length === 0 && (
                <div className="text-center py-10 text-gray-500">No results found. Try changing filters.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
