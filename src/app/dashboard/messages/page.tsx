"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Trash2, Send, ChevronLeft } from "lucide-react";

// --- Types ---
type MessageStatus = "New" | "Read" | "Replied" | "Pending" | "Archived" | "Deleted";
type MessageTag = "Lead" | "Support" | "Pricing" | "Feedback" | null;

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: MessageStatus;
  read: boolean;
  starred: boolean;
  tag: MessageTag;
  senderId: string;
  thread?: Array<{
    id?: string;
    text: string;
    date: string;
    direction: 'in' | 'out';
  }>;
  replies?: {
    text: string;
    date: string;
  }[];
}

export default function MessagesPage() {
  // --- Logic & State ---
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    // @ts-ignore
    (mql.addEventListener ? mql.addEventListener("change", onChange) : mql.addListener(onChange));
    return () => {
      // @ts-ignore
      (mql.removeEventListener ? mql.removeEventListener("change", onChange) : mql.removeListener(onChange));
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try{
      const token = localStorage.getItem('token');
      const response = await fetch('/api/message/receive', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const inboxMessages = data.messages || [];
        const sentMessages = data.sentMessages || [];

        const sendersMap: Record<string, { id: string; fullName?: string; email?: string }> = {};
        (data.senders || []).forEach((s: any) => {
          sendersMap[s.id] = s;
        });

        const inboxBySender = new Map<string, any[]>();
        (inboxMessages as any[]).forEach((m: any) => {
          const arr = inboxBySender.get(m.senderId) || [];
          arr.push(m);
          inboxBySender.set(m.senderId, arr);
        });

        const sentByReceiver = new Map<string, any[]>();
        (sentMessages as any[]).forEach((m: any) => {
          if (!m.receiverId) return;
          const arr = sentByReceiver.get(m.receiverId) || [];
          arr.push(m);
          sentByReceiver.set(m.receiverId, arr);
        });

        const allPartyIds = new Set<string>([
          ...Array.from(inboxBySender.keys()),
          ...Array.from(sentByReceiver.keys()),
        ]);

        const groupedBySender = new Map<string, MessageItem>();
        for (const partyId of allPartyIds) {
          const sender = sendersMap[partyId] || {};
          const combined = [
            ...((inboxBySender.get(partyId) || []).map((m: any) => ({
              id: m.id,
              text: m.text || m.message || '',
              date: m.createdAt || m.date || new Date().toISOString(),
              direction: 'in' as const,
            }))),
            ...((sentByReceiver.get(partyId) || []).map((m: any) => ({
              id: m.id,
              text: m.text || m.message || '',
              date: m.createdAt || m.date || new Date().toISOString(),
              direction: 'out' as const,
            }))),
          ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          const latest = combined[combined.length - 1] || null;

          if (latest) {
            groupedBySender.set(partyId, {
              id: latest.id,
              name: sender.fullName || 'Unknown User',
              email: sender.email || '',
              message: latest.text,
              date: latest.date,
              status: 'Read',
              read: true,
              starred: false,
              tag: null,
              senderId: partyId,
              thread: combined,
            });
          }
        }
        setMessages(Array.from(groupedBySender.values()));
      }
    } catch(err){
      console.error('Error fetching messages:', err);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat(undefined, {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
    }).format(d);
  };

  const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "Replied" | "Pending" | "Archived">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const conversationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!detailId) return;
    const container = conversationRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [detailId, messages]);

  const filteredMessages = useMemo(() => {
    let filtered = messages;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q)
      );
    }
    switch (activeFilter) {
      case "Unread": filtered = filtered.filter(m => !m.read && m.status !== "Archived" && m.status !== "Deleted"); break;
      case "Replied": filtered = filtered.filter(m => m.status === "Replied"); break;
      case "Pending": filtered = filtered.filter(m => m.status === "Pending"); break;
      case "Archived": filtered = filtered.filter(m => m.status === "Archived"); break;
      default: filtered = filtered.filter(m => m.status !== "Archived" && m.status !== "Deleted");
    }
    return filtered.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
  }, [messages, activeFilter, searchQuery, sortOrder]);

  const openDetail = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true, status: m.status === "New" ? "Read" : m.status } : m));
    setDetailId(id);
    setReplyId(id);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "Archived" } : m));
    const sendDeleteRequest = async () => {
      try { await fetch(`/api/message/delete?id=${encodeURIComponent(id)}`, { method: "DELETE" }); } 
      catch (error) { console.error("Error deleting message:", error); }
    };
    sendDeleteRequest();
    if (detailId === id) setDetailId(null);
    if (replyId === id) setReplyId(null);
  };

  const sendReply = async () => {
    if (!replyId || !replyText.trim()) return;
    const originalMessage = messages.find(m => m.id === replyId);
    if (!originalMessage) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          message: replyText.trim(),
          receiverId: originalMessage.senderId,
          status: 'REPLIED',
          tag: originalMessage.tag?.toUpperCase() || 'SUPPORT',
          read: false,
        }),
      });

      if (response.ok) {
        setMessages(prev => prev.map(m => m.id === replyId ? { 
          ...m, status: "Replied", read: true,
          thread: [...(m.thread || []), { text: replyText, date: new Date().toISOString(), direction: 'out' }]
        } : m));
        setReplyText("");
      } else { alert('Failed to send reply.'); }
    } catch (err) { alert('Error sending reply.'); }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // ------------------ STYLES ------------------ //
  
  // Color Palette
  const colors = {
    bg: "#F8FAFC",
    cardBg: "#FFFFFF",
    textMain: "#1E293B",
    textSec: "#64748B",
    textLight: "#94A3B8",
    primary: "#4F46E5",
    primaryLight: "#EEF2FF",
    primaryGradient: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
    border: "#E2E8F0",
    danger: "#EF4444",
    successBg: "#ECFDF5",
    successText: "#059669",
    hoverBg: "#F1F5F9",
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: colors.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: colors.textMain,
    },
    mainCard: {
      backgroundColor: colors.cardBg,
      maxWidth: "1200px",
      height: isMobile ? "100vh" : "calc(100vh - 40px)",
      margin: isMobile ? "0" : "20px auto",
      borderRadius: isMobile ? "0" : "16px",
      boxShadow: isMobile ? "none" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
      border: isMobile ? "none" : `1px solid ${colors.border}`,
      position: "relative" as const,
    },
    header: {
      padding: "20px 24px",
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(12px)",
      zIndex: 10,
    },
    searchContainer: {
      position: "relative" as const,
      maxWidth: "400px",
    },
    searchInput: {
      width: "100%",
      padding: "12px 16px 12px 40px",
      borderRadius: "12px",
      border: `1px solid ${colors.border}`,
      backgroundColor: "#F1F5F9",
      fontSize: "14px",
      color: colors.textMain,
      outline: "none",
      transition: "all 0.2s ease",
    },
    tabsContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "24px",
    },
    tabsList: {
      display: "flex",
      gap: "8px",
      overflowX: "auto" as const,
      paddingBottom: "4px",
    },
    tabButton: (isActive: boolean) => ({
      padding: "8px 16px",
      borderRadius: "9999px",
      fontSize: "13px",
      fontWeight: 600,
      border: isActive ? "none" : `1px solid ${colors.border}`,
      backgroundColor: isActive ? "#1E293B" : "transparent",
      color: isActive ? "#FFFFFF" : colors.textSec,
      cursor: "pointer",
      whiteSpace: "nowrap" as const,
      transition: "all 0.2s",
    }),
    sortSelect: {
      padding: "6px 12px",
      fontSize: "12px",
      fontWeight: 600,
      color: colors.textSec,
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      outline: "none",
    },
    sortSelectMobile: {
      padding: "2px 8px",
      fontSize: "10px",
      lineHeight: 1.1,
      height: "24px",
      fontWeight: 600,
      color: colors.textSec,
      border: `1px solid ${colors.border}`,
      backgroundColor: "#FFFFFF",
      borderRadius: "10px",
      outline: "none",
      width: "auto",
      maxWidth: "55%",
      WebkitAppearance: "none" as const,
      appearance: "none" as const,
    },
    listContainer: {
      flex: 1,
      overflowY: "auto" as const,
      backgroundColor: "#FAFAFA",
    },
    messageRow: (messageId: string, isRead: boolean) => ({
      padding: isMobile ? "16px" : "16px 24px",
      borderBottom: `1px solid ${colors.border}`,
      cursor: "pointer",
      backgroundColor: hoveredId === messageId ? "#F8FAFC" : (isRead ? "#FFFFFF" : "#F5F3FF"),
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
      position: "relative" as const,
    }),
    avatar: (name: string) => ({
      width: "48px",
      height: "48px",
      borderRadius: "14px",
      background: colors.primaryGradient,
      color: "#FFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: 700,
      flexShrink: 0,
      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
    }),
    unreadDot: {
      position: "absolute" as const,
      left: "8px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: colors.primary,
    },
    detailOverlay: {
      position: "fixed" as const,
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.2)",
      backdropFilter: "blur(4px)",
      zIndex: 50,
      display: "flex",
      justifyContent: isMobile ? "center" : "flex-end",
    },
    detailPanel: {
      width: isMobile ? "100%" : "650px",
      maxWidth: "100%",
      height: "100%",
      backgroundColor: "#FFFFFF",
      boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column" as const,
      animation: "slideIn 0.3s ease-out",
    },
    chatHeader: {
      height: "70px",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: "rgba(255,255,255,0.9)",
      backdropFilter: "blur(10px)",
    },
    chatBody: {
      flex: 1,
      overflowY: "auto" as const,
      padding: "24px",
      backgroundColor: "#F8FAFC",
      display: "flex",
      flexDirection: "column" as const,
      gap: "20px",
    },
    bubbleIn: {
      backgroundColor: "#FFFFFF",
      border: `1px solid ${colors.border}`,
      color: colors.textMain,
      padding: "14px 18px",
      borderRadius: "18px 18px 18px 4px",
      fontSize: "14px",
      lineHeight: "1.6",
      boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
      maxWidth: "80%",
    },
    bubbleOut: {
      background: colors.primaryGradient,
      color: "#FFFFFF",
      padding: "14px 18px",
      borderRadius: "18px 18px 4px 18px",
      fontSize: "14px",
      lineHeight: "1.6",
      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
      maxWidth: "80%",
    },
    composer: {
      padding: "20px",
      borderTop: `1px solid ${colors.border}`,
      backgroundColor: "#FFFFFF",
    },
    composerInputContainer: {
      backgroundColor: "#F8FAFC",
      border: `1px solid ${colors.border}`,
      borderRadius: "16px",
      padding: "4px",
      transition: "border 0.2s",
    },
    textarea: {
      width: "100%",
      backgroundColor: "transparent",
      border: "none",
      padding: "12px 16px",
      fontSize: "14px",
      outline: "none",
      resize: "none" as const,
      minHeight: "50px",
      maxHeight: "120px",
      fontFamily: "inherit",
    },
    sendButton: (disabled: boolean) => ({
      backgroundColor: disabled ? "#E2E8F0" : colors.primary,
      color: disabled ? "#94A3B8" : "#FFFFFF",
      border: "none",
      borderRadius: "12px",
      padding: "8px 12px",
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
    }),
  };

  // Inject minimal global styles for animation/scrollbar
  const globalStyles = `
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>
      
      <div style={styles.mainCard}>
        {/* --- Header --- */}
        <div style={styles.header}>
          <div style={styles.searchContainer}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: colors.textLight, width: "18px", height: "18px" }} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.tabsContainer}>
            <div className="no-scrollbar" style={styles.tabsList}>
              {(["All", "Unread", "Replied", "Pending", "Archived"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={styles.tabButton(activeFilter === f)}
                >
                  {f}
                </button>
              ))}
            </div>
            {!isMobile && (
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as any)}
                style={styles.sortSelect}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            )}
          </div>
          {isMobile && (
            <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-start" }}>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as any)}
                style={styles.sortSelectMobile}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          )}
        </div>

        {/* --- Message List --- */}
        <div style={styles.listContainer}>
          {filteredMessages.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.5 }}>
              <Search style={{ width: "40px", height: "40px", marginBottom: "16px", color: colors.textLight }} />
              <p style={{ fontSize: "14px", color: colors.textSec }}>No messages found</p>
            </div>
          ) : (
            <div>
              {filteredMessages.map(m => (
                <div
                  key={m.id}
                  onClick={() => openDetail(m.id)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={styles.messageRow(m.id, m.read)}
                >
                  {/* Unread Dot */}
                  {!m.read && <div style={styles.unreadDot} />}
                  
                  {/* Avatar */}
                  <div style={styles.avatar(m.name)}>
                    {getInitials(m.name)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <h3 style={{ 
                        fontSize: "14px", 
                        margin: 0, 
                        fontWeight: m.read ? 600 : 700, 
                        color: m.read ? colors.textMain : "#000",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: isMobile ? "60%" : "70%",
                      }}>{m.name}</h3>
                      <span style={{ fontSize: "11px", color: colors.textLight, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(m.date)}</span>
                    </div>
                    
                    <p className="message-text-left" style={{ 
                      margin: 0, 
                      fontSize: "13px", 
                      color: m.read ? colors.textSec : colors.textMain, 
                      fontWeight: m.read ? 400 : 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>{m.message}</p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", height: "20px" }}>
                      {m.replies && m.replies.length > 0 && (
                        <span style={{ 
                          fontSize: "10px", 
                          fontWeight: 700, 
                          color: colors.successText, 
                          backgroundColor: colors.successBg, 
                          padding: "2px 6px", 
                          borderRadius: "4px",
                          letterSpacing: "0.5px"
                        }}>
                          {m.replies.length} REPLIES
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMessage(m.id); }}
                        style={{ 
                          background: "transparent", 
                          border: "none", 
                          color: colors.textLight, 
                          cursor: "pointer", 
                          padding: "4px",
                          marginLeft: "auto",
                          opacity: hoveredId === m.id ? 1 : 0,
                          transition: "opacity 0.2s"
                        }}
                      >
                        <Trash2 style={{ width: "16px", height: "16px" }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Detail View Overlay --- */}
      {detailId && messages.find(m => m.id === detailId) && (() => {
        const msg = messages.find(m => m.id === detailId)!;
        return (
          <div style={styles.detailOverlay}>
            <div style={styles.detailPanel}>
              
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {isMobile && (
                    <button onClick={() => setDetailId(null)} style={{ background: "transparent", border: "none", padding: "4px", cursor: "pointer" }}>
                      <ChevronLeft style={{ color: colors.textSec }} />
                    </button>
                  )}
                  <div style={{ ...styles.avatar(msg.name), width: "40px", height: "40px", fontSize: "12px", background: "#1E293B" }}>
                    {getInitials(msg.name)}
                  </div>
                  <div>
                    <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: colors.textMain }}>{msg.name}</h2>
                    <p style={{ fontSize: "12px", margin: 0, color: colors.textSec }}>{msg.email}</p>
                  </div>
                </div>
                <button onClick={() => setDetailId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textLight }}>
                  <X style={{ width: "20px", height: "20px" }} />
                </button>
              </div>

              {/* Conversation */}
              <div ref={conversationRef} style={styles.chatBody}>
                <div style={{ textAlign: "center", margin: "10px 0" }}>
                   <span style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", backgroundColor: "#F1F5F9", padding: "4px 12px", borderRadius: "20px" }}>
                     {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(msg.date))}
                   </span>
                </div>

                {(msg.thread && msg.thread.length > 0 ? msg.thread : [
                  { text: msg.message, date: msg.date, direction: 'in' as const }
                ]).map((item, idx) => {
                  const isIncoming = item.direction === 'in';
                  return (
                    <div key={idx} style={{ display: "flex", width: "100%", justifyContent: isIncoming ? "flex-start" : "flex-end" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: isIncoming ? "flex-start" : "flex-end", width: "100%" }}>
                        <div style={isIncoming ? styles.bubbleIn : styles.bubbleOut}>
                          {item.text}
                        </div>
                        <span style={{ fontSize: "10px", marginTop: "6px", color: "#94A3B8", fontWeight: 500 }}>
                          {isIncoming ? msg.name.split(' ')[0] : 'You'} • {formatDate(item.date).split(',')[1].trim()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div style={styles.composer}>
                <div style={styles.composerInputContainer}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (replyText.trim()) sendReply(); }}}
                    placeholder="Type your reply..."
                    style={styles.textarea}
                    rows={1}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px 8px 12px" }}>
                    <span style={{ fontSize: "11px", color: colors.textLight }}>Enter to send</span>
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim()}
                      style={styles.sendButton(!replyText.trim())}
                    >
                      <Send style={{ width: "18px", height: "18px" }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}