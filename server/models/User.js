const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Auto-creates a unique B-tree index in MongoDB for fast authentication queries
      lowercase: true, // Forces lowercase email storage to prevent duplicates
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Email regex validation
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Ensures password is omitted from query results by default
    },
    avatar: {
      type: String,
      default: null, // Profile avatar image path
    },
    urlCount: {
      type: Number,
      default: 0, // Denormalized counter to show total shortened URLs on dashboard quickly without counting documents
    },
  },
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt` timestamps
  }
);

// --- Lifecycle Middleware: Pre-Save Password Hashing ---
userSchema.pre('save', async function () {
  // Only hash the password if it's new or modified
  if (!this.isModified('password')) return;

  // Generate salt with 12 computational rounds
  const salt = await bcrypt.genSalt(12);
  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Schema Instance Method: Password Comparison ---
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Compare candidate password with the cryptographically hashed password
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
