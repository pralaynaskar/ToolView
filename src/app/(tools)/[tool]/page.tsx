
import { TOOLS } from '@/lib/constants';
import { ToolCard } from '@/components/ToolCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';

const ToolLoader = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex justify-between items-center gap-4">
      <div className="h-10 bg-muted rounded-md w-1/3" />
      <div className="h-10 bg-muted rounded-md w-1/4" />
    </div>
    <div className="h-40 bg-muted rounded-md w-full" />
    <div className="h-10 bg-muted rounded-md w-full" />
  </div>
);

const toolComponentMap: Record<string, React.ComponentType> = {
  'length': dynamic(() => import('@/components/converters/LengthConverter'), { loading: () => <ToolLoader /> }),
  'mass': dynamic(() => import('@/components/converters/WeightConverter'), { loading: () => <ToolLoader /> }),
  'temperature': dynamic(() => import('@/components/converters/TemperatureConverter'), { loading: () => <ToolLoader /> }),
  'bmi': dynamic(() => import('@/components/converters/BmiConverter'), { loading: () => <ToolLoader /> }),
  'age': dynamic(() => import('@/components/converters/AgeConverter'), { loading: () => <ToolLoader /> }),
  'discount': dynamic(() => import('@/components/converters/DiscountConverter'), { loading: () => <ToolLoader /> }),
  'gst': dynamic(() => import('@/components/converters/GstConverter'), { loading: () => <ToolLoader /> }),
  'investment': dynamic(() => import('@/components/converters/InvestmentConverter'), { loading: () => <ToolLoader /> }),
  'loan': dynamic(() => import('@/components/converters/LoanConverter'), { loading: () => <ToolLoader /> }),
  'calculator': dynamic(() => import('@/components/ScientificCalculator'), { loading: () => <ToolLoader /> }),
  'gemini-chat': dynamic(() => import('@/components/tools/GeminiChat'), { loading: () => <ToolLoader /> }),
  'openai-chat': dynamic(() => import('@/components/tools/OpenAiChat'), { loading: () => <ToolLoader /> }),
  'deepseek-chat': dynamic(() => import('@/components/tools/ComingSoonTool'), { loading: () => <ToolLoader /> }),
  'qwen-chat': dynamic(() => import('@/components/tools/ComingSoonTool'), { loading: () => <ToolLoader /> }),
  'on-screen-ruler': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'simple-counter': dynamic(() => import('@/components/tools/general/SimpleCounter'), { loading: () => <ToolLoader /> }),
  'scoreboard': dynamic(() => import('@/components/tools/general/Scoreboard'), { loading: () => <ToolLoader /> }),
  'countdown': dynamic(() => import('@/components/tools/general/Countdown'), { loading: () => <ToolLoader /> }),
  'stopwatch': dynamic(() => import('@/components/tools/general/Stopwatch'), { loading: () => <ToolLoader /> }),
  'morse-code': dynamic(() => import('@/components/tools/general/MorseCodeConverter'), { loading: () => <ToolLoader /> }),
  'roman-numerals': dynamic(() => import('@/components/tools/general/RomanNumeralConverter'), { loading: () => <ToolLoader /> }),
  'number-to-word': dynamic(() => import('@/components/tools/general/NumberToWordConverter'), { loading: () => <ToolLoader /> }),
  'compass': dynamic(() => import('@/components/tools/general/Compass'), { loading: () => <ToolLoader /> }),
  'percentage': dynamic(() => import('@/components/calculators/PercentageCalculator'), { loading: () => <ToolLoader /> }),
  'average': dynamic(() => import('@/components/calculators/AverageCalculator'), { loading: () => <ToolLoader /> }),
  'proportional': dynamic(() => import('@/components/calculators/algebra/ProportionalCalculator'), { loading: () => <ToolLoader /> }),
  'aspect-ratio': dynamic(() => import('@/components/calculators/algebra/AspectRatioCalculator'), { loading: () => <ToolLoader /> }),
  'fraction-simplifier': dynamic(() => import('@/components/calculators/algebra/FractionSimplifier'), { loading: () => <ToolLoader /> }),
  'decimal-to-fraction': dynamic(() => import('@/components/calculators/algebra/DecimalToFraction'), { loading: () => <ToolLoader /> }),
  'prime-number': dynamic(() => import('@/components/calculators/algebra/PrimeNumberCalculator'), { loading: () => <ToolLoader /> }),
  'exponent': dynamic(() => import('@/components/calculators/algebra/ExponentCalculator'), { loading: () => <ToolLoader /> }),
  'factorial': dynamic(() => import('@/components/calculators/algebra/FactorialCalculator'), { loading: () => <ToolLoader /> }),
  'equation-solver': dynamic(() => import('@/components/calculators/algebra/EquationSolver'), { loading: () => <ToolLoader /> }),
  'commission': dynamic(() => import('@/components/calculators/financial/CommissionCalculator'), { loading: () => <ToolLoader /> }),
  'time-calculator': dynamic(() => import('@/components/calculators/time/TimeCalculator'), { loading: () => <ToolLoader /> }),
  'multiple-time': dynamic(() => import('@/components/calculators/time/MultipleTimeCalculator'), { loading: () => <ToolLoader /> }),
  'days-until': dynamic(() => import('@/components/calculators/time/DaysUntilCalculator'), { loading: () => <ToolLoader /> }),
  'date': dynamic(() => import('@/components/calculators/time/DateCalculator'), { loading: () => <ToolLoader /> }),
  'numeral-system': dynamic(() => import('@/components/calculators/developer/NumeralSystemConverter'), { loading: () => <ToolLoader /> }),
  'square-calculator': dynamic(() => import('@/components/calculators/geometry/SquareCalculator'), { loading: () => <ToolLoader /> }),
  'circle-calculator': dynamic(() => import('@/components/calculators/geometry/CircleCalculator'), { loading: () => <ToolLoader /> }),
  'rectangle-calculator': dynamic(() => import('@/components/calculators/geometry/RectangleCalculator'), { loading: () => <ToolLoader /> }),
  'rhombus-calculator': dynamic(() => import('@/components/calculators/geometry/RhombusCalculator'), { loading: () => <ToolLoader /> }),
  'triangle-calculator': dynamic(() => import('@/components/calculators/geometry/TriangleCalculator'), { loading: () => <ToolLoader /> }),
  'right-triangle-calculator': dynamic(() => import('@/components/calculators/geometry/RightTriangleCalculator'), { loading: () => <ToolLoader /> }),
  'trapezoid-calculator': dynamic(() => import('@/components/calculators/geometry/TrapezoidCalculator'), { loading: () => <ToolLoader /> }),
  'pentagon-calculator': dynamic(() => import('@/components/calculators/geometry/PentagonCalculator'), { loading: () => <ToolLoader /> }),
  'hexagon-calculator': dynamic(() => import('@/components/calculators/geometry/HexagonCalculator'), { loading: () => <ToolLoader /> }),
  'circle-arc-calculator': dynamic(() => import('@/components/calculators/geometry/CircleArcCalculator'), { loading: () => <ToolLoader /> }),
  'cube-calculator': dynamic(() => import('@/components/calculators/geometry/CubeCalculator'), { loading: () => <ToolLoader /> }),
  'sphere-calculator': dynamic(() => import('@/components/calculators/geometry/SphereCalculator'), { loading: () => <ToolLoader /> }),
  'pyramid-calculator': dynamic(() => import('@/components/calculators/geometry/PyramidCalculator'), { loading: () => <ToolLoader /> }),
  'prism-calculator': dynamic(() => import('@/components/calculators/geometry/PrismCalculator'), { loading: () => <ToolLoader /> }),
  'cone-calculator': dynamic(() => import('@/components/calculators/geometry/ConeCalculator'), { loading: () => <ToolLoader /> }),
  'cylinder-calculator': dynamic(() => import('@/components/calculators/geometry/CylinderCalculator'), { loading: () => <ToolLoader /> }),
  'ellipsoid-calculator': dynamic(() => import('@/components/calculators/geometry/EllipsoidCalculator'), { loading: () => <ToolLoader /> }),
  'pyramid-frustum-calculator': dynamic(() => import('@/components/calculators/geometry/PyramidFrustumCalculator'), { loading: () => <ToolLoader /> }),
  'cone-frustum-calculator': dynamic(() => import('@/components/calculators/geometry/ConeFrustumCalculator'), { loading: () => <ToolLoader /> }),
  'sphere-cap-calculator': dynamic(() => import('@/components/calculators/geometry/SphereCapCalculator'), { loading: () => <ToolLoader /> }),
  'sphere-segment-calculator': dynamic(() => import('@/components/calculators/geometry/SphereSegmentCalculator'), { loading: () => <ToolLoader /> }),
  'water-intake-calculator': dynamic(() => import('@/components/converters/WaterIntakeCalculator'), { loading: () => <ToolLoader /> }),
  'ideal-weight-calculator': dynamic(() => import('@/components/converters/IdealWeightCalculator'), { loading: () => <ToolLoader /> }),
  'bmr-calculator': dynamic(() => import('@/components/converters/BmrCalculator'), { loading: () => <ToolLoader /> }),
  'currency': dynamic(() => import('@/components/converters/CurrencyConverter'), { loading: () => <ToolLoader /> }),
  'energy': dynamic(() => import('@/components/converters/EnergyConverter'), { loading: () => <ToolLoader /> }),
  'angle': dynamic(() => import('@/components/converters/AngleConverter'), { loading: () => <ToolLoader /> }),
  'cooking': dynamic(() => import('@/components/converters/CookingConverter'), { loading: () => <ToolLoader /> }),
  'time': dynamic(() => import('@/components/converters/TimeConverter'), { loading: () => <ToolLoader /> }),
  'prefix': dynamic(() => import('@/components/converters/PrefixConverter'), { loading: () => <ToolLoader /> }),
  'area': dynamic(() => import('@/components/converters/AreaConverter'), { loading: () => <ToolLoader /> }),
  'volume': dynamic(() => import('@/components/converters/VolumeConverter'), { loading: () => <ToolLoader /> }),
  'current': dynamic(() => import('@/components/converters/CurrentConverter'), { loading: () => <ToolLoader /> }),
  'pressure': dynamic(() => import('@/components/converters/PressureConverter'), { loading: () => <ToolLoader /> }),
  'voltage': dynamic(() => import('@/components/converters/VoltageConverter'), { loading: () => <ToolLoader /> }),
  'electric-charge': dynamic(() => import('@/components/converters/ElectricChargeConverter'), { loading: () => <ToolLoader /> }),
  'force': dynamic(() => import('@/components/converters/ForceConverter'), { loading: () => <ToolLoader /> }),
  'work': dynamic(() => import('@/components/converters/EnergyConverter'), { loading: () => <ToolLoader /> }),
  'resistance': dynamic(() => import('@/components/converters/ResistanceConverter'), { loading: () => <ToolLoader /> }),
  'capacitance': dynamic(() => import('@/components/converters/CapacitanceConverter'), { loading: () => <ToolLoader /> }),
  'speed': dynamic(() => import('@/components/converters/SpeedConverter'), { loading: () => <ToolLoader /> }),
  'acceleration': dynamic(() => import('@/components/converters/AccelerationConverter'), { loading: () => <ToolLoader /> }),
  'torque': dynamic(() => import('@/components/converters/TorqueConverter'), { loading: () => <ToolLoader /> }),
  'data': dynamic(() => import('@/components/converters/DataConverter'), { loading: () => <ToolLoader /> }),
  'css-units': dynamic(() => import('@/components/converters/CssUnitsConverter'), { loading: () => <ToolLoader /> }),
  'data-transfer': dynamic(() => import('@/components/converters/DataTransferConverter'), { loading: () => <ToolLoader /> }),
  'pixel-density': dynamic(() => import('@/components/converters/PixelDensityConverter'), { loading: () => <ToolLoader /> }),
  'image-resolution': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'typography': dynamic(() => import('@/components/converters/TypographyConverter'), { loading: () => <ToolLoader /> }),
  'sound': dynamic(() => import('@/components/converters/SoundConverter'), { loading: () => <ToolLoader /> }),
  'luminance': dynamic(() => import('@/components/converters/LuminanceConverter'), { loading: () => <ToolLoader /> }),
  'luminous-flux': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'temperature-gradient': dynamic(() => import('@/components/converters/TemperatureGradientConverter'), { loading: () => <ToolLoader /> }),
  'resize-image': dynamic(() => import('@/components/tools/ResizeImage'), { loading: () => <ToolLoader /> }),
  'crop-image': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'rounded-image': dynamic(() => import('@/components/tools/image/RoundedImage'), { loading: () => <ToolLoader /> }),
  'gradient-wallpaper-maker': dynamic(() => import('@/components/tools/image/GradientWallpaperMaker'), { loading: () => <ToolLoader /> }),
  'trim-transparency': dynamic(() => import('@/components/tools/image/TrimTransparency'), { loading: () => <ToolLoader /> }),
  'flip-image': dynamic(() => import('@/components/tools/FlipImage'), { loading: () => <ToolLoader /> }),
  'merge-pdf': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'split-pdf': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'rearrange-pdf': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'compress-pdf': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'pdf-to-word': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'word-to-pdf': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'unlock-pdf': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'protect-pdf': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'text-cases': dynamic(() => import('@/components/tools/TextCases'), { loading: () => <ToolLoader /> }),
  'find-replace': dynamic(() => import('@/components/tools/FindReplace'), { loading: () => <ToolLoader /> }),
  'sort-lines': dynamic(() => import('@/components/tools/SortLines'), { loading: () => <ToolLoader /> }),
  'text-counter': dynamic(() => import('@/components/tools/TextCounter'), { loading: () => <ToolLoader /> }),
  'repeat-text': dynamic(() => import('@/components/tools/RepeatText'), { loading: () => <ToolLoader /> }),
  'remove-white-spaces': dynamic(() => import('@/components/tools/RemoveWhiteSpaces'), { loading: () => <ToolLoader /> }),
  'remove-empty-lines': dynamic(() => import('@/components/tools/RemoveEmptyLines'), { loading: () => <ToolLoader /> }),
  'remove-duplicate-lines': dynamic(() => import('@/components/tools/RemoveDuplicateLines'), { loading: () => <ToolLoader /> }),
  'remove-duplicate-words': dynamic(() => import('@/components/tools/RemoveDuplicateWords'), { loading: () => <ToolLoader /> }),
  'remove-break-lines': dynamic(() => import('@/components/tools/RemoveBreakLines'), { loading: () => <ToolLoader /> }),
  'suffix-prefix': dynamic(() => import('@/components/tools/SuffixPrefix'), { loading: () => <ToolLoader /> }),
  'add-numbers-to-lines': dynamic(() => import('@/components/tools/AddNumbersToLines'), { loading: () => <ToolLoader /> }),
  'reverse-text': dynamic(() => import('@/components/tools/ReverseText'), { loading: () => <ToolLoader /> }),
  'reverse-lines': dynamic(() => import('@/components/tools/ReverseLines'), { loading: () => <ToolLoader /> }),
  'reverse-words': dynamic(() => import('@/components/tools/ReverseWords'), { loading: () => <ToolLoader /> }),
  'add-break-lines': dynamic(() => import('@/components/tools/AddBreakLines'), { loading: () => <ToolLoader /> }),
  'stylish-font': dynamic(() => import('@/components/tools/StylishFont'), { loading: () => <ToolLoader /> }),
  'text-decoration': dynamic(() => import('@/components/tools/TextDecoration'), { loading: () => <ToolLoader /> }),
  'japanese-emotion': dynamic(() => import('@/components/tools/JapaneseEmoticons'), { loading: () => <ToolLoader /> }),
  'big-text': dynamic(() => import('@/components/converters/PlaceholderConverter'), { loading: () => <ToolLoader /> }),
  'text-to-emoji': dynamic(() => import('@/components/tools/TextToEmoji'), { loading: () => <ToolLoader /> }),
  'base-converter': dynamic(() => import('@/components/tools/developer/BaseConverter'), { loading: () => <ToolLoader /> }),
  'beautify-json': dynamic(() => import('@/components/tools/BeautifyJson'), { loading: () => <ToolLoader /> }),
  'beautify-css': dynamic(() => import('@/components/tools/developer/BeautifyCss'), { loading: () => <ToolLoader /> }),
  'beautify-xml': dynamic(() => import('@/components/tools/developer/BeautifyXml'), { loading: () => <ToolLoader /> }),
  'beautify-html': dynamic(() => import('@/components/tools/developer/BeautifyHtml'), { loading: () => <ToolLoader /> }),
  'unicode-inspector': dynamic(() => import('@/components/tools/developer/UnicodeInspector'), { loading: () => <ToolLoader /> }),
  'repo-explorer': dynamic(() => import('@/components/tools/developer/RepoExplorer'), { loading: () => <ToolLoader /> }),
  'org-research-tool': dynamic(() => import('@/components/tools/developer/OrgResearcherTool'), { loading: () => <ToolLoader /> }),
  'color-picker': dynamic(() => import('@/components/tools/ColorPicker'), { loading: () => <ToolLoader /> }),
  'image-color-picker': dynamic(() => import('@/components/tools/ImageColorPicker'), { loading: () => <ToolLoader /> }),
  'blend-colors': dynamic(() => import('@/components/tools/BlendColors'), { loading: () => <ToolLoader /> }),
  'is-color-darkened': dynamic(() => import('@/components/tools/IsColorDarkened'), { loading: () => <ToolLoader /> }),
  'lucky-wheel': dynamic(() => import('@/components/tools/randomizer/LuckyWheel'), { loading: () => <ToolLoader /> }),
  'flip-coin': dynamic(() => import('@/components/tools/FlipCoin'), { loading: () => <ToolLoader /> }),
  'yes-no': dynamic(() => import('@/components/tools/general/YesNo'), { loading: () => <ToolLoader /> }),
  'rock-paper-scissors': dynamic(() => import('@/components/tools/randomizer/RockPaperScissors'), { loading: () => <ToolLoader /> }),
  'spin-bottle': dynamic(() => import('@/components/tools/randomizer/SpinTheBottle'), { loading: () => <ToolLoader /> }),
  'roll-dice': dynamic(() => import('@/components/tools/RollDice'), { loading: () => <ToolLoader /> }),
  'qr-code': dynamic(() => import('@/components/tools/QrCodeGenerator'), { loading: () => <ToolLoader /> }),
  'lorem-ipsum': dynamic(() => import('@/components/tools/LoremIpsumGenerator'), { loading: () => <ToolLoader /> }),
  'simple-number-generator': dynamic(() => import('@/components/tools/generator/SimpleNumberGenerator'), { loading: () => <ToolLoader /> }),
  'multiple-numbers-generator': dynamic(() => import('@/components/tools/generator/MultipleNumbersGenerator'), { loading: () => <ToolLoader /> }),
};

export async function generateMetadata({ params }: { params: { tool: string } }): Promise<Metadata> {
  const tool = TOOLS.find((t) => t.slug === params.tool);

  if (!tool) {
    return {
      title: 'Tool Not Found | ToolView',
    };
  }

  let pageTitle = `${tool.name} | ToolView`;
  let pageDescription = `Use the ${tool.name} tool on ToolView.`;

  if (tool.slug === 'calculator') {
    pageTitle = 'Scientific Calculator | ToolView';
    pageDescription = 'Perform basic and scientific calculations with ToolView.';
  } else if (tool.category === 'Unit Converters' && !tool.name.toLowerCase().includes('converter')) {
    pageTitle = `${tool.name} Converter | ToolView`;
    pageDescription = `Convert ${tool.name} units with ToolView.`;
  } else if (tool.category === 'Calculator' && !tool.name.toLowerCase().includes('calculator')) {
    pageTitle = `${tool.name} Calculator | ToolView`;
    pageDescription = `Calculate with the ${tool.name} calculator on ToolView.`;
  }

  return {
    title: pageTitle,
    description: pageDescription,
  };
}


export default function ToolPage({ params }: { params: { tool: string } }) {
  const { tool } = params;
  const currentTool = TOOLS.find((t) => t.slug === tool);

  if (!currentTool) {
    notFound();
  }
  
  let cardTitle = currentTool.name;
  if (currentTool.slug === 'calculator') {
    cardTitle = 'Scientific Calculator';
  } else if (currentTool.category === 'Unit Converters' && !currentTool.name.toLowerCase().includes('converter')) {
    cardTitle = `${currentTool.name} Converter`;
  } else if (currentTool.category === 'Calculator' && !currentTool.name.toLowerCase().includes('calculator')) {
    cardTitle = `${currentTool.name} Calculator`;
  }

  const ToolComponent = toolComponentMap[currentTool.slug];

  return (
    <ToolCard title={cardTitle} icon={currentTool.icon}>
      {ToolComponent ? <ToolComponent /> : <div>Tool component not found for slug: {currentTool.slug}</div>}
    </ToolCard>
  );
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    tool: tool.slug,
  }));
}
