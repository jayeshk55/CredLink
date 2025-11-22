import { NextRequest, NextResponse } from "next/server";
import { adminStorageBucket } from "@/lib/firebase-admin";

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "ppt", "pptx"] as const;

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
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const originalName = (file as any).name || null;
    const ext = getExtension(originalName);
    if (!ext) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const safeName = (originalName || 'document').replace(/[^a-z0-9.]+/gi, '-').toLowerCase();
    const filePath = `uploads/documents/${timestamp}-${safeName}`;

    const fileRef = adminStorageBucket().file(filePath);

    await fileRef.save(buffer, {
      resumable: false,
      metadata: {
        contentType: file.type || 'application/octet-stream',
      },
    });

    const [signedUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '2100-01-01',
    });

    return NextResponse.json(
      {
        success: true,
        url: signedUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload document" },
      { status: 500 }
    );
  }
}
