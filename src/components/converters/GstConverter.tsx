"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { HistoryEntry } from '@/types'
import { calculateGst } from '@/lib/converters'
import { useCurrency } from '@/hooks/use-currency'

type GstType = 'add' | 'remove'

export default function GstConverter() {
  const [amount, setAmount] = useState("100")
  const [rate, setRate] = useState("10")
  const [gstType, setGstType] = useState<GstType>("add")
  const [result, setResult] = useState<{ originalAmount: number; gstAmount: number; finalAmount: number } | null>(null)
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", [])
  const { currency } = useCurrency();

  useEffect(() => {
    const numAmount = parseFloat(amount)
    const numRate = parseFloat(rate)

    if (!isNaN(numAmount) && !isNaN(numRate)) {
      const calcResult = calculateGst(numAmount, numRate, gstType)
      setResult(calcResult)

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'GST',
        calculation: `${gstType === 'add' ? 'Adding' : 'Removing'} ${numRate}% GST on ${currency.symbol}${numAmount} = ${currency.symbol}${calcResult.finalAmount.toFixed(2)}`,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 49)])
    } else {
      setResult(null)
    }
  }, [amount, rate, gstType, currency, setHistory])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            {gstType === 'add' ? `Base Amount (${currency.symbol})` : `Total Amount (incl. GST) (${currency.symbol})`}
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rate" className="text-sm font-medium">GST Rate (%)</Label>
          <Input
            id="rate"
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="text-lg"
          />
        </div>
      </div>
      
      <RadioGroup
        value={gstType}
        onValueChange={(value: GstType) => setGstType(value)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="add" id="add-gst" />
          <Label htmlFor="add-gst">Add GST</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="remove" id="remove-gst" />
          <Label htmlFor="remove-gst">Remove GST</Label>
        </div>
      </RadioGroup>

      {result && (
        <Card className="bg-muted">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Original Amount</p>
                <p className="text-2xl font-semibold">{currency.symbol}{result.originalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GST Amount</p>
                <p className="text-2xl font-semibold text-accent">{currency.symbol}{result.gstAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Final Amount</p>
                <p className="text-2xl font-bold text-primary">{currency.symbol}{result.finalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
