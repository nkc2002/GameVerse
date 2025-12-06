import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Public Pages
import { HomePage } from "./pages/HomePage";
import { GamesPage } from "./pages/GamesPage";
import { PostsPage } from "./pages/PostsPage";
import { GameDetailPage } from "./pages/GameDetailPage";
import { PostDetailPage } from "./pages/PostDetailPage";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// Admin Pages
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ManageGamesPage } from "./pages/admin/ManageGamesPage";
import { ManagePostsPage } from "./pages/admin/ManagePostsPage";
import { ManageUsersPage } from "./pages/admin/ManageUsersPage";
import { EditorPostsPage } from "./pages/editor/EditorPostsPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-dark">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:slug" element={<PostDetailPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Editor Routes - Protected */}
          <Route
            path="/editor/posts"
            element={
              <ProtectedRoute>
                <EditorPostsPage />
              </ProtectedRoute>
            }
          />

          {/* Profile Route - Protected */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/games"
            element={
              <ProtectedRoute>
                <ManageGamesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <ProtectedRoute>
                <ManagePostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <ManageUsersPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-dark flex items-center justify-center px-4">
                <div className="text-center">
                  <h1 className="text-6xl font-display text-gradient mb-4">
                    404
                  </h1>
                  <p className="text-slate-400 font-body mb-8">
                    Page not found
                  </p>
                  <a
                    href="/"
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors inline-block cursor-pointer"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
