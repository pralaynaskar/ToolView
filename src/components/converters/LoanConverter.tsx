"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { HistoryEntry } from '@/types'
import { calculateLoan } from '@/lib/converters'
import { useCurrency } from '@/hooks/use-currency'

export default function LoanConverter() {
  const [amount, setAmount] = useState("250000")
  const [rate, setRate] = useState("5")
  const [years, setYears] = useState("30")
  const [result, setResult] = useState<{ monthlyPayment: number; totalPayment: number; totalInterest: number } | null>(null)
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", [])
  const { currency } = useCurrency();

  useEffect(() => {
    const numAmount = parseFloat(amount)
    const numRate = parseFloat(rate)
    const numYears = parseFloat(years)

    if (!isNaN(numAmount) && !isNaN(numRate) && !isNaN(numYears) && numAmount > 0 && numRate > 0 && numYears > 0) {
      const calcResult = calculateLoan(numAmount, numRate, numYears)
      setResult(calcResult)

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'Loan',
        calculation: `Loan of ${currency.symbol}${numAmount} for ${numYears} years, monthly payment: ${currency.symbol}${calcResult.monthlyPayment.toFixed(2)}`,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 49)])
    } else {
      setResult(null)
    }
  }, [amount, rate, years, currency, setHistory])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">Loan Amount ({currency.symbol})</label>
          <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="text-lg" />
        </div>
        <div className="space-y-2">
          <label htmlFor="rate" className="text-sm font-medium">Annual Interest Rate (%)</label>
          <Input id="rate" type="number" value={rate} onChange={e => setRate(e.target.value)} className="text-lg" />
        </div>
        <div className="space-y-2">
          <label htmlFor="years" className="text-sm font-medium">Loan Term (Years)</label>
          <Input id="years" type="number" value={years} onChange={e => setYears(e.target.value)} className="text-lg" />
        </div>
      </div>

      {result && (
        <Card className="bg-muted">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-lg text-muted-foreground">Monthly Payment</p>
              <p className="text-5xl font-bold text-primary">{currency.symbol}{result.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center border-t pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Payment</p>
                <p className="text-2xl font-semibold">{currency.symbol}{result.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-2xl font-semibold text-accent">{currency.symbol}{result.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
