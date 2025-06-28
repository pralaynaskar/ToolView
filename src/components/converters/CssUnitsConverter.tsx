
"use client";

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { getCssEquivalents } from '@/lib/converters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CssUnitsConverter() {
  const [pxValue, setPxValue] = useState<string>("16");

  const equivalents = useMemo(() => {
    const num = parseFloat(pxValue);
    if (isNaN(num)) return { px: 0, pt: 0, pc: 0, in: 0, cm: 0, mm: 0 };
    return getCssEquivalents(num);
  }, [pxValue]);
  
  const formatNumber = (num: number) => Number(num.toFixed(4)).toString();

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <Label htmlFor="px-input">Pixel Value (px)</Label>
        <Input
          id="px-input"
          type="number"
          value={pxValue}
          onChange={(e) => setPxValue(e.target.value)}
          className="text-lg"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Points (pt)</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(equivalents.pt)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Picas (pc)</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(equivalents.pc)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Inches (in)</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(equivalents.in)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Centimeters (cm)</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(equivalents.cm)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Millimeters (mm)</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(equivalents.mm)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
