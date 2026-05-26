const mongoose = require('mongoose');

// A sub-blueprint to track every single click for your AnalyticsDrawer
const VisitSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  browser: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Unknown' }
});

const LinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Links this URL to a specific User ID
    ref: 'User',
    required: true
  },
  title: { type: String, default: 'Untitled Link' },
  longUrl: { type: String, required: true },  // The destination address
  shortCode: { type: String, required: true, unique: true }, // The random letters (e.g., 'aB3dE')
  alias: { type: String, unique: true, sparse: true }, // For the custom alias bonus feature!
  clicks: { type: Number, default: 0 }, // Total click counter
  visits: [VisitSchema] // An array of every click timestamp for history tracking
}, { 
  timestamps: true,
  // CRITICAL: Tell Mongoose to include virtual fields when sending JSON to React
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 1. FIX: Create an 'id' virtual so 'selectedDeleteLink.id' works perfectly!
LinkSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// 2. FIX: Create a 'shortUrl' virtual so your search filter and copy button work!
LinkSchema.virtual('shortUrl').get(function () {
  // If you have a custom alias, use it; otherwise, use the random shortCode
  const identifier = this.alias || this.shortCode;
  
  // Replace 'http://localhost:5000' with your real domain deployment URL later
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000'; 
  return `${baseUrl}/${identifier}`;
});

module.exports = mongoose.model('Link', LinkSchema);