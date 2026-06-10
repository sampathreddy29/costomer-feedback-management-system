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

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  reply: {
    type: replySchema,
    default: null
  }
}, { timestamps: true });

feedbackSchema.index({ user: 1, createdAt: -1 });
feedbackSchema.index({ rating: 1, status: 1, category: 1 });
feedbackSchema.index({ comment: 'text', category: 'text', status: 'text' });

feedbackSchema.pre('save', function setSentiment(next) {
  if (this.rating >= 4) this.sentiment = 'positive';
  else if (this.rating <= 2) this.sentiment = 'negative';
  else this.sentiment = 'neutral';
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);
