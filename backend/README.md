# GameVerse Backend API

Node.js + Express + MongoDB backend for GameVerse gaming platform.

## Prerequisites

- Node.js 18+
- MongoDB 6+

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required Variables

| Variable             | Description               |
| -------------------- | ------------------------- |
| `MONGO_URI`          | MongoDB connection string |
| `JWT_SECRET`         | Secret for access tokens  |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `FRONTEND_URL`       | Frontend URL for CORS     |

### Cookie Mode

Set `USE_HTTPONLY_COOKIES=true` for secure HttpOnly cookie storage of refresh tokens.

When enabled:

- Refresh token stored in HttpOnly Secure cookie
- CORS credentials enabled automatically
- Frontend must use `credentials: 'include'`

### Cloudinary (Optional)

Set `USE_CLOUDINARY=true` and configure:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh tokens
- `POST /api/auth/logout` - Logout

### Users (Admin)

- `GET /api/users` - List users
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Games

- `GET /api/games` - List games (search, filter, sort, pagination)
- `GET /api/games/:id` - Get game (increments views)
- `POST /api/games` - Create game (admin)
- `PUT /api/games/:id` - Update game (admin)
- `DELETE /api/games/:id` - Delete game (admin)

### Posts

- `GET /api/posts` - List posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `POST /api/posts` - Create post (admin)
- `PUT /api/posts/:id` - Update post (admin)
- `DELETE /api/posts/:id` - Delete post (admin)

### Reviews

- `GET /api/reviews` - List reviews
- `GET /api/reviews/:id` - Get review
- `POST /api/reviews` - Create review (auth)
- `PUT /api/reviews/:id` - Update review (owner/admin)
- `DELETE /api/reviews/:id` - Delete review (owner/admin)

### Comments

- `GET /api/comments` - List comments (nested replies)
- `POST /api/comments` - Create comment (auth)
- `DELETE /api/comments/:id` - Delete comment (owner/admin)

### Uploads

- `POST /api/uploads` - Upload single file
- `POST /api/uploads/multiple` - Upload multiple files

### Stats (Admin)

- `GET /api/stats/summary` - Dashboard stats

## Deploy Notes

### CORS with Credentials

For HttpOnly cookies to work cross-origin:

1. Backend: Set `FRONTEND_URL` to exact frontend origin
2. Backend: `USE_HTTPONLY_COOKIES=true`
3. Frontend: Use `credentials: 'include'` in fetch/axios

### Cookie Settings for Production

Cookies are configured with:

- `httpOnly: true`
- `secure: true` (production)
- `sameSite: 'none'` (production)

Ensure HTTPS is enabled on both frontend and backend.
