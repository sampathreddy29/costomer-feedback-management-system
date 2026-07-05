const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../middleware/authMiddleware');

const userPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const user = await User.create({ name, email, password });

  return res.status(201).json({
    token: signToken(user._id),
    user: userPayload(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'Account is inactive' });
  }

  return res.json({
    token: signToken(user._id),
    user: userPayload(user)
  });
});

const me = asyncHandler(async (req, res) => {
  return res.json({ user: userPayload(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (req.body.name) user.name = req.body.name;
  if (req.body.email && req.body.email !== user.email) {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(409).json({ message: 'Email is already in use' });
    user.email = req.body.email;
  }

  await user.save();
  return res.json({ user: userPayload(user) });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user || !(await user.matchPassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();
  return res.json({ message: 'Password updated successfully' });
});

module.exports = { register, login, me, updateProfile, changePassword };