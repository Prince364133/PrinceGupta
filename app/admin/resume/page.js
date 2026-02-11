// app/admin/resume/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/ui/FileUpload';
import Loader from '@/components/ui/Loader';
import { getAllDocuments, updateDocument, addDocument, deleteDocument } from '@/lib/firebase/firestore';
import { uploadResume, deleteFile } from '@/lib/firebase/storage';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import toast from 'react-hot-toast';
import { FaDownload, FaTrash, FaEye, FaFileAlt, FaCalendar } from 'react-icons/fa';
import { formatFileSize, formatResumeVersion } from '@/lib/utils/resumeUtils';

export default function AdminResumePage() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        trackPageView('admin_resume', 'Admin Resume');
        loadResumes();
    }, []);

    const loadResumes = async () => {
        try {
            const resumeDocs = await getAllDocuments(COLLECTIONS.RESUME);
            // Sort by uploadedAt desc
            resumeDocs.sort((a, b) => {
                const dateA = a.uploadedAt?.toDate?.() || new Date(0);
                const dateB = b.uploadedAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            });
            setResumes(resumeDocs);
        } catch (error) {
            console.error('Error loading resumes:', error);
            toast.error('Failed to load resumes');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Please select a PDF file');
            return;
        }

        if (!formData.title) {
            toast.error('Please enter a title');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            // Upload file to storage
            const { fileUrl, fileName, fileSize, path } = await uploadResume(
                selectedFile,
                (progress) => {
                    setUploadProgress(progress);
                }
            );

            // Deactivate all existing resumes
            for (const resume of resumes) {
                if (resume.isActive) {
                    await updateDocument(COLLECTIONS.RESUME, resume.id, { isActive: false });
                }
            }

            // Create new resume document
            const resumeData = {
                title: formData.title,
                description: formData.description,
                fileUrl,
                fileName,
                fileSize,
                uploadedAt: new Date(),
                updatedAt: new Date(),
                version: resumes.length + 1,
                isActive: true,
            };

            await addDocument(COLLECTIONS.RESUME, resumeData);

            toast.success('Resume uploaded successfully');
            setFormData({ title: '', description: '' });
            setSelectedFile(null);
            setUploadProgress(0);
            await loadResumes();
        } catch (error) {
            console.error('Error uploading resume:', error);
            toast.error(error.message || 'Failed to upload resume');
        } finally {
            setUploading(false);
        }
    };

    const handleSetActive = async (resumeId) => {
        try {
            // Deactivate all resumes
            for (const resume of resumes) {
                await updateDocument(COLLECTIONS.RESUME, resume.id, { isActive: false });
            }

            // Activate selected resume
            await updateDocument(COLLECTIONS.RESUME, resumeId, { isActive: true });

            toast.success('Resume activated');
            await loadResumes();
        } catch (error) {
            console.error('Error activating resume:', error);
            toast.error('Failed to activate resume');
        }
    };

    const handleDelete = async (resume) => {
        if (!confirm('Are you sure you want to delete this resume?')) {
            return;
        }

        try {
            // Delete file from storage
            if (resume.path) {
                await deleteFile(resume.path);
            }

            // Delete document
            await deleteDocument(COLLECTIONS.RESUME, resume.id);

            toast.success('Resume deleted');
            await loadResumes();
        } catch (error) {
            console.error('Error deleting resume:', error);
            toast.error('Failed to delete resume');
        }
    };

    // Removed local formatFileSize and formatDate in favor of resumeUtils and inline formatting


    const formatDateDisplay = (date) => {
        if (!date) return 'N/A';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Resume Management</h1>
                <p className="text-text-secondary">
                    Upload and manage your resume. Only one resume can be active at a time.
                </p>
            </div>

            {/* Upload Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Upload New Resume</h2>
                    <form onSubmit={handleUpload}>
                        <Input
                            label="Resume Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Software Engineer Resume 2024"
                        />

                        <Textarea
                            label="Description (Optional)"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Brief description of this resume version..."
                        />

                        <FileUpload
                            label="Resume PDF"
                            accept=".pdf,application/pdf"
                            onChange={handleFileSelect}
                            onClear={() => setSelectedFile(null)}
                            maxSize={10}
                            required
                        />

                        {selectedFile && (
                            <div className="mb-4 p-4 bg-surface rounded-lg">
                                <p className="text-sm">
                                    <strong>Selected:</strong> {selectedFile.name}
                                </p>
                                <p className="text-sm text-text-muted">
                                    Size: {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        )}

                        {uploading && (
                            <div className="mb-4">
                                <div className="w-full bg-surface rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-text-muted mt-1">
                                    Uploading: {uploadProgress.toFixed(0)}%
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" variant="primary" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Upload Resume'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>

            {/* Resume List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="text-2xl font-bold mb-4">Uploaded Resumes</h2>

                {resumes.length === 0 ? (
                    <Card>
                        <p className="text-center text-text-secondary py-8">
                            No resumes uploaded yet.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {resumes.map((resume) => (
                            <Card key={resume.id}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold">{resume.title}</h3>
                                            {resume.isActive && (
                                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                                    Active
                                                </span>
                                            )}
                                        </div>

                                        {resume.description && (
                                            <p className="text-text-secondary mb-2">
                                                {resume.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-4 text-sm text-text-muted mt-2">
                                            <span className="flex items-center gap-1">
                                                <FaFileAlt className="w-3 h-3" /> Version: {formatResumeVersion(resume.version)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                Size: {formatFileSize(resume.fileSize)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaCalendar className="w-3 h-3" /> Uploaded: {formatDateDisplay(resume.uploadedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <a
                                            href={resume.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-hover rounded-lg transition-colors"
                                            title="View Resume"
                                        >
                                            <FaEye className="w-5 h-5" />
                                        </a>

                                        <a
                                            href={resume.fileUrl}
                                            download={resume.fileName}
                                            className="p-2 hover:bg-hover rounded-lg transition-colors"
                                            title="Download Resume"
                                        >
                                            <FaDownload className="w-5 h-5" />
                                        </a>

                                        {!resume.isActive && (
                                            <button
                                                onClick={() => handleSetActive(resume.id)}
                                                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                            >
                                                Set Active
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(resume)}
                                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                            title="Delete Resume"
                                        >
                                            <FaTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
