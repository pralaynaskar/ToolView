
'use client';

import AppShell from '@/components/AppShell';
import { usePathname } from 'next/navigation';
import WeatherLayout from '@/components/WeatherLayout';


export default function AppsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/weather') {
    return <WeatherLayout>{children}</WeatherLayout>;
  }

  return <AppShell>{children}</AppShell>;
}
