# Customer Feedback Management System - Backend

Express/MongoDB backend for customer feedback submission, admin dashboards, user management, and reports.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Update `.env` with your MongoDB connection string and a strong `JWT_SECRET`.

3. Start the API:

```bash
npm run dev
```

4. Create the first admin account:

```bash
npm run seed:admin
```

Default seed login:

- Email: `admin@example.com`
- Password: `Admin12345`

You can override this with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` in `.env` before running the seed command.

## Main API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/feedback`
- `GET /api/feedback`
- `GET /api/feedback/mine`
- `GET /api/feedback/:id`
- `PUT /api/feedback/:id`
- `DELETE /api/feedback/:id`
- `GET /api/users` admin only
- `PATCH /api/users/:id` admin only
- `DELETE /api/users/:id` admin only
- `GET /api/reports/summary` admin only
- `GET /api/reports/monthly-trends` admin only
- `GET /api/reports/export.csv` admin only

## Uploads

Use `multipart/form-data` with a `screenshot` field when creating or updating feedback with an image.
## MongoDB Atlas DNS Note

If Atlas gives `querySrv ECONNREFUSED`, keep this in `.env` so Node resolves the Atlas SRV records through public DNS:

```env
DNS_SERVERS=1.1.1.1,8.8.8.8
```