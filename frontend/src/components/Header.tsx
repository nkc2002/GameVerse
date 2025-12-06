import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Gamepad2, Menu, X, User, LogOut, Shield, PenTool } from "lucide-react";

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav className="max-w-7xl mx-auto bg-dark-100/90 backdrop-blur-md border border-primary-500/30 rounded-2xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors duration-200">
              <Gamepad2 className="w-6 h-6 text-primary-400" />
            </div>
            <span className="font-display text-xl text-gradient">
              GameVerse
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-slate-300 hover:text-primary-400 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/games"
              className="text-slate-300 hover:text-primary-400 transition-colors duration-200 font-medium"
            >
              Games
            </Link>
            <Link
              to="/posts"
              className="text-slate-300 hover:text-primary-400 transition-colors duration-200 font-medium"
            >
              Posts
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-dark-200 transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-500/30 flex items-center justify-center">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary-400" />
                    )}
                  </div>
                  <span className="text-slate-200 font-medium">
                    {user?.username}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-dark-100 border border-primary-500/30 rounded-xl shadow-neon overflow-hidden">
                    <div className="p-3 border-b border-primary-500/20">
                      <p className="text-sm text-slate-400">Signed in as</p>
                      <p className="font-medium text-slate-200">
                        {user?.email}
                      </p>
                      <span className="badge mt-2">{user?.role}</span>
                    </div>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-dark-200 transition-colors cursor-pointer"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    {user?.role === "editor" && (
                      <Link
                        to="/editor/posts"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-dark-200 transition-colors cursor-pointer"
                      >
                        <PenTool className="w-4 h-4" />
                        My Posts
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-dark-200 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-cta hover:bg-dark-200 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-primary-400 transition-colors cursor-pointer"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-primary-500/20">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-300 hover:text-primary-400 transition-colors py-2"
              >
                Home
              </Link>
              <Link
                to="/games"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-300 hover:text-primary-400 transition-colors py-2"
              >
                Games
              </Link>
              <Link
                to="/posts"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-300 hover:text-primary-400 transition-colors py-2"
              >
                Posts
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-slate-300 hover:text-primary-400 transition-colors py-2"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user?.role === "editor" && (
                    <Link
                      to="/editor/posts"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-slate-300 hover:text-primary-400 transition-colors py-2"
                    >
                      My Posts
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-slate-300 hover:text-primary-400 transition-colors py-2"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-cta hover:text-cta-hover transition-colors py-2 text-left cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-4 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-secondary flex-1 text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary flex-1 text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
