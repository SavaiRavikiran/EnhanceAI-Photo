import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
    const [dark, setDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            setDark(true);
        } else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDark(true);
        }
    }, []);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(!dark)}
            className="h-9 w-9 rounded-full"
        >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    );
}