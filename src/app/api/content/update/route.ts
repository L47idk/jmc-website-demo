import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { jsonPath, value } = await req.body ? await req.json() : {};

    if (!jsonPath) {
      return NextResponse.json({ error: 'Missing jsonPath' }, { status: 400 });
    }

    const contentPath = path.join(process.cwd(), 'src', 'data', 'site-content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

    // Helper to set nested property
    const setNestedProperty = (obj: any, path: string, value: any) => {
      const parts = path.split('.');
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current)) current[part] = {};
        current = current[part];
      }
      current[parts[parts.length - 1]] = value;
    };

    setNestedProperty(content, jsonPath, value);

    // Write back to file
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
