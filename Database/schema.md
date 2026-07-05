# Database Schema

Database: `customer_feedback_system`

## users

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | Primary identifier |
| `name` | String | User full name |
| `email` | String | Unique login email |
| `password` | String | bcrypt hashed password, not returned by default |
| `role` | String | `customer` or `admin` |
| `isActive` | Boolean | Allows admin account disabling |
| `createdAt` | Date | Created timestamp |
| `updatedAt` | Date | Updated timestamp |

## feedback

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | Primary identifier |
| `user` | ObjectId | Reference to user |
| `rating` | Number | 1-5 star rating |
| `category` | String | service, product, website, delivery, support, other |
| `comment` | String | Customer comment |
| `screenshot` | String/null | Uploaded screenshot path |
| `status` | String | new, in-review, resolved, closed |
| `sentiment` | String | positive, neutral, negative, derived from rating |
| `reply.message` | String | Admin reply text |
| `reply.repliedBy` | ObjectId | Admin user reference |
| `reply.repliedAt` | Date | Reply timestamp |
| `createdAt` | Date | Created timestamp |
| `updatedAt` | Date | Updated timestamp |

## Indexes

- Feedback by user and date for customer history.
- Feedback by rating/status/category for dashboard filtering.
- Text index on comment/category/status for keyword search.