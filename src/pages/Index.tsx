import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { ToolsGrid } from '@/components/home/ToolsGrid';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <ToolsGrid />
    </Layout>
  );
};

export default Index;
