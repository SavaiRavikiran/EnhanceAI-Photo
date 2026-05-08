import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const showcases = [
    {
        title: 'Face Restoration',
        desc: 'Restore clarity to old or blurry portraits',
        before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=30&blur=20',
        after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=95',
    },
    {
        title: 'Super Resolution',
        desc: 'Upscale images to 4x their original size',
        before: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=30&blur=20',
        after: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=95',
    },
    {
        title: 'Old Photo Restore',
        desc: 'Bring life back to vintage photographs',
        before: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=30&blur=20',
        after: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=95',
    },
];

export default function BeforeAfterShowcase() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">See the <span className="gradient-text">Difference</span></h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Real results from our AI enhancement engine
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {showcases.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="glass rounded-2xl overflow-hidden group hover:glow-sm transition-all duration-500"
                        >
                            <div className="relative">
                                <div className="flex">
                                    <div className="w-1/2 relative">
                                        <img src={item.before} alt="Before" className="w-full h-48 object-cover" />
                                        <span className="absolute bottom-2 left-2 text-xs font-medium bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full">Before</span>
                                    </div>
                                    <div className="w-1/2 relative">
                                        <img src={item.after} alt="After" className="w-full h-48 object-cover" />
                                        <span className="absolute bottom-2 right-2 text-xs font-medium bg-primary/80 text-primary-foreground px-2 py-0.5 rounded-full">After</span>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border/50">
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}