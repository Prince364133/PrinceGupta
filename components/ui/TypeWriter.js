// components/ui/TypeWriter.js
'use client';

import { useState, useEffect } from 'react';

export default function TypeWriter({
    words = [],
    typingSpeed = 150,
    deletingSpeed = 100,
    pauseTime = 2000,
}) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (words.length === 0) return;

        const currentFullWord = words[currentWordIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                setCurrentText(currentFullWord.substring(0, currentText.length + 1));

                if (currentText === currentFullWord) {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                // Deleting
                setCurrentText(currentFullWord.substring(0, currentText.length - 1));

                if (currentText === '') {
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, words, currentWordIndex, typingSpeed, deletingSpeed, pauseTime]);

    return (
        <span className="relative">
            {currentText}
            <span className="inline-block w-[2px] h-[1em] bg-primary ml-1 animate-pulse align-middle" />
        </span>
    );
}
