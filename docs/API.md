# API Documentation

Base URL: `http://localhost:5000/api` locally, or the deployed Render API URL in production.

All protected routes require:

```http
Authorization: Bearer <jwt_token>
```

## Auth

### Register

`POST /auth/register`

```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "password": "Password123"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "customer@example.com",
  "password": "Password123"
}
```

### Current User

`GET /auth/me`

Requires JWT.

## Feedback

### Create Feedback

`POST /feedback`

Requires JWT. Supports `multipart/form-data` with optional `screenshot` image.

Fields:

- `rating`: integer 1-5
- `category`: service, product, website, delivery, support, other
- `comment`: text, 5-2000 characters
- `screenshot`: optional image

### List Feedback

`GET /feedback`

Customers see their own feedback. Admins see all feedback.

Optional filters:

- `search`
- `status`
- `category`
- `rating`
- `sentiment`
- `from`
- `to`
- `page`
- `limit`

### My Feedback

`GET /feedback/mine`

Requires JWT.

### Feedback by ID

`GET /feedback/:id`

Requires JWT.

### Update Feedback

`PUT /feedback/:id`

Customers can edit unresolved feedback. Admins can update status and reply.

### Delete Feedback

`DELETE /feedback/:id`

Customer can delete own feedback. Admin can delete any feedback.

## Users Admin Routes

Admin only.

- `GET /users`
- `PATCH /users/:id`
- `DELETE /users/:id`

## Reports Admin Routes

Admin only.

- `GET /reports/summary`
- `GET /reports/monthly-trends`
- `GET /reports/export.csv`