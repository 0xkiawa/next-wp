import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Bookmark from '@/models/Bookmark';
import { withAuth } from '@/lib/auth';

// DELETE /api/bookmarks/:id - Delete a bookmark
export const DELETE = withAuth(async (req) => {  // Remove { params } destructuring
  try {
    await dbConnect();
    const userId = req.user._id;
    
    // Extract bookmark ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Bookmark ID is required' },
        { status: 400 }
      );
    }
    
    // Find and delete the bookmark, ensuring it belongs to the current user
    const bookmark = await Bookmark.findOneAndDelete({
      _id: id,
      userId
    });
    
    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Bookmark deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
});