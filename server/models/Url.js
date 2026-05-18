const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      match: [/^https?:\/\//, 'Please provide a valid URL starting with http:// or https://'], // Ensure standard HTTP/S format
    },
    shortId: {
      type: String,
      required: true,
      unique: true, // Primary key index for rapid redirection lookups
    },
    customAlias: {
      type: String,
      sparse: true, // Sparse allows multiple nulls while enforcing uniqueness on non-null custom strings
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Establishes relations — connects URLs directly to their registered creator
      required: [true, 'Owner User reference is required'],
    },
    title: {
      type: String,
      default: null, // Custom user label for dashboard organization
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    totalClicks: {
      type: Number,
      default: 0, // Cache counter of clicks for high-speed table rendering
    },
    isActive: {
      type: Boolean,
      default: true, // Allows users to soft-disable redirection without deleting historical click data
    },
    expiresAt: {
      type: Date,
      default: null, // Timestamp for link expiration (TTL)
    },
  },
  {
    timestamps: true, // Auto-tracks creation date and update dates
  }
);

// --- Compound & Optimization Indexes ---
urlSchema.index({ user: 1, createdAt: -1 }); // Dashboard index — sorts user's links by newest first

// --- TTL (Time-To-Live) Automatic Expiration Index ---
// MongoDB background thread runs every 60 seconds.
// If the current date-time is greater than the date inside expiresAt (with 0 seconds lag),
// MongoDB will automatically delete the URL document from the collection.
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Url', urlSchema);
