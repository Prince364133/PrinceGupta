// components/sections/InstagramFeed.jsx
'use client';

import { FaInstagram } from 'react-icons/fa';

export default function InstagramFeed() {
    const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'prince_gupta3608';

    return (
        <div className="card text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
                <FaInstagram className="w-8 h-8 text-pink-500" />
                <h3 className="text-2xl font-bold">Follow on Instagram</h3>
            </div>

            <p className="text-text-secondary mb-6">
                Stay updated with my latest work and behind-the-scenes content
            </p>

            <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
            >
                <FaInstagram className="w-5 h-5" />
                @{instagramHandle}
            </a>

            {/* Instagram Embed Placeholder */}
            <div className="mt-8 p-8 bg-hover rounded-lg border-2 border-dashed border-border">
                <p className="text-text-muted text-sm">
                    Instagram feed will appear here once configured
                </p>
            </div>
        </div>
    );
}
