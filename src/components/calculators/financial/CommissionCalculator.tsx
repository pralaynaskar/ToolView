
"use client"

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrency } from '@/hooks/use-currency'
import { calculateCommission } from '@/lib/converters'

export default function CommissionCalculator() {
  const { currency } = useCurrency();
  const [salePrice, setSalePrice] = useState('1000')
  const [commissionRate, setCommissionRate] = useState('5')

  const { commission, netProceeds } = useMemo(() => {
    return calculateCommission(parseFloat(salePrice), parseFloat(commissionRate));
  }, [salePrice, commissionRate]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sale-price">Sale Price ({currency.symbol})</Label>
          <Input id="sale-price" type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="commission-rate">Commission Rate (%)</Label>
          <Input id="commission-rate" type="number" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Commission</p>
              <p className="text-2xl font-bold text-primary">{currency.symbol}{commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Proceeds</p>
              <p className="text-2xl font-bold text-primary">{currency.symbol}{netProceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
