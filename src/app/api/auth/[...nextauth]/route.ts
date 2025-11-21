import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        // Normalize email to lowercase for consistency
        const normalizedEmail = credentials.email.toLowerCase().trim()

        // Only allow active users to log in
        const user = await prisma.user.findFirst({
          where: { 
            email: normalizedEmail,
            status: 'active'
          }
        })

        if (!user) {
          throw new Error("No user found with this email")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          const email = (user.email || '').toLowerCase().trim()
          if (!email) return false

          let existing = await prisma.user.findUnique({ where: { email } })
          
          // Check if account exists but is deactivated
          if (existing && existing.status === 'inactive') {
            console.log('❌ Attempted login to deactivated account via Google:', email)
            return false
          }
          
          if (!existing) {
            const rawName = user.name || email.split('@')[0]
            // Create a URL-safe username base
            const base = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20) || 'user'
            let candidate = base
            let attempt = 0
            while (attempt < 5) {
              const found = await prisma.user.findUnique({ where: { username: candidate } })
              if (!found) break
              candidate = `${base}-${Math.floor(Math.random() * 1000)}`
              attempt++
            }
            const hashedTempPassword = await bcrypt.hash(randomUUID(), 10)
            existing = await prisma.user.create({
              data: {
                email,
                password: hashedTempPassword,
                fullName: rawName,
                username: candidate,
                status: 'active',
                cardName: rawName,
              }
            })
          }
          // Attach our internal id so jwt callback can persist it
          user.id = existing.id
        }
        return true
      } catch (e) {
        console.error('Google signIn error', e)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allow redirects to admin routes without authentication
      if (url.startsWith('/admin')) {
        return url
      }
      // Default redirect behavior
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }