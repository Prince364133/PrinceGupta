// components/ui/FileUpload.js
'use client';

import { useState } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';

export default function FileUpload({
    label,
    error,
    accept,
    onChange,
    value,
    onClear,
    className = '',
    required = false,
    maxSize = 5, // MB
    preview = false,
}) {
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(value || null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            alert(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Create preview for images
        if (preview && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }

        onChange(file);
    };

    const handleClear = () => {
        setPreviewUrl(null);
        if (onClear) onClear();
    };

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-sm font-medium mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${dragActive
                        ? 'border-primary bg-primary/10'
                        : error
                            ? 'border-red-500'
                            : 'border-border hover:border-primary'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {previewUrl && preview ? (
                    <div className="relative">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>
                ) : (
                    <>
                        <FaUpload className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                        <p className="text-text-secondary mb-2">
                            Drag and drop your file here, or click to browse
                        </p>
                        <p className="text-sm text-text-muted">
                            Max file size: {maxSize}MB
                        </p>
                        <input
                            type="file"
                            accept={accept}
                            onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
