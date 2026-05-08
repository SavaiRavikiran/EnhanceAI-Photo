import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Columns, SlidersHorizontal } from 'lucide-react';

export default function ImageComparison({ originalUrl, enhancedUrl, onDownload }) {
    const [mode, setMode] = useState('slider'); // 'slider' | 'side'
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef(null);
    const dragging = useRef(false);

    const handleMove = useCallback((clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
    }, []);

    const handleMouseDown = () => { dragging.current = true; };
    const handleMouseUp = () => { dragging.current = false; };
    const handleMouseMove = (e) => { if (dragging.current) handleMove(e.clientX); };
    const handleTouchMove = (e) => { handleMove(e.touches[0].clientX); };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={mode === 'slider' ? 'default' : 'outline'}
                        onClick={() => setMode('slider')}
                        className="h-8 rounded-lg text-xs"
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                        Slider
                    </Button>
                    <Button
                        size="sm"
                        variant={mode === 'side' ? 'default' : 'outline'}
                        onClick={() => setMode('side')}
                        className="h-8 rounded-lg text-xs"
                    >
                        <Columns className="h-3.5 w-3.5 mr-1.5" />
                        Side by Side
                    </Button>
                </div>
                <Button
                    size="sm"
                    onClick={onDownload}
                    className="gradient-primary text-primary-foreground h-8 rounded-lg text-xs"
                >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download
                </Button>
            </div>

            {mode === 'slider' ? (
                <div
                    ref={containerRef}
                    className="relative rounded-2xl overflow-hidden border border-border cursor-col-resize select-none"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                    onTouchMove={handleTouchMove}
                    onClick={(e) => handleMove(e.clientX)}
                >
                    <img src={enhancedUrl} alt="Enhanced" className="w-full block max-h-[500px] object-contain" />
                    <div
                        className="absolute top-0 left-0 bottom-0 overflow-hidden"
                        style={{ width: `${sliderPos}%` }}
                    >
                        <img
                            src={originalUrl}
                            alt="Original"
                            className="max-h-[500px] object-contain"
                            style={{ width: containerRef.current?.offsetWidth || '100%' }}
                        />
                    </div>
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground/80"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary-foreground/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <SlidersHorizontal className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                    <span className="absolute top-3 left-3 text-xs font-medium bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full">Original</span>
                    <span className="absolute top-3 right-3 text-xs font-medium bg-primary/80 text-primary-foreground px-2 py-0.5 rounded-full">Enhanced</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl overflow-hidden border border-border">
                        <img src={originalUrl} alt="Original" className="w-full object-contain max-h-[500px]" />
                        <div className="p-2 text-center text-xs font-medium text-muted-foreground border-t border-border">Original</div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-primary/30">
                        <img src={enhancedUrl} alt="Enhanced" className="w-full object-contain max-h-[500px]" />
                        <div className="p-2 text-center text-xs font-medium text-primary border-t border-primary/30">Enhanced</div>
                    </div>
                </div>
            )}
        </div>
    );
}