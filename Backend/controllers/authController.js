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

module.exports = { register, login, me };
