import React, { useState, useEffect, useMemo } from "react";
import { Search, Shield, User as UserIcon, Mail, Calendar } from "lucide-react";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { useUsers, useUpdateUser, useDeleteUser } from "../../hooks/useUsers";
import { User } from "../../api/auth";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const ManageUsersPage: React.FC = () => {
  const [page] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isFetching } = useUsers({
    page,
    search: debouncedSearch,
  });
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const allUsers: User[] = (data as any)?.data || [];
  const showFullScreenLoading = isLoading && !data;

  // Filter users by role on client side
  const users = useMemo(() => {
    if (!roleFilter) return allUsers;
    return allUsers.filter((u: User) => u.role === roleFilter);
  }, [allUsers, roleFilter]);

  const handleRoleChange = async (
    userId: string,
    currentRole: User["role"],
    newRole: User["role"]
  ) => {
    // Don't do anything if role is the same
    if (currentRole === newRole) return;

    if (
      confirm(`Are you sure you want to change this user's role to ${newRole}?`)
    ) {
      try {
        await updateUser.mutateAsync({ id: userId, data: { role: newRole } });
        alert("Role updated successfully!");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        alert("Failed to update role: " + errorMessage);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser.mutateAsync(userId);
        alert("User deleted successfully!");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        alert("Failed to delete user: " + errorMessage);
      }
    }
  };

  if (showFullScreenLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const totalUsers = allUsers.length;
  const adminCount = allUsers.filter((u: User) => u.role === "admin").length;
  const editorCount = allUsers.filter((u: User) => u.role === "editor").length;
  const userCount = allUsers.filter((u: User) => u.role === "user").length;

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-gradient mb-4">
            Manage Users
          </h1>
          <p className="text-slate-400 font-body">
            View and manage user accounts
          </p>
        </div>

        {/* Filters */}
        <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search users by username or email..."
                className="w-full pl-12 pr-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-primary-500 transition-colors font-body cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-display text-slate-100">
                  {totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Admins</p>
                <p className="text-2xl font-display text-slate-100">
                  {adminCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Editors</p>
                <p className="text-2xl font-display text-slate-100">
                  {editorCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-100 border border-primary-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Regular Users</p>
                <p className="text-2xl font-display text-slate-100">
                  {userCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-dark-100 border border-primary-500/30 rounded-2xl overflow-hidden relative min-h-[200px]">
          {isFetching && users.length > 0 && (
            <div className="absolute inset-0 bg-dark/50 flex items-center justify-center z-10">
              <LoadingSpinner />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-200 border-b border-primary-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-500/10">
                {users.length === 0 && !isLoading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No users found
                    </td>
                  </tr>
                )}
                {users.map((user: User) => (
                  <tr
                    key={user._id}
                    className="hover:bg-dark-200/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500/30 flex items-center justify-center">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-5 h-5 text-primary-400" />
                          )}
                        </div>
                        <span className="font-medium text-slate-200">
                          {user.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            user.role,
                            e.target.value as User["role"]
                          )
                        }
                        disabled={updateUser.isPending}
                        className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer disabled:opacity-50 ${
                          user.role === "admin"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : user.role === "editor"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={
                            user.role === "admin" || deleteUser.isPending
                          }
                          className="px-4 py-2 text-sm bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {deleteUser.isPending ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
