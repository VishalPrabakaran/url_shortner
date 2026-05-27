import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  browser: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Unknown' }
});

const LinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, default: 'Untitled Link' },
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  alias: { type: String, unique: true, sparse: true },
  clicks: { type: Number, default: 0 },
  visits: [VisitSchema]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

LinkSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

LinkSchema.virtual('shortUrl').get(function () {
  const identifier = this.alias || this.shortCode;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/${identifier}`;
});

// CHANGE THIS LINE AT THE BOTTOM:
export default mongoose.model('Link', LinkSchema);