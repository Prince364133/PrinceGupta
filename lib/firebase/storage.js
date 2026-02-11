// lib/firebase/storage.js
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload file to Firebase Storage
 * @param {File} file 
 * @param {string} path Storage path
 * @param {Function} onProgress Progress callback
 * @returns {Promise<string>} Download URL
 */
export const uploadFile = async (file, path, onProgress = null) => {
    try {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) {
                        onProgress(progress);
                    }
                },
                (error) => {
                    console.error('Upload error:', error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    } catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
};

/**
 * Delete file from Firebase Storage
 * @param {string} path Storage path
 */
export const deleteFile = async (path) => {
    try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('File deletion error:', error);
        throw error;
    }
};

/**
 * Upload image with optimization
 * @param {File} file 
 * @param {string} folder Folder name
 * @param {Function} onProgress 
 * @returns {Promise<Object>} { url, path }
 */
export const uploadImage = async (file, folder = 'images', onProgress = null) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const path = `${folder}/${fileName}`;

    const url = await uploadFile(file, path, onProgress);

    return { url, path };
};

/**
 * Upload multiple images
 * @param {FileList} files 
 * @param {string} folder 
 * @param {Function} onProgress 
 * @returns {Promise<Array>}
 */
export const uploadMultipleImages = async (files, folder = 'images', onProgress = null) => {
    const uploadPromises = Array.from(files).map((file, index) => {
        return uploadImage(file, folder, (progress) => {
            if (onProgress) {
                onProgress(index, progress);
            }
        });
    });

    return Promise.all(uploadPromises);
};

/**
 * Upload resume PDF
 * @param {File} file - The resume PDF file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Object with fileUrl, fileName, fileSize, path
 */
export const uploadResume = async (file, onProgress = null) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
        throw new Error('File must be a PDF');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('Resume size must be less than 10MB');
    }

    const timestamp = Date.now();
    const fileName = `resume_${timestamp}.pdf`;
    const path = `resumes/${fileName}`;

    const fileUrl = await uploadFile(file, path, onProgress);

    return {
        fileUrl,
        fileName,
        fileSize: file.size,
        path,
    };
};

/**
 * Upload profile image
 * @param {File} file - The image file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Object with url and path
 */
export const uploadProfileImage = async (file, onProgress = null) => {
    return await uploadImage(file, 'profile', onProgress);
};

/**
 * Upload blog cover image
 * @param {File} file - The image file
 * @param {string} blogSlug - The blog slug for organization
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Object with url and path
 */
export const uploadBlogImage = async (file, blogSlug, onProgress = null) => {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${blogSlug}_${timestamp}.${extension}`;
    const path = `blogs/${fileName}`;

    const url = await uploadFile(file, path, onProgress);
    return { url, path };
};

/**
 * Upload testimonial image
 * @param {File} file - The image file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Object with url and path
 */
export const uploadTestimonialImage = async (file, onProgress = null) => {
    return await uploadImage(file, 'testimonials', onProgress);
};
