import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image, Clock, CheckCircle2, Loader2, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusConfig = {
    pending: { icon: Clock, label: 'Pending', className: 'bg-muted text-muted-foreground' },
    processing: { icon: Loader2, label: 'Processing', className: 'bg-accent text-accent-foreground', spin: true },
    completed: { icon: CheckCircle2, label: 'Completed', className: 'bg-primary/10 text-primary' },
    failed: { icon: AlertCircle, label: 'Failed', className: 'bg-destructive/10 text-destructive' },
};

export default function RecentJobs({ jobs, onViewJob }) {
    if (!jobs?.length) {
        return (
            <Card className="p-12 text-center bg-card/50">
                <Image className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No enhancements yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Upload an image to get started</p>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {jobs.map((job) => {
                const status = statusConfig[job.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                    <Card
                        key={job.id}
                        className="p-4 bg-card/50 hover:bg-card/80 transition-all duration-200 cursor-pointer border-border/50"
                        onClick={() => onViewJob?.(job)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                                {job.original_image_url ? (
                                    <img src={job.original_image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Image className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{job.file_name || 'Image'}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {job.enhancement_type?.replace(/_/g, ' ')} · {job.created_date ? format(new Date(job.created_date), 'MMM d, h:mm a') : ''}
                                </p>
                            </div>
                            <Badge className={`${status.className} text-xs gap-1`}>
                                <StatusIcon className={`h-3 w-3 ${status.spin ? 'animate-spin' : ''}`} />
                                {status.label}
                            </Badge>
                            {job.status === 'completed' && job.enhanced_image_url && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(job.enhanced_image_url, '_blank');
                                    }}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}