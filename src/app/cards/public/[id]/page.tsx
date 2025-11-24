"use client";

import styles from "./publiccard.module.css";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { X, Users, Mail, Phone } from "lucide-react";
import DigitalCardPreview from "@/components/cards/DigitalCardPreview";
import FlatCardPreview from "@/components/cards/FlatCardPreview";
import ModernCardPreview from "@/components/cards/ModernCardPreview";
import SleekCardPreview from "@/components/cards/SleekCardPreview";

// ----------------- Card Type Definition -----------------
interface Card {
  id: string;
  fullName?: string;
  name?: string;
  title?: string;
  company?: string;
  location?: string;
  about?: string;
  bio?: string;
  description?: string;
  skills?: string;
  portfolio?: string;
  experience?: string;
  photo?: string;
  profileImage?: string;
  cover?: string;
  coverImage?: string;
  bannerImage?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  linkedinUrl?: string;
  website?: string;
  websiteUrl?: string;
  selectedDesign?: string;
  selectedColor?: string;
  selectedColor2?: string;
  selectedFont?: string;
  cardType?: string;
  views?: number;
  boost?: "Active" | "Inactive";
  user?: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
}

// ----------------- Connection Form Data -----------------
interface ConnectionFormData {
  name: string;
  phone: string;
  email: string;
}

// ----------------- Card Preview Component -----------------
const CardPreview: React.FC<{ card: Card }> = ({ card }) => {
  const renderCardPreview = () => {
    const commonProps = {
      name: card.fullName || card.name || '',
      title: card.title || '',
      company: card.company || '',
      location: card.location || '',
      about: card.bio || card.about || card.description || '',
      skills: card.skills || '',
      portfolio: card.portfolio || '',
      experience: card.experience || '',
      photo: card.profileImage || card.photo || '',
      cover: card.coverImage || card.bannerImage || card.cover || '',
      email: card.email || '',
      phone: card.phone || '',
      linkedin: card.linkedinUrl || card.linkedin || '',
      website: card.websiteUrl || card.website || '',
      themeColor1: card.selectedColor || '#3b82f6',
      themeColor2: card.selectedColor2 || '#2563eb',
     // cardType: card.cardType || '',
    };

    const design = card.selectedDesign || 'Classic';
    
    switch (design) {
      case 'Flat':
        return <FlatCardPreview {...commonProps} />;
      case 'Modern':
        return <ModernCardPreview {...commonProps} />;
      case 'Sleek':
        return <SleekCardPreview {...commonProps} />;
      case 'Classic':
      default:
        return <DigitalCardPreview {...commonProps} design={design} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={styles.cardPreviewArea}
      style={{ maxWidth: '360px' }}
    >
      {renderCardPreview()}
    </motion.div>
  );
};

// ----------------- Connection Modal Component -----------------
const ConnectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ConnectionFormData) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<ConnectionFormData>({
    name: '',
    phone: '',
    email: ''
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', email: '' });
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Different animations for mobile vs desktop
  const modalVariants = isMobile 
    ? {
        initial: { opacity: 0, y: "100%" },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "100%" }
      }
    : {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 }
      };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.modalOverlay}
        onClick={onClose}
      >
        <motion.div
          initial={modalVariants.initial}
          animate={modalVariants.animate}
          exit={modalVariants.exit}
          transition={{ 
            type: isMobile ? "tween" : "spring", 
            stiffness: 300, 
            damping: 30,
            duration: isMobile ? 0.3 : undefined
          }}
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className={styles.closeButton}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>

          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Let's Connect!</h2>
            <p className={styles.modalSubtitle}>
              Share your contact details to connect with this professional
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={styles.formInput}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={styles.formInput}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={styles.formInput}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ----------------- Main Public Card Page -----------------
const PublicCardPage = () => {
  const params = useParams();
  const cardId = params.id as string;
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Fetching public card with ID:', cardId);
        
        // For now, we'll use the same API endpoint as the private card
        // In a real implementation, you might want a separate public API endpoint
        const response = await fetch(`/api/card/${cardId}`);
        
        if (!response.ok) {
          throw new Error('Card not found');
        }

        const data = await response.json();
        
        if (data.success && data.card) {
          console.log('✅ Fetched public card:', data.card);
          
          // Check if card is active (not paused)
          if (data.card.cardActive === false) {
            toast.error('This card has been deactivated by the owner', {
              duration: 5000,
              icon: '🚫',
            });
            setCard(null);
            setIsLoading(false);
            return;
          }
          
          setCard(data.card);
          
          // Increment view count for public access
          try {
            await fetch(`/api/card/${cardId}/view`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
          } catch (viewError) {
            console.warn('Failed to increment view count:', viewError);
          }
        } else {
          throw new Error('Card not found');
        }
      } catch (error: any) {
        console.error('❌ Error fetching public card:', error);
        setCard(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

  const handleConnectClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  };

  const handleFormSubmit = async (formData: ConnectionFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('📝 Submitting connection request:', {
        cardId,
        ...formData
      });

      const response = await fetch(`/api/cards/${cardId}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sourceUrl: typeof window !== 'undefined' ? window.location.href : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit connection request');
      }

      toast.success(result.message || 'Thank you for connecting!', {
        duration: 4000,
        position: 'top-center',
      });
      
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('❌ Error submitting connection request:', error);
      
      // Handle specific error cases
      if (error.message.includes('already submitted')) {
        toast.error('You have already submitted a connection request for this card.');
      } else if (error.message.includes('Invalid input')) {
        toast.error('Please check your input and try again.');
      } else {
        toast.error(error.message || 'Failed to submit connection request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading card...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>Card Unavailable</h1>
          <p className={styles.errorMessage}>
            This card has been deactivated by the owner or does not exist.
          </p>
          <a href="/" className={styles.errorButton}>
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.contentWrapper}
      >
        {/* Card Preview */}
        <CardPreview card={card} />

        {/* Connect Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          onClick={handleConnectClick}
          className={styles.connectButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Users size={20} />
          Let's Connect
        </motion.button>
      </motion.div>

      {/* Connection Modal */}
      <ConnectionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PublicCardPage;
