const Feedback = require('../models/Feedback');
const asyncHandler = require('../utils/asyncHandler');

const buildFeedbackQuery = (req) => {
  const { status, category, rating, sentiment, search, from, to } = req.query;
  const query = {};

  if (req.user.role !== 'admin') query.user = req.user._id;
  if (status) query.status = status;
  if (category) query.category = category;
  if (rating) query.rating = Number(rating);
  if (sentiment) query.sentiment = sentiment;
  if (search) query.$text = { $search: search };
  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  return query;
};

const createFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.create({
    user: req.user._id,
    rating: req.body.rating,
    category: req.body.category,
    comment: req.body.comment,
    screenshot: req.file ? `/uploads/${req.file.filename}` : null
  });

  await feedback.populate('user', 'name email');
  return res.status(201).json({ feedback });
});

const getFeedback = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;
  const query = buildFeedbackQuery(req);

  const [items, total] = await Promise.all([
    Feedback.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Feedback.countDocuments(query)
  ]);

  return res.json({
    feedback: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

const getMyFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json({ feedback });
});

const getFeedbackById = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id).populate('user', 'name email');

  if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
  if (req.user.role !== 'admin' && feedback.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.json({ feedback });
});

const updateFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

  if (req.user.role === 'admin') {
    if (req.body.status) feedback.status = req.body.status;
    if (req.body.reply) {
      feedback.reply = { message: req.body.reply, repliedBy: req.user._id, repliedAt: new Date() };
    }
  } else {
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (!['new', 'in-review'].includes(feedback.status)) {
      return res.status(400).json({ message: 'Resolved or closed feedback cannot be edited by customer' });
    }
    if (req.body.rating) feedback.rating = req.body.rating;
    if (req.body.category) feedback.category = req.body.category;
    if (req.body.comment) feedback.comment = req.body.comment;
    if (req.file) feedback.screenshot = `/uploads/${req.file.filename}`;
  }

  await feedback.save();
  await feedback.populate('user', 'name email');
  return res.json({ feedback });
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

  if (req.user.role !== 'admin' && feedback.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await feedback.deleteOne();
  return res.json({ message: 'Feedback deleted' });
});

module.exports = {
  createFeedback,
  getFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
};
