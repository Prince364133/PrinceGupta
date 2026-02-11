// app/admin/profile/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/ui/FileUpload';
import Loader from '@/components/ui/Loader';
import { getAllDocuments, updateDocument, addDocument } from '@/lib/firebase/firestore';
import { uploadProfileImage } from '@/lib/firebase/storage';
import { COLLECTIONS } from '@/lib/schema/collections';
import { trackPageView } from '@/lib/firebase/analytics';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
    const [profile, setProfile] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        heroImage: '',
        location: '',
        email: '',
        phone: '',
        yearsOfExperience: 0,
        projectsCompleted: 0,
        startupsLaunched: 0,
        technologiesMastered: 0,
    });

    useEffect(() => {
        trackPageView('admin_profile', 'Admin Profile');
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profiles = await getAllDocuments(COLLECTIONS.PROFILE);
            if (profiles.length > 0) {
                const profileData = profiles[0];
                setProfile(profileData);
                setProfileId(profileData.id);
                setFormData({
                    name: profileData.name || '',
                    title: profileData.title || '',
                    bio: profileData.bio || '',
                    heroImage: profileData.heroImage || '',
                    location: profileData.location || '',
                    email: profileData.email || '',
                    phone: profileData.phone || '',
                    yearsOfExperience: profileData.yearsOfExperience || 0,
                    projectsCompleted: profileData.projectsCompleted || 0,
                    startupsLaunched: profileData.startupsLaunched || 0,
                    technologiesMastered: profileData.technologiesMastered || 0,
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.error('Failed to load profile');
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
            setUploading(true);
            const { url } = await uploadProfileImage(file, (progress) => {
                console.log('Upload progress:', progress);
            });
            setFormData((prev) => ({ ...prev, heroImage: url }));
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (profileId) {
                // Update existing profile
                await updateDocument(COLLECTIONS.PROFILE, profileId, formData);
                toast.success('Profile updated successfully');
            } else {
                // Create new profile
                const newProfile = await addDocument(COLLECTIONS.PROFILE, formData);
                setProfileId(newProfile.id);
                toast.success('Profile created successfully');
            }
            await loadProfile();
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
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
                <h1 className="text-4xl font-bold mb-2">Profile Management</h1>
                <p className="text-text-secondary">
                    Update your personal information and profile details
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <form onSubmit={handleSubmit}>
                        {/* Profile Image */}
                        <FileUpload
                            label="Profile Image"
                            accept="image/*"
                            value={formData.heroImage}
                            onChange={handleImageUpload}
                            onClear={() => setFormData((prev) => ({ ...prev, heroImage: '' }))}
                            preview
                            maxSize={5}
                        />

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />

                            <Input
                                label="Professional Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Full-Stack Developer"
                            />
                        </div>

                        <Textarea
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us about yourself..."
                        />

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                            />

                            <Input
                                label="Phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                            />

                            <Input
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="San Francisco, CA"
                            />
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Input
                                label="Years of Experience"
                                name="yearsOfExperience"
                                type="number"
                                value={formData.yearsOfExperience}
                                onChange={handleChange}
                                min="0"
                            />

                            <Input
                                label="Projects Completed"
                                name="projectsCompleted"
                                type="number"
                                value={formData.projectsCompleted}
                                onChange={handleChange}
                                min="0"
                            />

                            <Input
                                label="Startups Launched"
                                name="startupsLaunched"
                                type="number"
                                value={formData.startupsLaunched}
                                onChange={handleChange}
                                min="0"
                            />

                            <Input
                                label="Technologies Mastered"
                                name="technologiesMastered"
                                type="number"
                                value={formData.technologiesMastered}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 mt-6">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={saving || uploading}
                            >
                                {saving ? 'Saving...' : profileId ? 'Update Profile' : 'Create Profile'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
