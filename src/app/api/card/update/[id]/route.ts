import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET) as { userId: string };
    const { id: cardId } = await params;

    // Find existing card
    const existingCard = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!existingCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Verify ownership
    if (existingCard.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Not authorized to update this card' }, { status: 403 });
    }

    // Parse form data
    const formData = await req.formData();
    
    // Extract card fields
    const updateData: any = {};
    
    // Personal Information - Extract name fields
    const firstName = formData.get('firstName') as string;
    if (firstName !== null) updateData.firstName = firstName || undefined;
    
    const middleName = formData.get('middleName') as string;
    if (middleName !== null) updateData.middleName = middleName || undefined;
    
    const lastName = formData.get('lastName') as string;
    if (lastName !== null) updateData.lastName = lastName || undefined;
    
    // Construct fullName from firstName/middleName/lastName
    if (firstName !== null || middleName !== null || lastName !== null) {
      const names = [
        firstName || existingCard.firstName || '',
        middleName || existingCard.middleName || '',
        lastName || existingCard.lastName || ''
      ];
      updateData.fullName = names.filter(Boolean).join(' ').trim() || 'Unnamed';
    }
    
    const prefix = formData.get('prefix') as string;
    if (prefix !== null) updateData.prefix = prefix || undefined;
    
    const suffix = formData.get('suffix') as string;
    if (suffix !== null) updateData.suffix = suffix || undefined;
    
    const preferredName = formData.get('preferredName') as string;
    if (preferredName !== null) updateData.preferredName = preferredName || undefined;
    
    const maidenName = formData.get('maidenName') as string;
    if (maidenName !== null) updateData.maidenName = maidenName || undefined;
    
    const pronouns = formData.get('pronouns') as string;
    if (pronouns !== null) updateData.pronouns = pronouns || undefined;

    // Professional Information
    const title = formData.get('title') as string;
    if (title !== null) updateData.title = title || undefined;
    
    const company = formData.get('company') as string;
    if (company !== null) updateData.company = company || undefined;
    
    const department = formData.get('department') as string;
    if (department !== null) updateData.department = department || undefined;
    
    const affiliation = formData.get('affiliation') as string;
    if (affiliation !== null) updateData.affiliation = affiliation || undefined;
    
    const headline = formData.get('headline') as string;
    if (headline !== null) updateData.headline = headline || undefined;
    
    const accreditations = formData.get('accreditations') as string;
    if (accreditations !== null) updateData.accreditations = accreditations || undefined;

    // Contact Information
    const email = formData.get('email') as string;
    if (email !== null) updateData.email = email || undefined;
    
    const phone = formData.get('phone') as string;
    if (phone !== null) updateData.phone = phone || undefined;
    
    const emailLink = formData.get('emailLink') as string;
    if (emailLink !== null) updateData.emailLink = emailLink || undefined;
    
    const phoneLink = formData.get('phoneLink') as string;
    if (phoneLink !== null) updateData.phoneLink = phoneLink || undefined;
    
    const location = formData.get('location') as string;
    if (location !== null) updateData.location = location || undefined;
    
    const linkedinUrl = formData.get('linkedinUrl') as string;
    if (linkedinUrl !== null) updateData.linkedinUrl = linkedinUrl || undefined;
    
    const websiteUrl = formData.get('websiteUrl') as string;
    if (websiteUrl !== null) updateData.websiteUrl = websiteUrl || undefined;

    // Card Customization
    const cardName = formData.get('cardName') as string;
    if (cardName !== null) updateData.cardName = cardName || undefined;
    
    const cardType = formData.get('cardType') as string;
    if (cardType !== null) updateData.cardType = cardType || undefined;
    
    const selectedDesign = formData.get('selectedDesign') as string;
    if (selectedDesign !== null) updateData.selectedDesign = selectedDesign || undefined;
    
    const selectedColor = formData.get('selectedColor') as string;
    if (selectedColor !== null) updateData.selectedColor = selectedColor || undefined;
    
    const selectedColor2 = formData.get('selectedColor2') as string;
    if (selectedColor2 !== null) updateData.selectedColor2 = selectedColor2 || undefined;
    
    const selectedFont = formData.get('selectedFont') as string;
    if (selectedFont !== null) updateData.selectedFont = selectedFont || undefined;

    // Content
    const bio = formData.get('bio') as string;
    if (bio !== null) updateData.bio = bio || undefined;
    
    const description = formData.get('description') as string;
    if (description !== null) updateData.description = description || undefined;

    // Card Sections
    const skills = formData.get('skills') as string;
    if (skills !== null) updateData.skills = skills || undefined;
    
    const portfolio = formData.get('portfolio') as string;
    if (portfolio !== null) updateData.portfolio = portfolio || undefined;
    
    const experience = formData.get('experience') as string;
    if (experience !== null) updateData.experience = experience || undefined;
    
    const services = formData.get('services') as string;
    if (services !== null) updateData.services = services || undefined;
    
    const review = formData.get('review') as string;
    if (review !== null) updateData.review = review || undefined;

    // Status
    const status = formData.get('status') as string;
    if (status !== null) updateData.status = status;

    // Handle document upload (optional)
    const documentFile = formData.get('document') as File;
    if (documentFile && documentFile.size > 0) {
      const buffer = Buffer.from(await documentFile.arrayBuffer());
      const uploadResult: any = await uploadToCloudinary(buffer, {
        folder: 'credlink/cards/documents',
        public_id: `${decoded.userId}_document_${Date.now()}`,
      });
      updateData.documentUrl = uploadResult.secure_url;
    }

    // Handle profile image upload
    const profileImageFile = formData.get('profileImage') as File;
    if (profileImageFile && profileImageFile.size > 0) {
      // Delete old image if exists
      if (existingCard.profileImage) {
        try {
          const publicId = existingCard.profileImage.split('/').slice(-2).join('/').split('.')[0];
          await deleteFromCloudinary(publicId);
        } catch (err) {
          console.error('Error deleting old profile image:', err);
        }
      }
      
      // Upload new image
      const buffer = Buffer.from(await profileImageFile.arrayBuffer());
      const uploadResult: any = await uploadToCloudinary(buffer, {
        folder: 'credlink/cards/profiles',
        public_id: `${decoded.userId}_profile_${Date.now()}`,
      });
      updateData.profileImage = uploadResult.secure_url;
    }

    // Handle banner image upload
    const bannerImageFile = formData.get('bannerImage') as File;
    if (bannerImageFile && bannerImageFile.size > 0) {
      // Delete old image if exists
      if ((existingCard as any).bannerImage) {
        try {
          const publicId = (existingCard as any).bannerImage.split('/').slice(-2).join('/').split('.')[0];
          await deleteFromCloudinary(publicId);
        } catch (err) {
          console.error('Error deleting old banner image:', err);
        }
      }
      
      // Upload new image
      const buffer = Buffer.from(await bannerImageFile.arrayBuffer());
      const uploadResult: any = await uploadToCloudinary(buffer, {
        folder: 'credlink/cards/banners',
        public_id: `${decoded.userId}_banner_${Date.now()}`,
      });
      updateData.bannerImage = uploadResult.secure_url;
    }

    // Handle cover image upload
    const coverImageFile = formData.get('coverImage') as File;
    if (coverImageFile && coverImageFile.size > 0) {
      // Delete old image if exists
      if (existingCard.coverImage) {
        try {
          const publicId = existingCard.coverImage.split('/').slice(-2).join('/').split('.')[0];
          await deleteFromCloudinary(publicId);
        } catch (err) {
          console.error('Error deleting old cover image:', err);
        }
      }
      
      // Upload new image
      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      const uploadResult: any = await uploadToCloudinary(buffer, {
        folder: 'credlink/cards/covers',
        public_id: `${decoded.userId}_cover_${Date.now()}`,
      });
      updateData.coverImage = uploadResult.secure_url;
    }

    // Update card
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Card updated successfully',
      card: updatedCard 
    });

  } catch (error: any) {
    console.error("Error updating card:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to update card" 
    }, { status: 500 });
  }
}

// DELETE card
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET) as { userId: string };
    const { id: cardId } = await params;

    // Find existing card
    const existingCard: any = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!existingCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Verify ownership
    if (existingCard.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Not authorized to delete this card' }, { status: 403 });
    }

    // Delete images from Cloudinary
    const deletePromises = [];
    
    if (existingCard.profileImage) {
      try {
        const publicId = existingCard.profileImage.split('/').slice(-2).join('/').split('.')[0];
        deletePromises.push(deleteFromCloudinary(publicId));
      } catch (err) {
        console.error('Error deleting profile image:', err);
      }
    }
    
    if (existingCard.bannerImage) {
      try {
        const publicId = existingCard.bannerImage.split('/').slice(-2).join('/').split('.')[0];
        deletePromises.push(deleteFromCloudinary(publicId));
      } catch (err) {
        console.error('Error deleting banner image:', err);
      }
    }
    
    if (existingCard.coverImage) {
      try {
        const publicId = existingCard.coverImage.split('/').slice(-2).join('/').split('.')[0];
        deletePromises.push(deleteFromCloudinary(publicId));
      } catch (err) {
        console.error('Error deleting cover image:', err);
      }
    }

    await Promise.allSettled(deletePromises);

    // Delete card from database
    await prisma.card.delete({
      where: { id: cardId }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Card deleted successfully'
    });

  } catch (error: any) {
    console.error("Error deleting card:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to delete card" 
    }, { status: 500 });
  }
}
