const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    wpPostId: { // The ID of the WordPress post being bookmarked
        type: Number, // Assuming WordPress Post IDs are numbers
        required: [true, 'WordPress Post ID is required']
    },
    // Optional: Store some metadata about the bookmarked post for quick access
    // This can reduce the need to fetch from WordPress API every time for basic display
    postTitle: {
        type: String,
        trim: true
    },
    postSlug: {
        type: String,
        trim: true
    },
    // You could add more fields like postExcerpt, featuredImageUrl if needed
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    }
}, { timestamps: true });

// Ensure a user can only bookmark a specific post once
bookmarkSchema.index({ userId: 1, wpPostId: 1 }, { unique: true });

module.exports = mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);