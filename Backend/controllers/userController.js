const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return res.json({ users });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;
  if (req.body.role && ['customer', 'admin'].includes(req.body.role)) user.role = req.body.role;

  await user.save();
  return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive } });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ message: 'Admin cannot delete their own account' });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  return res.json({ message: 'User deleted' });
});

module.exports = { listUsers, updateUser, deleteUser };
