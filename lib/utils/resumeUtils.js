// lib/utils/resumeUtils.js

/**
 * Format file size from bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get the currently active resume from a list of resumes
 * @param {Array} resumes - Array of resume objects
 * @returns {Object|null} - Active resume or null
 */
export const getActiveResume = (resumes) => {
    if (!resumes || resumes.length === 0) return null;

    const active = resumes.find((resume) => resume.isActive);
    return active || null;
};

/**
 * Validate resume file (PDF only, max 10MB)
 * @param {File} file - File to validate
 * @returns {Object} - Validation result {valid, error}
 */
export const validateResumeFile = (file) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    // Check file type
    if (file.type !== 'application/pdf') {
        return { valid: false, error: 'Only PDF files are allowed' };
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }

    return { valid: true, error: null };
};

/**
 * Generate resume metadata from file
 * @param {File} file - Resume file
 * @returns {Object} - Metadata object
 */
export const generateResumeMetadata = (file) => {
    return {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date(),
    };
};

/**
 * Format resume version string
 * @param {string|number} version - Version number or string
 * @returns {string} - Formatted version (e.g., "v1.0")
 */
export const formatResumeVersion = (version) => {
    if (!version) return 'v1.0';

    if (typeof version === 'number') {
        return `v${version.toFixed(1)}`;
    }

    if (typeof version === 'string') {
        return version.startsWith('v') ? version : `v${version}`;
    }

    return 'v1.0';
};

/**
 * Get resume file extension
 * @param {string} fileName - File name
 * @returns {string} - File extension
 */
export const getFileExtension = (fileName) => {
    if (!fileName) return '';
    return fileName.split('.').pop().toLowerCase();
};

/**
 * Generate download filename
 * @param {string} baseName - Base name (e.g., "Prince Kumar")
 * @param {string} version - Version string
 * @returns {string} - Download filename
 */
export const generateDownloadFilename = (baseName = 'Resume', version = '') => {
    const sanitizedName = baseName.replace(/[^a-z0-9]/gi, '_');
    const versionStr = version ? `_${version}` : '';
    return `${sanitizedName}${versionStr}.pdf`;
};

/**
 * Calculate total resume downloads from analytics
 * @param {Array} resumes - Array of resume objects
 * @returns {number} - Total downloads
 */
export const getTotalDownloads = (resumes) => {
    if (!resumes || resumes.length === 0) return 0;

    return resumes.reduce((total, resume) => {
        return total + (resume.downloads || 0);
    }, 0);
};
