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
        negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } }
      }
    }
  ]);

  const byStatus = await Feedback.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const byCategory = await Feedback.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);

  return res.json({
    totals: stats || { totalFeedback: 0, averageRating: 0, positive: 0, neutral: 0, negative: 0 },
    byStatus,
    byCategory
  });
});

const monthlyTrends = asyncHandler(async (req, res) => {
  const trends = await Feedback.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return res.json({ trends });
});

const exportCsv = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find().populate('user', 'name email').sort({ createdAt: -1 });
  const header = 'Date,Customer,Email,Rating,Category,Status,Sentiment,Comment\n';
  const rows = feedback.map((item) => [
    item.createdAt.toISOString(),
    item.user?.name || '',
    item.user?.email || '',
    item.rating,
    item.category,
    item.status,
    item.sentiment,
    `"${String(item.comment).replace(/"/g, '""')}"`
  ].join(','));

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="feedback-report.csv"');
  return res.send(header + rows.join('\n'));
});

module.exports = { summary, monthlyTrends, exportCsv };
