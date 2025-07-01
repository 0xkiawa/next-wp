import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { withAuth } from '@/lib/auth';

async function handler(request) {
  await dbConnect();
  
  // Return the user data (excluding password)
  return NextResponse.json({
    success: true,
    user: request.user
  });
}

export const GET = withAuth(handler);