'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode.react';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://firebase.google.com/studio');
  const [qrValue, setQrValue] = useState('https://firebase.google.com/studio');

  const handleGenerate = () => {
    setQrValue(text);
  };
  
  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-md flex gap-2">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL"
          className="text-base"
        />
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
      {qrValue && (
        <div className="p-4 bg-white rounded-lg shadow-md inline-block">
          <QRCode value={qrValue} size={256} />
        </div>
      )}
       {qrValue && (
        <Button onClick={handleDownload} variant="outline">Download QR Code</Button>
      )}
    </div>
  );
}
