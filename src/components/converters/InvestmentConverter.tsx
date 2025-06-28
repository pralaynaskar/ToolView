"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { HistoryEntry } from '@/types'
import { calculateInvestment } from '@/lib/converters'
import { useCurrency } from '@/hooks/use-currency'

export default function InvestmentConverter() {
  const [initial, setInitial] = useState("1000")
  const [monthly, setMonthly] = useState("100")
  const [rate, setRate] = useState("7")
  const [years, setYears] = useState("10")
  const [result, setResult] = useState<{ futureValue: number; totalContribution: number; totalInterest: number } | null>(null)
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>("calc-history", [])
  const { currency } = useCurrency();

  useEffect(() => {
    const numInitial = parseFloat(initial)
    const numMonthly = parseFloat(monthly)
    const numRate = parseFloat(rate)
    const numYears = parseFloat(years)

    if (!isNaN(numInitial) && !isNaN(numMonthly) && !isNaN(numRate) && !isNaN(numYears) && numYears > 0) {
      const calcResult = calculateInvestment(numInitial, numMonthly, numRate, numYears)
      setResult(calcResult)

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        type: 'Investment',
        calculation: `Invested for ${numYears} years, future value: ${currency.symbol}${calcResult.futureValue.toFixed(2)}`,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 49)])
    } else {
      setResult(null)
    }
  }, [initial, monthly, rate, years, currency, setHistory])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="initial" className="text-sm font-medium">Initial Investment ({currency.symbol})</label>
          <Input id="initial" type="number" value={initial} onChange={e => setInitial(e.target.value)} className="text-lg" />
        </div>
        <div className="space-y-2">
          <label htmlFor="monthly" className="text-sm font-medium">Monthly Contribution ({currency.symbol})</label>
          <Input id="monthly" type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="text-lg" />
        </div>
        <div className="space-y-2">
          <label htmlFor="rate" className="text-sm font-medium">Annual Return Rate (%)</label>
          <Input id="rate" type="number" value={rate} onChange={e => setRate(e.target.value)} className="text-lg" />
        </div>
        <div className="space-y-2">
          <label htmlFor="years" className="text-sm font-medium">Investment Period (Years)</label>
          <Input id="years" type="number" value={years} onChange={e => setYears(e.target.value)} className="text-lg" />
        </div>
      </div>

      {result && (
        <Card className="bg-muted">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <p className="text-lg text-muted-foreground">Future Value</p>
              <p className="text-5xl font-bold text-primary">{currency.symbol}{result.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center border-t pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Contribution</p>
                <p className="text-2xl font-semibold">{currency.symbol}{result.totalContribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interest Earned</p>
                <p className="text-2xl font-semibold text-accent">{currency.symbol}{result.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
