// app/admin/forms/page.js
'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { getAllDocuments, updateDocument, deleteDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/lib/schema/collections';
import { format } from 'date-fns';

export default function AdminFormsPage() {
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        try {
            const formDocs = await getAllDocuments(COLLECTIONS.FORMS, {
                orderBy: { field: 'createdAt', direction: 'desc' },
            });
            setForms(formDocs);
        } catch (error) {
            console.error('Error loading forms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (form) => {
        setSelectedForm(form);

        // Mark as read
        if (form.status === 'unread') {
            updateDocument(COLLECTIONS.FORMS, form.id, { status: 'read' });
            setForms(prev => prev.map(f => f.id === form.id ? { ...f, status: 'read' } : f));
        }
    };

    const handleDelete = async (form) => {
        if (!confirm('Are you sure you want to delete this form submission?')) return;

        try {
            await deleteDocument(COLLECTIONS.FORMS, form.id);
            setForms(prev => prev.filter(f => f.id !== form.id));
        } catch (error) {
            console.error('Error deleting form:', error);
            alert('Failed to delete form');
        }
    };

    const handleMarkAsReplied = async () => {
        if (!selectedForm) return;

        try {
            await updateDocument(COLLECTIONS.FORMS, selectedForm.id, { status: 'replied' });
            setForms(prev => prev.map(f => f.id === selectedForm.id ? { ...f, status: 'replied' } : f));
            setSelectedForm(null);
        } catch (error) {
            console.error('Error updating form:', error);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (value) => <span className="font-semibold">{value}</span>
        },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value === 'unread' ? 'bg-red-500/10 text-red-500' :
                        value === 'read' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-green-500/10 text-green-500'
                    }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Date',
            render: (value) => value ? format(value.toDate(), 'MMM dd, yyyy') : 'N/A'
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Form Submissions</h1>
                    <p className="text-text-secondary">Manage contact form submissions</p>
                </div>
            </div>

            <DataTable
                data={forms}
                columns={columns}
                onView={handleView}
                onDelete={handleDelete}
                loading={loading}
            />

            {/* View Modal */}
            {selectedForm && (
                <Modal
                    isOpen={!!selectedForm}
                    onClose={() => setSelectedForm(null)}
                    title="Form Submission Details"
                    size="lg"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-text-muted">Name</label>
                            <p className="text-lg">{selectedForm.name}</p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-text-muted">Email</label>
                            <p className="text-lg">{selectedForm.email}</p>
                        </div>

                        {selectedForm.phone && (
                            <div>
                                <label className="text-sm font-semibold text-text-muted">Phone</label>
                                <p className="text-lg">{selectedForm.phone}</p>
                            </div>
                        )}

                        {selectedForm.company && (
                            <div>
                                <label className="text-sm font-semibold text-text-muted">Company</label>
                                <p className="text-lg">{selectedForm.company}</p>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-semibold text-text-muted">Subject</label>
                            <p className="text-lg">{selectedForm.subject}</p>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-text-muted">Message</label>
                            <p className="text-lg whitespace-pre-wrap">{selectedForm.message}</p>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <p className="text-sm text-text-muted">
                                Submitted: {selectedForm.createdAt ? format(selectedForm.createdAt.toDate(), 'PPpp') : 'N/A'}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="primary" onClick={handleMarkAsReplied}>
                                Mark as Replied
                            </Button>
                            <a href={`mailto:${selectedForm.email}`}>
                                <Button variant="outline">Reply via Email</Button>
                            </a>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
