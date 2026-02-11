// components/admin/ImageUpload.jsx
'use client';

import { useState } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { uploadImage } from '@/lib/firebase/storage';
import Loader from '@/components/ui/Loader';

export default function ImageUpload({
    onUploadComplete,
    folder = 'images',
    multiple = false,
    preview = true
}) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            if (multiple) {
                const uploadPromises = Array.from(files).map(file =>
                    uploadImage(file, folder, (prog) => setProgress(prog))
                );
                const results = await Promise.all(uploadPromises);
                onUploadComplete(results.map(r => r.url));
            } else {
                const file = files[0];

                // Show preview
                if (preview) {
                    const reader = new FileReader();
                    reader.onloadend = () => setPreviewUrl(reader.result);
                    reader.readAsDataURL(file);
                }

                const result = await uploadImage(file, folder, (prog) => setProgress(prog));
                onUploadComplete(result.url);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const clearPreview = () => {
        setPreviewUrl(null);
    };

    return (
        <div>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                    id="image-upload"
                />

                <label htmlFor="image-upload" className="cursor-pointer">
                    {uploading ? (
                        <div>
                            <Loader size="md" className="mb-4" />
                            <p className="text-text-secondary">Uploading... {Math.round(progress)}%</p>
                        </div>
                    ) : (
                        <div>
                            <FaCloudUploadAlt className="w-12 h-12 mx-auto mb-4 text-primary" />
                            <p className="text-lg font-semibold mb-2">Click to upload</p>
                            <p className="text-sm text-text-secondary">
                                {multiple ? 'Select multiple images' : 'Select an image'} (Max 5MB)
                            </p>
                        </div>
                    )}
                </label>
            </div>

            {/* Preview */}
            {preview && previewUrl && (
                <div className="mt-4 relative">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                        onClick={clearPreview}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}
        </div>
    );
}
