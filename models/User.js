import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot be more than 30 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Do not return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'editor'],
    default: 'user',
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters long'],
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters long'],
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters long'],
  },
  profilePicture: {
    type: String, // URL to the profile picture
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // For password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in DB
UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) {
    console.error('Password is undefined for user:', this.email);
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update `updatedAt` field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// REMOVED the duplicate indexes since unique: true already creates them
// UserSchema.index({ email: 1 });
// UserSchema.index({ username: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);