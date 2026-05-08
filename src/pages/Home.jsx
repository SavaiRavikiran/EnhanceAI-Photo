import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import HomeNavbar from '@/components/home/HomeNavbar';
import HeroSection from '@/components/home/HeroSection';
import BeforeAfterShowcase from '@/components/home/BeforeAfterShowcase';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HomeNavbar />
      <HeroSection />
      <BeforeAfterShowcase />

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Enhance?</h2>
          <p className="text-muted-foreground mb-8">
            Start with 5 free credits. No credit card required.
          </p>
          <Link to={createPageUrl('Enhance')}>
            <Button size="lg" className="gradient-primary text-primary-foreground h-14 px-10 rounded-2xl glow text-base group">
              Try It Free
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">EnhanceAI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 EnhanceAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}