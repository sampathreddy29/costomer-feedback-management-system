const dns = require('dns');
const mongoose = require('mongoose');

const configureDns = () => {
  if (process.env.DNS_SERVERS) {
    const servers = process.env.DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean);
    if (servers.length > 0) dns.setServers(servers);
  }
};

const connectDB = async () => {
  try {
    configureDns();
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;