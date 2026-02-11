// app/admin/startups/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import FileUpload from '@/components/ui/FileUpload';
import Loader from '@/components/ui/Loader';
import { getAllDocuments, updateDocument, addDocument, deleteDocument } from '@/lib/firebase/firestore';
import { uploadImage } from '@/lib/firebase/storage';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';

export default function AdminStartupsPage() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        description: '',
        logo: '',
        website: '',
        industry: '',
        founded: '',
        status: 'active',
        role: '',
        achievements: [],
        order: 0,
    });
    const [achievementInput, setAchievementInput] = useState('');

    const statuses = [
        { value: 'active', label: 'Active' },
        { value: 'acquired', label: 'Acquired' },
        { value: 'closed', label: 'Closed' },
        { value: 'stealth', label: 'Stealth Mode' },
    ];

    useEffect(() => {
        trackPageView('admin_startups', 'Admin Startups');
        loadStartups();
    }, []);

    const loadStartups = async () => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.STARTUPS);
            docs.sort((a, b) => (a.order || 0) - (b.order || 0));
            setStartups(docs);
        } catch (error) {
            console.error('Error loading startups:', error);
            toast.error('Failed to load startups');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value,
        }));
    };

    const handleLogoUpload = async (file) => {
        try {
            const { url } = await uploadImage(file, 'startups');
            setFormData((prev) => ({ ...prev, logo: url }));
            toast.success('Logo uploaded');
        } catch (error) {
            console.error('Error uploading logo:', error);
            toast.error('Failed to upload logo');
        }
    };

    const handleAddAchievement = () => {
        if (achievementInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                achievements: [...prev.achievements, achievementInput.trim()],
            }));
            setAchievementInput('');
        }
    };

    const handleRemoveAchievement = (index) => {
        setFormData((prev) => ({
            ...prev,
            achievements: prev.achievements.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editing) {
                await updateDocument(COLLECTIONS.STARTUPS, editing, formData);
                toast.success('Startup updated');
            } else {
                await addDocument(COLLECTIONS.STARTUPS, formData);
                toast.success('Startup added');
            }
            resetForm();
            await loadStartups();
        } catch (error) {
            console.error('Error saving startup:', error);
            toast.error('Failed to save startup');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name || '',
            tagline: item.tagline || '',
            description: item.description || '',
            logo: item.logo || '',
            website: item.website || '',
            industry: item.industry || '',
            founded: item.founded || '',
            status: item.status || 'active',
            role: item.role || '',
            achievements: item.achievements || [],
            order: item.order || 0,
        });
        setEditing(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this startup?')) return;

        try {
            await deleteDocument(COLLECTIONS.STARTUPS, id);
            toast.success('Startup deleted');
            await loadStartups();
        } catch (error) {
            console.error('Error deleting startup:', error);
            toast.error('Failed to delete startup');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            tagline: '',
            description: '',
            logo: '',
            website: '',
            industry: '',
            founded: '',
            status: 'active',
            role: '',
            achievements: [],
            order: 0,
        });
        setEditing(null);
        setShowForm(false);
        setAchievementInput('');
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
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Startups Management</h1>
                    <p className="text-text-secondary">Manage your entrepreneurial ventures</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowForm(!showForm)}
                    icon={<FaPlus />}
                >
                    {showForm ? 'Cancel' : 'Add Startup'}
                </Button>
            </div>

            {/* Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Card>
                        <h2 className="text-2xl font-bold mb-4">
                            {editing ? 'Edit Startup' : 'Add Startup'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Startup Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="TechVenture Inc."
                                    className="md:col-span-2"
                                />

                                <Input
                                    label="Tagline"
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleChange}
                                    required
                                    placeholder="Revolutionizing the industry"
                                    className="md:col-span-2"
                                />

                                <Textarea
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    placeholder="Detailed description of the startup..."
                                    className="md:col-span-2"
                                />

                                <Input
                                    label="Industry"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    required
                                    placeholder="FinTech"
                                />

                                <Input
                                    label="Founded Year"
                                    name="founded"
                                    value={formData.founded}
                                    onChange={handleChange}
                                    required
                                    placeholder="2022"
                                />

                                <Input
                                    label="Your Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    placeholder="Co-Founder & CTO"
                                />

                                <Select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    options={statuses}
                                    required
                                />

                                <Input
                                    label="Website"
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://startup.com"
                                />

                                <Input
                                    label="Order"
                                    name="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>

                            <FileUpload
                                label="Startup Logo"
                                accept="image/*"
                                value={formData.logo}
                                onChange={handleLogoUpload}
                                onClear={() => setFormData((prev) => ({ ...prev, logo: '' }))}
                                preview
                            />

                            {/* Achievements */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Key Achievements
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={achievementInput}
                                        onChange={(e) => setAchievementInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                                        className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Add an achievement..."
                                    />
                                    <Button type="button" onClick={handleAddAchievement}>
                                        Add
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.achievements.map((achievement, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-surface rounded-lg"
                                        >
                                            <span>{achievement}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAchievement(index)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={saving}>
                                    {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {startups.length === 0 ? (
                    <Card className="md:col-span-2">
                        <p className="text-center text-text-secondary py-8">
                            No startups yet. Click "Add Startup" to get started.
                        </p>
                    </Card>
                ) : (
                    startups.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <div className="flex items-start gap-4">
                                    {item.logo && (
                                        <img
                                            src={item.logo}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold">{item.name}</h3>
                                                <p className="text-primary text-sm">{item.tagline}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 hover:bg-hover rounded-lg transition-colors"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-text-secondary text-sm mb-2">
                                            {item.role} • {item.industry} • Founded {item.founded}
                                        </p>
                                        <p className="text-text-secondary text-sm mb-2">{item.description}</p>
                                        {item.achievements && item.achievements.length > 0 && (
                                            <div className="mb-2">
                                                <p className="font-medium text-sm mb-1">Achievements:</p>
                                                <ul className="space-y-1">
                                                    {item.achievements.slice(0, 2).map((achievement, i) => (
                                                        <li key={i} className="text-xs text-text-secondary">
                                                            • {achievement}
                                                        </li>
                                                    ))}
                                                    {item.achievements.length > 2 && (
                                                        <li className="text-xs text-text-secondary">
                                                            +{item.achievements.length - 2} more
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {item.website && (
                                                <a
                                                    href={item.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline text-sm flex items-center gap-1"
                                                >
                                                    <FaExternalLinkAlt className="w-3 h-3" />
                                                    Website
                                                </a>
                                            )}
                                            <span
                                                className={`ml-auto px-2 py-1 text-xs rounded-full ${item.status === 'active'
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : item.status === 'acquired'
                                                            ? 'bg-blue-500/10 text-blue-500'
                                                            : 'bg-gray-500/10 text-gray-500'
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
