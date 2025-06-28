import { ToolCard } from '@/components/ToolCard';
import HistoryDisplay from '@/components/HistoryDisplay';
import { History } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'History | ToolView',
  description: 'View your past calculations and conversions.',
};

export default function HistoryPage() {
  return (
    <ToolCard title="History" icon={<History className="size-6" />}>
      <HistoryDisplay />
    </ToolCard>
  );
}
