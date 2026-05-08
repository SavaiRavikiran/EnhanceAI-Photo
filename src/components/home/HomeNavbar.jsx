import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

export default function HomeNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-sm' : 'bg-transparent'
            }`}>
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to={createPageUrl('Home')} className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">EnhanceAI</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link to={createPageUrl('Pricing')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                    <ThemeToggle />
                    <Link to={createPageUrl('Dashboard')}>
                        <Button className="gradient-primary text-primary-foreground rounded-xl h-9 px-5 text-sm">
                            Get Started
                        </Button>
                    </Link>
                </div>

                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {mobileOpen && (
                <div className="md:hidden glass-strong border-t border-border/50 p-4 space-y-3">
                    <Link to={createPageUrl('Pricing')} className="block px-4 py-2 text-sm" onClick={() => setMobileOpen(false)}>Pricing</Link>
                    <Link to={createPageUrl('Dashboard')} onClick={() => setMobileOpen(false)}>
                        <Button className="w-full gradient-primary text-primary-foreground">Get Started</Button>
                    </Link>
                </div>
            )}
        </nav>
    );
}