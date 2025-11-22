import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { adminStorageBucket } from "@/lib/firebase-admin";
import mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key';

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"] as const;
type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

function getExtension(fileName: string | null): AllowedExtension | null {
  if (!fileName) return null;
  const parts = fileName.toLowerCase().split(".");
  if (parts.length < 2) return null;
  const ext = parts.pop() as string;
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(ext) ? (ext as AllowedExtension) : null;
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET) as { userId: string };
    
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log('File upload received:', {
      name: (file as any).name,
      type: file.type,
      size: file.size
    });

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
    }

    const originalName = (file as any).name || null;
    const ext = getExtension(originalName);
    
    if (!ext) {
      return NextResponse.json({ 
        error: "Unsupported file type. Please upload PDF, DOC, or DOCX files." 
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    let finalBuffer = buffer;
    let contentType = 'application/pdf';

    // Convert DOC/DOCX to PDF
    if (ext === 'doc' || ext === 'docx') {
      console.log(`Converting ${ext.toUpperCase()} to PDF...`, { fileSize: buffer.length });
      
      try {
        // Extract text and basic formatting from DOCX
        const result = await mammoth.extractRawText({ buffer });
        const text = result.value;
        
        console.log('Extracted text from DOCX, length:', text.length);
        
        // Create PDF from extracted text
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        const fontSize = 11;
        const margin = 50;
        const pageWidth = 595.28; // A4 width in points
        const pageHeight = 841.89; // A4 height in points
        const maxWidth = pageWidth - (margin * 2);
        const lineHeight = fontSize * 1.5;
        
        let page = pdfDoc.addPage([pageWidth, pageHeight]);
        let yPosition = pageHeight - margin;
        
        // Split text into lines that fit the page width
        const words = text.split(/\s+/);
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth && currentLine) {
            // Draw current line
            page.drawText(currentLine, {
              x: margin,
              y: yPosition,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            });
            
            yPosition -= lineHeight;
            currentLine = word;
            
            // Add new page if needed
            if (yPosition < margin) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              yPosition = pageHeight - margin;
            }
          } else {
            currentLine = testLine;
          }
        }
        
        // Draw the last line
        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
        }
        
        const pdfBytes = await pdfDoc.save();
        finalBuffer = Buffer.from(pdfBytes);
        
        console.log('Conversion successful!', { pdfSize: finalBuffer.length });
      } catch (error: any) {
        console.error('DOCX conversion error:', {
          message: error.message,
          stack: error.stack,
          fileExtension: ext,
          fileSize: buffer.length
        });
        
        return NextResponse.json({ 
          error: `Failed to convert ${ext.toUpperCase()} to PDF. The file may be corrupted or in an invalid format. Error: ${error.message}`
        }, { status: 500 });
      }
    } else if (ext === 'pdf') {
      console.log('PDF file uploaded directly, no conversion needed');
    }

    // Generate file path
    const timestamp = Date.now();
    const safeName = (originalName || 'document').replace(/[^a-z0-9.]+/gi, '-').toLowerCase();
    const pdfFileName = safeName.replace(/\.(doc|docx)$/i, '.pdf');
    const filePath = `cards/documents/${decoded.userId}/${timestamp}-${pdfFileName}`;

    // Upload to Firebase Storage
    const bucket = adminStorageBucket();
    if (!bucket) {
      return NextResponse.json({ error: 'Firebase Storage not available during build' }, { status: 503 });
    }
    const fileRef = bucket.file(filePath);

    await fileRef.save(finalBuffer, {
      resumable: false,
      metadata: {
        contentType: contentType,
        metadata: {
          originalName: originalName || 'document',
          uploadedBy: decoded.userId,
          uploadedAt: new Date().toISOString(),
        }
      },
    });

    // Get signed URL with long expiration
    const [signedUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '2100-01-01',
    });

    return NextResponse.json(
      {
        success: true,
        url: signedUrl,
        message: ext === 'pdf' ? 'PDF uploaded successfully' : 'Document converted to PDF and uploaded successfully'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process document" },
      { status: 500 }
    );
  }
}
