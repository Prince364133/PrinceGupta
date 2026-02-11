// components/ui/Textarea.js
'use client';

export default function Textarea({
    label,
    error,
    className = '',
    required = false,
    rows = 4,
    ...props
}) {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-sm font-medium mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                rows={rows}
                className={`w-full px-4 py-2 bg-surface border rounded-lg focus:outline-none focus:ring-2 transition-all resize-vertical ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-border focus:ring-primary'
                    }`}
                {...props}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
