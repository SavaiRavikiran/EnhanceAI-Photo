import React from 'react';
import { api } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentJobs from '@/components/dashboard/RecentJobs';
import UsageChart from '@/components/dashboard/UsageChart';

export default function Dashboard() {
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => api.auth.me(),
        retry: false,
    });

    const { data: jobs = [] } = useQuery({
        queryKey: ['jobs'],
        queryFn: () => api.entities.EnhancementJob.list('-created_date', 50),
        retry: false,
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}</h1>
                    <p className="text-muted-foreground text-sm mt-1">Here's an overview of your image enhancements</p>
                </div>
                <Link to={createPageUrl('Enhance')}>
                    <Button className="gradient-primary text-primary-foreground rounded-xl glow">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Enhance Image
                    </Button>
                </Link>
            </div>

            <StatsCards user={user} jobCount={Array.isArray(jobs) ? jobs.filter(j => j.status === 'completed').length : 0} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Enhancements</h2>
                    <RecentJobs jobs={Array.isArray(jobs) ? jobs.slice(0, 10) : []} onViewJob={() => { }} />
                </div>
                <div className="lg:col-span-2">
                    <UsageChart jobs={jobs} />
                </div>
            </div>
        </div>
    );
}