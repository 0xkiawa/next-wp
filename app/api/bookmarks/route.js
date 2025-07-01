import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Bookmark from '@/models/Bookmark';
import { withAuth } from '@/lib/auth';
import { getPostById } from '@/lib/wordpress';

// GET /api/bookmarks - Get all bookmarks for the current user
export const GET = withAuth(async (req) => {
  try {
    await dbConnect();
    const userId = req.user._id;
    
    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ bookmarks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
});

// POST /api/bookmarks - Create a new bookmark
export const POST = withAuth(async (req) => {
  try {
    await dbConnect();
    const userId = req.user._id;
    const { wpPostId, notes } = await req.json();
    
    if (!wpPostId) {
      return NextResponse.json(
        { error: 'WordPress Post ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the WordPress post exists
    try {
      const post = await getPostById(Number(wpPostId));
      
      // Create the bookmark with post metadata
      const bookmark = await Bookmark.create({
        userId,
        wpPostId: Number(wpPostId),
        postTitle: post.title.rendered,
        postSlug: post.slug,
        notes: notes || ''
      });
      
      return NextResponse.json({ bookmark }, { status: 201 });
    } catch (wpError) {
      console.error('Error fetching WordPress post:', wpError);
      return NextResponse.json(
        { error: 'Invalid WordPress Post ID or WordPress API error' },
        { status: 400 }
      );
    }
  } catch (error) {
    // Handle duplicate bookmark error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'You have already bookmarked this post' },
        { status: 409 }
      );
    }
    
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
});
