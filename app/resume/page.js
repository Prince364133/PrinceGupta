// app/resume/page.js
'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { getAllDocuments } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView, trackResumeDownload } from '@/lib/firebase/analytics';
import { getActiveResume, formatFileSize, formatResumeVersion } from '@/lib/utils/resumeUtils';
import { FaDownload, FaFileAlt, FaCalendar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Dynamically import react-pdf components to avoid SSR issues
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });
const pdfjs = dynamic(() => import('react-pdf').then(mod => mod.pdfjs), { ssr: false });

export default function ResumePage() {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfError, setPdfError] = useState(false);
    const [scale, setScale] = useState(1.0);

    // Effect to set worker and load data on client side
    useEffect(() => {
        // Set PDF.js worker
        import('react-pdf').then(mod => {
            const { pdfjs } = mod;
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        });

        trackPageView('resume', 'Resume');
        loadResume();

        // Adjust scale based on screen size
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setScale(0.6);
            } else if (window.innerWidth < 1024) {
                setScale(0.8);
            } else {
                setScale(1.0);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadResume = async () => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.RESUME);
            const activeResume = getActiveResume(docs);
            setResume(activeResume);
        } catch (error) {
            console.error('Error loading resume:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!resume) return;

        try {
            // Track download
            await trackResumeDownload(resume.id, resume.fileName);

            // Create download link
            const link = document.createElement('a');
            link.href = resume.fileUrl;
            link.download = resume.fileName || 'Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading resume:', error);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPdfError(false);
    };

    const onDocumentLoadError = (error) => {
        console.error('Error loading PDF:', error);
        setPdfError(true);
    };

    const goToPrevPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="min-h-screen py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <Card className="text-center py-16">
                        <FaFileAlt className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
                        <h1 className="text-3xl font-bold mb-4">Resume Not Available</h1>
                        <p className="text-text-secondary mb-6">
                            The resume is currently not available. Please check back later.
                        </p>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold mb-4">Resume</h1>
                    <p className="text-xl text-text-secondary mb-6">
                        View and download my professional resume
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                        {resume.version && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                                <FaFileAlt className="text-primary" />
                                <span className="text-sm">
                                    Version: {formatResumeVersion(resume.version)}
                                </span>
                            </div>
                        )}
                        {resume.uploadedAt && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                                <FaCalendar className="text-primary" />
                                <span className="text-sm">
                                    Updated: {new Date(resume.uploadedAt.toDate()).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        {resume.fileSize && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                                <span className="text-sm">Size: {formatFileSize(resume.fileSize)}</span>
                            </div>
                        )}
                    </div>

                    {/* Download Button */}
                    <Button
                        variant="primary"
                        size="lg"
                        icon={<FaDownload />}
                        onClick={handleDownload}
                    >
                        Download Resume
                    </Button>
                </motion.div>

                {/* PDF Viewer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-0 overflow-hidden">
                        {pdfError ? (
                            <div className="text-center py-16 px-4">
                                <p className="text-red-500 mb-4">
                                    Failed to load PDF. Please try downloading instead.
                                </p>
                                <Button variant="primary" icon={<FaDownload />} onClick={handleDownload}>
                                    Download Resume
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* PDF Document */}
                                <div className="flex justify-center bg-gray-900 p-4">
                                    <Document
                                        file={resume.fileUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={onDocumentLoadError}
                                        loading={
                                            <div className="flex items-center justify-center h-96">
                                                <Loader size="lg" />
                                            </div>
                                        }
                                    >
                                        <Page
                                            pageNumber={pageNumber}
                                            scale={scale}
                                            renderTextLayer={true}
                                            renderAnnotationLayer={true}
                                        />
                                    </Document>
                                </div>

                                {/* Page Controls */}
                                {numPages && numPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 p-4 border-t border-border">
                                        <Button
                                            variant="secondary"
                                            onClick={goToPrevPage}
                                            disabled={pageNumber <= 1}
                                            icon={<FaChevronLeft />}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm">
                                            Page {pageNumber} of {numPages}
                                        </span>
                                        <Button
                                            variant="secondary"
                                            onClick={goToNextPage}
                                            disabled={pageNumber >= numPages}
                                            icon={<FaChevronRight />}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-center"
                >
                    <p className="text-text-secondary text-sm">
                        For the best viewing experience, download the PDF or view on a larger screen.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
