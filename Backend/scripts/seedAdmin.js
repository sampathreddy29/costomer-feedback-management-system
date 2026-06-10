const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin12345';
    const name = process.env.ADMIN_NAME || 'System Admin';

    const existing = await User.findOne({ email });
    if (existing) {
      existing.name = name;
      existing.role = 'admin';
      existing.isActive = true;
      if (process.env.ADMIN_PASSWORD) existing.password = password;
      await existing.save();
      console.log(`Admin updated: ${email}`);
    } else {
      await User.create({ name, email, password, role: 'admin' });
      console.log(`Admin created: ${email}`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();
