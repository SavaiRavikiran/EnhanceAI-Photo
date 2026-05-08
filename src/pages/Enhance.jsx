import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import ImageDropzone from '@/components/enhance/ImageDropzone';
import EnhancementOptions from '@/components/enhance/EnhancementOptions';
import ImageComparison from '@/components/enhance/ImageComparison';

export default function Enhance() {
    const [file, setFile] = useState(null);
    const [enhancementType, setEnhancementType] = useState('upscale_2x');
    const [prompt, setPrompt] = useState('');
    const [step, setStep] = useState('upload');
    const [result, setResult] = useState(null);

    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => api.auth.me(),
    });

    const credits = user?.credits ?? 5;
    const creditCost = ['upscale_4x', 'old_photo_restore', 'prompt_enhance'].includes(enhancementType) ? 2 : 1;

    const enhanceMutation = useMutation({
        mutationFn: async () => {
            setStep('processing');

            const originalPreviewUrl = URL.createObjectURL(file);

            // Upload & enhance in parallel prep
            const uploadPromise = api.integrations.Core.UploadFile({ file });

            const enhancePrompts = {
                upscale_2x: 'Upscale this image 2x, make it sharper and higher resolution.',
                upscale_4x: 'Upscale this image 4x, ultra high resolution, sharp details.',
                face_restore: 'Restore and enhance faces in this image, make facial features crisp and clear.',
                denoise: 'Remove noise and grain, clean and sharp result.',
                color_correct: 'Fix color balance, enhance colors and contrast.',
                old_photo_restore: 'Restore this old photograph, fix damage, enhance colors.',
                sharpen: 'Sharpen this image, enhance edges and details.',
                prompt_enhance: prompt || 'Enhance this image to look better.',
            };

            const { file_url } = await uploadPromise;

            const [enhancedResult] = await Promise.all([
                api.integrations.Core.GenerateImage({
                    prompt: enhancePrompts[enhancementType] + ' Photorealistic, high quality output.',
                    existing_image_urls: [file_url],
                }),
            ]);

            // Fire-and-forget DB writes (don't await)
            api.entities.EnhancementJob.create({
                original_image_url: file_url,
                enhanced_image_url: enhancedResult.url,
                status: 'completed',
                enhancement_type: enhancementType,
                prompt: enhancementType === 'prompt_enhance' ? prompt : '',
                credits_used: creditCost,
                file_name: file.name,
                file_size: file.size,
            });

            api.auth.updateMe({
                credits: Math.max(0, credits - creditCost),
                total_enhancements: (user?.total_enhancements || 0) + 1,
            });

            return {
                original_image_url: file_url,
                enhanced_image_url: enhancedResult.url,
            };
        },
        onSuccess: (data) => {
            setResult(data);
            setStep('result');
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
        onError: () => {
            setStep('upload');
        },
    });

    const handleReset = () => {
        setFile(null);
        setStep('upload');
        setResult(null);
        setPrompt('');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {step === 'upload' && (
                    <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Enhance Image</h1>
                            <p className="text-muted-foreground text-sm">Upload a photo and pick an enhancement</p>
                        </div>

                        <ImageDropzone onFileSelect={setFile} selectedFile={file} onClear={() => setFile(null)} />

                        {file && (
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <EnhancementOptions
                                    selected={enhancementType}
                                    onSelect={setEnhancementType}
                                    prompt={prompt}
                                    onPromptChange={setPrompt}
                                />

                                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                                    <div>
                                        <p className="text-sm font-medium">{creditCost} credit{creditCost > 1 ? 's' : ''}</p>
                                        <p className="text-xs text-muted-foreground">{credits} remaining</p>
                                    </div>
                                    <Button
                                        onClick={() => enhanceMutation.mutate()}
                                        disabled={credits < creditCost}
                                        className="gradient-primary text-primary-foreground rounded-xl glow h-11 px-6"
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Enhance Now
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {step === 'processing' && (
                    <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24 gap-6">
                        <div className="relative">
                            <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center glow">
                                <Sparkles className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <div className="absolute -inset-3 rounded-3xl border-2 border-primary/30 animate-ping" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-1">Enhancing...</h2>
                            <p className="text-muted-foreground text-sm">AI is working on your image</p>
                        </div>
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </motion.div>
                )}

                {step === 'result' && result && (
                    <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <h1 className="text-xl font-bold">Done!</h1>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleReset} className="rounded-xl">
                                <ArrowLeft className="h-4 w-4 mr-1.5" />
                                New
                            </Button>
                        </div>
                        <ImageComparison
                            originalUrl={result.original_image_url}
                            enhancedUrl={result.enhanced_image_url}
                            onDownload={() => window.open(result.enhanced_image_url, '_blank')}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}