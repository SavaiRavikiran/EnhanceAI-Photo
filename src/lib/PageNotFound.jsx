import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="text-center max-w-md">
                <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow">
                    <Sparkles className="h-7 w-7 text-primary-foreground" />
                </div>
                <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
                <p className="text-xl font-semibold mb-2">Page Not Found</p>
                <p className="text-muted-foreground mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to={createPageUrl('Home')}>
                    <Button className="gradient-primary text-primary-foreground rounded-xl h-11 px-6 glow">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}