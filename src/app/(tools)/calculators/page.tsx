'use client';

import Link from 'next/link';
import { TOOLS } from '@/lib/constants';
import React, { useMemo } from 'react';
import { Calculator } from 'lucide-react';

const subCategoryOrder = [
  'Common',
  'Algebra',
  'Finance',
  'Time',
  '2D Geometry',
  '3D Geometry',
  'Developer',
  'Financial'
];

export default function CalculatorsPage() {

  const allCalculators = useMemo(() => {
    return TOOLS.filter(tool => tool.category === 'Calculator');
  }, []);

  const groupedCalculators = useMemo(() => {
    return allCalculators.reduce((acc, tool) => {
      const subCategory = tool.subCategory || 'Other';
      if (!acc[subCategory]) {
        acc[subCategory] = [];
      }
      acc[subCategory].push(tool);
      return acc;
    }, {} as Record<string, typeof allCalculators>);
  }, [allCalculators]);
  
  const displayedSubCategories = subCategoryOrder.filter(subCategory => groupedCalculators[subCategory]?.length > 0);


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 p-4 bg-card border rounded-xl">
        <div className="p-4 bg-primary/10 rounded-lg">
          <Calculator className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">Calculation Tools</h1>
          <p className="text-muted-foreground mt-1">This section helps you find the solutions of your mathematical operations.</p>
        </div>
      </div>
      
      <div className="space-y-10">
        {displayedSubCategories.length > 0 ? (
          displayedSubCategories.map((subCategory) => (
            <section key={subCategory}>
              <h2 className="text-xl font-bold mb-4 text-primary/80">{subCategory}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {groupedCalculators[subCategory].map((tool) => (
                  <Link href={`/${tool.slug}`} key={tool.slug} className="block group">
                    <div className="p-3 bg-card border rounded-lg h-full flex flex-col items-center justify-center text-center gap-2 transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                        {React.cloneElement(tool.icon, { className: "size-6" })}
                      </div>
                      <span className="font-semibold text-xs leading-tight">{tool.slug === 'calculator' ? 'Scientific Calculator' : tool.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-semibold">No Calculators Found</h3>
            <p>This category has no tools yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
