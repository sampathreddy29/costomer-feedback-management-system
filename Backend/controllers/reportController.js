const Feedback = require('../models/Feedback');
const asyncHandler = require('../utils/asyncHandler');

const summary = asyncHandler(async (req, res) => {
  const [stats] = await Feedback.aggregate([
    {
      $group: {
        _id: null,
        totalFeedback: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
        neutral: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } },
        negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
        urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
        unresolved: { $sum: { $cond: [{ $in: ['$status', ['new', 'in-review']] }, 1, 0] } }
      }
    }
  ]);

  const byStatus = await Feedback.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const byCategory = await Feedback.aggregate([{ $group: { _id: '$category', count: { $sum: 1 }, averageRating: { $avg: '$rating' } } }]);
  const byPriority = await Feedback.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);
  const bySource = await Feedback.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]);

  return res.json({
    totals: stats || { totalFeedback: 0, averageRating: 0, positive: 0, neutral: 0, negative: 0, urgent: 0, unresolved: 0 },
    byStatus,
    byCategory,
    byPriority,
    bySource
  });
});

const monthlyTrends = asyncHandler(async (req, res) => {
  const trends = await Feedback.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
        negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return res.json({ trends });
});

const recent = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(8);

  return res.json({ feedback });
});

const categoryInsights = asyncHandler(async (req, res) => {
  const insights = await Feedback.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
        negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return res.json({ insights });
});

const exportCsv = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find().populate('user', 'name email').sort({ createdAt: -1 });
  const header = 'Date,Customer,Email,Title,Rating,Category,Priority,Source,Location,Status,Sentiment,Tags,Comment,AdminNote\n';
  const rows = feedback.map((item) => [
    item.createdAt.toISOString(),
    item.user?.name || '',
    item.user?.email || '',
    `"${String(item.title || '').replace(/"/g, '""')}"`,
    item.rating,
    item.category,
    item.priority,
    item.source,
    `"${String(item.location || '').replace(/"/g, '""')}"`,
    item.status,
    item.sentiment,
    `"${(item.tags || []).join('|').replace(/"/g, '""')}"`,
    `"${String(item.comment).replace(/"/g, '""')}"`,
    `"${String(item.adminNote || '').replace(/"/g, '""')}"`
  ].join(','));

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="feedback-report.csv"');
  return res.send(header + rows.join('\n'));
});

module.exports = { summary, monthlyTrends, recent, categoryInsights, exportCsv };