'use client';

import { useState } from 'react';
import { SEED_DATA } from './seed-data';
import { getAllDocuments, addDocument, updateDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminDataUploadPage() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({});
    const [logs, setLogs] = useState([]);

    const addLog = (message, type = 'info') => {
        setLogs(prev => [...prev, { message, type, timestamp: new Date() }]);
    };

    const handleUpload = async () => {
        if (!confirm('This will upload data to your portfolio. Continue?')) return;

        setUploading(true);
        setLogs([]);
        setProgress({});

        try {
            // 1. Upload Profile
            addLog('Checking Profile...', 'info');
            const profiles = await getAllDocuments(COLLECTIONS.PROFILE);
            if (profiles.length > 0) {
                // Update existing
                await updateDocument(COLLECTIONS.PROFILE, profiles[0].id, SEED_DATA.profile);
                addLog('Updated existing profile.', 'success');
            } else {
                // Create new
                await addDocument(COLLECTIONS.PROFILE, SEED_DATA.profile);
                addLog('Created new profile.', 'success');
            }
            setProgress(prev => ({ ...prev, profile: true }));

            // 2. Upload Collections (Skills, Projects, Startups, Experience)
            await uploadCollection(COLLECTIONS.SKILLS, SEED_DATA.skills, 'name');
            await uploadCollection(COLLECTIONS.PROJECTS, SEED_DATA.projects, 'title');
            await uploadCollection(COLLECTIONS.STARTUPS, SEED_DATA.startups, 'name');
            await uploadCollection(COLLECTIONS.EXPERIENCE, SEED_DATA.experience, 'company'); // Using company as unique identifier for now

            toast.success('Data upload complete!');

        } catch (error) {
            console.error('Upload failed:', error);
            addLog(`Upload failed: ${error.message}`, 'error');
            toast.error('Upload failed. Check logs.');
        } finally {
            setUploading(false);
        }
    };

    const uploadCollection = async (collectionName, data, uniqueKey) => {
        addLog(`Processing ${collectionName}...`, 'info');
        try {
            const existingDocs = await getAllDocuments(collectionName);
            const existingKeys = new Set(existingDocs.map(doc => doc[uniqueKey]));

            let added = 0;
            let skipped = 0;

            for (const item of data) {
                if (existingKeys.has(item[uniqueKey])) {
                    skipped++;
                    // Optional: Update existing if needed, but for now we skip to preserve manual changes
                } else {
                    await addDocument(collectionName, item);
                    added++;
                }
            }

            addLog(`${collectionName}: Added ${added}, Skipped ${skipped} (duplicates).`, 'success');
            setProgress(prev => ({ ...prev, [collectionName]: true }));

        } catch (error) {
            addLog(`Error processing ${collectionName}: ${error.message}`, 'error');
            throw error;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Data Upload Center</h1>
                <p className="text-text-secondary">
                    Seed your portfolio with the extracted data. This will not delete existing data, only add new items.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FaCloudUploadAlt className="text-primary" />
                        Ready to Upload
                    </h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between p-2 bg-surface rounded">
                            <span>Profile Data</span>
                            <span className="font-mono font-bold text-primary">Ready</span>
                        </div>
                        <div className="flex justify-between p-2 bg-surface rounded">
                            <span>Skills</span>
                            <span className="font-mono font-bold text-primary">{SEED_DATA.skills.length} items</span>
                        </div>
                        <div className="flex justify-between p-2 bg-surface rounded">
                            <span>Projects</span>
                            <span className="font-mono font-bold text-primary">{SEED_DATA.projects.length} items</span>
                        </div>
                        <div className="flex justify-between p-2 bg-surface rounded">
                            <span>Startups</span>
                            <span className="font-mono font-bold text-primary">{SEED_DATA.startups.length} items</span>
                        </div>
                        <div className="flex justify-between p-2 bg-surface rounded">
                            <span>Experience</span>
                            <span className="font-mono font-bold text-primary">{SEED_DATA.experience.length} items</span>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={handleUpload}
                        disabled={uploading}
                        icon={uploading ? <Loader size="sm" /> : <FaCloudUploadAlt />}
                    >
                        {uploading ? 'Uploading...' : 'Upload All Data'}
                    </Button>
                </Card>

                <Card className="p-6 h-[500px] overflow-hidden flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">Upload Logs</h2>
                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm bg-black/5 p-4 rounded-lg">
                        {logs.length === 0 && (
                            <p className="text-text-muted italic">Logs will appear here...</p>
                        )}
                        {logs.map((log, i) => (
                            <div key={i} className={`
                                ${log.type === 'error' ? 'text-red-500' :
                                    log.type === 'success' ? 'text-green-600' : 'text-text-secondary'}
                            `}>
                                <span className="opacity-50 mr-2">
                                    {log.timestamp.toLocaleTimeString()}
                                </span>
                                {log.message}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
