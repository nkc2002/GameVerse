import api from "./axios";

// Build absolute URL for uploaded files so images render correctly on the frontend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
// Remove trailing /api if present to get the file host root
const FILE_HOST = API_BASE_URL.replace(/\/api\/?$/, "");

const toAbsoluteUrl = (url: string) => {
  if (!url) return url;
  return url.startsWith("http") ? url : `${FILE_HOST}${url}`;
};

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId?: string;
  };
}

export interface MultiUploadResponse {
  success: boolean;
  data: Array<{
    url: string;
    publicId?: string;
  }>;
}

export const uploadApi = {
  single: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadResponse>("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Normalize URL to absolute for immediate display
    return {
      ...response.data,
      data: {
        ...response.data.data,
        url: toAbsoluteUrl(response.data.data.url),
      },
    };
  },

  multiple: async (files: File[]): Promise<MultiUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post<MultiUploadResponse>(
      "/uploads/multiple",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Normalize URLs to absolute for immediate display
    return {
      ...response.data,
      data: response.data.data.map((item) => ({
        ...item,
        url: toAbsoluteUrl(item.url),
      })),
    };
  },
};
