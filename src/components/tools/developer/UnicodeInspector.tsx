'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBlockName, unicodeCharNames, unicodeBlockRanges } from '@/lib/unicodeData';

interface CharDetail {
  char: string;
  codepoint: string;
  name: string;
  decCode: number;
  utf8: string;
  utf16: string;
  utf16LE: string;
  block: string;
}

const toUtf8 = (code: number) => {
  const bytes: number[] = [];
  if (code < 0x80) {
    bytes.push(code);
  } else if (code < 0x800) {
    bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
  } else if (code < 0x10000) {
    bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
  } else {
    bytes.push(0xF0 | (code >> 18), 0x80 | ((code >> 12) & 0x3F), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
  }
  return bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
};

const toUtf16 = (code: number) => {
  if (code < 0x10000) {
    return code.toString(16).toUpperCase().padStart(4, '0');
  }
  const high = Math.floor((code - 0x10000) / 0x400) + 0xD800;
  const low = (code - 0x10000) % 0x400 + 0xDC00;
  return `${high.toString(16).toUpperCase()} ${low.toString(16).toUpperCase()}`;
};

const toUtf16LE = (code: number) => {
  const utf16 = toUtf16(code);
  if (utf16.includes(' ')) { // Surrogate pair
    const [high, low] = utf16.split(' ');
    const highLE = high.substring(2, 4) + high.substring(0, 2);
    const lowLE = low.substring(2, 4) + low.substring(0, 2);
    return `${highLE} ${lowLE}`;
  }
  return utf16.substring(2,4) + utf16.substring(0,2);
};


export default function UnicodeInspector() {
  const [inputText, setInputText] = useState('Hello ► 查');
  const [analyzedChars, setAnalyzedChars] = useState<CharDetail[]>([]);
  const [codepointInput, setCodepointInput] = useState('');

  const analyzeText = useCallback((text: string) => {
    const chars: CharDetail[] = [];
    const seenBlocks = new Set<string>();

    for (const char of text) {
      const codePoint = char.codePointAt(0);
      if (codePoint === undefined) continue;

      const block = getBlockName(codePoint);
      seenBlocks.add(block);
      
      chars.push({
        char,
        codepoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
        name: unicodeCharNames[codePoint] || 'Unknown',
        decCode: codePoint,
        utf8: toUtf8(codePoint),
        utf16: toUtf16(codePoint),
        utf16LE: toUtf16LE(codePoint),
        block,
      });
    }
    setAnalyzedChars(chars);
  }, []);
  
  useEffect(() => {
    analyzeText(inputText);
  }, [inputText, analyzeText]);

  const handleAnalyzeClick = () => {
    analyzeText(inputText);
  };

  const handleCodepointLookup = () => {
    const code = parseInt(codepointInput.replace(/U\+/i, ''), 16);
    if (!isNaN(code)) {
      const char = String.fromCodePoint(code);
      setInputText(char);
      analyzeText(char);
    }
  };

  const getUnicodeBlocks = () => {
    const blockNames = new Set(analyzedChars.map(c => c.block));
    return Array.from(blockNames).map(name => {
      const blockData = unicodeBlockRanges.find(b => b.name === name);
      return {
        name,
        range: blockData ? `${blockData.start.toString(16).toUpperCase().padStart(4, '0')} - ${blockData.end.toString(16).toUpperCase().padStart(4, '0')}` : 'N/A',
        chartUrl: blockData ? `https://www.unicode.org/charts/PDF/U${blockData.start.toString(16).toUpperCase().padStart(4, '0')}.pdf` : '#'
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p>Paste your text below or use the lookup options to analyze Unicode characters and sequences.</p>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Lookup Specific Character</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="codepoint-lookup">By Codepoint (Hex, e.g., 0041 or U+1F600)</Label>
            <div className="flex gap-2">
              <Input id="codepoint-lookup" value={codepointInput} onChange={e => setCodepointInput(e.target.value)} placeholder="e.g., U+0041" />
              <Button onClick={handleCodepointLookup}>Lookup</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <Label htmlFor="input-text">Input Text:</Label>
        <Textarea 
          id="input-text" 
          value={inputText} 
          onChange={e => setInputText(e.target.value)} 
          className="min-h-[150px] font-mono text-lg" 
        />
      </div>
      <Button onClick={handleAnalyzeClick}>Analyze Text</Button>

      {analyzedChars.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Individual Character Details:</h3>
            <div className="overflow-x-auto border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Char</TableHead>
                            <TableHead>Codepoint (U+)</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Code Point</TableHead>
                            <TableHead>UTF-8</TableHead>
                            <TableHead>UTF-16</TableHead>
                            <TableHead>UTF-16 LE</TableHead>
                            <TableHead>Block</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analyzedChars.map((char, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-mono text-xl">{char.char}</TableCell>
                                <TableCell>{char.codepoint}</TableCell>
                                <TableCell>{char.name}</TableCell>
                                <TableCell>{char.decCode}</TableCell>
                                <TableCell className="font-mono">{char.utf8}</TableCell>
                                <TableCell className="font-mono">{char.utf16}</TableCell>
                                <TableCell className="font-mono">{char.utf16LE}</TableCell>
                                <TableCell>{char.block}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Unicode Blocks in Text:</h3>
             <div className="overflow-x-auto border rounded-lg">
                <Table>
                     <TableHeader>
                        <TableRow>
                            <TableHead>Block Name</TableHead>
                            <TableHead>Range (Hex)</TableHead>
                            <TableHead>Chart</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {getUnicodeBlocks().map((block, index) => (
                             <TableRow key={index}>
                                <TableCell>{block.name}</TableCell>
                                <TableCell className="font-mono">{block.range}</TableCell>
                                <TableCell>
                                    <a href={block.chartUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        PDF
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
