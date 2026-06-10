const express = require('express');
const { body, param } = require('express-validator');
const { listUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', listUsers);
router.patch('/:id', [
  param('id').isMongoId().withMessage('Invalid user id'),
  body('role').optional().isIn(['customer', 'admin']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false')
], validate, updateUser);
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid user id')], validate, deleteUser);

module.exports = router;
