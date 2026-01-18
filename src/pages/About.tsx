import { Layout } from '@/components/layout/Layout';
import { Zap, Shield, Clock, Heart, Code, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'All tools run instantly in your browser with no server delays.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data never leaves your device. We don\'t store or track anything.',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Access our tools 24/7 from any device with an internet connection.',
  },
  {
    icon: Heart,
    title: 'Free Forever',
    description: 'All core tools are completely free with no hidden costs.',
  },
  {
    icon: Code,
    title: 'No Installation',
    description: 'Works directly in your browser. No downloads or plugins required.',
  },
  {
    icon: Users,
    title: 'For Everyone',
    description: 'Designed for students, professionals, and everyday users alike.',
  },
];

export default function About() {
  return (
    <Layout>
      <div className="container py-12 md:py-20">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">ToolsHub</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe essential digital tools should be accessible to everyone. 
            ToolsHub brings together the most commonly needed utilities in one 
            clean, fast, and privacy-respecting platform.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              In a world cluttered with ad-heavy, slow, and privacy-invasive online tools, 
              we set out to create something different. ToolsHub is built on three core principles:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <div>
                  <span className="font-semibold">Simplicity</span>
                  <span className="text-muted-foreground"> – Clean interfaces that get out of your way</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">2</span>
                </div>
                <div>
                  <span className="font-semibold">Speed</span>
                  <span className="text-muted-foreground"> – Instant results without waiting</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">3</span>
                </div>
                <div>
                  <span className="font-semibold">Privacy</span>
                  <span className="text-muted-foreground"> – Your data stays on your device</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-12">Why Choose ToolsHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-secondary/30 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">3+</div>
              <div className="text-sm text-muted-foreground">Essential Tools</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Free to Use</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">0</div>
              <div className="text-sm text-muted-foreground">Signup Required</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Availability</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
