 "use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "react-hot-toast";
import DigitalCardPreview, { DigitalCardProps } from "@/components/cards/DigitalCardPreview";
import FlatCardPreview from '@/components/cards/FlatCardPreview';
import ModernCardPreview from "@/components/cards/ModernCardPreview";
import SleekCardPreview from "@/components/cards/SleekCardPreview";

// ----------------- Card Type Definition -----------------
interface Card {
  id: string | number;
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
  services?: string;
  review?: string;
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
}

// ----------------- Card Preview Renderer (Exact Copy from Edit Page) -----------------
const renderCardPreview = (card: Card) => {
  // Use EXACT same prop mapping as edit page
  const commonProps = {
    name: card.fullName || card.name || '',
    title: card.title || '',
    company: card.company || '',
    location: card.location || '',
    about: card.bio || card.about || card.description || '',
    skills: card.skills || 'SEO, Content Creation, Analytics, Social Media',
    portfolio: card.portfolio || '[Link] Latest Campaigns',
    experience: card.experience || `${card.title || 'Lead SEO Specialist'}${card.company ? ` @ ${card.company}` : ''} (2021-Present)`,
    services: card.services || '',
    review: card.review || '',
    photo: card.profileImage || card.photo || '',
    cover: card.coverImage || card.bannerImage || card.cover || '',
    email: card.email || '',
    phone: card.phone || '',
    linkedin: card.linkedinUrl || card.linkedin || '',
    website: card.websiteUrl || card.website || '',
    themeColor1: card.selectedColor || '#3b82f6',
    themeColor2: card.selectedColor2 || '#2563eb',
    fontFamily: card.selectedFont || 'system-ui, sans-serif',
    cardType: card.cardType || '',
  };

  const selectedDesign = card.selectedDesign || 'Classic';
  
  // Use EXACT same switch logic as edit page
  switch (selectedDesign) {
    case 'Flat':
      return <FlatCardPreview {...commonProps} />;
    case 'Modern':
      return <ModernCardPreview {...commonProps} />;
    case 'Sleek':
      return <SleekCardPreview {...commonProps} />;
    case 'Classic':
    default:
      return <DigitalCardPreview {...commonProps} />;
  }
};

// ----------------- Main Dashboard -----------------
const Dashboard = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
 const [cardsData, setCardsData] = useState<Card[]>([]);
 const [isLoadingCards, setIsLoadingCards] = useState(false);

 useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchCards();
    }
 }, [isAuthenticated, isLoading]);

 const fetchCards = async () => {
   try {
    setIsLoadingCards(true);
    const response = await fetch('/api/card', {
      method: 'GET',
      credentials: 'include', // Important: include cookies
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.success) {
      console.log('✅ Fetched cards:', data.cards);
      console.log('🎨 Design values:', data.cards.map((c: any) => ({ id: c.id, design: c.selectedDesign })));
      setCardsData(data.cards);
      toast.success(`Loaded ${data.count} card(s)`);
    } else {
      toast.error(data.error || 'Failed to fetch cards');
    }
   } catch (error: any) {
     console.error('Error fetching cards:', error);
     toast.error(error.message || 'Failed to fetch cards');
   } finally {
     setIsLoadingCards(false);
   }
  };
  const cards: Card[] = [
    {
      id: 'demo',
      name: "Demo Card",
      title: "Sample Title",
      company: "Sample Company",
      location: "Sample Location",
      about: "This is a demo card showing how your card will look",
      skills: "Sample Skills",
      portfolio: "Sample Portfolio",
      experience: "Sample Experience",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      email: "demo@example.com",
      phone: "+1-555-0000",
      linkedin: "https://linkedin.com",
      website: "https://example.com",
      cardType: "Demo",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-8 sm:px-14 py-8 lg:ml-64 transition-all duration-300">
      {/* Create New Card Button */}
      <div className="flex justify-center my-6">
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow:
              "0 20px 40px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.3)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/dashboard/create")}
          style={{
            background: 'linear-gradient(to bottom right, #1e3a8a, #2563eb)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiPlus size={16} />
          Create New Card
        </motion.button>
      </div>

      {/* Invisible container for vertical spacing */}
      <div className="h-10"></div>

      {/* Cards Bento Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mt-4" style={{ columnGap: '1.5rem' }}>
        {isLoadingCards ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cards...</p>
          </div>
        ) : cardsData.length > 0 ? (
          cardsData.map((card, index) => {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                }}
                className="transition-all duration-300 cursor-pointer break-inside-avoid mb-6 block w-full"
                style={{ marginBottom: '1.5rem' }}
                onClick={() => router.push(`/cards/${card.id}`)}
              >
{renderCardPreview(card)}
              </motion.div>
            );
          })
        ) : (
          <>
            <div className="w-full flex justify-center py-4 break-inside-avoid">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm shadow-sm">
                <span>⚠️</span>
                <span>Showing demo card - No cards found in database</span>
              </div>
            </div>
            <div className="w-full flex justify-center break-inside-avoid">
              <motion.div
                key={cards[0].id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                }}
                className="transition-all duration-300 cursor-pointer"
                style={{ marginBottom: '1.5rem' }}
              >
                {renderCardPreview(cards[0])}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
