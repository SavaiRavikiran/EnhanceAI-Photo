import React from 'react';
import { api } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: '$0',
        period: 'forever',
        icon: Zap,
        description: 'Perfect for trying out',
        credits: '5 credits/day',
        features: [
            '5 daily credits',
            'Up to 2× upscale',
            'Basic enhancements',
            'Standard quality output',
            'Community support',
        ],
        cta: 'Current Plan',
        variant: 'outline',
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$12',
        period: '/month',
        icon: Sparkles,
        description: 'For power users',
        credits: '100 credits/month',
        popular: true,
        features: [
            '100 monthly credits',
            'Up to 4× upscale',
            'All enhancement types',
            'HD quality output',
            'Priority processing',
            'Face restoration',
            'Old photo restoration',
            'Prompt-based enhancement',
            'Priority support',
        ],
        cta: 'Upgrade to Pro',
        variant: 'default',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: '$49',
        period: '/month',
        icon: Crown,
        description: 'For teams & businesses',
        credits: 'Unlimited credits',
        features: [
            'Unlimited credits',
            'Up to 4× upscale',
            'All enhancement types',
            'Ultra HD output',
            'Instant processing',
            'Batch processing',
            'API access',
            'Custom branding',
            'Dedicated support',
            'SLA guarantee',
        ],
        cta: 'Contact Sales',
        variant: 'outline',
    },
];

export default function Pricing() {
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => api.auth.me(),
    });

    const currentPlan = user?.plan || 'free';

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Simple, Transparent Pricing</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Choose the plan that fits your needs. Upgrade or downgrade anytime.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className={`relative p-6 bg-card/50 border-border/50 hover:glow-sm transition-all duration-300 h-full flex flex-col ${plan.popular ? 'ring-2 ring-primary/30 glow-sm' : ''
                            }`}>
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground px-4">
                                    Most Popular
                                </Badge>
                            )}
                            <div className="mb-6">
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${plan.popular ? 'gradient-primary' : 'bg-muted'
                                    }`}>
                                    <plan.icon className={`h-5 w-5 ${plan.popular ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                                </div>
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                                <div className="mt-4">
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                                </div>
                                <p className="text-sm font-medium text-primary mt-2">{plan.credits}</p>
                            </div>

                            <div className="flex-1 space-y-3 mb-6">
                                {plan.features.map((feat, fi) => (
                                    <div key={fi} className="flex items-start gap-2.5">
                                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={`w-full rounded-xl h-11 ${plan.popular ? 'gradient-primary text-primary-foreground glow' : ''
                                    }`}
                                variant={plan.popular ? 'default' : 'outline'}
                                disabled={currentPlan === plan.id}
                            >
                                {currentPlan === plan.id ? 'Current Plan' : plan.cta}
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="text-center mt-12">
                <p className="text-sm text-muted-foreground">
                    All plans include basic support and secure image processing.
                    <br />
                    Need custom solutions? <span className="text-primary cursor-pointer hover:underline">Contact us</span>
                </p>
            </div>
        </div>
    );
}