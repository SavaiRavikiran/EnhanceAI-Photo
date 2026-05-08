import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Image, Download, Search, Filter, CheckCircle2, Clock, AlertCircle, Loader2, Eye } from 'lucide-react';
import ImageComparison from '@/components/enhance/ImageComparison';

const statusConfig = {
    pending: { icon: Clock, label: 'Pending', className: 'bg-muted text-muted-foreground' },
    processing: { icon: Loader2, label: 'Processing', className: 'bg-accent text-accent-foreground' },
    completed: { icon: CheckCircle2, label: 'Completed', className: 'bg-primary/10 text-primary' },
    failed: { icon: AlertCircle, label: 'Failed', className: 'bg-destructive/10 text-destructive' },
};

export default function History() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedJob, setSelectedJob] = useState(null);

    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ['allJobs'],
        queryFn: () => api.entities.EnhancementJob.list('-created_date', 100),
        retry: false,
    });

    const filtered = jobs.filter((job) => {
        const matchSearch = !search || job.file_name?.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === 'all' || job.enhancement_type === filterType;
        const matchStatus = filterStatus === 'all' || job.status === filterStatus;
        return matchSearch && matchType && matchStatus;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-1">Enhancement History</h1>
                <p className="text-muted-foreground text-sm">View all your past image enhancements</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by file name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-xl"
                    />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-48 rounded-xl">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="upscale_2x">Upscale 2×</SelectItem>
                        <SelectItem value="upscale_4x">Upscale 4×</SelectItem>
                        <SelectItem value="face_restore">Face Restore</SelectItem>
                        <SelectItem value="denoise">Denoise</SelectItem>
                        <SelectItem value="color_correct">Color Correct</SelectItem>
                        <SelectItem value="old_photo_restore">Photo Restore</SelectItem>
                        <SelectItem value="sharpen">Sharpen</SelectItem>
                        <SelectItem value="prompt_enhance">Prompt Enhance</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 rounded-xl">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : filtered.length === 0 ? (
                <Card className="p-12 text-center bg-card/50">
                    <Image className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No enhancements found</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((job) => {
                        const status = statusConfig[job.status] || statusConfig.pending;
                        const StatusIcon = status.icon;
                        return (
                            <Card
                                key={job.id}
                                className="overflow-hidden bg-card/50 border-border/50 hover:glow-sm transition-all duration-300 cursor-pointer group"
                                onClick={() => setSelectedJob(job)}
                            >
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    {job.original_image_url ? (
                                        <img src={job.original_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Image className="h-8 w-8 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <Badge className={`absolute top-3 right-3 ${status.className} text-xs gap-1`}>
                                        <StatusIcon className="h-3 w-3" />
                                        {status.label}
                                    </Badge>
                                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Eye className="h-6 w-6 text-foreground" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm font-medium truncate">{job.file_name || 'Untitled'}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-muted-foreground capitalize">{job.enhancement_type?.replace(/_/g, ' ')}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {job.created_date ? format(new Date(job.created_date), 'MMM d') : ''}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{selectedJob?.file_name || 'Enhancement Detail'}</DialogTitle>
                    </DialogHeader>
                    {selectedJob?.status === 'completed' && selectedJob?.enhanced_image_url ? (
                        <ImageComparison
                            originalUrl={selectedJob.original_image_url}
                            enhancedUrl={selectedJob.enhanced_image_url}
                            onDownload={() => window.open(selectedJob.enhanced_image_url, '_blank')}
                        />
                    ) : (
                        <div className="py-8 text-center">
                            {selectedJob?.original_image_url && (
                                <img src={selectedJob.original_image_url} alt="" className="max-h-[400px] mx-auto rounded-xl" />
                            )}
                            <p className="text-muted-foreground mt-4">Enhancement is {selectedJob?.status}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}