# GameVerse 🎮

A full-stack gaming community platform built with React, Node.js, Express, and MongoDB.

## 🎯 Features

- **User Authentication**: Secure login and registration system
- **Game Database**: Browse and discover games with detailed information
- **User Reviews & Ratings**: Share and read game reviews
- **Community Posts**: Discuss games with community members
- **User Profiles**: Customize your profile and avatar
- **Admin Dashboard**: Manage games, posts, and users
- **Editor Tools**: Create and manage gaming content

## 🛠️ Tech Stack

### Frontend

- React 18 + TypeScript
- Vite (Build tool)
- React Router (Navigation)
- React Query (Data fetching)
- React Hook Form (Form management)
- Tailwind CSS (Styling)
- Lucide React (Icons)

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image uploads)
- Express Validator

## 📁 Project Structure

```
GameVerse/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/  # Reusable components
│   │   ├── hooks/    # Custom React hooks
│   │   ├── api/      # API integration
│   │   └── auth/     # Authentication context
│   └── package.json
├── backend/          # Express API server
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── controllers/  # Route handlers
│   │   ├── models/   # MongoDB schemas
│   │   ├── middlewares/  # Custom middlewares
│   │   └── utils/    # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd GameVerse
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Setup (.env)**

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gameverse
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

2. **Frontend Setup (.env)**
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Server** (in new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📝 Available Scripts

### Backend

- `npm run dev` - Run development server
- `npm run build` - Build TypeScript
- `npm start` - Run production build
- `npm run lint` - Run ESLint

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Start preview server

## 🔐 Authentication

- User registration and login
- JWT-based authentication
- Token refresh mechanism
- Password hashing with bcrypt
- Role-based access control (Admin, Editor, User)

## 📚 API Documentation

API endpoints are prefixed with `/api`

### Auth Routes

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token

### User Routes

- `GET /users/me` - Get current user profile
- `PUT /users/profile/me` - Update profile
- `PUT /users/profile/password` - Change password

### Games Routes

- `GET /games` - List all games
- `GET /games/:id` - Get game details
- `POST /games` - Create game (Admin)
- `PUT /games/:id` - Update game (Admin)
- `DELETE /games/:id` - Delete game (Admin)

### Posts Routes

- `GET /posts` - List all posts
- `GET /posts/:slug` - Get post details
- `POST /posts` - Create post (Editor/Admin)
- `PUT /posts/:id` - Update post (Editor/Admin)
- `DELETE /posts/:id` - Delete post (Editor/Admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For support, email support@gameverse.com or open an issue in the repository.

---

**Happy Gaming! 🎮**
