import React, { useState, useRef } from "react";
import ImageCropper from "./ImageCropper";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUploadChange?: (uploading: boolean) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onUploadChange,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = async (croppedBlob: Blob) => {
    // Immediately block UI
    if (onUploadChange) onUploadChange(true);
    setShowCropper(false);
    setUploading(true);

    const formData = new FormData();
    formData.append("image", croppedBlob, "product.jpg");

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(res.data.imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload Error:", err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
      if (onUploadChange) onUploadChange(false);
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative aspect-square w-full max-w-[200px] mx-auto rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2
          ${value ? "border-brand-600/50 bg-brand-600/5" : "border-stone-700 bg-stone-900 hover:border-stone-600 hover:bg-stone-800/50"}
          ${uploading ? "cursor-not-allowed opacity-50" : ""}
        `}
      >
        {value ? (
          <img
            src={value}
            alt="Product"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <span className="text-3xl text-stone-500">📸</span>
            <span className="text-stone-400 text-sm font-medium">
              Select Product Image
            </span>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-white font-medium">Uploading…</span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {showCropper && image && (
        <ImageCropper
          image={image}
          onCropComplete={onCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
      )}
    </div>
  );
};

export default ImageUpload;
