import { NextResponse } from 'next/server';
import { getPresignedDownloadUrl } from '@/lib/s3';

export async function GET() {
  // Update the file key to the name of your MP3 file
  const fileKey = "Denzel and Asap Convo.mp3"; 
  
  try {
    const presignedUrl = await getPresignedDownloadUrl(fileKey);
    return NextResponse.json({ url: presignedUrl });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ url: '' }, { status: 500 });
  }
}