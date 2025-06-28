'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { HistoryEntry } from '@/types';
import { Delete, FlaskConical, Calculator as CalculatorIcon } from 'lucide-react';

type Operator = '+' | '-' | '×' | '÷' | 'x^y';
type Mode = 'normal' | 'scientific';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [operand, setOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);
  const [, setHistory] = useLocalStorage<HistoryEntry[]>('calc-history', []);
  const [isDeg, setIsDeg] = useState(true);
  const [mode, setMode] = useState<Mode>('normal');

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };
  
  const logToHistory = (calculation: string) => {
    const newEntry: HistoryEntry = {
      id: new Date().toISOString(),
      type: 'Scientific Calculator',
      calculation,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 49)]);
  };

  const inputDigit = (digit: string) => {
    if (display.length >= 20) return;
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setWaitingForOperand(false);
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleBackspace = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
     if (display.length === 1) setWaitingForOperand(true);
  };
  
  const handleUnaryOperation = (op: string) => {
    const value = parseFloat(display);
    if (isNaN(value)) return;
    let result: number | undefined = undefined;
    let expr: string = '';

    switch (op) {
      case 'sin':
        result = Math.sin(isDeg ? value * (Math.PI / 180) : value);
        expr = `sin(${display})`;
        break;
      case 'cos':
        result = Math.cos(isDeg ? value * (Math.PI / 180) : value);
        expr = `cos(${display})`;
        break;
      case 'tan':
        result = Math.tan(isDeg ? value * (Math.PI / 180) : value);
        expr = `tan(${display})`;
        break;
      case 'lg':
        result = Math.log10(value);
        expr = `log(${display})`;
        break;
      case 'ln':
        result = Math.log(value);
        expr = `ln(${display})`;
        break;
      case '√x':
        result = Math.sqrt(value);
        expr = `√(${display})`;
        break;
      case 'x!':
        result = factorial(value);
        expr = `${display}!`;
        break;
      case '1/x':
        result = 1 / value;
        expr = `1/(${display})`;
        break;
      case 'x²':
        result = value * value;
        expr = `${display}²`;
        break;
      case '+/-':
        result = -value;
        expr = `negate(${display})`;
        break;
      default:
        return;
    }
    
    if (result === undefined || isNaN(result) || !isFinite(result)) {
      setDisplay('Error');
    } else {
      const resultString = String(result);
      setDisplay(resultString);
      logToHistory(`${expr} = ${resultString}`);
    }
    setWaitingForOperand(true);
  };
  
  const performOperation = (nextOperator: Operator) => {
    const inputValue = parseFloat(display);
    if (operand === null) {
      setOperand(inputValue);
    } else if (operator) {
      const result = calculate(operand, inputValue, operator);
      const resultString = String(result);
      logToHistory(`${operand} ${operator} ${inputValue} = ${resultString}`);
      setDisplay(resultString);
      setOperand(result);
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };
  
  const handleEquals = () => {
    if (operator && operand !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(operand, inputValue, operator);
      logToHistory(`${operand} ${operator} ${inputValue} = ${result}`);
      setDisplay(String(result));
      setOperand(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const calculate = (left: number, right: number, op: Operator) => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '×': return left * right;
      case '÷': return left / right;
      case 'x^y': return Math.pow(left, right);
      default: return right;
    }
  };

  const handleConstant = (constant: 'π' | 'e') => {
    setDisplay(constant === 'π' ? String(Math.PI) : String(Math.E));
    setWaitingForOperand(false);
  };

  const handlePercent = () => {
    const result = String(parseFloat(display)/100);
    logToHistory(`${display}% = ${result}`);
    setDisplay(result);
    setWaitingForOperand(true);
  };

  const normalButtons = [
    { label: 'AC', class: 'bg-muted text-destructive', handler: clearDisplay },
    { label: '+/-', class: 'bg-muted', handler: () => handleUnaryOperation('+/-') },
    { label: '%', class: 'bg-muted', handler: handlePercent },
    { label: '÷', class: 'bg-primary text-primary-foreground', handler: () => performOperation('÷') },
    { label: '7', class: 'bg-secondary', handler: () => inputDigit('7') },
    { label: '8', class: 'bg-secondary', handler: () => inputDigit('8') },
    { label: '9', class: 'bg-secondary', handler: () => inputDigit('9') },
    { label: '×', class: 'bg-primary text-primary-foreground', handler: () => performOperation('×') },
    { label: '4', class: 'bg-secondary', handler: () => inputDigit('4') },
    { label: '5', class: 'bg-secondary', handler: () => inputDigit('5') },
    { label: '6', class: 'bg-secondary', handler: () => inputDigit('6') },
    { label: '-', class: 'bg-primary text-primary-foreground', handler: () => performOperation('-') },
    { label: '1', class: 'bg-secondary', handler: () => inputDigit('1') },
    { label: '2', class: 'bg-secondary', handler: () => inputDigit('2') },
    { label: '3', class: 'bg-secondary', handler: () => inputDigit('3') },
    { label: '+', class: 'bg-primary text-primary-foreground', handler: () => performOperation('+') },
    { label: '0', class: 'col-span-2 bg-secondary', handler: () => inputDigit('0') },
    { label: '.', class: 'bg-secondary', handler: inputDot },
    { label: '=', class: 'bg-primary text-primary-foreground', handler: handleEquals },
  ];

  const scientificButtons = [
    { label: 'x²', class: 'bg-muted', handler: () => handleUnaryOperation('x²')},
    { label: isDeg ? 'deg' : 'rad', class: 'bg-muted', handler: () => setIsDeg(prev => !prev)},
    { label: 'sin', class: 'bg-muted', handler: () => handleUnaryOperation('sin')},
    { label: 'cos', class: 'bg-muted', handler: () => handleUnaryOperation('cos')},
    { label: 'tan', class: 'bg-muted', handler: () => handleUnaryOperation('tan')},
    
    { label: 'x^y', class: 'bg-muted', handler: () => performOperation('x^y')},
    { label: 'lg', class: 'bg-muted', handler: () => handleUnaryOperation('lg')},
    { label: 'ln', class: 'bg-muted', handler: () => handleUnaryOperation('ln')},
    { label: 'e', class: 'bg-muted', handler: () => handleConstant('e')},
    { label: 'π', class: 'bg-muted', handler: () => handleConstant('π')},
    
    { label: '√x', class: 'bg-muted', handler: () => handleUnaryOperation('√x')},
    { label: 'AC', class: 'bg-muted text-destructive', handler: clearDisplay},
    { label: <Delete />, class: 'bg-muted', handler: handleBackspace},
    { label: '%', class: 'bg-muted', handler: handlePercent},
    { label: '÷', class: 'bg-primary text-primary-foreground', handler: () => performOperation('÷')},
    
    { label: 'x!', class: 'bg-muted', handler: () => handleUnaryOperation('x!')},
    { label: '7', class: 'bg-secondary', handler: () => inputDigit('7')},
    { label: '8', class: 'bg-secondary', handler: () => inputDigit('8')},
    { label: '9', class: 'bg-secondary', handler: () => inputDigit('9')},
    { label: '×', class: 'bg-primary text-primary-foreground', handler: () => performOperation('×')},
    
    { label: '1/x', class: 'bg-muted', handler: () => handleUnaryOperation('1/x')},
    { label: '4', class: 'bg-secondary', handler: () => inputDigit('4')},
    { label: '5', class: 'bg-secondary', handler: () => inputDigit('5')},
    { label: '6', class: 'bg-secondary', handler: () => inputDigit('6')},
    { label: '-', class: 'bg-primary text-primary-foreground', handler: () => performOperation('-')},
    
    { label: '+/-', class: 'bg-muted', handler: () => handleUnaryOperation('+/-') },
    { label: '1', class: 'bg-secondary', handler: () => inputDigit('1')},
    { label: '2', class: 'bg-secondary', handler: () => inputDigit('2')},
    { label: '3', class: 'bg-secondary', handler: () => inputDigit('3')},
    { label: '+', class: 'bg-primary text-primary-foreground', handler: () => performOperation('+')},

    { label: '0', class: 'col-span-3 bg-secondary', handler: () => inputDigit('0')},
    { label: '.', class: 'bg-secondary', handler: inputDot},
    { label: '=', class: 'bg-primary text-primary-foreground', handler: handleEquals},
  ];

  const buttonsToRender = mode === 'scientific' ? scientificButtons : normalButtons;
  const gridColsClass = mode === 'scientific' ? 'grid-cols-5' : 'grid-cols-4';
  const maxWidthClass = mode === 'scientific' ? 'max-w-md' : 'max-w-xs';
  const ToggleIcon = mode === 'normal' ? FlaskConical : CalculatorIcon;
  const toggleText = mode === 'normal' ? 'Scientific' : 'Normal';

  return (
    <div className={`mx-auto p-2 bg-background/50 rounded-lg transition-all duration-300 ${maxWidthClass}`}>
      <div className="flex justify-end items-center mb-2 h-10">
        <Button variant="ghost" size="sm" onClick={() => setMode(mode === 'normal' ? 'scientific' : 'normal')}>
          <ToggleIcon className="mr-2 h-4 w-4" />
          {toggleText}
        </Button>
      </div>
      <Input
        readOnly
        value={display}
        className="text-right text-5xl h-24 mb-4 font-light tracking-wide border-0 bg-transparent"
      />
      <div className={`grid ${gridColsClass} gap-2`}>
        {buttonsToRender.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.handler}
            variant="ghost"
            className={`text-xl h-14 rounded-full ${btn.class || ''}`}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
