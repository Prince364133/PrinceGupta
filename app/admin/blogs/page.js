// app/admin/blogs/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import FileUpload from '@/components/ui/FileUpload';
import RichTextEditor from '@/components/ui/RichTextEditor';
import Loader from '@/components/ui/Loader';
import { getAllDocuments, updateDocument, addDocument, deleteDocument } from '@/lib/firebase/firestore';
import { uploadBlogImage } from '@/lib/firebase/storage';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import {
    generateSlug,
    calculateReadingTime,
    getBlogCategories,
    formatDate,
    truncateExcerpt,
} from '@/lib/utils/blogUtils';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaEye, FaSearch } from 'react-icons/fa';
import { serverTimestamp } from 'firebase/firestore';

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        coverImage: '',
        category: '',
        tags: [],
        author: 'Prince Kumar',
        status: 'draft',
        featured: false,
        readingTime: 0,
        metaTitle: '',
        metaDescription: '',
        ogImage: '',
    });
    const [tagInput, setTagInput] = useState('');

    const categories = getBlogCategories();
    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
    ];

    useEffect(() => {
        trackPageView('admin_blogs', 'Admin Blogs');
        loadBlogs();
    }, []);

    useEffect(() => {
        filterBlogs();
    }, [searchQuery, filterCategory, blogs]);

    const loadBlogs = async () => {
        try {
            const docs = await getAllDocuments(COLLECTIONS.BLOGS);
            docs.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            });
            setBlogs(docs);
        } catch (error) {
            console.error('Error loading blogs:', error);
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const filterBlogs = () => {
        let filtered = [...blogs];

        if (searchQuery) {
            filtered = filtered.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterCategory !== 'all') {
            filtered = filtered.filter((blog) => blog.category === filterCategory);
        }

        setFilteredBlogs(filtered);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };

            // Auto-generate slug from title
            if (name === 'title' && !editing) {
                updated.slug = generateSlug(value);
            }

            // Auto-generate excerpt if not manually set
            if (name === 'content') {
                updated.readingTime = calculateReadingTime(value);
                if (!prev.excerpt) {
                    updated.excerpt = truncateExcerpt(value, 160);
                }
            }

            return updated;
        });
    };

    const handleContentChange = (content) => {
        setFormData((prev) => ({
            ...prev,
            content,
            readingTime: calculateReadingTime(content),
            excerpt: prev.excerpt || truncateExcerpt(content, 160),
        }));
    };

    const handleCoverImageUpload = async (file) => {
        try {
            const slug = formData.slug || 'temp';
            const { url } = await uploadBlogImage(file, slug);
            setFormData((prev) => ({
                ...prev,
                coverImage: url,
                ogImage: prev.ogImage || url,
            }));
            toast.success('Cover image uploaded');
        } catch (error) {
            console.error('Error uploading cover image:', error);
            toast.error('Failed to upload cover image');
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (index) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                ...formData,
                updatedAt: serverTimestamp(),
            };

            if (editing) {
                await updateDocument(COLLECTIONS.BLOGS, editing, data);
                toast.success('Blog updated');
            } else {
                data.createdAt = serverTimestamp();
                data.publishedAt = formData.status === 'published' ? serverTimestamp() : null;
                data.views = 0;
                await addDocument(COLLECTIONS.BLOGS, data);
                toast.success('Blog created');
            }

            resetForm();
            await loadBlogs();
        } catch (error) {
            console.error('Error saving blog:', error);
            toast.error('Failed to save blog');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title || '',
            slug: item.slug || '',
            content: item.content || '',
            excerpt: item.excerpt || '',
            coverImage: item.coverImage || '',
            category: item.category || '',
            tags: item.tags || [],
            author: item.author || 'Prince Kumar',
            status: item.status || 'draft',
            featured: item.featured || false,
            readingTime: item.readingTime || 0,
            metaTitle: item.metaTitle || '',
            metaDescription: item.metaDescription || '',
            ogImage: item.ogImage || '',
        });
        setEditing(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            await deleteDocument(COLLECTIONS.BLOGS, id);
            toast.success('Blog deleted');
            await loadBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Failed to delete blog');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            coverImage: '',
            category: '',
            tags: [],
            author: 'Prince Kumar',
            status: 'draft',
            featured: false,
            readingTime: 0,
            metaTitle: '',
            metaDescription: '',
            ogImage: '',
        });
        setEditing(null);
        setShowForm(false);
        setTagInput('');
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
                    <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
                    <p className="text-text-secondary">Create and manage blog posts</p>
                </div>
                <Button variant="primary" onClick={() => setShowForm(!showForm)} icon={<FaPlus />}>
                    {showForm ? 'Cancel' : 'New Post'}
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
                            {editing ? 'Edit Blog Post' : 'Create New Post'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter blog title..."
                                    className="md:col-span-2"
                                />

                                <Input
                                    label="Slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    required
                                    placeholder="url-friendly-slug"
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
                                    options={statusOptions}
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <RichTextEditor
                                    content={formData.content}
                                    onChange={handleContentChange}
                                    placeholder="Write your blog content..."
                                />
                                <p className="text-sm text-text-secondary mt-1">
                                    Reading time: {formData.readingTime} min
                                </p>
                            </div>

                            <Textarea
                                label="Excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Short description (auto-generated from content if left empty)"
                            />

                            {/* Cover Image */}
                            <FileUpload
                                label="Cover Image"
                                accept="image/*"
                                value={formData.coverImage}
                                onChange={handleCoverImageUpload}
                                onClear={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                                preview
                            />

                            {/* Tags */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Tags</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) =>
                                            e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                                        }
                                        className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Add a tag..."
                                    />
                                    <Button type="button" onClick={handleAddTag}>
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(index)}
                                                className="hover:text-red-500"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SEO Fields */}
                            <div className="border-t border-border pt-4 mt-4">
                                <h3 className="text-lg font-bold mb-4">SEO Settings (Optional)</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <Input
                                        label="Meta Title"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleChange}
                                        placeholder="Leave empty to use blog title"
                                    />

                                    <Textarea
                                        label="Meta Description"
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Leave empty to use excerpt"
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="mb-4 mt-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />
                                    <span>Featured post</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={saving}>
                                    {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            )}

            {/* Search and Filter */}
            {!showForm && (
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search blogs..."
                            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {filteredBlogs.length === 0 ? (
                    <Card>
                        <p className="text-center text-text-secondary py-8">
                            {searchQuery || filterCategory !== 'all'
                                ? 'No blogs found matching your filters.'
                                : 'No blog posts yet. Click "New Post" to get started.'}
                        </p>
                    </Card>
                ) : (
                    filteredBlogs.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card>
                                <div className="flex items-start gap-4">
                                    {item.coverImage && (
                                        <img
                                            src={item.coverImage}
                                            alt={item.title}
                                            className="w-32 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold">{item.title}</h3>
                                                <p className="text-sm text-text-secondary">
                                                    {formatDate(item.createdAt, 'short')} •{' '}
                                                    {item.readingTime} min read
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
                                        <p className="text-text-secondary text-sm mb-2">
                                            {item.excerpt || truncateExcerpt(item.content, 120)}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${item.status === 'published'
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : 'bg-yellow-500/10 text-yellow-500'
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                            {item.category && (
                                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                    {
                                                        categories.find((c) => c.value === item.category)
                                                            ?.label
                                                    }
                                                </span>
                                            )}
                                            {item.featured && (
                                                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                            {item.views > 0 && (
                                                <span className="flex items-center gap-1 text-xs text-text-secondary">
                                                    <FaEye /> {item.views}
                                                </span>
                                            )}
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
