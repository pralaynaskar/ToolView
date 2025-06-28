'use client';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { textToMorse, morseToText } from '@/lib/converters';

export default function MorseCodeConverter() {
  const [textInput, setTextInput] = useState('Hello World');
  const [morseInput, setMorseInput] = useState('.... . .-.. .-.. --- / .-- --- .-. .-.. -..');
  const [lastChanged, setLastChanged] = useState<'text' | 'morse'>('text');

  useEffect(() => {
    if (lastChanged === 'text') {
      setMorseInput(textToMorse(textInput));
    }
  }, [textInput, lastChanged]);
  
  useEffect(() => {
    if (lastChanged === 'morse') {
      setTextInput(morseToText(morseInput));
    }
  }, [morseInput, lastChanged]);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="space-y-2">
          <label className="font-medium">Text</label>
          <Textarea
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              setLastChanged('text');
            }}
            className="min-h-[200px]"
            placeholder="Enter text..."
          />
        </div>
        <Button variant="ghost" size="icon" className="self-center hidden md:flex">
          <ArrowRightLeft className="w-5 h-5" />
        </Button>
        <div className="space-y-2">
          <label className="font-medium">Morse Code</label>
          <Textarea
            value={morseInput}
            onChange={(e) => {
              setMorseInput(e.target.value);
              setLastChanged('morse');
            }}
            className="min-h-[200px]"
            placeholder="Enter morse code..."
          />
        </div>
      </div>
    </div>
  );
}
