import { Calculator, FileText, ArrowLeftRight } from 'lucide-react';
import { ToolCard } from './ToolCard';

const tools = [
  {
    title: 'Calculator',
    description: 'Basic and scientific calculator with keyboard support. Perform complex calculations instantly.',
    icon: Calculator,
    href: '/calculator',
  },
  {
    title: 'PDF Converter',
    description: 'Convert PDF to Word, Word to PDF, and merge multiple PDFs with ease.',
    icon: FileText,
    href: '/pdf-converter',
  },
  {
    title: 'Unit Converter',
    description: 'Convert length, weight, temperature, time, and currency units in real-time.',
    icon: ArrowLeftRight,
    href: '/unit-converter',
  },
];

export function ToolsGrid() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Tools</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our collection of carefully crafted utilities designed to make your life easier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
