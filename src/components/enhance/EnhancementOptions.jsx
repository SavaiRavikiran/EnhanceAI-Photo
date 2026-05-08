import React from 'react';
import { Maximize, Focus, Eraser, Palette, Camera, Wand2, ZoomIn, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';

const options = [
    { id: 'upscale_2x', label: 'Upscale 2×', desc: 'Double the resolution', icon: Maximize, credits: 1 },
    { id: 'upscale_4x', label: 'Upscale 4×', desc: 'Quadruple resolution', icon: ZoomIn, credits: 2 },
    { id: 'face_restore', label: 'Face Restore', desc: 'Enhance face clarity', icon: Focus, credits: 1 },
    { id: 'denoise', label: 'Remove Noise', desc: 'Clean grainy images', icon: Eraser, credits: 1 },
    { id: 'color_correct', label: 'Color Correct', desc: 'Fix color balance', icon: Palette, credits: 1 },
    { id: 'old_photo_restore', label: 'Photo Restore', desc: 'Restore old photos', icon: Camera, credits: 2 },
    { id: 'sharpen', label: 'Sharpen', desc: 'Increase sharpness', icon: Wand2, credits: 1 },
    { id: 'prompt_enhance', label: 'Prompt Enhance', desc: 'Describe your changes', icon: MessageSquare, credits: 2 },
];

export default function EnhancementOptions({ selected, onSelect, prompt, onPromptChange }) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Enhancement Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {options.map((opt) => {
                    const active = selected === opt.id;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onSelect(opt.id)}
                            className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${active
                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
                                }`}
                        >
                            <opt.icon className={`h-5 w-5 mb-2 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className="text-sm font-medium">{opt.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                            <span className={`absolute top-3 right-3 text-xs font-medium px-1.5 py-0.5 rounded-full ${active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                                }`}>
                                {opt.credits} cr
                            </span>
                        </button>
                    );
                })}
            </div>

            {selected === 'prompt_enhance' && (
                <div className="mt-4">
                    <Input
                        placeholder="Describe how you want to enhance the image..."
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        className="h-12 rounded-xl"
                    />
                </div>
            )}
        </div>
    );
}