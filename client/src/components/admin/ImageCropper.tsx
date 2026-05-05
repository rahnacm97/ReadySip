import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/canvasUtils";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropComplete,
  onCancel,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback(
    (
      _croppedArea: unknown,
      croppedAreaPixels: {
        x: number;
        y: number;
        width: number;
        height: number;
      },
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleCrop = async () => {
    try {
      if (!croppedAreaPixels) return;
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-2xl aspect-square bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteInternal}
        />
      </div>

      <div className="mt-8 w-full max-w-md space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-stone-400 text-sm">Zoom</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-brand-600"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl bg-stone-800 text-stone-300 font-semibold hover:bg-stone-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="flex-1 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
