import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    const fileExtension = path.extname(file.name).toLowerCase();

    if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only .jpg, .jpeg, and .png files are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, filename);

    // Write file
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
