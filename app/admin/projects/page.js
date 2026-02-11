// app/admin/projects/page.js
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
import { FaEdit, FaTrash, FaPlus, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        longDescription: '',
        image: '',
        technologies: [],
        category: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
        status: 'completed',
        order: 0,
    });
    const [technologyInput, setTechnologyInput] = useState('');

    const categories = [
        { value: 'web', label: 'Web Application' },
        { value: 'mobile', label: 'Mobile App' },
        { value: 'desktop', label: 'Desktop App' },
        { value: 'api', label: 'API/Backend' },
        { value: 'other', label: 'Other' },
    ];

    const statuses = [
        { value: 'completed', label: 'Completed' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'planned', label: 'Planned' },
    ];

    useEffect(() => {
        trackPageView('admin_projects', 'Admin Projects');
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.PROJECTS);
            docs.sort((a, b) => (a.order || 0) - (b.order || 0));
            setProjects(docs);
        } catch (error) {
            console.error('Error loading projects:', error);
            toast.error('Failed to load projects');
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

    const handleImageUpload = async (file) => {
        try {
            const { url } = await uploadImage(file, 'projects');
            setFormData((prev) => ({ ...prev, image: url }));
            toast.success('Image uploaded');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        }
    };

    const handleAddTechnology = () => {
        if (technologyInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                technologies: [...prev.technologies, technologyInput.trim()],
            }));
            setTechnologyInput('');
        }
    };

    const handleRemoveTechnology = (index) => {
        setFormData((prev) => ({
            ...prev,
            technologies: prev.technologies.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editing) {
                await updateDocument(COLLECTIONS.PROJECTS, editing, formData);
                toast.success('Project updated');
            } else {
                await addDocument(COLLECTIONS.PROJECTS, formData);
                toast.success('Project added');
            }
            resetForm();
            await loadProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Failed to save project');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title || '',
            description: item.description || '',
            longDescription: item.longDescription || '',
            image: item.image || '',
            technologies: item.technologies || [],
            category: item.category || '',
            liveUrl: item.liveUrl || '',
            githubUrl: item.githubUrl || '',
            featured: item.featured || false,
            status: item.status || 'completed',
            order: item.order || 0,
        });
        setEditing(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await deleteDocument(COLLECTIONS.PROJECTS, id);
            toast.success('Project deleted');
            await loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            longDescription: '',
            image: '',
            technologies: [],
            category: '',
            liveUrl: '',
            githubUrl: '',
            featured: false,
            status: 'completed',
            order: 0,
        });
        setEditing(null);
        setShowForm(false);
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
                    <h1 className="text-4xl font-bold mb-2">Projects Management</h1>
                    <p className="text-text-secondary">Manage your portfolio projects</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowForm(!showForm)}
                    icon={<FaPlus />}
                >
                    {showForm ? 'Cancel' : 'Add Project'}
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
                            {editing ? 'Edit Project' : 'Add Project'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Project Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="E-Commerce Platform"
                                    className="md:col-span-2"
                                />

                                <Textarea
                                    label="Short Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={2}
                                    required
                                    placeholder="Brief project description..."
                                    className="md:col-span-2"
                                />

                                <Textarea
                                    label="Long Description"
                                    name="longDescription"
                                    value={formData.longDescription}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Detailed project description..."
                                    className="md:col-span-2"
                                />

                                <Select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    options={categories}
                                    required
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
                                    label="Live URL"
                                    name="liveUrl"
                                    type="url"
                                    value={formData.liveUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                />

                                <Input
                                    label="GitHub URL"
                                    name="githubUrl"
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
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
                                label="Project Image"
                                accept="image/*"
                                value={formData.image}
                                onChange={handleImageUpload}
                                onClear={() => setFormData((prev) => ({ ...prev, image: '' }))}
                                preview
                            />

                            {/* Technologies */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Technologies
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={technologyInput}
                                        onChange={(e) => setTechnologyInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                                        className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Add a technology..."
                                    />
                                    <Button type="button" onClick={handleAddTechnology}>
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
                                                onClick={() => handleRemoveTechnology(index)}
                                                className="hover:text-red-500"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />
                                    <span>Featured project</span>
                                </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.length === 0 ? (
                    <Card className="md:col-span-2 lg:col-span-3">
                        <p className="text-center text-text-secondary py-8">
                            No projects yet. Click "Add Project" to get started.
                        </p>
                    </Card>
                ) : (
                    projects.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-bold">{item.title}</h3>
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
                                <p className="text-text-secondary text-sm mb-3">{item.description}</p>
                                {item.technologies && item.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {item.technologies.slice(0, 3).map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {item.technologies.length > 3 && (
                                            <span className="px-2 py-1 bg-surface text-xs rounded-full">
                                                +{item.technologies.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    {item.liveUrl && (
                                        <a
                                            href={item.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-sm flex items-center gap-1"
                                        >
                                            <FaExternalLinkAlt className="w-3 h-3" />
                                            Live
                                        </a>
                                    )}
                                    {item.githubUrl && (
                                        <a
                                            href={item.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-sm flex items-center gap-1"
                                        >
                                            <FaGithub className="w-3 h-3" />
                                            Code
                                        </a>
                                    )}
                                    {item.featured && (
                                        <span className="ml-auto px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
