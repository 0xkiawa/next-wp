const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'], // The user who uploaded the file
        index: true
    },
    fileName: {
        type: String,
        required: [true, 'Filename is required'],
        trim: true
    },
    fileUrl: { // URL of the file stored in iDrive E2 (or other S3-compatible storage)
        type: String,
        required: [true, 'File URL is required'],
        trim: true
    },
    fileType: { // MIME type of the file (e.g., 'image/jpeg', 'application/pdf')
        type: String,
        required: [true, 'File type is required'],
        trim: true
    },
    fileSize: { // Size of the file in bytes
        type: Number,
        required: [true, 'File size is required']
    },
    // Optional: Link the upload to a specific context, e.g., a user's avatar, a comment attachment
    context: {
        type: String, // e.g., 'avatar', 'commentAttachment', 'blogAsset'
        trim: true
    },
    contextId: { // ID related to the context, e.g., userId for avatar, commentId for attachment
        type: String, // Can be ObjectId or any other string ID depending on context
        trim: true
    }
}, { timestamps: true });

// Index for querying uploads by user
// You might add more indexes based on common query patterns, e.g., context and contextId

module.exports = mongoose.models.Upload || mongoose.model('Upload', uploadSchema);