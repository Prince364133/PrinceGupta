// app/admin/education/page.js
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
import { uploadImage } from '@/lib/firebase/storage';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function AdminEducationPage() {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        description: '',
        achievements: [],
        image: '',
        order: 0,
    });
    const [achievementInput, setAchievementInput] = useState('');

    useEffect(() => {
        trackPageView('admin_education', 'Admin Education');
        loadEducation();
    }, []);

    const loadEducation = async () => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.EDUCATION);
            docs.sort((a, b) => (a.order || 0) - (b.order || 0));
            setEducation(docs);
        } catch (error) {
            console.error('Error loading education:', error);
            toast.error('Failed to load education');
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

    const handleImageUpload = async (file) => {
        try {
            const { url } = await uploadImage(file, 'education');
            setFormData((prev) => ({ ...prev, image: url }));
            toast.success('Image uploaded');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
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
                await updateDocument(COLLECTIONS.EDUCATION, editing, formData);
                toast.success('Education updated');
            } else {
                await addDocument(COLLECTIONS.EDUCATION, formData);
                toast.success('Education added');
            }
            resetForm();
            await loadEducation();
        } catch (error) {
            console.error('Error saving education:', error);
            toast.error('Failed to save education');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            institution: item.institution || '',
            degree: item.degree || '',
            field: item.field || '',
            startYear: item.startYear || '',
            endYear: item.endYear || '',
            description: item.description || '',
            achievements: item.achievements || [],
            image: item.image || '',
            order: item.order || 0,
        });
        setEditing(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this education entry?')) return;

        try {
            await deleteDocument(COLLECTIONS.EDUCATION, id);
            toast.success('Education deleted');
            await loadEducation();
        } catch (error) {
            console.error('Error deleting education:', error);
            toast.error('Failed to delete education');
        }
    };

    const resetForm = () => {
        setFormData({
            institution: '',
            degree: '',
            field: '',
            startYear: '',
            endYear: '',
            description: '',
            achievements: [],
            image: '',
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
                    <h1 className="text-4xl font-bold mb-2">Education Management</h1>
                    <p className="text-text-secondary">Manage your educational background</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowForm(!showForm)}
                    icon={<FaPlus />}
                >
                    {showForm ? 'Cancel' : 'Add Education'}
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
                            {editing ? 'Edit Education' : 'Add Education'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Institution"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleChange}
                                    required
                                    placeholder="University Name"
                                />

                                <Input
                                    label="Degree"
                                    name="degree"
                                    value={formData.degree}
                                    onChange={handleChange}
                                    required
                                    placeholder="Bachelor of Science"
                                />

                                <Input
                                    label="Field of Study"
                                    name="field"
                                    value={formData.field}
                                    onChange={handleChange}
                                    required
                                    placeholder="Computer Science"
                                />

                                <Input
                                    label="Order"
                                    name="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={handleChange}
                                    placeholder="0"
                                />

                                <Input
                                    label="Start Year"
                                    name="startYear"
                                    value={formData.startYear}
                                    onChange={handleChange}
                                    required
                                    placeholder="2018"
                                />

                                <Input
                                    label="End Year"
                                    name="endYear"
                                    value={formData.endYear}
                                    onChange={handleChange}
                                    placeholder="2022 or Present"
                                />
                            </div>

                            <Textarea
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Brief description of your education..."
                            />

                            <FileUpload
                                label="Institution Logo/Image"
                                accept="image/*"
                                value={formData.image}
                                onChange={handleImageUpload}
                                onClear={() => setFormData((prev) => ({ ...prev, image: '' }))}
                                preview
                            />

                            {/* Achievements */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Achievements
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
            <div className="space-y-4">
                {education.length === 0 ? (
                    <Card>
                        <p className="text-center text-text-secondary py-8">
                            No education entries yet. Click "Add Education" to get started.
                        </p>
                    </Card>
                ) : (
                    education.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <div className="flex items-start gap-4">
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.institution}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold">{item.degree}</h3>
                                        <p className="text-primary">{item.institution}</p>
                                        <p className="text-text-secondary text-sm">
                                            {item.field} • {item.startYear} - {item.endYear}
                                        </p>
                                        {item.description && (
                                            <p className="text-text-secondary mt-2">
                                                {item.description}
                                            </p>
                                        )}
                                        {item.achievements && item.achievements.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {item.achievements.map((achievement, i) => (
                                                    <li key={i} className="text-sm text-text-secondary">
                                                        • {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 hover:bg-hover rounded-lg transition-colors"
                                        >
                                            <FaEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                        >
                                            <FaTrash className="w-5 h-5" />
                                        </button>
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
