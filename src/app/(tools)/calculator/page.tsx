import { ToolCard } from '@/components/ToolCard';
import ScientificCalculator from '@/components/ScientificCalculator';
import { Calculator } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scientific Calculator | ToolView',
  description: 'Perform basic and scientific calculations with ToolView.',
};

export default function CalculatorPage() {
  return (
    <ToolCard title="Scientific Calculator" icon={<Calculator className="size-6" />}>
      <ScientificCalculator />
    </ToolCard>
  );
}
