export interface User {
  id: string
  email: string
  phone?: string
  location?: string
  name: string
  avatar?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  id: string
  userId: string
  slug: string
  
  // Basic Info
  name: string
  photo?: string
  designation: string
  company?: string
  city: string
  
  // Professional Info
  about?: string
  services?: string[]
  skills?: string[]
  categories?: string[]
  pricing?: string
  
  // Credibility
  googleReviewLink?: string
  testimonialsLink?: string
  certificates?: string[]
  resume?: string
  
  // Experience
  experience?: Experience[]
  
  // Portfolio
  portfolioLinks?: PortfolioLink[]
  
  // Theme
  theme: ProfileTheme
  
  // Stats
  views: number
  qrScans: number
  buttonClicks: number
  
  // Status
  isPublished: boolean
  isPromoted: boolean
  promotionLevel?: 'standard' | 'featured' | 'premium'
  
  createdAt: Date
  updatedAt: Date
}

export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description?: string
}

export interface PortfolioLink {
  id: string
  platform: string
  url: string
  title: string
}

export interface ProfileTheme {
  primaryColor: string
  secondaryColor: string
  layout: 'modern' | 'classic' | 'minimal'
}

export interface Connection {
  id: string
  fromUserId: string
  toUserId: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: Date
}

export interface Promotion {
  id: string
  profileId: string
  level: 'standard' | 'featured' | 'premium'
  duration: number // days
  amount: number
  status: 'active' | 'expired' | 'pending'
  startDate: Date
  endDate: Date
  createdAt: Date
}

export interface Analytics {
  profileId: string
  views: number
  qrScans: number
  buttonClicks: number
  date: Date
}

export interface SearchFilters {
  category?: string
  location?: string
  verified?: boolean
  keyword?: string
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  message: string
  profileId: string
}
