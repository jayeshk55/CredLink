"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  username?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  prefix?: string;
  suffix?: string;
  preferredName?: string;
  title?: string;
  company?: string;
  department?: string;
  headline?: string;
  location?: string;
  cardName?: string;
  cardType?: string;
  selectedDesign?: string;
  selectedColor?: string;
  selectedFont?: string;
  profileImage?: string;
  bannerImage?: string;
  bio?: string;
  emailLink?: string;
  phoneLink?: string;
}

export default function ProfilePage() {
  const { user: zustandUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/me', {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user profile:', data);
        setUserProfile(data.user);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch profile:', errorData);
        setError(errorData.error || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Error loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const user = userProfile || session?.user || zustandUser;

  const displayUser = user
    ? {
        name: (user as any).fullName || 
              (user as any).cardName || 
              `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() ||
              (user as any).name || 
              "Josh Hazelwood",
        email: (user as any).email || "josh@boostnow.com",
        jobTitle: (user as any)?.title || (user as any)?.jobTitle || "Software Designer",
        company: (user as any)?.company || "BoostNow LLP",
        location: (user as any)?.location || "California, USA",
        phone: (user as any)?.phone || "+1-555-0123",
        linkedin: (user as any)?.linkedin || (user as any)?.username || "josh-hazelwood",
        website: (user as any)?.website || "https://boostnow.com",
        profileImage: (user as any)?.profileImage || null,
        bannerImage: (user as any)?.bannerImage || null,
        selectedColor: (user as any)?.selectedColor || "#3b82f6",
        selectedFont: (user as any)?.selectedFont || "Arial, sans-serif",
        description: (user as any)?.bio ||
          (user as any)?.description ||
          (user as any)?.headline ||
          "A modern digital visiting card for software designer showcasing professional details, social links, and portfolio",
      }
    : {
        name: "Josh Hazelwood",
        email: "josh@boostnow.com",
        jobTitle: "Software Designer",
        company: "BoostNow LLP",
        location: "California, USA",
        phone: "+1-555-0123",
        linkedin: "josh-hazelwood",
        website: "https://boostnow.com",
        profileImage: null,
        bannerImage: null,
        selectedColor: "#3b82f6",
        selectedFont: "Arial, sans-serif",
        description:
          "A modern digital visiting card for software designer showcasing professional details, social links, and portfolio",
      };

  if (isLoading) return <p className="text-center mt-10">Loading your card...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 relative"
      style={{ background: "#f5f5f5" }}
    >
      {/* ✅ Logo at top-left */}
      <div className="absolute top-6 left-6">
        <Image
          src="/logo.jpg" // place your logo in /public folder
          alt="BoostNow Logo"
          width={140}
          height={40}
          className="object-contain"
        />
      </div>

      <div className="w-full max-w-md">
        {/* Main Card */}
        <div 
          className="relative p-10 text-white shadow-2xl min-h-[550px] flex flex-col items-center border-4 border-white"
          style={{
            background: `linear-gradient(to bottom right, ${displayUser.selectedColor}dd, ${displayUser.selectedColor})`,
            fontFamily: displayUser.selectedFont
          }}
        >

          {/* Background Image */}
          <div className="absolute top-6 left-6 right-6 h-32 bg-black/20 rounded-2xl overflow-hidden">
            {displayUser.bannerImage ? (
              <img 
                src={displayUser.bannerImage} 
                alt="Banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                {/* <span className="text-white/70 text-sm">Meeting Background</span> */}
              </div>
            )}
          </div>

          {/* ✅ Profile Image + Username */}
          <div className="relative z-10 flex flex-col items-center mt-40 mb-8">
            <div 
              className="w-28 h-28 bg-white rounded-full shadow-lg overflow-hidden translate-y-25"
              style={{ border: `4px solid ${displayUser.selectedColor}` }}
            >
              {displayUser.profileImage ? (
                <img
                  src={displayUser.profileImage}
                  alt={displayUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 text-2xl font-bold">
                    {displayUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
            </div>

            {/* Username below image */}
            <p className="text-white/90 text-sm font-medium mt-3">
              @{(userProfile?.username || displayUser.name || "JoshHazelwood")
                .replace(/\s+/g, "")
                .toLowerCase()}
            </p>
          </div>

          {/* Name */}
          <h1 
            className="text-3xl font-semi-bold text-center mb-4 translate-y-15"
            style={{ 
              color: 'white',
              fontFamily: displayUser.selectedFont 
            }}
          >
            {displayUser.name}
          </h1>

          {/* Job Title & Company */}
          <p 
            className="text-center mt-6 mb-1 translate-y-15"
            style={{ 
              color: 'white',
              fontFamily: displayUser.selectedFont 
            }}
          >
            {displayUser.jobTitle} | {displayUser.company}
          </p>

          {/* Location */}
          <p 
            className="text-center mb-10"
            style={{ 
              color: 'white',
              fontFamily: displayUser.selectedFont 
            }}
          >
            {displayUser.location}
          </p>

          {/* Contact Icons */}
          <div className="flex justify-center gap-5 mb-12 translate-y-5">
            <div className="p-1">
              <a
                href={`mailto:${displayUser.email}`}
                className="w-14 h-14 p-3 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition shadow-md"
              >
                <Mail className="w-6 h-6 text-white" />
              </a>
            </div>

            <div className="p-1">
              <a
                href={`tel:${displayUser.phone}`}
                className="w-14 h-14 p-3 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition shadow-md"
              >
                <Phone className="w-6 h-6 text-white" />
              </a>
            </div>

            <div className="p-1">
              <a
                href={`https://linkedin.com/in/${displayUser.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 p-3 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition shadow-md"
              >
                <Linkedin className="w-6 h-6 text-white" />
              </a>
            </div>

            <div className="p-1">
              <a
                href={displayUser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 p-3 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition shadow-md"
              >
                <Globe className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-center text-white text-base leading-relaxed mb-12 px-4 translate-y-10"
            style={{ fontFamily: "Times New Roman, Times, serif" }}
          >
            {displayUser.description}
          </p>

          {/* Buttons Section */}
          <div className="flex flex-col items-center gap-8 w-full translate-y-10">
            {/* Row 1 - 3 Buttons */}
            <div className="flex justify-center gap-5 w-full">
              <button 
                className="flex-1 py-15 rounded-lg text-base font-semibold hover:opacity-90 transition shadow-md"
                style={{ 
                  backgroundColor: 'white', 
                  color: displayUser.selectedColor 
                }}
              >
                Services
              </button>
              <button 
                className="flex-1 py-15 rounded-lg text-base font-semibold hover:opacity-90 transition shadow-md"
                style={{ 
                  backgroundColor: 'white', 
                  color: displayUser.selectedColor 
                }}
              >
                Portfolio
              </button>
              <button 
                className="flex-1 py-15 rounded-lg text-base font-semibold hover:opacity-90 transition shadow-md"
                style={{ 
                  backgroundColor: 'white', 
                  color: displayUser.selectedColor 
                }}
              >
                Links
              </button>
            </div>

            {/* Row 2 - 2 Buttons Centered */}
            <div className="flex justify-center gap-5 w-3/5">
              <button 
                className="flex-1 py-10 rounded-lg text-base font-semibold hover:opacity-90 transition shadow-md"
                style={{ 
                  backgroundColor: 'white', 
                  color: displayUser.selectedColor 
                }}
              >
                Experience
              </button>
              <button 
                className="flex-1 py-10 rounded-lg text-base font-semibold hover:opacity-90 transition shadow-md"
                style={{ 
                  backgroundColor: 'white', 
                  color: displayUser.selectedColor 
                }}
              >
                Review
              </button>
            </div>
          </div>
{/* <div>hello</div> */}

        </div>
      </div>
    </div>
  );
}
