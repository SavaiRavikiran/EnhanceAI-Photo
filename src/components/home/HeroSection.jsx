import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, ArrowRight, Zap, Shield, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/20 blur-3xl" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-border/50 mb-8 text-sm">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">AI-Powered Image Enhancement</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6">
                        <span className="gradient-text">Transform</span>
                        <br />
                        <span className="text-foreground">Your Photos</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Upscale, restore, and enhance any image with state-of-the-art AI.
                        Turn blurry photos into stunning, high-resolution masterpieces in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link to={createPageUrl('Enhance')}>
                            <Button size="lg" className="gradient-primary text-primary-foreground h-14 px-8 text-base rounded-2xl glow group">
                                Start Enhancing
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to={createPageUrl('Pricing')}>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-2xl">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                >
                    {[
                        { icon: Zap, title: 'Lightning Fast', desc: 'Enhance images in under 10 seconds' },
                        { icon: Image, title: 'Multiple Modes', desc: 'Upscale, restore faces, remove noise' },
                        { icon: Shield, title: 'Privacy First', desc: 'Images are deleted after processing' },
                    ].map((f, i) => (
                        <div key={i} className="glass rounded-2xl p-6 text-left hover:glow-sm transition-all duration-300">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <f.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-1">{f.title}</h3>
                            <p className="text-sm text-muted-foreground">{f.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}