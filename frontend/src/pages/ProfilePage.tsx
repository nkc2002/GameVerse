import React, { useState } from "react";
import { User, Mail, Shield, Calendar, Edit, Lock } from "lucide-react";
import { useGetProfile, useUpdateProfile, useChangePassword } from "../hooks";
import { ImageUpload } from "../components/ImageUpload";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { ErrorMessage } from "../components/shared/ErrorMessage";

type Tab = "overview" | "edit" | "password";

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { data: profile, isLoading, error: profileError } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  React.useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatarUrl || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await updateProfile.mutateAsync({ username, avatarUrl });
      setMessage("Profile updated successfully!");
      setActiveTab("overview");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("overview");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (profileError) {
    console.error("Profile error details:", profileError);
    return (
      <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <ErrorMessage
            message={`Failed to load profile: ${
              (profileError as any)?.response?.data?.message ||
              (profileError as any)?.message ||
              "Unknown error"
            }`}
          />
          <div className="mt-4 p-4 bg-dark-100 border border-primary-500/30 rounded-xl text-slate-300">
            <p className="mb-2">Please try:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Logout and login again</li>
              <li>Clear browser cache (Ctrl + Shift + Delete)</li>
              <li>Check if backend server is running</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display text-gradient mb-12">
          My Profile
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-primary-500/20">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "text-primary-400 border-b-2 border-primary-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeTab === "edit"
                ? "text-primary-400 border-b-2 border-primary-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <Edit className="w-4 h-4 inline mr-2" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
              activeTab === "password"
                ? "text-primary-400 border-b-2 border-primary-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Change Password
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-8 mb-8">
              <div className="w-32 h-32 rounded-full bg-primary-500/30 flex items-center justify-center overflow-hidden">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-primary-400" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-display text-slate-100 mb-2">
                  {profile?.username}
                </h2>
                <div className="flex items-center gap-2 text-slate-400 mb-4">
                  <Mail className="w-4 h-4" />
                  {profile?.email}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-400" />
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      profile?.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : profile?.role === "editor"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {profile?.role?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-dark-200 rounded-xl">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Member Since</span>
                </div>
                <p className="text-slate-200 font-medium">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Tab */}
        {activeTab === "edit" && (
          <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-8">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Avatar
                </label>
                <ImageUpload
                  onUpload={(urls) => setAvatarUrl(urls[0])}
                  multiple={false}
                  maxFiles={1}
                  currentImages={avatarUrl ? [avatarUrl] : []}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className="flex-1 px-6 py-3 bg-dark-200 border border-primary-500/30 text-slate-300 rounded-xl font-medium hover:bg-dark-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-8">
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("overview");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="flex-1 px-6 py-3 bg-dark-200 border border-primary-500/30 text-slate-300 rounded-xl font-medium hover:bg-dark-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {changePassword.isPending ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
