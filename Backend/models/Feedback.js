const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  repliedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    trim: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: 3,
    maxlength: 120
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['service', 'product', 'website', 'delivery', 'support', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['web', 'qr', 'email', 'phone', 'in-store', 'other'],
    default: 'web'
  },
  location: {
    type: String,
    trim: true,
    maxlength: 120,
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 30
  }],
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: 5,
    maxlength: 2000
  },
  screenshot: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'in-review', 'resolved', 'closed'],
    default: 'new'
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  adminNote: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  reply: {
    type: replySchema,
    default: null
  },
  history: {
    type: [historySchema],
    default: []
  }
}, { timestamps: true });

feedbackSchema.index({ user: 1, createdAt: -1 });
feedbackSchema.index({ rating: 1, status: 1, category: 1, priority: 1 });
feedbackSchema.index({ comment: 'text', title: 'text', category: 'text', status: 'text', tags: 'text', location: 'text' });

feedbackSchema.pre('save', function setSentiment(next) {
  const negativeWords = ['bad', 'poor', 'slow', 'broken', 'angry', 'terrible', 'late', 'issue', 'problem'];
  const positiveWords = ['good', 'great', 'excellent', 'fast', 'helpful', 'happy', 'perfect', 'love'];
  const text = `${this.title || ''} ${this.comment || ''}`.toLowerCase();
  const negativeHits = negativeWords.filter((word) => text.includes(word)).length;
  const positiveHits = positiveWords.filter((word) => text.includes(word)).length;

  if (this.rating <= 2 || negativeHits > positiveHits) this.sentiment = 'negative';
  else if (this.rating >= 4 || positiveHits > negativeHits) this.sentiment = 'positive';
  else this.sentiment = 'neutral';
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);