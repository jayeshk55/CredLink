'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './connections.module.css'; // Import CSS Module
import { Modal } from '@/components/ui/modal';
import DigitalCardPreview from '@/components/cards/DigitalCardPreview';

// Remove the inline style injection logic
/*
const flipCardStyles = `...`;
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = flipCardStyles;
  document.head.appendChild(styleSheet);
}
*/

import { Search, Filter, Download, Plus, ChevronDown, MoreHorizontal, Phone, Mail, MessageCircle, Calendar, TrendingUp, Users, Activity, Zap, Star, Clock, MapPin, Send, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Contact {
  id: string; // connection id from backend API
  userId?: string; // actual user id of the other party (for messaging)
  name: string;
  title: string;
  company: string;
  tags: string[];
  associatedCard: string;
  dateAdded: string;
  avatar?: string;
  email?: string;
  phone?: string;
  location?: string;
  lastInteraction?: string;
  relationshipScore?: number;
  activityStatus?: 'active' | 'inactive' | 'new';
  meetingCount?: number;
  responseRate?: number;
  connectionStatus?: 'connected' | 'pending' | 'rejected';
  isIncomingRequest?: boolean;
}

// Enhanced sample contact data (Keeping this data structure)
const contactsData: Contact[] = [
  { id: "1", name: "Leo Garcia", title: "Full Stack Developer", company: "MyKard", tags: ["Personal"], associatedCard: "Personal", dateAdded: "2024-10-30", email: "leo@MyKard.com", phone: "+1 (555) 123-4567", location: "Mumbai, India", lastInteraction: "2024-10-29", activityStatus: "active" },
  { id: "2", name: "John Smith", title: "Software Engineer", company: "Tech Corp", tags: ["Tech"], associatedCard: "Work", dateAdded: "2024-10-25", email: "john@techcorp.com", phone: "+1 (555) 234-5678", location: "San Francisco, CA", lastInteraction: "2024-10-28", activityStatus: "active" },
  { id: "3", name: "Sarah Johnson", title: "Marketing Manager", company: "Creative Agency", tags: ["Marketing"], associatedCard: "Business", dateAdded: "2024-10-20", email: "sarah@creative.com", phone: "+1 (555) 345-6789", location: "New York, NY", lastInteraction: "2024-10-15", activityStatus: "inactive" },
  { id: "4", name: "Mike Davis", title: "Product Designer", company: "Design Studio", tags: ["Design"], associatedCard: "Creative", dateAdded: "2024-10-15", email: "mike@designstudio.com", phone: "+1 (555) 456-7890", location: "Austin, TX", lastInteraction: "2024-10-30", activityStatus: "active" },
  { id: "5", name: "Emily Chen", title: "Data Scientist", company: "Analytics Inc", tags: ["Professional"], associatedCard: "Professional", dateAdded: "2024-10-10", email: "emily@analytics.com", phone: "+1 (555) 567-8901", location: "Seattle, WA", lastInteraction: "2024-10-25", activityStatus: "active" },
  { id: "6", name: "Alex Rodriguez", title: "Sales Director", company: "Sales Solutions", tags: ["Business"], associatedCard: "Business", dateAdded: "2024-10-05", email: "alex@sales.com", phone: "+1 (555) 678-9012", location: "Miami, FL", lastInteraction: "2024-09-20", activityStatus: "inactive" },
  { id: "7", name: "Lisa Wang", title: "UX Researcher", company: "User Labs", tags: ["Creative"], associatedCard: "Creative", dateAdded: "2024-09-30", email: "lisa@userlabs.com", phone: "+1 (555) 789-0123", location: "Portland, OR", lastInteraction: "2024-10-28", activityStatus: "active" },
  { id: "8", name: "David Brown", title: "DevOps Engineer", company: "Cloud Systems", tags: ["Technical"], associatedCard: "Technical", dateAdded: "2024-10-12", email: "david@cloudsys.com", phone: "+1 (555) 890-1234", location: "Denver, CO", lastInteraction: "2024-10-26", activityStatus: "new" }
];

const connectionRequestsData: Contact[] = [
  { id: "9", name: "New User 1", title: "Developer", company: "Tech Inc", tags: ["Tech"], associatedCard: "Work", dateAdded: "2024-11-01", connectionStatus: "pending", isIncomingRequest: true },
  { id: "10", name: "New User 2", title: "Designer", company: "Design Co", tags: ["Design"], associatedCard: "Creative", dateAdded: "2024-11-02", connectionStatus: "pending", isIncomingRequest: true }
];

export default function DashboardContactPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('a-z');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState('a-z');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showContactInfo, setShowContactInfo] = useState<{[key: string]: {type: 'phone' | 'email' | null}}>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [contactsList, setContactsList] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messageModal, setMessageModal] = useState<{isOpen: boolean, contact: Contact | null}>({isOpen: false, contact: null});
  const [messageText, setMessageText] = useState('');
  const [connectionRequests, setConnectionRequests] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');
  const [previewContact, setPreviewContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [approveModal, setApproveModal] = useState<{isOpen: boolean, request: Contact | null}>({isOpen: false, request: null});
  const filterRef = useRef<HTMLDivElement>(null);
  const [hasUnreadRequests, setHasUnreadRequests] = useState(false);

  useEffect(() => {
    setHasUnreadRequests(connectionRequests.length > 0 && activeTab !== 'requests');
  }, [connectionRequests, activeTab]);

  const handleTabClick = (tab: 'connections' | 'requests') => {
    setActiveTab(tab);
    if (tab === 'requests') {
      setHasUnreadRequests(false);
    }
  };

  // Handle direct message - open message modal
  const handleDirectMessage = (contact: Contact) => {
    setMessageModal({isOpen: true, contact});
    setMessageText('');
  };

  // Close message modal
  const handleCloseMessageModal = () => {
    setMessageModal({isOpen: false, contact: null});
    setMessageText('');
  };

  // Send message to backend so it appears in recipient's inbox
  const handleSendMessage = async () => {
    if (!messageText.trim() || !messageModal.contact) return;

    const receiverId = messageModal.contact.userId;
    if (!receiverId) {
      toast.error('Cannot send message: missing receiver id');
      return;
    }

    try {
      const res = await fetch('/api/message/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: messageText.trim(),
          receiverId,
          status: 'PENDING',
          tag: 'SUPPORT',
          read: false,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to send message');
      }

      toast.success('Message sent');
      handleCloseMessageModal();
    } catch (e: any) {
      console.error('Send message error:', e);
      toast.error(e?.message || 'Failed to send message');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      
      // Check if click is inside filter button or dropdown
      const isFilterButton = filterRef.current && filterRef.current.contains(target);
      const isFilterDropdown = target.closest('[data-filter-dropdown]');
      
      if (!isFilterButton && !isFilterDropdown && isFilterOpen) {
        setIsFilterOpen(false);
      }
      
      // Close action dropdown when clicking outside
      if (!target.closest(`.${styles.relativeContainer}`)) { // Check against a specific class for the dropdown container
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Fetch accepted connections from backend
  useEffect(() => {
    const fetchAcceptedConnections = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users/connections?type=accepted', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch connections');
        }
        
        const data = await response.json();
        
        // Map backend data to frontend Contact structure
        const mappedConnections: Contact[] = (data.requests || []).map((connection: any) => ({
          id: connection.id,
          userId: connection.user?.id,
          name: connection.user?.fullName || 'Unknown User',
          title: connection.user?.title || 'No Title',
          company: connection.user?.company || 'No Company',
          tags: ['Professional'],
          associatedCard: 'Professional',
          dateAdded: new Date(connection.updatedAt).toISOString().split('T')[0],
          email: connection.user?.email,
          phone: connection.user?.phone,
          location: connection.user?.location,
          connectionStatus: 'connected',
          activityStatus: 'active' as const
        }));
        
        setContactsList(mappedConnections);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('connections-updated'));
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
        toast.error('Failed to load connections');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAcceptedConnections();
  }, []);

  // Fetch connection requests from backend
  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        setRequestsLoading(true);
        const response = await fetch('/api/users/connections?type=received', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch connection requests');
        }
        
        const data = await response.json();
        
        // Map backend data to frontend Contact structure
        const mappedRequests: Contact[] = (data.requests || []).map((request: any) => ({
          id: request.id,
          name: request.sender?.fullName || 'Unknown User',
          title: request.sender?.title || 'No Title',
          company: request.sender?.company || 'No Company',
          tags: ['Professional'],
          associatedCard: 'Professional',
          dateAdded: new Date(request.createdAt).toISOString().split('T')[0],
          email: request.sender?.email,
          connectionStatus: 'pending',
          isIncomingRequest: true,
          activityStatus: 'new' as const
        }));
        
        setConnectionRequests(mappedRequests);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('connections-updated'));
        }
      } catch (error) {
        console.error('Error fetching connection requests:', error);
        toast.error('Failed to load connection requests');
      } finally {
        setRequestsLoading(false);
      }
    };
    
    fetchConnectionRequests();
  }, []);

  // Handle showing contact info
  const handleContactInfo = (contactId: string, type: 'phone' | 'email') => {
    setShowContactInfo(prev => ({
      ...prev,
      [contactId]: { type: prev[contactId]?.type === type ? null : type }
    }));
  };

  // Handle delete connection
  const handleDeleteConnection = async (contactId: string) => {
    try {
      const res = await fetch(`/api/users/connections/${contactId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to remove connection');
      }

      setContactsList(prev => prev.filter(contact => contact.id !== contactId));
      setOpenDropdown(null);
      toast.success('Connection removed successfully');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('connections-updated'));
      }
    } catch (e: any) {
      console.error('Delete connection error:', e);
      toast.error(e?.message || 'Failed to remove connection');
    }
  };

  // Handle contact click to open sidebar
  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsSidebarOpen(true);
  };

  // Handle sidebar close
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedContact(null);
  };

  // Filter contacts based on search term
  const filteredContacts = contactsList.filter((contact: Contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    switch (sortBy) {
      case 'a-z':
        return a.name.localeCompare(b.name);
      case 'z-a':
        return b.name.localeCompare(a.name);
      case 'recent':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'oldest':
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Helper to map tags to specific module classes for color (defined in CSS module)
  const getTagClass = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'personal':
        return styles.tagPersonal;
      case 'tech':
        return styles.tagTech;
      case 'marketing':
        return styles.tagMarketing;
      case 'design':
        return styles.tagDesign;
      case 'professional':
        return styles.tagProfessional;
      case 'business':
        return styles.tagBusiness;
      case 'creative':
        return styles.tagCreative;
      case 'technical':
        return styles.tagTechnical;
      default:
        return styles.tagDefault;
    }
  };

  const handleApproveRequest = async (contactId: string) => {
    try {
      const response = await fetch(`/api/users/connections/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'accept' }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve connection request');
      }

      const data = await response.json();
      
      // Find the request and move it to connections
      const request = connectionRequests.find(c => c.id === contactId);
      if (request) {
        setContactsList(prev => [...prev, {...request, connectionStatus: 'connected'}]);
        setConnectionRequests(prev => prev.filter(c => c.id !== contactId));
        toast.success(`Connection with ${request.name} approved!`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('connections-updated'));
        }
      }
    } catch (error: any) {
      console.error('Error approving connection request:', error);
      toast.error(error.message || 'Failed to approve connection request');
    }
  };

  const openApproveModal = (request: Contact) => {
    setApproveModal({ isOpen: true, request });
  };

  const closeApproveModal = () => {
    setApproveModal({ isOpen: false, request: null });
  };

  const handleRejectRequest = async (contactId: string) => {
    try {
      const response = await fetch(`/api/users/connections/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'reject' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject connection request');
      }

      const data = await response.json();
      
      // Remove the request from the list
      const request = connectionRequests.find(c => c.id === contactId);
      setConnectionRequests(prev => prev.filter(c => c.id !== contactId));
      
      if (request) {
        toast.success(`Connection request from ${request.name} rejected`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('connections-updated'));
        }
      }
    } catch (error: any) {
      console.error('Error rejecting connection request:', error);
      toast.error(error.message || 'Failed to reject connection request');
    }
  };

  return (
    <div className={styles.minHScreen}>
      <div className={styles.wFull}>
        {previewContact && (
          <Modal
            isOpen={!!previewContact}
            onClose={() => setPreviewContact(null)}
            title=""
            message={null}
            showActions={false}
          >
            <div style={{ padding: 20 }}>
              <DigitalCardPreview
                name={previewContact.name}
                title={previewContact.title}
                company={previewContact.company}
                location={previewContact.location || ''}
                about={`${previewContact.title || ''}${previewContact.company ? ' at ' + previewContact.company : ''}`}
                skills=""
                portfolio=""
                experience=""
              />
            </div>
          </Modal>
        )}
        {/* Hero Section */}
        <div className={styles.heroSection}>
          {/* Background Pattern */}
          <div className={styles.bgOverlay}></div>
          <div className={styles.bgWhite}></div>
          
          {/* Decorative Elements */}
          <div className={styles.decorativeElement}></div>
          
          <div className={styles.heroContentWrapper}>
            {/* Header Section - Mobile First */}
            <div className={styles.headerFlexContainer}>
              <div className={styles.flexOne}>
                <h1 className={styles.pageTitle}>Connections</h1>
                <p className={styles.pageSubtitle}>Manage and grow your connections</p>
                {/* Mobile-only: View toggle under title */}
                <div className={styles.mobileOnly}>
                  <div className={styles.viewToggleContainer}>
                    <div 
                      className={`${styles.viewToggleBackground} ${
                        viewMode === 'table' ? styles.viewToggleTableActive : styles.viewToggleCardsActive
                      }`}
                    />
                    <button 
                      onClick={() => setViewMode('table')}
                      className={`${styles.viewToggleButton} ${
                        viewMode === 'table' 
                          ? styles.viewToggleActiveText 
                          : styles.viewToggleInactiveText
                      }`}
                    >
                      <span className={styles.flexCenter}>
                        <svg className={styles.viewToggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9" />
                        </svg>
                        Table View
                      </span>
                    </button>
                    <button 
                      onClick={() => setViewMode('cards')}
                      className={`${styles.viewToggleButton} ${
                        viewMode === 'cards' 
                          ? styles.viewToggleActiveText 
                          : styles.viewToggleInactiveText
                      }`}
                    >
                      <span className={styles.flexCenter}>
                        <svg className={styles.viewToggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                        </svg>
                        Cards View
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Stats and Controls - Mobile Responsive */}
              <div className={styles.controlsFlexContainer}>
                <div className={styles.statsBox}>
                  {/* Content removed to save space */}
                </div>
                
                <div className={styles.controlsGroup}>
                  {/* Mobile: Filter first, then Toggle */}
                  <div className={styles.controlsInnerFlex}>
                    {/* Filter: Desktop Only in Header */}
                    {!isSidebarOpen && (
                      <div className={styles.desktopOnly}>
                        <div className={styles.filterContainer} ref={filterRef} data-filter-dropdown>
                          <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={styles.filterButton}
                          >
                            <Filter className={styles.filterIcon} />
                            <span className={styles.filterText}>Sort by: {selectedSortOption === 'a-z' ? 'A-Z' : selectedSortOption === 'z-a' ? 'Z-A' : selectedSortOption === 'recent' ? 'Recent' : 'Oldest'}</span>
                            <ChevronDown className={`${styles.chevronIcon} ${isFilterOpen ? styles.rotate180 : ''}`} />
                          </button>
                          
                          {isFilterOpen && (
                            <div className={styles.filterDropdown}>
                              <div className={styles.filterDropdownContent}>
                                <button 
                                  onClick={() => {
                                    setSortBy('a-z');
                                    setSelectedSortOption('a-z');
                                    setIsFilterOpen(false);
                                  }}
                                  className={`${styles.filterOption} ${selectedSortOption === 'a-z' ? styles.filterOptionActive : ''}`}
                                >
                                  Sort A-Z
                                </button>
                                <button 
                                  onClick={() => {
                                    setSortBy('z-a');
                                    setSelectedSortOption('z-a');
                                    setIsFilterOpen(false);
                                  }}
                                  className={`${styles.filterOption} ${selectedSortOption === 'z-a' ? styles.filterOptionActive : ''}`}
                                >
                                  Sort Z-A
                                </button>
                                <button 
                                  onClick={() => {
                                    setSortBy('recent');
                                    setSelectedSortOption('recent');
                                    setIsFilterOpen(false);
                                  }}
                                  className={`${styles.filterOption} ${selectedSortOption === 'recent' ? styles.filterOptionActive : ''}`}
                                >
                                  Sort by Recent
                                </button>
                                <button 
                                  onClick={() => {
                                    setSortBy('oldest');
                                    setSelectedSortOption('oldest');
                                    setIsFilterOpen(false);
                                  }}
                                  className={`${styles.filterOption} ${selectedSortOption === 'oldest' ? styles.filterOptionActive : ''}`}
                                >
                                  Sort by Oldest
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* View Toggle - Desktop Only in header controls */}
                    <div className={styles.desktopOnly}>
                      <div className={styles.viewToggleContainer}>
                        <div 
                          className={`${styles.viewToggleBackground} ${
                            viewMode === 'table' ? styles.viewToggleTableActive : styles.viewToggleCardsActive
                          }`}
                        />
                        <button 
                          onClick={() => setViewMode('table')}
                          className={`${styles.viewToggleButton} ${
                            viewMode === 'table' 
                              ? styles.viewToggleActiveText 
                              : styles.viewToggleInactiveText
                          }`}
                        >
                          <span className={styles.flexCenter}>
                            <svg className={styles.viewToggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9" />
                            </svg>
                            Table View
                          </span>
                        </button>
                        <button 
                          onClick={() => setViewMode('cards')}
                          className={`${styles.viewToggleButton} ${
                            viewMode === 'cards' 
                              ? styles.viewToggleActiveText 
                              : styles.viewToggleInactiveText
                          }`}
                        >
                          <span className={styles.flexCenter}>
                            <svg className={styles.viewToggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                            </svg>
                            Cards View
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className={styles.searchBarSection}>
              <div className={styles.searchBarWrapper}>
                <div className={styles.searchBarInner}>
                  <div className={styles.relativeContainer}>
                    <div className={styles.searchIconContainer}>
                      <Search className={styles.searchIcon} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search your professional network..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only Filter under search bar */}
        {!isSidebarOpen && (
          <div className={styles.mobileOnly}>
            <div className={styles.controlsFlexContainer}>
              <div className={styles.controlsGroup}>
                <div className={styles.controlsInnerFlex}>
                  <div className={styles.filterContainer} ref={filterRef} data-filter-dropdown>
                    <button 
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={styles.filterButton}
                    >
                      <Filter className={styles.filterIcon} />
                      <span className={styles.filterText}>Sort by: {selectedSortOption === 'a-z' ? 'A-Z' : selectedSortOption === 'z-a' ? 'Z-A' : selectedSortOption === 'recent' ? 'Recent' : 'Oldest'}</span>
                      <ChevronDown className={`${styles.chevronIcon} ${isFilterOpen ? styles.rotate180 : ''}`} />
                    </button>
                    {isFilterOpen && (
                      <div className={styles.filterDropdown}>
                        <div className={styles.filterDropdownContent}>
                          <button 
                            onClick={() => { setSortBy('a-z'); setSelectedSortOption('a-z'); setIsFilterOpen(false); }}
                            className={`${styles.filterOption} ${selectedSortOption === 'a-z' ? styles.filterOptionActive : ''}`}
                          >
                            Sort A-Z
                          </button>
                          <button 
                            onClick={() => { setSortBy('z-a'); setSelectedSortOption('z-a'); setIsFilterOpen(false); }}
                            className={`${styles.filterOption} ${selectedSortOption === 'z-a' ? styles.filterOptionActive : ''}`}
                          >
                            Sort Z-A
                          </button>
                          <button 
                            onClick={() => { setSortBy('recent'); setSelectedSortOption('recent'); setIsFilterOpen(false); }}
                            className={`${styles.filterOption} ${selectedSortOption === 'recent' ? styles.filterOptionActive : ''}`}
                          >
                            Sort by Recent
                          </button>
                          <button 
                            onClick={() => { setSortBy('oldest'); setSelectedSortOption('oldest'); setIsFilterOpen(false); }}
                            className={`${styles.filterOption} ${selectedSortOption === 'oldest' ? styles.filterOptionActive : ''}`}
                          >
                            Sort by Oldest
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Smart Insights Panel (desktop only) */}
        <div className={`${styles.insightsPanel} ${styles.desktopOnly}`}>
          <div className={styles.insightsContent}>
            <div className={styles.insightsGrid}>
              {/* Content removed to save space */}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              onClick={() => handleTabClick('connections')}
              className={`${styles.tabButton} ${activeTab === 'connections' ? styles.tabButtonActive : ''}`}
            >
              Connections
            </button>
            <button 
              onClick={() => handleTabClick('requests')}
              className={`${styles.tabButton} ${activeTab === 'requests' ? styles.tabButtonActive : ''}`}
              style={{ position: 'relative' }}
            >
              Requests
              {hasUnreadRequests && <span className={styles.notificationDot}></span>}
            </button>
          </div>
          {activeTab === 'connections' ? (
            viewMode === 'table' ? (
              /* Table View */
              <div className={styles.tableViewContainer}>
                {/* Desktop Table View */}
                <div className={styles.desktopTableWrapper}>
                  <table className={styles.tableFullWidth}>
                    <thead className={styles.tableHead}>
                      <tr>
                        <th className={styles.tableHeaderCell}>
                          <div className={styles.flexCenterGap}>NAME</div>
                        </th>
                        <th className={styles.tableHeaderCell}>
                          <div className={styles.flexCenterGap}>TITLE</div>
                        </th>
                        <th className={styles.tableHeaderCell}>
                          <div className={styles.flexCenterGap}>COMPANY</div>
                        </th>
                        <th className={styles.tableHeaderDate}>
                          <div className={styles.flexCenterGap}>DATE</div>
                        </th>
                        <th className={styles.tableHeaderAction}></th>
                        <th className={styles.tableHeaderActionW8}></th>
                      </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                      {sortedContacts.map((contact) => (
                        <tr key={contact.id} className={styles.tableRow}>
                          <td className={styles.tableDataCell}>
                            <div className={styles.flexCenterGap}>
                              <div className={styles.avatarPlaceholder}>
                                <span className={styles.avatarText}>
                                  {sortedContacts.indexOf(contact) + 1}
                                </span>
                              </div>
                              <button
                                onClick={() => setPreviewContact(contact)}
                                className={styles.contactNameButton}
                              >
                                {contact.name}
                              </button>
                            </div>
                          </td>
                          <td className={styles.tableDataCell}>
                            <span className={styles.tableCellText}>{contact.title}</span>
                          </td>
                          <td className={styles.tableDataCell}>
                            <span className={styles.tableCellText}>{contact.company}</span>
                          </td>
                          <td className={styles.tableDataDate}>
                            <span>{contact.dateAdded}</span>
                          </td>
                          <td className={styles.tableDataCell}>
                            <button
                              onClick={() => handleDirectMessage(contact)}
                              className={styles.messageButton}
                            >
                              Message
                            </button>
                          </td>
                          <td className={styles.tableDataCell}>
                            <div className={styles.relativeContainer}>
                              <button 
                                onClick={() => setOpenDropdown(openDropdown === contact.id ? null : contact.id)}
                                className={styles.moreButton}
                              >
                                <MoreHorizontal className={styles.moreIcon} />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {openDropdown === contact.id && (
                                <div className={styles.dropdownMenu}>
                                  <button
                                    onClick={() => handleDeleteConnection(contact.id)}
                                    className={styles.dropdownItemDelete}
                                  >
                                    <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Connection
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View (used inside table view block for responsiveness) */}
                <div className={styles.mobileCardsWrapper}>
                  <div className={styles.mobileCardsList}>
                    {sortedContacts.map((contact) => (
                      <div key={contact.id} className={styles.mobileCard}>
                        <div className={styles.mobileCardInner} style={{ marginLeft: 0 }}>
                          <div className={styles.mobileCardContent}>
                            <div className={styles.mobileCardHeader}>
                              <div>
                                <h3 className={styles.mobileCardTitle} onClick={() => setPreviewContact(contact)} style={{ cursor: 'pointer' }}>{contact.name}</h3>
                                <p className={styles.mobileCardSubtitle}>{contact.title}</p>
                              </div>
                              <div className={styles.mobileCardActions}>
                                <button
                                  onClick={() => handleDirectMessage(contact)}
                                  className={styles.mobileMessageButton}
                                >
                                  Message
                                </button>
                                <div className={styles.relativeContainer}>
                                  <button 
                                    onClick={() => setOpenDropdown(openDropdown === contact.id ? null : contact.id)}
                                    className={styles.mobileMoreButton}
                                  >
                                    <MoreHorizontal className={styles.mobileMoreIcon} />
                                  </button>
                                  {openDropdown === contact.id && (
                                    <div className={styles.dropdownMenuMobile}>
                                      <button 
                                        onClick={() => handleDeleteConnection(contact.id)}
                                        className={styles.dropdownItemDeleteMobile}
                                      >
                                        <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Connection
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className={styles.mobileCardFooter}>
                              <p className={styles.mobileCompanyText}>{contact.company}</p>
                              <span className={styles.mobileDateText}>Connected: {contact.dateAdded}</span>
                            </div>

                            {/* Contact Info Display for Mobile */}
                            {showContactInfo[contact.id]?.type && (
                              <div className={styles.mobileContactInfoBox}>
                                <div className={styles.mobileContactInfoText}>
                                  <span className={styles.mobileContactInfoLabel}>
                                    {showContactInfo[contact.id]?.type === 'phone' ? 'Phone: ' : 'Email: '}
                                  </span>
                                  <span className={styles.mobileContactInfoValue}>
                                    {showContactInfo[contact.id]?.type === 'phone' ? contact.phone : contact.email}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.tableFooter}>
                  <p className={styles.tableFooterText}>
                    1 - {Math.min(sortedContacts.length, contactsList.length)} of {contactsList.length} contacts
                  </p>
                </div>
              </div>
            ) : (
              /* Cards View */
              <div className={styles.cardsViewContainer}>
                <div className={styles.cardsWrapper}>
                  <div className={styles.cardsGrid}>
                    {sortedContacts.map((contact, index) => (
                      <div
                        key={contact.id}
                        className={styles.cardGroup}
                        onMouseEnter={() => setHoveredCard(contact.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        {/* Card Container with 3D Flip Effect */}
                        <div className={styles.flipCardContainer}>
                          <div className={`${styles.flipCardInner} ${
                            hoveredCard === contact.id ? styles.rotateY180 : ''
                          }`}>
                            
                            {/* Front of Card */}
                            <div className={`${styles.cardFace} ${styles.backfaceHidden} ${
                              index % 4 === 1 ? styles.cardFront1 :
                              index % 4 === 2 ? styles.cardFront2 :
                              index % 4 === 3 ? styles.cardFront3 :
                              styles.cardFront4
                            }`}>
                              
                              {/* Decorative Elements */}
                              <div className={styles.cardDecorativeElement}>
                                <div className={`${styles.cardCircle} ${
                                  index % 4 === 1 ? styles.circle1 :
                                  index % 4 === 2 ? styles.circle2 :
                                  index % 4 === 3 ? styles.circle3 :
                                  styles.circle4
                                }`}></div>
                              </div>
                              
                              <div className={styles.cardContentFlex}>
                                {/* Name and Title */}
                                <h3 className={styles.cardName}>{contact.name}</h3>
                                <p className={styles.cardTitle}>{contact.title}</p>
                                <p className={styles.cardCompany}>{contact.company}</p>

                                {/* Tags */}
                                <div className={styles.cardTagsFlex}>
                                  {contact.tags.slice(0, 2).map((tag, index) => (
                                    <span
                                      key={index}
                                      className={`${styles.cardTag} ${getTagClass(tag)}`}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Back of Card - Different templates based on contact ID */}
                            <div className={`${styles.cardFace} ${styles.backfaceHidden} ${styles.rotateY180} ${
                              index % 4 === 1 ? styles.cardBack1 :
                              index % 4 === 2 ? styles.cardBack2 :
                              index % 4 === 3 ? styles.cardBack3 :
                              styles.cardBack4
                            }`}>
                              <div className={styles.cardBackCenter}>
                                <div className={styles.quickHeader}>
                                  <h3 className={styles.quickTitle}>{contact.name}</h3>
                                  <p className={styles.quickSubtitle}>Quick Actions</p>
                                  {showContactInfo[contact.id]?.type && (
                                    <div className={styles.quickInfoBox}>
                                      <p className={styles.quickInfoText}>
                                        {showContactInfo[contact.id]?.type === 'phone' ? contact.phone : contact.email}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Actions layout: desktop keeps orbit/row logic; mobile always shows row for alignment */}
                                <div className={styles.desktopOnly}>
                                  {showContactInfo[contact.id]?.type ? (
                                    <div className={styles.quickActionsRow}>
                                      <button
                                        onClick={() => handleContactInfo(contact.id, 'email')}
                                        className={`${styles.quickActionBtn} ${styles.quickActionInline} ${showContactInfo[contact.id]?.type === 'email' ? styles.quickActionBtnActive : ''}`}
                                        aria-label="Show email"
                                      >
                                        <Mail className={styles.quickActionIcon} />
                                      </button>
                                      <button
                                        onClick={() => handleDirectMessage(contact)}
                                        className={`${styles.quickActionBtn} ${styles.quickActionInline}`}
                                        aria-label="Send message"
                                      >
                                        <Send className={styles.quickActionIcon} />
                                      </button>
                                      <button
                                        onClick={() => handleContactInfo(contact.id, 'phone')}
                                        className={`${styles.quickActionBtn} ${styles.quickActionInline} ${showContactInfo[contact.id]?.type === 'phone' ? styles.quickActionBtnActive : ''}`}
                                        aria-label="Show phone"
                                      >
                                        <Phone className={styles.quickActionIcon} />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className={styles.quickActionsOrbit}>
                                      <button
                                        onClick={() => handleContactInfo(contact.id, 'phone')}
                                        className={`${styles.quickActionBtn} ${showContactInfo[contact.id]?.type === 'phone' ? styles.quickActionBtnActive : ''} ${styles.quickActionTop}`}
                                        aria-label="Show phone"
                                      >
                                        <Phone className={styles.quickActionIcon} />
                                      </button>
                                      <button
                                        onClick={() => handleContactInfo(contact.id, 'email')}
                                        className={`${styles.quickActionBtn} ${showContactInfo[contact.id]?.type === 'email' ? styles.quickActionBtnActive : ''} ${styles.quickActionLeft}`}
                                        aria-label="Show email"
                                      >
                                        <Mail className={styles.quickActionIcon} />
                                      </button>
                                      <button
                                        onClick={() => handleDirectMessage(contact)}
                                        className={`${styles.quickActionBtn} ${styles.quickActionRight}`}
                                        aria-label="Send message"
                                      >
                                        <Send className={styles.quickActionIcon} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className={styles.mobileOnly}>
                                  <div className={styles.quickActionsRow}>
                                    <button
                                      onClick={() => handleContactInfo(contact.id, 'email')}
                                      className={`${styles.quickActionBtn} ${styles.quickActionInline} ${showContactInfo[contact.id]?.type === 'email' ? styles.quickActionBtnActive : ''}`}
                                      aria-label="Show email"
                                    >
                                      <Mail className={styles.quickActionIcon} />
                                    </button>
                                    <button
                                      onClick={() => handleDirectMessage(contact)}
                                      className={`${styles.quickActionBtn} ${styles.quickActionInline}`}
                                      aria-label="Send message"
                                    >
                                      <Send className={styles.quickActionIcon} />
                                    </button>
                                    <button
                                      onClick={() => handleContactInfo(contact.id, 'phone')}
                                      className={`${styles.quickActionBtn} ${styles.quickActionInline} ${showContactInfo[contact.id]?.type === 'phone' ? styles.quickActionBtnActive : ''}`}
                                      aria-label="Show phone"
                                    >
                                      <Phone className={styles.quickActionIcon} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          ) : (
            /* Requests View */
            <div className={styles.requestsViewContainer}>
              <h3 className={styles.requestsTitle}>Connection Requests</h3>
              {connectionRequests.length > 0 ? (
                <div className={styles.requestsList}>
                  {connectionRequests.map((request) => (
                    <div key={request.id} className={styles.requestCard}>
                      <div className={styles.requestUserInfo}>
                        <div className={styles.requestAvatar}>
                          {getInitials(request.name)}
                        </div>
                        <div>
                          <h4 className={styles.requestName}>{request.name}</h4>
                          <p className={styles.requestDetails}>{request.title} at {request.company}</p>
                        </div>
                      </div>
                      <div className={styles.requestActions}>
                        <button 
                          onClick={() => openApproveModal(request)}
                          style={{
                            background: 'linear-gradient(to bottom right, #1e3a8a, #2563eb)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontWeight: '500',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectRequest(request.id)}
                          className={styles.requestRejectButton}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noRequestsText}>No pending connection requests</p>
              )}
            </div>
          )}
        </div>
        
        {/* Message Modal */}
        {messageModal.isOpen && messageModal.contact && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>New Message to {messageModal.contact.name}</h3>
                <button onClick={handleCloseMessageModal} className={styles.modalCloseButton}>
                  <X className={styles.modalCloseIcon} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Type your message to ${messageModal.contact.name}...`}
                  className={styles.modalTextarea}
                />
              </div>
              <div className={styles.modalFooter}>
                <button onClick={handleCloseMessageModal} className={styles.modalCancelButton}>
                  Cancel
                </button>
                <button onClick={handleSendMessage} disabled={!messageText.trim()} className={styles.modalSendButton}>
                  <Send className={styles.modalSendIcon} />
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        {approveModal.isOpen && approveModal.request && (
          <Modal
            isOpen={approveModal.isOpen}
            onClose={closeApproveModal}
            title={`Approve connection with ${approveModal.request.name}?`}
            showActions={false}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p className={styles.modalBody}>
              Approving will allow this person to connect with you and see your card information, including your phone number, email, job title, and other shared details.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={closeApproveModal} className={styles.modalCancelButton} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button onClick={() => { const id = approveModal.request!.id; closeApproveModal(); handleApproveRequest(id); }} className={styles.modalSendButton} style={{ flex: 1 }}>
                  Approve
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}   