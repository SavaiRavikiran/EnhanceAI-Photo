import React from 'react';
import { Card } from '@/components/ui/card';
import { Zap, Image, Download, TrendingUp } from 'lucide-react';

const stats = [
    { key: 'credits', label: 'Credits Left', icon: Zap, color: 'text-primary' },
    { key: 'enhancements', label: 'Total Enhancements', icon: Image, color: 'text-chart-2' },
    { key: 'downloads', label: 'Downloads', icon: Download, color: 'text-chart-3' },
    { key: 'plan', label: 'Current Plan', icon: TrendingUp, color: 'text-chart-4', isPlan: true },
];

export default function StatsCards({ user, jobCount }) {
    const values = {
        credits: user?.credits ?? 5,
        enhancements: user?.total_enhancements ?? 0,
        downloads: jobCount ?? 0,
        plan: (user?.plan || 'free').charAt(0).toUpperCase() + (user?.plan || 'free').slice(1),
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
                <Card key={s.key} className="p-5 bg-card/50 backdrop-blur-sm border-border/50 hover:glow-sm transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                        <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <p className="text-2xl font-bold">{values[s.key]}</p>
                </Card>
            ))}
        </div>
    );
}