
"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { convertBase } from '@/lib/converters'

export default function NumeralSystemConverter() {
  const [decimal, setDecimal] = useState('255');
  const [binary, setBinary] = useState('11111111');
  const [octal, setOctal] = useState('377');
  const [hex, setHex] = useState('FF');
  const [lastChanged, setLastChanged] = useState('decimal');

  useEffect(() => {
    if (lastChanged === 'decimal') {
      setBinary(convertBase(decimal, 10, 2));
      setOctal(convertBase(decimal, 10, 8));
      setHex(convertBase(decimal, 10, 16));
    } else if (lastChanged === 'binary') {
      setDecimal(convertBase(binary, 2, 10));
      setOctal(convertBase(binary, 2, 8));
      setHex(convertBase(binary, 2, 16));
    } else if (lastChanged === 'octal') {
        setDecimal(convertBase(octal, 8, 10));
        setBinary(convertBase(octal, 8, 2));
        setHex(convertBase(octal, 8, 16));
    } else if (lastChanged === 'hex') {
        setDecimal(convertBase(hex, 16, 10));
        setBinary(convertBase(hex, 16, 2));
        setOctal(convertBase(hex, 16, 8));
    }
  }, [decimal, binary, octal, hex, lastChanged]);
  

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="decimal">Decimal</Label>
        <Input id="decimal" value={decimal} onChange={(e) => {setDecimal(e.target.value); setLastChanged('decimal')}} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="binary">Binary</Label>
        <Input id="binary" value={binary} onChange={(e) => {setBinary(e.target.value); setLastChanged('binary')}} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="octal">Octal</Label>
        <Input id="octal" value={octal} onChange={(e) => {setOctal(e.target.value); setLastChanged('octal')}} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hex">Hexadecimal</Label>
        <Input id="hex" value={hex} onChange={(e) => {setHex(e.target.value.toUpperCase()); setLastChanged('hex')}} />
      </div>
    </div>
  )
}
