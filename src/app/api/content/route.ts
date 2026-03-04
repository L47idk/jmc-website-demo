import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'src/data/site-content.json');

export async function GET() {
  try {
    const data = await fs.readFile(CONTENT_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading content file:', error);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newContent = await request.json();
    await fs.writeFile(CONTENT_FILE, JSON.stringify(newContent, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing content file:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
