const express = require('express');
const { summary, monthlyTrends, recent, categoryInsights, exportCsv } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/summary', summary);
router.get('/monthly-trends', monthlyTrends);
router.get('/recent', recent);
router.get('/category-insights', categoryInsights);
router.get('/export.csv', exportCsv);

module.exports = router;