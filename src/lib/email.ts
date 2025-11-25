import nodemailer from 'nodemailer'

// In production we must have real SMTP creds; in non-production we can fallback to Ethereal
const createTransporter = async () => {
  const hasCreds = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)

  if (!hasCreds) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP credentials (SMTP_USER/SMTP_PASS) are missing in production. Configure Hostinger SMTP before sending emails.')
    }
    // Development / testing fallback: Ethereal ephemeral SMTP
    const testAccount = await nodemailer.createTestAccount()
    console.warn('⚠️ SMTP credentials missing; using Ethereal test account. Set SMTP_USER/SMTP_PASS for production.')
    console.warn(`🔍 Preview emails at: https://ethereal.email/messages (login: ${testAccount.user})`)
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    })
  }

  const host = process.env.SMTP_HOST || 'smtp.hostinger.com'
  const port = parseInt(process.env.SMTP_PORT || '587')
  // If explicit secure flag provided use it; otherwise auto true for port 465
  const explicitSecure = process.env.SMTP_SECURE
  const secure = explicitSecure ? explicitSecure === 'true' : port === 465

  // Basic validation to catch common misconfiguration where an email is placed in SMTP_HOST
  if (host.includes('@')) {
    throw new Error(`Invalid SMTP_HOST '${host}'. Use the mail server hostname (e.g. smtp.hostinger.com), not an email address.`)
  }
  if (!/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(host)) {
    console.warn(`⚠️ SMTP_HOST '${host}' does not look like a valid hostname. Check your .env.`)
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
    },
  })
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = await createTransporter()
    
    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || 'MyKard',
        address: process.env.SMTP_FROM || process.env.SMTP_USER || '',
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', result.messageId)
    // If using Ethereal, output preview URL
    if (nodemailer.getTestMessageUrl(result)) {
      console.log('🔗 Ethereal preview URL:', nodemailer.getTestMessageUrl(result))
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    throw new Error('Failed to send email')
  }
}

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  userName?: string
): Promise<void> => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - MyKard</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MyKard</h1>
          <h2>Password Reset Request</h2>
        </div>
        <div class="content">
          <p>Hello${userName ? ` ${userName}` : ''},</p>
          
          <p>We received a request to reset your password for your MyKard account. If you didn't make this request, you can safely ignore this email.</p>
          
          <p>To reset your password, click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px;">
            ${resetUrl}
          </p>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
          </div>
          
          <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
          
          <p>Best regards,<br>The MyKard Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}. If you didn't request a password reset, please ignore this email.</p>
          <p>© 2024 MyKard. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    MyKard - Password Reset Request
    
    Hello${userName ? ` ${userName}` : ''},
    
    We received a request to reset your password for your MyKard account.
    
    To reset your password, visit this link:
    ${resetUrl}
    
    This link will expire in 1 hour for security reasons.
    
    If you didn't request this password reset, you can safely ignore this email.
    
    Best regards,
    The MyKard Team
  `

  await sendEmail({
    to: email,
    subject: 'Reset Your MyKard Password',
    html,
    text,
  })
}
