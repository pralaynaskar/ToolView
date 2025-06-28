import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ToolCard({ title, icon, children, className }: ToolCardProps) {
  return (
    <Card className={cn('w-full max-w-4xl mx-auto shadow-lg', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-primary">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
