"use client";

import "./support.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  Reply,
  Send,
  Mail,
  Calendar,
  Settings,
  Loader2,
} from "lucide-react";

interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  date: string;
  status: "Pending" | "Resolved";
}

const dummyTickets: SupportTicket[] = [
  {
    id: "demo-1",
    userName: "Jane Doe",
    userEmail: "jane@example.com",
    subject: "Unable to share card",
    message: "I cannot share my card link.",
    date: new Date().toISOString(),
    status: "Pending",
  },
  {
    id: "demo-2",
    userName: "John Smith",
    userEmail: "john@example.com",
    subject: "Billing & invoicing",
    message: "Question about my last invoice.",
    date: new Date().toISOString(),
    status: "Resolved",
  },
];

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "resolved">("all");
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const navigateToSettings = () => {
    router.push("/admin/dashboard/adminsetting");
  };

  // Fetch tickets from backend
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/support/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else {
        // Fallback to dummy data if API fails
        setTickets(dummyTickets);
        toast.error('Failed to fetch tickets, showing demo data');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Fallback to dummy data
      setTickets(dummyTickets);
      toast.error('Failed to connect to server, showing demo data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "all" ||
      ticket.status.toLowerCase() === filterStatus.toLowerCase();

    return matchSearch && matchStatus;
  });

  // Update ticket status with email notification
  const updateTicketStatus = async (id: string, newStatus: "Pending" | "Resolved") => {
    try {
      setUpdating(id);
      
      // Find the ticket to get user details
      const ticket = tickets.find(t => t.id === id);
      if (!ticket) {
        toast.error('Ticket not found');
        return;
      }

      
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );

      // Send status update email
      const statusColor = newStatus === 'Resolved' ? '#28a745' : '#ffc107';
      const statusMessage = newStatus === 'Resolved' 
        ? 'Your support ticket has been resolved!' 
        : 'Your support ticket status has been updated.';

      const emailData = {
        to: ticket.userEmail,
        subject: `Ticket Status Update: ${ticket.subject} [Ticket #${ticket.id}]`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #667eea; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1>MyKard Support</h1>
              <p>${statusMessage}</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
              <h2>Hello ${ticket.userName},</h2>
              <p>Your support ticket regarding: <strong>${ticket.subject}</strong> has been updated.</p>
              <p><strong>New Status:</strong> <span style="display: inline-block; background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0;">${newStatus}</span></p>
              ${newStatus === 'Resolved' ? 
                '<p>Thank you for using MyKard support. If you have any other questions, feel free to create a new ticket.</p>' :
                '<p>Our team is continuing to work on your request. We\'ll keep you updated on any progress.</p>'
              }
              <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
                <p><strong>Ticket ID:</strong> #${ticket.id}</p>
                <p>© ${new Date().getFullYear()} MyKard. All rights reserved.</p>
              </div>
            </div>
          </div>
        `,
        text: `Hello ${ticket.userName},\n\nYour support ticket regarding: ${ticket.subject} has been updated.\n\nNew Status: ${newStatus}\n\nTicket ID: #${ticket.id}\n\nBest regards,\nMyKard Support Team`
      };

      // Send email notification
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (response.ok) {
          toast.success(`Ticket marked as ${newStatus.toLowerCase()} - Email sent to ${ticket.userName}`);
        } else {
          toast.success(`Ticket marked as ${newStatus.toLowerCase()} (Email service unavailable)`);
       //   console.log('Status update email that would be sent:', emailData);
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        toast.success(`Ticket marked as ${newStatus.toLowerCase()} (Email service error)`);
        
        // Log the email details for debugging
        // console.log('Status update details:', {
        //   ticketId: id,
        //   userEmail: ticket.userEmail,
        //   userName: ticket.userName,
        //   oldStatus: ticket.status,
        //   newStatus: newStatus,
        //   timestamp: new Date().toISOString()
        // });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket status');
    } finally {
      setUpdating(null);
    }
  };

  const handleReplyToggle = (id: string) => {
    setOpenReplyId(openReplyId === id ? null : id);
    setReplyText("");
  };

  // Send reply with email functionality
  const sendReply = async (id: string) => {
    if (!replyText.trim()) return;

    try {
      setSending(true);
      
      // Find the ticket to get user details
      const ticket = tickets.find(t => t.id === id);
      if (!ticket) {
        toast.error('Ticket not found');
        return;
      }

      // Send email using a simple email service API
      const emailData = {
        to: ticket.userEmail,
        subject: `Re: ${ticket.subject} [Ticket #${ticket.id}]`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #667eea; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1>MyKard Support</h1>
              <p>We've replied to your support ticket</p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
              <h2>Hello ${ticket.userName},</h2>
              <p>Our support team has replied to your ticket regarding: <strong>${ticket.subject}</strong></p>
              <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; margin: 15px 0;">
                <h3>Support Team Reply:</h3>
                <p>${replyText.replace(/\n/g, '<br>')}</p>
              </div>
              <p>If you have any additional questions, please don't hesitate to contact us.</p>
              <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
                <p><strong>Ticket ID:</strong> #${ticket.id}</p>
                <p>© ${new Date().getFullYear()} MyKard. All rights reserved.</p>
              </div>
            </div>
          </div>
        `,
        text: `Hello ${ticket.userName},\n\nOur support team has replied to your ticket regarding: ${ticket.subject}\n\nSupport Team Reply:\n${replyText}\n\nTicket ID: #${ticket.id}\n\nBest regards,\nMyKard Support Team`
      };

      // Use EmailJS or similar service for sending emails
      // For demo purposes, we'll simulate the email sending
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        toast.success(`Reply sent successfully to ${ticket.userEmail}`);
        setOpenReplyId(null);
        setReplyText("");
        
        // Show success message with email details
        setTimeout(() => {
          toast.success(`📧 Email delivered to ${ticket.userName}`, {
            duration: 4000,
          });
        }, 1000);
      } else {
        // Fallback: Show the reply was processed even if email fails
        toast.success('Reply processed (Email service unavailable)');
        setOpenReplyId(null);
        setReplyText("");
        
        // Show what would have been sent
        // console.log('Email that would be sent:', {
        //   to: ticket.userEmail,
        //   subject: `Re: ${ticket.subject} [Ticket #${ticket.id}]`,
        //   message: replyText
        // });
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      
      // Even if email fails, show that the reply was processed
      const ticket = tickets.find(t => t.id === id);
      if (ticket) {
        toast.success(`Reply processed for ${ticket.userName} (Email service error)`);
        setOpenReplyId(null);
        setReplyText("");
        
        // Log the email details for debugging
        // console.log('Reply details:', {
        //   ticketId: id,
        //   userEmail: ticket.userEmail,
        //   userName: ticket.userName,
        //   subject: ticket.subject,
        //   replyMessage: replyText,
        //   timestamp: new Date().toISOString()
        // });
      } else {
        toast.error('Failed to send reply');
      }
    } finally {
      setSending(false);
    }
  };

  // Export tickets functionality
  const exportTickets = async () => {
    try {
      const response = await fetch('/api/admin/support/tickets/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `support-tickets-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Tickets exported successfully');
      } else {
        toast.error('Failed to export tickets');
      }
    } catch (error) {
      console.error('Error exporting tickets:', error);
      toast.error('Failed to export tickets');
    }
  };

  const getStatusBadge = (status: string) =>
    status === "Pending" ? (
      <span className="status-badge pending">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    ) : (
      <span className="status-badge resolved">
        <CheckCircle className="w-3 h-3 mr-1" />
        Resolved
      </span>
    );

  if (loading) {
    return (
      <div className="support-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="support-page min-h-screen">
      <div className="support-container">
        {/* Header */}
        <header className="support-header">
          <div>
            <h1 className="support-title">Support & Feedback</h1>
            <p className="support-subtitle">
              Manage customer support tickets and feedback efficiently
            </p>
          </div>
          <button className="export-btn">
            <MessageSquare className="w-4 h-4" />
            Export Tickets
          </button>
        </header>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box relative">
            <Search className="search-icon" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, email, or subject..."
              className="search-input"
            />
          </div>
          <div className="filter-tabs">
            {["all", "pending", "resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab as any)}
                className={`tab-btn ${filterStatus === tab ? "active" : ""}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets */}
        <section className="ticket-section">
          {filteredTickets.map((t) => (
            <div key={t.id} className="ticket-card hover:shadow-2xl">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="avatar">
                      {t.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="ticket-user">{t.userName}</h3>
                      <div className="ticket-meta">
                        <span>
                          <Mail className="w-4 h-4" />
                          {t.userEmail}
                        </span>
                        <span>
                          <Calendar className="w-4 h-4" />
                          {new Date(t.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>{getStatusBadge(t.status)}</div>
                </div>

                {/* Body */}
                <div className="ticket-body">
                  <h4 className="ticket-subject">{t.subject}</h4>
                  <p className="ticket-message">{t.message}</p>
                </div>

                {/* Actions */}
                <div className="ticket-actions">
                  <button
                    onClick={() => handleReplyToggle(t.id)}
                    className={`action-btn ${openReplyId === t.id ? "active" : ""}`}
                  >
                    <Reply className="w-4 h-4" />
                    {openReplyId === t.id ? "Cancel" : "Reply"}
                  </button>

                  <button
                    onClick={() => updateTicketStatus(t.id, "Resolved")}
                    className="status-btn resolved"
                    disabled={t.status === "Resolved"}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Resolved
                  </button>

                  <button
                    onClick={() => updateTicketStatus(t.id, "Pending")}
                    className="status-btn pending"
                    disabled={t.status === "Pending"}
                  >
                    <Clock className="w-4 h-4" />
                    Mark Pending
                  </button>
                </div>

                {/* Reply Box */}
                {openReplyId === t.id && (
                  <div className="reply-box">
                    <h5 className="reply-title">
                      <Reply className="w-4 h-4 text-[#0066FF]" />
                      Reply to {t.userName}
                    </h5>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={3}
                      className="reply-input"
                    />
                    <div className="reply-actions">
                      <button
                        onClick={() => setOpenReplyId(null)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => sendReply(t.id)}
                        disabled={!replyText.trim() || sending}
                        className="send-btn"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {sending ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
