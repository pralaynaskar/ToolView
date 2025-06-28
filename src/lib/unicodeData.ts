
export const unicodeCharNames: Record<number, string> = {
  0x0020: 'SPACE',
  0x27A4: 'BLACK RIGHTWARDS ARROWHEAD',
  0x20919: 'CJK UNIFIED IDEOGRAPH-20919',
};

export const unicodeBlockRanges: { name: string; start: number; end: number }[] = [
  { name: 'Basic Latin', start: 0x0000, end: 0x007F },
  { name: 'Dingbats', start: 0x2700, end: 0x27BF },
  { name: 'CJK Unified Ideographs Extension B', start: 0x20000, end: 0x2A6DF },
];

export function getBlockName(codePoint: number): string {
    for (const block of unicodeBlockRanges) {
        if (codePoint >= block.start && codePoint <= block.end) {
            return block.name;
        }
    }
    // A more comprehensive check could be added here later if needed
    if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) return 'CJK Unified Ideographs';
    
    return 'Unknown';
}
