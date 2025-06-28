'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft } from 'lucide-react';
import { toRoman, fromRoman } from '@/lib/converters';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function RomanNumeralConverter() {
  const [arabic, setArabic] = useState('1994');
  const [roman, setRoman] = useState('MCMXCIV');
  const [lastChanged, setLastChanged] = useState<'arabic' | 'roman'>('arabic');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    if (lastChanged === 'arabic') {
      const num = parseInt(arabic, 10);
      if (!isNaN(num)) {
        if (num > 3999 || num < 1) {
            setError('Enter a number between 1 and 3999.');
            setRoman('');
        } else {
            setRoman(toRoman(num));
        }
      } else {
        setRoman('');
      }
    }
  }, [arabic, lastChanged]);
  
  useEffect(() => {
    setError('');
    if (lastChanged === 'roman') {
      const num = fromRoman(roman.toUpperCase());
      if (!isNaN(num)) {
        setArabic(String(num));
      } else {
        if (roman) setError('Invalid Roman numeral.');
        setArabic('');
      }
    }
  }, [roman, lastChanged]);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="space-y-2">
          <Label htmlFor="arabic-input">Arabic Numeral</Label>
          <Input
            id="arabic-input"
            type="number"
            value={arabic}
            onChange={e => {
              setArabic(e.target.value);
              setLastChanged('arabic');
            }}
            className="text-lg"
          />
        </div>
        <Button variant="ghost" size="icon" className="self-end hidden md:flex">
            <ArrowRightLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-2">
          <Label htmlFor="roman-input">Roman Numeral</Label>
          <Input
            id="roman-input"
            value={roman}
            onChange={e => {
              setRoman(e.target.value);
              setLastChanged('roman');
            }}
            className="text-lg uppercase font-serif"
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}
