// lib/email-verification.ts
import { prisma } from '@/lib/prisma';
import { sendEmailVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

/**
 * Generate a new email verification token and send verification email
 * 
 * @param userId User ID to generate token for
 * @param email Email address to send verification to
 * @param name User's name
 * @returns Object with success status and message
 */
export async function generateEmailVerificationToken(userId: string, email: string, name: string) {
  try {
    // Generate a secure random token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Update or create verification token
    await prisma.user.update({
      where: { id: userId },
      data: { 
        verificationToken: token
      }
    });
    
    // Send verification email
    await sendEmailVerificationEmail(email, name || "User", token);
    
    return { 
      success: true, 
      message: "Verification email sent successfully. Please check your inbox and spam folder." 
    };
  } catch (error) {
    console.error("Failed to generate verification token:", error);
    return { 
      success: false, 
      error: "Failed to send verification email. Please try again later." 
    };
  }
}

/**
 * Verify an email verification token
 * 
 * @param token Verification token to check
 * @returns Object with success status and message
 */
export async function verifyEmail(token: string) {
  try {
    // Find the user with this verification token
    const user = await prisma.user.findFirst({ 
      where: { verificationToken: token }
    });
    
    if (!user) {
      return { 
        success: false, 
        error: "Invalid or expired verification token" 
      };
    }
    
    // Mark the email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: new Date(),
        verificationToken: null
      }
    });
    
    return { 
      success: true, 
      message: "Email verified successfully! You may now log in." 
    };
  } catch (error) {
    console.error("Error verifying email:", error);
    return { 
      success: false, 
      error: "An error occurred while verifying your email. Please try again later." 
    };
  }
}

/**
 * Resend verification email for existing user
 * 
 * @param email Email address to resend verification to
 * @returns Object with success status and message
 */
export async function resendVerificationEmail(email: string) {
  try {
    // Find the user
    const user = await prisma.user.findUnique({ 
      where: { email }
    });
    
    if (!user) {
      // Return success anyway to prevent email enumeration
      return { 
        success: true, 
        message: "If an account exists with this email, a verification link has been sent." 
      };
    }
    
    // Check if already verified
    if (user.emailVerified) {
      return { 
        success: true, 
        message: "This email is already verified. You can login now." 
      };
    }
    
    // Generate a new token and send verification email
    return await generateEmailVerificationToken(user.id, user.email!, user.name || "User");
  } catch (error) {
    console.error("Error resending verification email:", error);
    return { 
      success: false, 
      error: "An error occurred. Please try again later." 
    };
  }
}