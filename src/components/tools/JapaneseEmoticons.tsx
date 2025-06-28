'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const emoticons = {
    happy: ['(⌒▽⌒)☆', '(´｡• ᵕ •｡`) ♡', '(´• ω •`)', '(* ^ ω ^)'],
    sad: ['(╯︵╰,)', '(｡•́︿•̀｡)', '(ಥ﹏ಥ)', '(╥_╥)'],
    angry: ['(＃`Д´)', '٩(ఠ益ఠ)۶', '(凸ಠ益ಠ)凸', 'ヽ( `д´*)ノ'],
    love: ['(｡♥‿♥｡)', '(♡-_-♡)', '(´ ▽ ` ).｡ｏ♡', '(*♡∀♡)'],
    shrug: ['¯\\_(ツ)_/¯', '┐(‘～` )┌', 'ƪ(˘⌣˘)ʃ', '┐(￣ヘ￣)┌'],
};

export default function JapaneseEmoticons() {
  const { toast } = useToast();

  const handleCopy = (emoticon: string) => {
    navigator.clipboard.writeText(emoticon);
    toast({ title: `Copied "${emoticon}" to clipboard!` });
  };

  return (
    <Tabs defaultValue="happy" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="happy">Happy</TabsTrigger>
            <TabsTrigger value="sad">Sad</TabsTrigger>
            <TabsTrigger value="angry">Angry</TabsTrigger>
            <TabsTrigger value="love">Love</TabsTrigger>
            <TabsTrigger value="shrug">Shrug</TabsTrigger>
        </TabsList>
        {Object.entries(emoticons).map(([category, items]) => (
            <TabsContent key={category} value={category}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {items.map(emoticon => (
                        <Button key={emoticon} variant="outline" onClick={() => handleCopy(emoticon)} className="text-lg">
                            {emoticon}
                        </Button>
                    ))}
                </div>
            </TabsContent>
        ))}
    </Tabs>
  );
}
