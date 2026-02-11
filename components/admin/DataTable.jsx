// components/admin/DataTable.jsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function DataTable({
    data,
    columns,
    onEdit,
    onDelete,
    onView,
    loading = false
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="card">
                <div className="text-center py-8 text-text-secondary">Loading...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="card">
                <div className="text-center py-8 text-text-secondary">No data available</div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            {columns.map((column) => (
                                <th key={column.key} className="text-left p-4 font-semibold text-text-secondary">
                                    {column.label}
                                </th>
                            ))}
                            <th className="text-right p-4 font-semibold text-text-secondary">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item) => (
                            <tr key={item.id} className="border-b border-border hover:bg-hover transition-colors">
                                {columns.map((column) => (
                                    <td key={column.key} className="p-4">
                                        {column.render ? column.render(item[column.key], item) : item[column.key]}
                                    </td>
                                ))}
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {onView && (
                                            <button
                                                onClick={() => onView(item)}
                                                className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                                                title="View"
                                            >
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-text-secondary">
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-lg transition-colors ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-hover text-text-secondary'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
