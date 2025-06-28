"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { HistoryEntry } from '@/types'
import { calculateDiscount } from '@/lib/converters'
import { useCurrency } from '@/hooks/use-currency'

export default function DiscountConverter() {
  const [originalPrice, setOriginalPrice] = useState("100")
  const [discountPercent, setDiscountPercent] = useState("25")
  const [result, setResult] = useState<{ finalPrice: number, savedAmount: number } | null>(null)
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", [])
  const { currency } = useCurrency();

  useEffect(() => {
    const price = parseFloat(originalPrice)
    const discount = parseFloat(discountPercent)

    if (!isNaN(price) && !isNaN(discount)) {
      const { finalPrice, savedAmount } = calculateDiscount(price, discount)
      setResult({ finalPrice, savedAmount })

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'Discount',
        calculation: `${discount}% off ${currency.symbol}${price} = ${currency.symbol}${finalPrice.toFixed(2)}`,
        timestamp: new Date().toISOString(),
      }
      setHistory(prev => [newEntry, ...prev.slice(0, 49)])
    } else {
      setResult(null)
    }
  }, [originalPrice, discountPercent, currency, setHistory])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="original-price" className="text-sm font-medium">Original Price ({currency.symbol})</label>
          <Input
            id="original-price"
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="text-lg"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="discount-percent" className="text-sm font-medium">Discount (%)</label>
          <Input
            id="discount-percent"
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            className="text-lg"
          />
        </div>
      </div>
      {result && (
        <Card className="bg-muted">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg text-muted-foreground">Final Price</p>
                <p className="text-4xl font-bold text-primary">{currency.symbol}{result.finalPrice.toFixed(2)}</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0">
                <p className="text-lg text-muted-foreground">You Save</p>
                <p className="text-4xl font-bold text-accent">{currency.symbol}{result.savedAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
