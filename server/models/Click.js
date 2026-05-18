const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema(
  {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url', // Parent relation — connects each click event directly to a shortened URL
      required: [true, 'URL reference is required'],
    },
    timestamp: {
      type: Date,
      default: Date.now, // Accurate capture of when redirect occurred
    },
    ip: {
      type: String,
      default: null, // Client IP (for potential geolocation lookups)
    },
    userAgent: {
      type: String,
      default: null, // Full raw user-agent string for audit logs
    },
    device: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown', // Parsed device classification for the Pie Chart
    },
    browser: {
      type: String,
      default: 'unknown', // e.g. Chrome, Firefox, Safari for the Bar Chart
    },
    os: {
      type: String,
      default: 'unknown', // e.g. Windows, macOS, iOS, Android
    },
    referrer: {
      type: String,
      default: 'direct', // e.g. Twitter, Facebook, Google, or Direct URL typing
    },
    country: {
      type: String,
      default: 'unknown', // e.g. United States, India, Germany
    },
    city: {
      type: String,
      default: 'unknown',
    },
  },
  {
    timestamps: false, // Disabled standard timestamps because `timestamp` is explicitly handled
  }
);

// --- Compound Indexes for Analytical Query Performance ---
// Redirection lists are typically rendered newest first for details views
clickSchema.index({ url: 1, timestamp: -1 });

// Speeds up the Mongoose aggregation $group pipeline for Device breakdowns (Pie Chart)
clickSchema.index({ url: 1, device: 1 });

// Speeds up the aggregation pipeline for Country geographical map charts
clickSchema.index({ url: 1, country: 1 });

module.exports = mongoose.model('Click', clickSchema);
