import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

export default function UsageChart({ jobs }) {
    const chartData = useMemo(() => {
        const days = 14;
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = startOfDay(subDays(new Date(), i));
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayJobs = (jobs || []).filter((j) => {
                if (!j.created_date) return false;
                return format(new Date(j.created_date), 'yyyy-MM-dd') === dateStr;
            });
            data.push({
                date: format(date, 'MMM d'),
                enhancements: dayJobs.length,
                credits: dayJobs.reduce((sum, j) => sum + (j.credits_used || 1), 0),
            });
        }
        return data;
    }, [jobs]);

    return (
        <Card className="p-6 bg-card/50 border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Usage (14 days)</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                background: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '12px',
                                fontSize: '12px',
                            }}
                        />
                        <Area type="monotone" dataKey="enhancements" stroke="hsl(var(--primary))" fill="url(#gradient)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}