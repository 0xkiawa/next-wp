const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    wpPostId: { // To link with a WordPress post
        type: Number, // Assuming WordPress Post IDs are numbers
        required: [true, 'WordPress Post ID is required'],
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        minlength: [1, 'Comment cannot be empty'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    parentId: { // For threaded comments (replies to other comments)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null // null if it's a top-level comment
    }
}, { timestamps: true });

// To efficiently query comments by post and then by parentId for threading
commentSchema.index({ wpPostId: 1, parentId: 1, createdAt: 1 });

module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);