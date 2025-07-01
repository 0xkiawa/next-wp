const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        enum: [
            'PAGE_VIEW',
            'POST_VIEW',
            'USER_REGISTRATION',
            'USER_LOGIN',
            'COMMENT_CREATED',
            'BOOKMARK_CREATED',
            'FILE_UPLOADED',
            'SEARCH_PERFORMED',
            // Add other event types as needed
        ],
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        // Not required, as some events might be anonymous (e.g., general page views)
    },
    wpPostId: { // Or a generic postId if not strictly WordPress
        type: String, // Assuming WordPress post IDs can be strings or numbers
        index: true,
        // Optional, only relevant for post-related events
    },
    path: { // For PAGE_VIEW events
        type: String,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
    additionalData: {
        type: mongoose.Schema.Types.Mixed, // For any other event-specific data
        // e.g., for SEARCH_PERFORMED: { query: 'search term', resultsCount: 5 }
        // e.g., for FILE_UPLOADED: { fileId: 'someFileId', fileSize: 1024 }
    }
}, {
    timestamps: true // This will add createdAt and updatedAt timestamps
});

// Compound index for common queries
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ userId: 1, eventType: 1, timestamp: -1 });

module.exports = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);