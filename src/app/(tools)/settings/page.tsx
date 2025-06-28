
"use client";

import { ToolCard } from '@/components/ToolCard';
import { Settings, CheckCircle2, XCircle, MinusCircle, Check } from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';
import { currencies, type Currency } from '@/contexts/CurrencyContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { getApiKeyStatus } from '@/ai/flows/aiChatFlow';
import { Skeleton } from '@/components/ui/skeleton';
import { useTimeFormat, type TimeFormat } from '@/hooks/use-time-format';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useClockStyle, type ClockStyle } from '@/hooks/use-clock-style';
import { clockStyles } from '@/contexts/ClockStyleContext';
import { cn } from '@/lib/utils';
import { useColorTheme } from '@/hooks/use-color-theme';
import { themes } from '@/lib/themes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function ThemeSettings() {
  const { theme, setTheme } = useColorTheme();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Theme</h3>
      <p className="text-sm text-muted-foreground">
        Select a color theme for the application.
      </p>
      <TooltipProvider>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {themes.map((t) => (
            <Tooltip key={t.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTheme(t.name)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-2 transition-all hover:bg-accent",
                    theme === t.name ? "border-primary" : "border-transparent"
                  )}
                  aria-label={`Select ${t.label} theme`}
                >
                  <div
                    className="h-10 w-10 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="text-xs font-medium">{t.label}</span>
                  {theme === t.name && <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}

function CurrencySettings() {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Currency</h3>
       <p className="text-sm text-muted-foreground max-w-md">
          This currency will be used as the default for all financial calculations across the application.
      </p>
      <div className="space-y-2 max-w-sm">
        <Label htmlFor="currency-select">Primary Currency</Label>
        <Select value={currency.code} onValueChange={handleCurrencyChange}>
          <SelectTrigger id="currency-select">
            <SelectValue placeholder="Select a currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((c: Currency) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name} ({c.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function TimeFormatSettings() {
  const { timeFormat, setTimeFormat } = useTimeFormat();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Clock Display</h3>
       <p className="text-sm text-muted-foreground">
        Choose how time is displayed on the main page clock.
      </p>
      <RadioGroup
        value={timeFormat}
        onValueChange={(value) => setTimeFormat(value as TimeFormat)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="12h" id="12h" />
          <Label htmlFor="12h">12-Hour</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="24h" id="24h" />
          <Label htmlFor="24h">24-Hour</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

function ClockStyleSettings() {
  const { clockStyle, setClockStyle } = useClockStyle();

  const getStylePreviewClasses = (style: ClockStyle) => {
    switch (style) {
      case 'minimalist':
        return 'font-mono';
      case 'digital-glow':
        return 'font-orbitron text-cyan-500 [text-shadow:0_0_5px_theme(colors.cyan.500)]';
      case 'elegant-serif':
        return 'font-serif';
      case 'bold-modern':
        return 'font-anton tracking-wider';
      default:
        return 'font-mono';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Clock Style</h3>
      <p className="text-sm text-muted-foreground">
        Choose the visual style of the clock on the main page.
      </p>
      <RadioGroup
        value={clockStyle}
        onValueChange={(value) => setClockStyle(value as ClockStyle)}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {clockStyles.map((style) => (
          <Label
            key={style.id}
            htmlFor={style.id}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
              clockStyle === style.id ? "border-primary bg-accent" : "border-muted"
            )}
          >
            <RadioGroupItem value={style.id} id={style.id} className="sr-only" />
            <div className={cn("text-3xl", getStylePreviewClasses(style.id))}>
              12:34
            </div>
            <span className="mt-2 text-sm font-normal">{style.name}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}

const ApiKeyStatusRow = ({ name, provider, configured, available = true }: { name: string, provider: string, configured: boolean, available?: boolean }) => {
  const StatusIcon = available ? (configured ? CheckCircle2 : XCircle) : MinusCircle;
  const colorClass = available ? (configured ? 'text-green-500' : 'text-destructive') : 'text-muted-foreground';
  const statusText = available ? (configured ? 'Configured' : 'Not Configured') : 'Not Available';

  return (
    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{provider}</p>
      </div>
      <div className={`flex items-center gap-2 text-sm font-medium ${colorClass}`}>
        <StatusIcon className="size-5" />
        <span>{statusText}</span>
      </div>
    </div>
  );
};

function ApiKeysSettings() {
  const [keyStatus, setKeyStatus] = useState<{ openai: boolean; openweather: boolean; accuweather: boolean; } | null>(null);

  useEffect(() => {
    getApiKeyStatus().then(status => {
      setKeyStatus(status);
    });
  }, []);

  const apiKeys = [
    { name: 'Gemini', provider: 'Google AI', configured: true, available: true },
    { name: 'OpenAI', provider: 'GPT-4o, etc.', configured: keyStatus?.openai ?? false, available: false },
    { name: 'OpenWeatherMap', provider: 'Weather Data', configured: keyStatus?.openweather ?? false, available: true },
    { name: 'AccuWeather', provider: 'Weather Data', configured: keyStatus?.accuweather ?? false, available: true },
    { name: 'Deepseek', provider: '(Coming Soon)', configured: false, available: false },
    { name: 'Qwen', provider: '(Coming Soon)', configured: false, available: false },
  ];

  return (
    <div className="space-y-4 max-w-md">
      <h3 className="text-lg font-medium">API Keys Status</h3>
       <p className="text-sm text-muted-foreground">
        API keys are stored securely as environment variables. To enable a provider, add its key to your <code>.env</code> file in the root of your project, then restart the server.
        <br/><br/>
        <strong>Important:</strong> Keys for client-side services like weather must be prefixed with <code>NEXT_PUBLIC_</code>.
        <br/>
        Examples: <code>OPENAI_API_KEY=sk-...</code>, <code>NEXT_PUBLIC_OPENWEATHER_API_KEY=...</code>
      </p>
      <div className="space-y-3">
        {keyStatus === null ? (
            <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </>
        ) : (
            apiKeys.map(key => (
                <ApiKeyStatusRow key={key.name} {...key} />
            ))
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ToolCard title="Settings" icon={<Settings className="size-6" />} className="max-w-5xl">
      <Tabs defaultValue="appearance" className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <TabsList className="md:col-span-1 flex flex-col h-auto items-stretch bg-transparent p-0 gap-1">
             <TabsTrigger value="appearance" className="justify-start data-[state=active]:bg-accent data-[state=active]:shadow-none">Appearance</TabsTrigger>
             <TabsTrigger value="general" className="justify-start data-[state=active]:bg-accent data-[state=active]:shadow-none">General</TabsTrigger>
             <TabsTrigger value="developer" className="justify-start data-[state=active]:bg-accent data-[state=active]:shadow-none">Developer</TabsTrigger>
          </TabsList>
          
          <div className="md:col-span-3">
            <TabsContent value="appearance" className="mt-0">
                <div className="space-y-12">
                    <ThemeSettings />
                    <Separator/>
                    <ClockStyleSettings />
                    <Separator/>
                    <TimeFormatSettings />
                </div>
            </TabsContent>
            
            <TabsContent value="general" className="mt-0">
                <CurrencySettings />
            </TabsContent>

            <TabsContent value="developer" className="mt-0">
                <ApiKeysSettings />
            </TabsContent>
          </div>
      </Tabs>
    </ToolCard>
  );
}
