import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { Modal } from "../../components/shared/Modal";
import { ImageUpload } from "../../components/ImageUpload";
import {
  usePosts,
  useDeletePost,
  useCreatePost,
  useUpdatePost,
} from "../../hooks/usePosts";
import { useAuth } from "../../auth/AuthContext";
import type { Post } from "../../api/posts";

interface PostFormData {
  title: string;
  content: string;
  category: string;
  status: "draft" | "published";
  thumbnailUrl: string;
}

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

export const EditorPostsPage: React.FC = () => {
  const { user } = useAuth();
  const [page] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    category: "News",
    status: "draft",
    thumbnailUrl: "",
  });

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  // Only fetch posts by current user
  const { data, isLoading, isFetching } = usePosts({
    page,
    search: debouncedSearch,
    author: user?._id,
  });
  const deletePost = useDeletePost();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const allPosts: Post[] = (data as any)?.data ?? [];

  // Filter posts by category client-side
  // Only show posts owned by current editor; then apply category filter
  const posts = useMemo(() => {
    const myPosts = user?._id
      ? allPosts.filter((post: Post) => post.author?._id === user._id)
      : [];
    if (!categoryFilter) return myPosts;
    return myPosts.filter((post: Post) => post.category === categoryFilter);
  }, [allPosts, categoryFilter, user?._id]);

  const showFullScreenLoading = isLoading && !data;

  const categories = ["News", "Reviews", "Guides", "Updates", "Features"];

  // Reset form when modal opens/closes or selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      setFormData({
        title: selectedPost.title || "",
        content: selectedPost.content || "",
        category: selectedPost.category || "News",
        status: selectedPost.status || "draft",
        thumbnailUrl: selectedPost.thumbnailUrl || "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        category: "News",
        status: "draft",
        thumbnailUrl: "",
      });
    }
  }, [selectedPost, showModal]);

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost.mutateAsync(postId);
        alert("Post deleted successfully!");
      } catch (error) {
        alert("Failed to delete post: " + (error as Error).message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedPost) {
        await updatePost.mutateAsync({ id: selectedPost._id, data: formData });
        alert("Post updated successfully!");
      } else {
        await createPost.mutateAsync(formData);
        alert("Post created successfully!");
      }
      setShowModal(false);
      setSelectedPost(null);
    } catch (error) {
      alert("Failed to save post: " + (error as Error).message);
    }
  };

  if (showFullScreenLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-display text-gradient mb-4">
              My Posts
            </h1>
            <p className="text-slate-400 font-body">
              Manage your articles and content
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedPost(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
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
                placeholder="Search my posts..."
                className="w-full pl-12 pr-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-primary-500 transition-colors font-body cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-dark-100 border border-primary-500/30 rounded-2xl overflow-hidden relative min-h-[200px]">
          {isFetching && posts.length > 0 && (
            <div className="absolute inset-0 bg-dark/50 flex items-center justify-center z-10">
              <LoadingSpinner />
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-200 border-b border-primary-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Views
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-500/10">
                {posts.length === 0 && !isLoading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No posts found
                    </td>
                  </tr>
                )}
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="hover:bg-dark-200/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-200 font-medium max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-medium rounded-lg">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-lg ${
                          post.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer"
                          aria-label="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Post Form Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedPost(null);
          }}
          title={selectedPost ? "Edit Post" : "Create New Post"}
          size="xl"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body"
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-primary-500 transition-colors font-body cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "draft" | "published",
                    })
                  }
                  className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 focus:outline-none focus:border-primary-500 transition-colors font-body cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Content
              </label>
              <textarea
                rows={12}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-4 py-3 bg-dark-200 border border-primary-500/30 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors font-body resize-none"
                placeholder="Write your post content here..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Thumbnail Image
              </label>
              <ImageUpload
                onUpload={(urls) =>
                  setFormData({ ...formData, thumbnailUrl: urls[0] || "" })
                }
                multiple={false}
                maxFiles={1}
                currentImages={
                  formData.thumbnailUrl ? [formData.thumbnailUrl] : []
                }
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedPost(null);
                }}
                className="flex-1 px-6 py-3 bg-dark-200 border border-primary-500/30 text-slate-300 rounded-xl font-medium hover:bg-dark-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPost.isPending || updatePost.isPending}
                className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {createPost.isPending || updatePost.isPending
                  ? "Saving..."
                  : selectedPost
                  ? "Update Post"
                  : "Create Post"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
