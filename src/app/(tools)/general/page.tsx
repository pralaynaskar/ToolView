import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | ToolView',
};

export default function GeneralToolsPage() {
  notFound();
}
