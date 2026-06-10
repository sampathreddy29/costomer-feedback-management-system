const express = require('express');
const { body, param } = require('express-validator');
const {
  createFeedback,
  getFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const feedbackRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('category').isIn(['service', 'product', 'website', 'delivery', 'support', 'other']).withMessage('Invalid category'),
  body('comment').trim().isLength({ min: 5, max: 2000 }).withMessage('Comment must be 5 to 2000 characters')
];

const idRule = [param('id').isMongoId().withMessage('Invalid feedback id')];

router.use(protect);

router.route('/')
  .post(upload.single('screenshot'), feedbackRules, validate, createFeedback)
  .get(getFeedback);

router.get('/mine', getMyFeedback);

router.route('/:id')
  .get(idRule, validate, getFeedbackById)
  .put(upload.single('screenshot'), idRule, validate, updateFeedback)
  .delete(idRule, validate, deleteFeedback);

module.exports = router;
