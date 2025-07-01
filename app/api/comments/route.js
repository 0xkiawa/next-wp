import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import { withAuth } from '@/lib/auth';
import { getPostById } from '@/lib/wordpress';

// GET /api/comments?postId=123 - Get comments for a specific WordPress post
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const wpPostId = searchParams.get('postId');
    
    if (!wpPostId) {
      return NextResponse.json(
        { error: 'WordPress Post ID is required' },
        { status: 400 }
      );
    }
    
    // Get all top-level comments for this post (parentId is null)
    const comments = await Comment.find({
      wpPostId: Number(wpPostId),
      parentId: null
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'username') // Populate user info
      .lean();
    
    // For each top-level comment, get its replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentId: comment._id
        })
          .sort({ createdAt: 1 })
          .populate('userId', 'username')
          .lean();
        
        return { ...comment, replies };
      })
    );
    
    return NextResponse.json({ comments: commentsWithReplies }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a new comment
export const POST = withAuth(async (req) => {
  try {
    await dbConnect();
    const userId = req.user._id;
    const { wpPostId, content, parentId } = await req.json();
    
    if (!wpPostId || !content) {
      return NextResponse.json(
        { error: 'WordPress Post ID and content are required' },
        { status: 400 }
      );
    }
    
    // Verify the WordPress post exists
    try {
      await getPostById(Number(wpPostId));
    } catch (wpError) {
      console.error('Error fetching WordPress post:', wpError);
      return NextResponse.json(
        { error: 'Invalid WordPress Post ID or WordPress API error' },
        { status: 400 }
      );
    }
    
    // If this is a reply, verify the parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
      
      // Ensure the parent comment is for the same post
      if (parentComment.wpPostId !== Number(wpPostId)) {
        return NextResponse.json(
          { error: 'Parent comment does not belong to the specified post' },
          { status: 400 }
        );
      }
    }
    
    // Create the comment
    const comment = await Comment.create({
      userId,
      wpPostId: Number(wpPostId),
      content,
      parentId: parentId || null
    });
    
    // Populate the user info
    await comment.populate('userId', 'username');
    
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
});

// DELETE /api/comments/:id - Delete a comment
export const DELETE = withAuth(async (req) => {
  try {
    await dbConnect();
    const userId = req.user._id;
    
    // Extract comment ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }
    
    // Find the comment
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this comment' },
        { status: 403 }
      );
    }
    
    // Delete the comment and its replies
    await Comment.deleteMany({
      $or: [{ _id: id }, { parentId: id }]
    });
    
    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
});