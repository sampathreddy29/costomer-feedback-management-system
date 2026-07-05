# Deployment Guide

This project is designed for cloud deployment using MongoDB Atlas, Render, and Vercel.

## 1. MongoDB Atlas

1. Create an Atlas cluster.
2. Create a database user under Database Access.
3. Add an allowed IP address under Network Access. For development testing, `0.0.0.0/0` works, but a restricted IP range is safer for production.
4. Copy the Node.js driver connection string.
5. Use a database name in the URI, for example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/customer_feedback_system?retryWrites=true&w=majority&appName=Cluster0
```

## 2. Backend on Render

Create a Render Web Service with these settings:

- Root Directory: `Backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Node

Set these environment variables in Render:

```env
PORT=5000
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=use_a_long_random_production_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
NODE_ENV=production
DNS_SERVERS=1.1.1.1,8.8.8.8
```

After deployment, test:

```text
https://your-render-service.onrender.com/
```

Expected response:

```json
{"message":"Customer Feedback Management System API is running"}
```

## 3. Frontend on Vercel

Create a Vercel project with these settings:

- Framework Preset: Vite
- Root Directory: `Frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Set these environment variables in Vercel:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
VITE_UPLOADS_URL=https://your-render-service.onrender.com
```

Redeploy after setting environment variables.

## 4. Final Submission Links

Submit these on Moodle:

- GitHub repository URL
- Vercel frontend URL
- Render backend URL
- Technical report PDF or Word document