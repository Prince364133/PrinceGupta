// app/admin/skills/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Loader from '@/components/ui/Loader';
import { getAllDocuments, updateDocument, addDocument, deleteDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        level: 80,
        icon: '',
        order: 0,
    });

    const categories = [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'database', label: 'Database' },
        { value: 'devops', label: 'DevOps' },
        { value: 'tools', label: 'Tools' },
        { value: 'other', label: 'Other' },
    ];

    useEffect(() => {
        trackPageView('admin_skills', 'Admin Skills');
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.SKILLS);
            docs.sort((a, b) => (a.order || 0) - (b.order || 0));
            setSkills(docs);
        } catch (error) {
            console.error('Error loading skills:', error);
            toast.error('Failed to load skills');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editing) {
                await updateDocument(COLLECTIONS.SKILLS, editing, formData);
                toast.success('Skill updated');
            } else {
                await addDocument(COLLECTIONS.SKILLS, formData);
                toast.success('Skill added');
            }
            resetForm();
            await loadSkills();
        } catch (error) {
            console.error('Error saving skill:', error);
            toast.error('Failed to save skill');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name || '',
            category: item.category || '',
            level: item.level || 80,
            icon: item.icon || '',
            order: item.order || 0,
        });
        setEditing(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            await deleteDocument(COLLECTIONS.SKILLS, id);
            toast.success('Skill deleted');
            await loadSkills();
        } catch (error) {
            console.error('Error deleting skill:', error);
            toast.error('Failed to delete skill');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            level: 80,
            icon: '',
            order: 0,
        });
        setEditing(null);
        setShowForm(false);
    };

    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
    }, {});

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
                    <h1 className="text-4xl font-bold mb-2">Skills Management</h1>
                    <p className="text-text-secondary">Manage your technical skills</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowForm(!showForm)}
                    icon={<FaPlus />}
                >
                    {showForm ? 'Cancel' : 'Add Skill'}
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
                            {editing ? 'Edit Skill' : 'Add Skill'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Skill Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="React.js"
                                />

                                <Select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    options={categories}
                                    required
                                />

                                <Input
                                    label="Proficiency Level (%)"
                                    name="level"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.level}
                                    onChange={handleChange}
                                    required
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
                                    label="Icon (optional)"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    placeholder="FaReact"
                                    className="md:col-span-2"
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-4">
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
            <div className="space-y-6">
                {skills.length === 0 ? (
                    <Card>
                        <p className="text-center text-text-secondary py-8">
                            No skills yet. Click "Add Skill" to get started.
                        </p>
                    </Card>
                ) : (
                    Object.entries(groupedSkills).map(([category, categorySkills]) => (
                        <div key={category}>
                            <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categorySkills.map((skill) => (
                                    <motion.div
                                        key={skill.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <Card>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-bold">{skill.name}</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(skill)}
                                                        className="p-1 hover:bg-hover rounded transition-colors"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(skill.id)}
                                                        className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-surface rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all"
                                                        style={{ width: `${skill.level}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium">{skill.level}%</span>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
