"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Trash2 } from "lucide-react";

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
  // Full chronological thread for this conversation (incoming/outgoing)
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
      console.log('token', token);
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

        const statusMap: Record<string, MessageStatus> = {
          NEW: 'New',
          READ: 'Read',
          REPLIED: 'Replied',
          PENDING: 'Pending',
          ARCHIVED: 'Archived',
          DELETED: 'Deleted',
        };
        const tagMap: Record<string, Exclude<MessageTag, null>> = {
          LEAD: 'Lead',
          SUPPORT: 'Support',
          PRICING: 'Pricing',
          FEEDBACK: 'Feedback',
        };

        // Build per-user conversation threads (incoming + outgoing)
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

          // Combine incoming and outgoing, then sort by date ASC so latest is at the bottom
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
              name: sender.fullName || 'Unknown',
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
      console.log(response);
    }catch(err){
      console.error('Error fetching messages:', err);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
    container.scrollTop = container.scrollHeight;
  }, [detailId, messages]);

  const filteredMessages = useMemo(() => {
    let filtered = messages;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
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
      try {
        const response = await fetch(`/api/message/delete?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (!response.ok && response.status !== 404) {
          throw new Error("Failed to delete message");
        }
      } catch (error) {
        console.error("Error deleting message:", error);
      }
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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
          ...m, 
          status: "Replied", 
          read: true,
          thread: [
            ...(m.thread || []),
            {
              text: replyText,
              date: new Date().toISOString(),
              direction: 'out',
            }
          ]
        } : m));
        setReplyId(null);
        setReplyText("");
      } else {
        const errorData = await response.json();
        console.error('Failed to send reply:', errorData);
        alert('Failed to send reply. Please try again.');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Error sending reply. Please check your connection.');
    }
  };

  const getStatusBadge = (status: MessageStatus) => {
    const styles: Record<MessageStatus, string> = {
      New: "bg-blue-50 text-blue-700 border border-blue-200",
      Read: "bg-gray-50 text-gray-600 border border-gray-200",
      Replied: "bg-green-50 text-green-700 border border-green-200",
      Pending: "bg-amber-50 text-amber-700 border border-amber-200",
      Archived: "bg-gray-50 text-gray-500 border border-gray-200",
      Deleted: "bg-red-50 text-red-600 border border-red-200",
    };
    return `px-2.5 py-0.5 text-xs font-medium rounded ${styles[status]}`;
  };

  const getTagBadge = (tag: MessageTag) => {
    const styles: Record<NonNullable<MessageTag>, string> = {
      Lead: "bg-purple-50 text-purple-700 border border-purple-200",
      Support: "bg-blue-50 text-blue-700 border border-blue-200",
      Pricing: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      Feedback: "bg-orange-50 text-orange-700 border border-orange-200",
    };
    return tag ? `px-2.5 py-0.5 text-xs font-medium rounded ${styles[tag]}` : "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div
      className="no-scrollbar"
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: 0,
          boxSizing: "border-box",
          padding: "0px",
        }}
      >
        {/* Full-page Message Box */}
        <div style={{ 
          maxWidth: "100%",
          margin: 0,
          padding: 0,
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
            minHeight: isMobile ? "100vh" : "auto", 
          }}>
            {/* Search Bar */}
            <div style={{ padding: "16px 16px 0 16px" }}>
              <div style={{ position: "relative" }}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#666666" }} />
                <input
                  type="text"
                  placeholder="Search messages"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full"
                  style={{
                    padding: "8px 12px 8px 36px",
                    fontSize: 14,
                    backgroundColor: "#EDF3F8",
                    border: "none",
                    borderRadius: 4,
                    outline: "none",
                    color: "#000000",
                  }}
                />
              </div>
            </div>

            {/* Tabs Section */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              borderBottom: "1px solid #E0E0E0",
              padding: "12px 16px 0 16px",
            }}>
              <div style={{ 
                display: "flex", 
                gap: 0,
                overflowX: isMobile ? "auto" : "visible",
                WebkitOverflowScrolling: "touch",
              }}>
                {(["All", "Unread", "Replied", "Pending", "Archived"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      padding: "12px 16px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: activeFilter === f ? "#0A66C2" : "#666666",
                      backgroundColor: "transparent",
                      borderBottom: activeFilter === f ? "2px solid #0A66C2" : "2px solid transparent",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as any)}
                style={{
                  padding: "6px 8px",
                  fontSize: 13,
                  border: "1px solid #E0E0E0",
                  borderRadius: 4,
                  outline: "none",
                  backgroundColor: "#FFFFFF",
                  color: "#666666",
                }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            {/* Message List */}
            <div>
              {filteredMessages.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center", color: "#666666" }}>
                  <p style={{ fontSize: 16 }}>No messages found.</p>
                </div>
              ) : (
                filteredMessages.map(m => (
                  <div
                    key={m.id}
                    onMouseEnter={() => !isMobile && setHoveredId(m.id)}
                    onMouseLeave={() => !isMobile && setHoveredId(null)}
                    onClick={() => openDetail(m.id)}
                    style={{
                      padding: isMobile ? "16px" : "12px 16px",
                      borderBottom: "1px solid #E0E0E0",
                      backgroundColor: hoveredId === m.id && !isMobile ? "#F3F6F8" : m.read ? "#FFFFFF" : "#F7FBFF",
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                    }}
                  >
                    {/* === UPDATED LAYOUT LOGIC === */}
                    {isMobile ? (
                      /* --- MOBILE LAYOUT --- */
                      <div>
                        {/* Top Row: Avatar, Info, Actions */}
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          {/* Avatar */}
                          <div style={{
                            width: 48, height: 48, borderRadius: "50%", backgroundColor: "#0A66C2",
                            color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, fontWeight: 600, flexShrink: 0,
                          }}>
                            {getInitials(m.name)}
                          </div>
                          {/* Content Header (Name, Date, Trash) */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                  <span style={{ fontSize: 14, fontWeight: m.read ? 400 : 600, color: "#000000" }}>
                                    {m.name}
                                  </span>
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 12, color: "#666666", whiteSpace: "nowrap" }}>
                                  {formatDate(m.date)}
                                </span>
                                <button
                                  aria-label="Delete message"
                                  onClick={e => { e.stopPropagation(); deleteMessage(m.id); }}
                                  style={{
                                    padding: 6, border: "none", background: "transparent",
                                    cursor: "pointer", color: "#D11124", borderRadius: 6,
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Message Body and Reply Count (Same Row) */}
                        <div style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginTop: 12,
                          paddingLeft: 55,
                          paddingRight: 16,
                        }}>
                          <p 
                            className="message-text-left"
                            style={{
                              fontSize: 14,
                              color: m.read ? "#666666" : "#000000",
                              margin: 0,
                              padding: 0,
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "pre-line", 
                              wordBreak: "break-word",
                            }}>
                            {m.message}
                          </p>
                          
                          {/* Reply count on the right */}
                          {m.replies && m.replies.length > 0 && (
                            <p style={{ 
                              fontSize: 12, 
                              color: "#666666", 
                              fontWeight: 600,
                              margin: 0,
                              marginLeft: 16,
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}>
                              {m.replies.length} {m.replies.length === 1 ? 'reply' : 'replies'}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* --- DESKTOP LAYOUT (Original) --- */
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {/* Avatar */}
                        <div style={{
                          width: 48, height: 48, borderRadius: "50%", backgroundColor: "#0A66C2",
                          color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16, fontWeight: 600, flexShrink: 0,
                        }}>
                          {getInitials(m.name)}
                        </div>

                        {/* Content (all in one block) */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Content Header */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 14, fontWeight: m.read ? 400 : 600, color: "#000000" }}>
                                  {m.name}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 12, color: "#666666", whiteSpace: "nowrap" }}>
                                {formatDate(m.date)}
                              </span>
                              <button
                                aria-label="Delete message"
                                onClick={e => { e.stopPropagation(); deleteMessage(m.id); }}
                                style={{
                                  padding: 6, border: "none", background: "transparent",
                                  cursor: "pointer", color: "#D11124", borderRadius: 6,
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Message Body */}
                          <p style={{
                            fontSize: 14,
                            color: m.read ? "#666666" : "#000000",
                            marginTop: 6,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            width: "100%",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            textAlign: "left", // This was the fix from last time
                            alignSelf: "stretch",
                            marginLeft: 0,
                            marginRight: 0,
                          }}>
                            {m.message}
                          </p>

                          {/* Replies */}
                          {m.replies && m.replies.length > 0 && (
                            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #E0E0E0" }}>
                              <p style={{ fontSize: 12, color: "#666666", fontWeight: 600 }}>
                                {m.replies.length} {m.replies.length === 1 ? 'reply' : 'replies'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* === END UPDATED LAYOUT LOGIC === */}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Full-Page View */}
      {detailId && messages.find(m => m.id === detailId) && (
        <div
          className="fixed right-0 bottom-0 left-0 lg:left-72 z-50 bg-white"
          style={{
            top: 64,
            padding: isMobile ? 0 : 12,
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 64px)",
            maxHeight: "calc(100vh - 64px)",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
              width: "100%",
              height: "auto",
              maxWidth: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {(() => {
              const msg = messages.find(m => m.id === detailId)!;
              return (
                <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                  {/* Header */}
                  <div style={{ 
                    padding: "16px 20px", 
                    borderBottom: "1px solid #E0E0E0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: "#0A66C2",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 600,
                      }}>
                        {getInitials(msg.name)}
                      </div>
                      <div>
                        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#000000" }}>{msg.name}</h2>
                        <p style={{ fontSize: 13, color: "#666666" }}>{msg.email}</p>
                      </div>
                    </div>
                    <button onClick={() => setDetailId(null)} style={{ color: "#666666" }}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ padding: 0, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                    {/* Meta strip removed: tag/status badges hidden per request */}

                    {/* Scrollable conversation area + sticky composer */}
                    <div
                      ref={conversationRef}
                      style={{
                        padding: isMobile ? 12 : 20,
                        paddingBottom: isMobile ? 100 : 110,
                        overflowY: "auto",
                        flex: 1,
                        minHeight: 0,
                        maxHeight: "100%",
                      }}
                    >
                      {/* Date separator */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#666", fontSize: 12, margin: "8px 0 16px" }}>
                        <div style={{ flex: 1, height: 1, background: "#E0E0E0" }} />
                        {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(msg.date))}
                        <div style={{ flex: 1, height: 1, background: "#E0E0E0" }} />
                      </div>

                      {/* Full chronological thread (latest at bottom) */}
                      {(msg.thread && msg.thread.length > 0 ? msg.thread : [
                        { text: msg.message, date: msg.date, direction: 'in' as const }
                      ]).map((item, idx) => {
                        const isIncoming = item.direction === 'in';
                        return (
                          <div key={`${item.id || idx}`} style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'flex-start',
                            marginBottom: 12,
                            justifyContent: isIncoming ? 'flex-start' : 'flex-end',
                          }}>
                            {isIncoming && (
                              <div style={{
                                width: 36, height: 36, borderRadius: '50%', background: '#0A66C2', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
                              }}>{getInitials(msg.name)}</div>
                            )}
                            <div style={{ maxWidth: '70%' }}>
                              <div style={{ textAlign: isIncoming ? 'left' : 'right', fontSize: 12, color: '#666', marginBottom: 4 }}>
                                {isIncoming ? `${msg.name} • ${formatDate(item.date)}` : `You • ${formatDate(item.date)}`}
                              </div>
                              <div style={{
                                background: isIncoming ? '#F3F6F8' : '#E6F3FF',
                                borderRadius: 8,
                                padding: 12,
                                color: '#000',
                                lineHeight: 1.5,
                                whiteSpace: 'pre-line',
                              }}>{item.text}</div>
                            </div>
                            {!isIncoming && (
                              <div style={{
                                width: 28, height: 28, borderRadius: '50%', background: '#E0E0E0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#555'
                              }}>You</div>
                            )}
                          </div>
                        );
                      })}

                      {/* Composer (sticky at bottom) */}
                      <div
                        style={{
                          position: "sticky",
                          bottom: 0,
                          borderTop: "3px solid #2A8C2F20",
                          paddingTop: 16,
                          paddingBottom: `calc(8px + env(safe-area-inset-bottom))`,
                          backgroundColor: "#FFFFFF",
                          zIndex: 10,
                        }}
                      >
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                          <textarea
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (replyText.trim()) {
                                  sendReply();
                                }
                              }
                            }}
                            placeholder="Write a message..."
                            className="w-full resize-none"
                            style={{
                              minHeight: 56,
                              maxHeight: 140,
                              padding: 12,
                              border: "1px solid #E0E0E0",
                              borderRadius: 12,
                              outline: "none",
                              fontSize: 14,
                              fontFamily: "inherit",
                              backgroundColor: "#FAFAFA",
                              overflowY: "auto",
                            }}
                          />
                          <button
                            onClick={sendReply}
                            disabled={!replyText.trim()}
                            style={{
                              padding: "10px 16px",
                              backgroundColor: !replyText.trim() ? "#B0B0B0" : "#0A66C2",
                              color: "#FFFFFF",
                              borderRadius: 20,
                              fontWeight: 600,
                              fontSize: 14,
                              border: "none",
                              cursor: !replyText.trim() ? "not-allowed" : "pointer",
                            }}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}