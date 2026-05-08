import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/lib/AuthContext';
import {
    LayoutDashboard,
    Sparkles,
    Clock,
    CreditCard,
    Shield,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreditBadge from '@/components/CreditBadge';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
    { name: 'Dashboard', path: '/Dashboard', icon: LayoutDashboard },
    { name: 'Enhance', path: '/Enhance', icon: Sparkles },
    { name: 'History', path: '/History', icon: Clock },
    { name: 'Pricing', path: '/Pricing', icon: CreditCard },
    { name: 'Admin', path: '/Admin', icon: Shield },
];

export default function Layout() {
    const { user, isAuthenticated, logout, navigateToLogin } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-border">
                    <Link to={createPageUrl('Home')} className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">EnhanceAI</span>
                    </Link>
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                    }`}
                            >
                                <item.icon className="h-4.5 w-4.5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border space-y-3">
                    <ThemeToggle />
                    {isAuthenticated && user && (
                        <div className="space-y-3">
                            <CreditBadge credits={user.credits ?? 0} />
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user.full_name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => logout()}>
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                    {!isAuthenticated && (
                        <Button className="w-full gradient-primary text-primary-foreground rounded-xl" onClick={navigateToLogin}>
                            Sign In
                        </Button>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile header */}
                <header className="lg:hidden h-14 flex items-center px-4 border-b border-border bg-card">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 ml-3">
                        <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
                            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-sm">EnhanceAI</span>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
