// app/admin/testimonials/page.js
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
import { uploadTestimonialImage } from '@/lib/firebase/storage';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaStar } from 'react-icons/fa';

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        image: '',
        content: '',
        rating: 5,
        featured: false,
        order: 0,
    });

    useEffect(() => {
        trackPageView('admin_testimonials', 'Admin Testimonials');
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.TESTIMONIALS);
            docs.sort((a, b) => (a.order || 0) - (b.order || 0));
            setTestimonials(docs);
        } catch (error) {
            console.error('Error loading testimonials:', error);
            toast.error('Failed to load testimonials');
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
            const { url } = await uploadTestimonialImage(file);
            setFormData((prev) => ({ ...prev, image: url }));
            toast.success('Image uploaded');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editing) {
                await updateDocument(COLLECTIONS.TESTIMONIALS, editing, formData);
                toast.success('Testimonial updated');
            } else {
                await addDocument(COLLECTIONS.TESTIMONIALS, formData);
                toast.success('Testimonial added');
            }
            resetForm();
            await loadTestimonials();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            toast.error('Failed to save testimonial');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name || '',
            role: item.role || '',
            company: item.company || '',
            image: item.image || '',
            content: item.content || '',
            rating: item.rating || 5,
            featured: item.featured || false,
            order: item.order || 0,
        });
        setEditing(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await deleteDocument(COLLECTIONS.TESTIMONIALS, id);
            toast.success('Testimonial deleted');
            await loadTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            toast.error('Failed to delete testimonial');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            company: '',
            image: '',
            content: '',
            rating: 5,
            featured: false,
            order: 0,
        });
        setEditing(null);
        setShowForm(false);
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
                    <h1 className="text-4xl font-bold mb-2">Testimonials Management</h1>
                    <p className="text-text-secondary">Manage client testimonials and reviews</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowForm(!showForm)}
                    icon={<FaPlus />}
                >
                    {showForm ? 'Cancel' : 'Add Testimonial'}
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
                            {editing ? 'Edit Testimonial' : 'Add Testimonial'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                />

                                <Input
                                    label="Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    placeholder="CEO"
                                />

                                <Input
                                    label="Company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tech Corp"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Rating"
                                        name="rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={formData.rating}
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
                                </div>
                            </div>

                            <Textarea
                                label="Testimonial Content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows={4}
                                required
                                placeholder="Write the testimonial content..."
                            />

                            <FileUpload
                                label="Profile Image"
                                accept="image/*"
                                value={formData.image}
                                onChange={handleImageUpload}
                                onClear={() => setFormData((prev) => ({ ...prev, image: '' }))}
                                preview
                            />

                            <div className="mb-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />
                                    <span>Featured testimonial</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.length === 0 ? (
                    <Card className="md:col-span-2">
                        <p className="text-center text-text-secondary py-8">
                            No testimonials yet. Click "Add Testimonial" to get started.
                        </p>
                    </Card>
                ) : (
                    testimonials.map((item, index) => (
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
                                            alt={item.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold">{item.name}</h3>
                                                <p className="text-sm text-text-secondary">
                                                    {item.role} at {item.company}
                                                </p>
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
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`w-4 h-4 ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-text-secondary text-sm">{item.content}</p>
                                        {item.featured && (
                                            <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div >
    );
}
