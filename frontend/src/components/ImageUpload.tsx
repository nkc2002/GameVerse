import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useUploadSingle, useUploadMultiple } from "../hooks";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const FILE_HOST = API_BASE_URL.replace(/\/api\/?$/, "");
const toAbsoluteUrl = (url: string) => {
  if (!url) return url;
  return url.startsWith("http") ? url : `${FILE_HOST}${url}`;
};

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  currentImages?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  multiple = false,
  maxFiles = 5,
  currentImages = [],
}) => {
  const [previews, setPreviews] = useState<string[]>(
    currentImages.map(toAbsoluteUrl)
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadSingle = useUploadSingle();
  const uploadMultiple = useUploadMultiple();

  // Sync previews with currentImages when it changes
  useEffect(() => {
    setPreviews(currentImages.map(toAbsoluteUrl));
  }, [currentImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxFiles - previews.length;
    const filesToUpload = files.slice(0, remainingSlots);

    const newPreviews = filesToUpload.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    setIsUploading(true);

    try {
      let uploadedUrls: string[] = [];

      if (multiple && filesToUpload.length > 1) {
        const result = await uploadMultiple.mutateAsync(filesToUpload);
        uploadedUrls = result.data.map((item) => item.url);
      } else {
        const results = await Promise.all(
          filesToUpload.map((file) => uploadSingle.mutateAsync(file))
        );
        uploadedUrls = results.map((result) => result.data.url);
      }

      newPreviews.forEach((preview) => URL.revokeObjectURL(preview));

      const finalUrls = [...currentImages.map(toAbsoluteUrl), ...uploadedUrls];
      setPreviews(finalUrls);
      onUpload(finalUrls);
    } catch (error) {
      console.error("Upload failed:", error);
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setPreviews(currentImages);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onUpload(newPreviews);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg border border-primary-500/30"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 p-1 bg-cta rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {previews.length < maxFiles && (
          <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-primary-500/30 rounded-lg cursor-pointer hover:border-primary-500/60 transition-colors">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-primary-400" />
                <span className="text-xs text-slate-400 mt-1">Upload</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {multiple && (
        <p className="text-xs text-slate-500">
          {previews.length}/{maxFiles} images uploaded
        </p>
      )}
    </div>
  );
};
