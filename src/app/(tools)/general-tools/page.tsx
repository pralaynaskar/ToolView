
'use client';

import Link from 'next/link';
import { TOOLS } from '@/lib/constants';
import React, { useMemo } from 'react';
import { Briefcase } from 'lucide-react';

export default function GeneralToolsPage() {
  const allGeneralTools = useMemo(() => {
    return TOOLS.filter(tool => tool.category === 'General Tools');
  }, []);


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 p-4 bg-card border rounded-xl">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Briefcase className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">General Tools</h1>
          <p className="text-muted-foreground mt-1">This section contains a number of different tools that can be used for a variety of purposes.</p>
        </div>
      </div>
      
      {allGeneralTools.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allGeneralTools.map((tool) => (
            <Link href={`/${tool.slug}`} key={tool.slug} className="block group">
              <div className="p-4 bg-card border rounded-xl h-full flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                  {React.cloneElement(tool.icon, { className: "size-8" })}
                </div>
                <span className="font-semibold text-sm leading-tight">{tool.name}</span>
              </div>
            </Link>
          ))}
        </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-semibold">No General Tools Found</h3>
            <p>This category has no tools yet.</p>
          </div>
        )}
    </div>
  );
}
