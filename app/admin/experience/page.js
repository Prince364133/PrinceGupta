// app/admin/experience/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Loader from '@/components/ui/Loader';
import { getAllDocuments, updateDocument, addDocument, deleteDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function AdminExperiencePage() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        responsibilities: [],
        technologies: [],
        order: 0,
    });
    const [responsibilityInput, setResponsibilityInput] = useState('');
    const [technologyInput, setTechnologyInput] = useState('');

    useEffect(() => {
        trackPageView('admin_experience', 'Admin Experience');
        loadExperiences();
    }, []);

    const loadExperiences = async () => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.EXPERIENCE);
            docs.sort((a, b) => (b.order || 0) - (a.order || 0));
            setExperiences(docs);
        } catch (error) {
            console.error('Error loading experiences:', error);
            toast.error('Failed to load experiences');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
        }));
    };

    const handleAddItem = (type) => {
        const input = type === 'responsibility' ? responsibilityInput : technologyInput;
        if (input.trim()) {
            setFormData((prev) => ({
                ...prev,
                [type === 'responsibility' ? 'responsibilities' : 'technologies']: [
                    ...prev[type === 'responsibility' ? 'responsibilities' : 'technologies'],
                    input.trim(),
                ],
            }));
            if (type === 'responsibility') {
                setResponsibilityInput('');
            } else {
                setTechnologyInput('');
            }
        }
    };

    const handleRemoveItem = (type, index) => {
        setFormData((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                ...formData,
                endDate: formData.current ? 'Present' : formData.endDate,
            };

            if (editing) {
                await updateDocument(COLLECTIONS.EXPERIENCE, editing, data);
                toast.success('Experience updated');
            } else {
                await addDocument(COLLECTIONS.EXPERIENCE, data);
                toast.success('Experience added');
            }
            resetForm();
            await loadExperiences();
        } catch (error) {
            console.error('Error saving experience:', error);
            toast.error('Failed to save experience');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            company: item.company || '',
            position: item.position || '',
            location: item.location || '',
            startDate: item.startDate || '',
            endDate: item.endDate === 'Present' ? '' : item.endDate || '',
            current: item.endDate === 'Present',
            description: item.description || '',
            responsibilities: item.responsibilities || [],
            technologies: item.technologies || [],
            order: item.order || 0,
        });
        setEditing(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            await deleteDocument(COLLECTIONS.EXPERIENCE, id);
            toast.success('Experience deleted');
            await loadExperiences();
        } catch (error) {
            console.error('Error deleting experience:', error);
            toast.error('Failed to delete experience');
        }
    };

    const resetForm = () => {
        setFormData({
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            responsibilities: [],
            technologies: [],
            order: 0,
        });
        setEditing(null);
        setShowForm(false);
        setResponsibilityInput('');
        setTechnologyInput('');
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
                    <h1 className="text-4xl font-bold mb-2">Experience Management</h1>
                    <p className="text-text-secondary">Manage your work experience</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowForm(!showForm)}
                    icon={<FaPlus />}
                >
                    {showForm ? 'Cancel' : 'Add Experience'}
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
                            {editing ? 'Edit Experience' : 'Add Experience'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    placeholder="Company Name"
                                />

                                <Input
                                    label="Position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    placeholder="Senior Developer"
                                />

                                <Input
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="San Francisco, CA"
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
                                    label="Start Date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    placeholder="Jan 2020"
                                />

                                <Input
                                    label="End Date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    disabled={formData.current}
                                    placeholder="Dec 2022"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="current"
                                        checked={formData.current}
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />
                                    <span>Currently working here</span>
                                </label>
                            </div>

                            <Textarea
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Brief description of your role..."
                            />

                            {/* Responsibilities */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Responsibilities
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={responsibilityInput}
                                        onChange={(e) => setResponsibilityInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('responsibility'))}
                                        className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Add a responsibility..."
                                    />
                                    <Button type="button" onClick={() => handleAddItem('responsibility')}>
                                        Add
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.responsibilities.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-surface rounded-lg"
                                        >
                                            <span>{item}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem('responsibilities', index)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Technologies */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Technologies Used
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={technologyInput}
                                        onChange={(e) => setTechnologyInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('technology'))}
                                        className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Add a technology..."
                                    />
                                    <Button type="button" onClick={() => handleAddItem('technology')}>
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.technologies.map((tech, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full"
                                        >
                                            <span>{tech}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem('technologies', index)}
                                                className="hover:text-red-500"
                                            >
                                                ×
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
                {experiences.length === 0 ? (
                    <Card>
                        <p className="text-center text-text-secondary py-8">
                            No experience entries yet. Click "Add Experience" to get started.
                        </p>
                    </Card>
                ) : (
                    experiences.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold">{item.position}</h3>
                                        <p className="text-primary">{item.company}</p>
                                        <p className="text-text-secondary text-sm">
                                            {item.location} • {item.startDate} - {item.endDate || 'Present'}
                                        </p>
                                        {item.description && (
                                            <p className="text-text-secondary mt-2">{item.description}</p>
                                        )}
                                        {item.responsibilities && item.responsibilities.length > 0 && (
                                            <div className="mt-2">
                                                <p className="font-medium text-sm mb-1">Responsibilities:</p>
                                                <ul className="space-y-1">
                                                    {item.responsibilities.map((resp, i) => (
                                                        <li key={i} className="text-sm text-text-secondary">
                                                            • {resp}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {item.technologies && item.technologies.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {item.technologies.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
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
