import React from 'react';
import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CreditBadge({ credits = 0 }) {
    return (
        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm font-medium bg-accent text-accent-foreground">
            <Zap className="h-3.5 w-3.5 fill-current" />
            {credits} credits
        </Badge>
    );
}