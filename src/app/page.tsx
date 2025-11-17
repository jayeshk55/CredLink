"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Header } from "@/components/layout/header"
import Homepage from "@/components/Homepage"
import Footer from "@/components/Footer"

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated, checkAuth, isLoading } = useAuth()

  useEffect(() => {
    // Only check auth once on mount
    checkAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Don't auto-redirect - let users navigate manually
  // The header will show "Dashboard" button if authenticated

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Homepage />
      </main>
      <Footer />
    </div>
  )
}
