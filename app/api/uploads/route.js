import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Upload from '@/models/Upload';
import { withAuth } from '@/lib/auth';
import { getPresignedUploadUrl, deleteFileFromS3 } from '@/lib/s3';

// GET /api/uploads - Get all uploads for the current user
export const GET = withAuth(async (req) => {
  try {
    await dbConnect();
    const userId = req.user._id;
    const { searchParams } = new URL(req.url);
    const context = searchParams.get('context');
    const contextId = searchParams.get('contextId');
    
    // Build query based on parameters
    const query = { userId };
    if (context) query.context = context;
    if (contextId) query.contextId = contextId;
    
    const uploads = await Upload.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ uploads }, { status: 200 });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch uploads' },
      { status: 500 }
    );
  }
});

// POST /api/uploads/presigned - Get a presigned URL for uploading
export const POST = withAuth(async (req) => {
  try {
    const { fileName, fileType, context, contextId, wpPostId } = await req.json();
    
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'File name and type are required' },
        { status: 400 }
      );
    }
    
    // Determine the folder based on context
    let folder = 'uploads';
    if (context === 'avatar') folder = 'avatars';
    else if (context === 'commentAttachment') folder = 'comments';
    else if (context === 'blogAsset' && wpPostId) folder = `posts/${wpPostId}`;
    
    // Generate presigned URL
    const { presignedUrl, fileKey, fileUrl } = await getPresignedUploadUrl(
      fileName,
      fileType,
      folder
    );
    
    return NextResponse.json({
      presignedUrl,
      fileKey,
      fileUrl,
      // Include additional data for client to use when confirming upload
      uploadData: {
        userId: req.user._id,
        fileName,
        fileType,
        context: context || null,
        contextId: contextId || null,
        wpPostId: wpPostId || null
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
});

// POST /api/uploads/confirm - Confirm an upload and save to database
export const confirmUpload = withAuth(async (req) => {
  try {
    await dbConnect();
    const userId = req.user._id;
    const {
      fileKey,
      fileUrl,
      fileName,
      fileType,
      fileSize,
      context,
      contextId,
      wpPostId
    } = await req.json();
    
    if (!fileKey || !fileUrl || !fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { error: 'Missing required upload information' },
        { status: 400 }
      );
    }
    
    // Create upload record in database
    const upload = await Upload.create({
      userId,
      fileName,
      fileUrl,
      fileType,
      fileSize,
      context: context || null,
      contextId: contextId || null
    });
    
    return NextResponse.json({ upload }, { status: 201 });
  } catch (error) {
    console.error('Error confirming upload:', error);
    return NextResponse.json(
      { error: 'Failed to confirm upload' },
      { status: 500 }
    );
  }
});

// DELETE /api/uploads/:id - Delete an upload
export const DELETE = withAuth(async (req) => {
  try {
    await dbConnect();
    const userId = req.user._id;
    
    // Extract upload ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }
    
    // Find the upload
    const upload = await Upload.findById(id);
    
    if (!upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the owner of the upload
    if (upload.userId.toString() !== userId.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this upload' },
        { status: 403 }
      );
    }
    
    // Extract the file key from the URL
    const fileKey = upload.fileUrl.split('/').slice(-2).join('/');
    
    // Delete from S3
    await deleteFileFromS3(fileKey);
    
    // Delete from database
    await upload.deleteOne();
    
    return NextResponse.json(
      { message: 'Upload deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting upload:', error);
    return NextResponse.json(
      { error: 'Failed to delete upload' },
      { status: 500 }
    );
  }
});