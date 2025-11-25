import * as jwt from 'jsonwebtoken'
import { SignOptions } from 'jsonwebtoken'

function getJwtSecret(): string {
  return process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key'
}

const JWT_SECRET: string = getJwtSecret()

export function signToken(payload: object, options: SignOptions = { expiresIn: '3000d' }) {
  return jwt.sign(payload, JWT_SECRET, options)
}

export function verifyToken(token: string){
  return jwt.verify(token, JWT_SECRET)
}

export function verifyUserToken(token: string){
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

export function verifyAdminToken(token: string){
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}