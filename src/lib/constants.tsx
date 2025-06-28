

import React from 'react';
import {
  Ruler, Scale, Thermometer, Landmark, Cake, Square, HeartPulse, Database,
  Percent, Binary, GaugeCircle, Clock, FlaskConical, Receipt,
  TrendingUp, Banknote, Flame, Triangle,
  CookingPot, Gauge, CircuitBoard, Zap, Bolt, Move, Hammer, Waves, BatteryCharging,
  Rabbit, RotateCw, PenTool, ArrowRightLeft, Grid, Image as LucideImage, Type,
  Volume2, Sun, Lamp, Sigma, Superscript, Gem, Github,
  Scaling, Calculator, CalendarClock, Globe, Pyramid, Cone,
  Cylinder, Box, TriangleRight, Circle, RectangleHorizontal, Pentagon, Hexagon, Divide,
  Clapperboard, Crop, Scissors, FlipHorizontal, Layers, CaseSensitive, Replace, ArrowDownUp,
  Repeat, Eraser, MinusSquare, CopyX, Brackets, ListOrdered, Undo, Undo2, Combine, Palette,
  Underline, Smile, SmilePlus, Tv2, FileCode2, FileJson2, Pipette, Blend,
  Dices, Hash, CircleDollarSign, ThumbsUp, Hand, Bot, Dice6, Briefcase, ClipboardList,
  Timer, MessageCircle, WholeWord, Compass as CompassIcon, Hourglass, Sparkles, QrCode, FileText,
  GlassWater, Minimize2, Unlock, Lock, Download, Shuffle, ArrowDownAZ, ArrowUpAZ,
  Copy, ClipboardPaste, Wine, CloudSun, CheckSquare, StickyNote, Calendar as CalendarIconApp, Brain, Lightbulb, Music, Video, Newspaper, Camera, Gamepad2, Tv
} from 'lucide-react';

const TrapezoidIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18l-3 10H6L3 6z"/></svg>;
const RhombusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2l8 10-8 10-8-10z"/></svg>;
const AspectRatioIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 2v14a2 2 0 0 0 2 2h14" />
    <path d="M18 22V8a2 2 0 0 0-2-2H2" />
  </svg>
);
const LuckyWheelIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M5.6 5.6l12.8 12.8M5.6 18.4l12.8-12.8"/></svg>;
const CircleArcIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 12A10 10 0 1 1 12 2"/>
    <path d="M22 12H12V2"/>
  </svg>
);
const PyramidFrustumIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 3h8l4 18H4L8 3zM6.5 12h11"/></svg>;
const ConeFrustumIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 3h8l4 18H4L8 3z"/></svg>;
const SphereCapIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a10 10 0 00-10 10c0 4.42 2.86 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.84c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.29 2.75-1.29.55 1.35.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.83-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.41 22 12A10 10 0 0012 2z"/><path d="M6 16c0-1.1.9-2 2-2h8a2 2 0 012 2v0a2 2 0 01-2-2H8a2 2 0 01-2-2v0z"/></svg>;
const SphereSegmentIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M3.5 8h17M3.5 16h17"/></svg>;


export const mainCategories = [
   { name: 'AI Tools', slug: '/ai-tools', icon: <Bot className="size-8" />, description: 'Interact with powerful AI models.', color: 'ai', textColor: 'text-white' },
   { name: 'General Tools', slug: '/general-tools', icon: <Briefcase className="size-8" />, description: 'A variety of tools for different purposes.', color: 'general', textColor: 'text-white' },
   { name: 'Calculators', slug: '/calculators', icon: <Calculator className="size-8" />, description: 'Perform a wide range of calculations.', color: 'calculators', textColor: 'text-white' },
   { name: 'Unit Converters', slug: '/unit-converters', icon: <Ruler className="size-8" />, description: 'Convert between various units of measurement.', color: 'unit-converters', textColor: 'text-white' },
   { name: 'Health Tools', slug: '/health-tools', icon: <HeartPulse className="size-8" />, description: 'Tools to support your wellness journey.', color: 'health', textColor: 'text-white' },
   { name: 'Text Tools', slug: '/text-tools', icon: <Type className="size-8" />, description: 'Edit and transform your text content.', color: 'text', textColor: 'text-white' },
   { name: 'Image Tools', slug: '/image-tools', icon: <Clapperboard className="size-8" />, description: 'Manipulate and transform your images.', color: 'image', textColor: 'text-white' },
   { name: 'PDF Tools', slug: '/pdf-tools', icon: <FileText className="size-8" />, description: 'Merge, split, compress, and more.', color: 'pdf', textColor: 'text-white' },
   { name: 'Colors Tools', slug: '/colors-tools', icon: <Palette className="size-8" />, description: 'Handle colors with these powerful tools.', color: 'colors', textColor: 'text-white' },
   { name: 'Development Tools', slug: '/development-tools', icon: <Tv2 className="size-8" />, description: 'Format and convert your code.', color: 'development', textColor: 'text-white' },
   { name: 'Randomizer Tools', slug: '/randomizer-tools', icon: <Dices className="size-8" />, description: 'Tools to help you make decisions.', color: 'randomizer', textColor: 'text-white' },
   { name: 'Generator Tools', slug: '/generator-tools', icon: <Sparkles className="size-8" />, description: 'This section contains generative tools.', color: 'generator', textColor: 'text-white' },
];

export const mainApps = [
   { name: 'Weather', slug: '/weather', icon: <CloudSun className="size-8" />, description: 'Check the latest weather forecast.', color: 'weather', textColor: 'text-white' },
   { name: 'Calendar', slug: '/calendar', icon: <CalendarIconApp className="size-8" />, description: 'Organize your schedule and events.', color: 'calendar', textColor: 'text-white' },
   { name: 'To-Do List', slug: '/todo', icon: <CheckSquare className="size-8" />, description: 'Keep track of your tasks.', color: 'todo', textColor: 'text-white' },
   { name: 'Notes', slug: '/notes', icon: <StickyNote className="size-8" />, description: 'Jot down your thoughts and ideas.', color: 'notes', textColor: 'text-white' },
   { name: 'Quiz', slug: '/quiz', icon: <Lightbulb className="size-8" />, description: 'Test your knowledge on various topics.', color: 'quiz', textColor: 'text-white' },
   { name: 'Music Player', slug: '/music', icon: <Music className="size-8" />, description: 'Listen to your favorite tunes.', color: 'music', textColor: 'text-white' },
   { name: 'Video Player', slug: '/video', icon: <Video className="size-8" />, description: 'Watch videos seamlessly.', color: 'video', textColor: 'text-white' },
   { name: 'News', slug: '/news', icon: <Newspaper className="size-8" />, description: 'Stay updated with the latest news.', color: 'news', textColor: 'text-white' },
   { name: 'Camera', slug: '/camera', icon: <Camera className="size-8" />, description: 'Capture photos and record video.', color: 'camera', textColor: 'text-white' },
];

export const mainGames = [
   { name: 'Sudoku', slug: '/sudoku', icon: <Brain className="size-8" />, description: 'A classic logic puzzle for all ages.', color: 'sudoku', textColor: 'text-white' },
   { name: 'Dinosaur Game', slug: '/dinosaur-game', icon: <Gamepad2 className="size-8" />, description: 'Jump over obstacles and beat your high score.', color: 'dinosaur', textColor: 'text-white' },
   { name: 'Tic-Tac-Toe', slug: '/tic-tac-toe', icon: <Hash className="size-8" />, description: 'The classic game of Xs and Os.', color: 'tic-tac-toe', textColor: 'text-white' },
   { name: 'Memory Game', slug: '/memory-game', icon: <Brain className="size-8" />, description: 'Test your memory by matching pairs of cards.', color: 'memory', textColor: 'text-white' },
];


export const TOOLS = [
  // --- AI TOOLS ---
  { name: 'Gemini Chat', slug: 'gemini-chat', icon: <Bot className="size-5" />, category: 'AI Tools', keywords: ['gemini', 'google', 'llm', 'large language model'] },
  { name: 'OpenAI Chat', slug: 'openai-chat', icon: <Bot className="size-5" />, category: 'AI Tools', keywords: ['openai', 'gpt', 'llm'] },
  { name: 'Deepseek Chat', slug: 'deepseek-chat', icon: <Bot className="size-5" />, category: 'AI Tools', keywords: ['deepseek', 'llm'] },
  { name: 'Qwen Chat', slug: 'qwen-chat', icon: <Bot className="size-5" />, category: 'AI Tools', keywords: ['qwen', 'alibaba', 'llm'] },
  
  // --- GENERAL TOOLS ---
  { name: 'On-Screen Ruler', slug: 'on-screen-ruler', icon: <Ruler className="size-5" />, category: 'General Tools' },
  { name: 'Simple Counter', slug: 'simple-counter', icon: <Hash className="size-5" />, category: 'General Tools' },
  { name: 'Scoreboard', slug: 'scoreboard', icon: <ClipboardList className="size-5" />, category: 'General Tools' },
  { name: 'Countdown', slug: 'countdown', icon: <Hourglass className="size-5" />, category: 'General Tools' },
  { name: 'Stopwatch', slug: 'stopwatch', icon: <Timer className="size-5" />, category: 'General Tools' },
  { name: 'Morse Code', slug: 'morse-code', icon: <MessageCircle className="size-5" />, category: 'General Tools' },
  { name: 'Roman Numerals', slug: 'roman-numerals', icon: <Sigma className="size-5" />, category: 'General Tools' },
  { name: 'Number To Word', slug: 'number-to-word', icon: <WholeWord className="size-5" />, category: 'General Tools' },
  { name: 'Compass', slug: 'compass', icon: <CompassIcon className="size-5" />, category: 'General Tools' },

  // --- CALCULATORS ---
  // Calculator - Common
  { name: 'Scientific Calculator', slug: 'calculator', icon: <Calculator className="size-5" />, category: 'Calculator', subCategory: 'Common' },
  
  // Calculator - Algebra
  { name: 'Percentage', slug: 'percentage', icon: <Percent className="size-5" />, category: 'Calculator', subCategory: 'Algebra' },
  { name: 'Average', slug: 'average', icon: <Sigma className="size-5" />, category: 'Calculator', subCategory: 'Algebra' },
  { name: 'Proportional', slug: 'proportional', icon: <Scaling className="size-5" />, category: 'Calculator', subCategory: 'Algebra' },
  { name: 'Aspect Ratio', slug: 'aspect-ratio', icon: <AspectRatioIcon />, category: 'Calculator', subCategory: 'Algebra' },
  { name: 'Fraction Simplifier', slug: 'fraction-simplifier', icon: <Divide className="size-5" />, category: 'Calculator', subCategory: 'Algebra' },
  { name: 'Decimal to Fraction', slug: 'decimal-to-fraction', icon: <ArrowRightLeft className="size-5" />, category: 'Calculator', subCategory: 'Algebra' },
  { name: 'Prime Number', slug: 'prime-number', icon: <Gem className="size-5" />, category: 'Calculator', subCategory: 'Algebra' },
  { name: 'Exponent', slug: 'exponent', icon: <Superscript className="size-5" />, category: 'Calculator', subCategory: 'Algebra' },
  { name: 'Factorial', slug: 'factorial', icon: <Sigma className="size-5" />, category: 'Calculator', subCategory: 'Algebra' },
  { name: 'Equation Solver', slug: 'equation-solver', icon: <Sigma className="size-5" />, category: 'Calculator', subCategory: 'Algebra' },

  // Calculator - Financial
  { name: 'Discount', slug: 'discount', icon: <Percent className="size-5" />, category: 'Calculator', subCategory: 'Financial' },
  { name: 'GST', slug: 'gst', icon: <Receipt className="size-5" />, category: 'Calculator', subCategory: 'Financial', keywords: ['tax', 'sales tax', 'value added tax', 'vat'] },
  { name: 'Investment', slug: 'investment', icon: <TrendingUp className="size-5" />, category: 'Calculator', subCategory: 'Financial' },
  { name: 'Loan', slug: 'loan', icon: <Banknote className="size-5" />, category: 'Calculator', subCategory: 'Financial', keywords: ['mortgage'] },
  { name: 'Commission', slug: 'commission', icon: <Receipt className="size-5" />, category: 'Calculator', subCategory: 'Financial' },

  // Calculator - Time
  { name: 'Age Calculator', slug: 'age', icon: <Cake className="size-5" />, category: 'Calculator', subCategory: 'Time' },
  { name: 'Time Calculator', slug: 'time-calculator', icon: <Clock className="size-5" />, category: 'Calculator', subCategory: 'Time' },
  { name: 'Multiple Time', slug: 'multiple-time', icon: <Clock className="size-5" />, category: 'Calculator', subCategory: 'Time' },
  { name: 'Days Until', slug: 'days-until', icon: <CalendarClock className="size-5" />, category: 'Calculator', subCategory: 'Time' },
  { name: 'Date Calculator', slug: 'date', icon: <CalendarIconApp className="size-5" />, category: 'Calculator', subCategory: 'Time' },
  
  // Calculator - 2D Geometry
  { name: 'Square', slug: 'square-calculator', icon: <Square className="size-5" />, category: 'Calculator', subCategory: '2D Geometry' },
  { name: 'Circle', slug: 'circle-calculator', icon: <Circle className="size-5" />, category: 'Calculator', subCategory: '2D Geometry' },
  { name: 'Rectangle', slug: 'rectangle-calculator', icon: <RectangleHorizontal className="size-5" />, category: 'Calculator', subCategory: '2D Geometry' },
  { name: 'Rhombus', slug: 'rhombus-calculator', icon: <RhombusIcon />, category: 'Calculator', subCategory: '2D Geometry' },
  { name: 'Triangle', slug: 'triangle-calculator', icon: <Triangle className="size-5" />, category: 'Calculator', subCategory: '2D Geometry' },
  { name: 'Right Triangle', slug: 'right-triangle-calculator', icon: <TriangleRight className="size-5" />, category: 'Calculator', subCategory: '2D Geometry' },
  { name: 'Trapezoid', slug: 'trapezoid-calculator', icon: <TrapezoidIcon />, category: 'Calculator', subCategory: '2D Geometry' },
  { name: 'Pentagon', slug: 'pentagon-calculator', icon: <Pentagon className="size-5" />, category: 'Calculator', subCategory: '2D Geometry' },
  { name: 'Hexagon', slug: 'hexagon-calculator', icon: <Hexagon className="size-5" />, category: 'Calculator', subCategory: '2D Geometry' },
  { name: 'Circle Arc', slug: 'circle-arc-calculator', icon: <CircleArcIcon />, category: 'Calculator', subCategory: '2D Geometry' },
  
  // Calculator - 3D Geometry
  { name: 'Cube', slug: 'cube-calculator', icon: <Box className="size-5" />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Sphere', slug: 'sphere-calculator', icon: <Globe className="size-5" />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Pyramid', slug: 'pyramid-calculator', icon: <Pyramid className="size-5" />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Prism', slug: 'prism-calculator', icon: <Box className="size-5" />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Cone', slug: 'cone-calculator', icon: <Cone className="size-5" />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Cylinder', slug: 'cylinder-calculator', icon: <Cylinder className="size-5" />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Ellipsoid', slug: 'ellipsoid-calculator', icon: <Globe className="size-5" />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Pyramid Frustum', slug: 'pyramid-frustum-calculator', icon: <PyramidFrustumIcon />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Cone Frustum', slug: 'cone-frustum-calculator', icon: <ConeFrustumIcon />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Sphere Cap', slug: 'sphere-cap-calculator', icon: <SphereCapIcon />, category: 'Calculator', subCategory: '3D Geometry' },
  { name: 'Sphere Segment', slug: 'sphere-segment-calculator', icon: <SphereSegmentIcon />, category: 'Calculator', subCategory: '3D Geometry' },
  
  // Calculator - Developer
  { name: 'Numeral System', slug: 'numeral-system', icon: <Binary className="size-5" />, category: 'Calculator', subCategory: 'Developer', keywords: ['binary', 'hexadecimal', 'octal', 'decimal'] },

  // --- HEALTH TOOLS ---
  { name: 'BMI Calculator', slug: 'bmi', icon: <Gauge className="size-5" />, category: 'Health Tools', keywords: ['body mass index'] },
  { name: 'Water intake Calculator', slug: 'water-intake-calculator', icon: <GlassWater className="size-5" />, category: 'Health Tools' },
  { name: 'Ideal Weight Calculator', slug: 'ideal-weight-calculator', icon: <Scale className="size-5" />, category: 'Health Tools' },
  { name: 'BMR Calculator', slug: 'bmr-calculator', icon: <Flame className="size-5" />, category: 'Health Tools' },


  // --- UNIT CONVERTERS ---
  // Unit Converters - Common
  { name: 'Currency', slug: 'currency', icon: <Landmark className="size-5" />, category: 'Unit Converters', subCategory: 'Common', keywords: ['money', 'exchange rate'] },
  { name: 'Energy', slug: 'energy', icon: <Flame className="size-5" />, category: 'Unit Converters', subCategory: 'Common' },
  { name: 'Angle', slug: 'angle', icon: <Triangle className="size-5" />, category: 'Unit Converters', subCategory: 'Common' },
  { name: 'Temperature', slug: 'temperature', icon: <Thermometer className="size-5" />, category: 'Unit Converters', subCategory: 'Common' },
  { name: 'Cooking', slug: 'cooking', icon: <CookingPot className="size-5" />, category: 'Unit Converters', subCategory: 'Common' },
  { name: 'Time', slug: 'time', icon: <Clock className="size-5" />, category: 'Unit Converters', subCategory: 'Common' },
  { name: 'Prefix', slug: 'prefix', icon: <Binary className="size-5" />, category: 'Unit Converters', subCategory: 'Common' },
  
  // Unit Converters - Dimension
  { name: 'Area', slug: 'area', icon: <Square className="size-5" />, category: 'Unit Converters', subCategory: 'Dimension' },
  { name: 'Length', slug: 'length', icon: <Ruler className="size-5" />, category: 'Unit Converters', subCategory: 'Dimension' },
  { name: 'Volume', slug: 'volume', icon: <FlaskConical className="size-5" />, category: 'Unit Converters', subCategory: 'Dimension' },

  // Unit Converters - Mechanics & Electricity
  { name: 'Mass', slug: 'mass', icon: <Scale className="size-5" />, category: 'Unit Converters', subCategory: 'Mechanics & Electricity', keywords: ['weight'] },
  { name: 'Current', slug: 'current', icon: <CircuitBoard className="size-5" />, category: 'Unit Converters', subCategory: 'Mechanics & Electricity' },
  { name: 'Pressure', slug: 'pressure', icon: <Gauge className="size-5" />, category: 'Unit Converters', subCategory: 'Mechanics & Electricity' },
  { name: 'Voltage', slug: 'voltage', icon: <Zap className="size-5" />, category: 'Unit Converters', subCategory: 'Mechanics & Electricity' },
  { name: 'Electric Charge', slug: 'electric-charge', icon: <Bolt className="size-5" />, category: 'Unit Converters', subCategory: 'Mechanics & Electricity' },
  { name: 'Force', slug: 'force', icon: <Move className="size-5" />, category: 'Unit Converters', subCategory: 'Mechanics & Electricity' },
  { name: 'Work', slug: 'work', icon: <Hammer className="size-5" />, category: 'Unit Converters', subCategory: 'Mechanics & Electricity' },
  { name: 'Resistance', slug: 'resistance', icon: <Waves className="size-5" />, category: 'Unit Converters', subCategory: 'Mechanics & Electricity' },
  { name: 'Capacitance', slug: 'capacitance', icon: <BatteryCharging className="size-5" />, category: 'Unit Converters', subCategory: 'Mechanics & Electricity' },

  // Unit Converters - Motion
  { name: 'Speed', slug: 'speed', icon: <GaugeCircle className="size-5" />, category: 'Unit Converters', subCategory: 'Motion' },
  { name: 'Acceleration', slug: 'acceleration', icon: <Rabbit className="size-5" />, category: 'Unit Converters', subCategory: 'Motion' },
  { name: 'Torque', slug: 'torque', icon: <RotateCw className="size-5" />, category: 'Unit Converters', subCategory: 'Motion' },

  // Unit Converters - Developer
  { name: 'Data', slug: 'data', icon: <Database className="size-5" />, category: 'Unit Converters', subCategory: 'Developer' },
  { name: 'CSS Units', slug: 'css-units', icon: <PenTool className="size-5" />, category: 'Unit Converters', subCategory: 'Developer' },
  { name: 'Data Transfer', slug: 'data-transfer', icon: <ArrowRightLeft className="size-5" />, category: 'Unit Converters', subCategory: 'Developer' },
  { name: 'Pixel Density', slug: 'pixel-density', icon: <Grid className="size-5" />, category: 'Unit Converters', subCategory: 'Developer' },
  { name: 'Image Resolution', slug: 'image-resolution', icon: <LucideImage className="size-5" />, category: 'Unit Converters', subCategory: 'Developer' },
  { name: 'Typography', slug: 'typography', icon: <Type className="size-5" />, category: 'Unit Converters', subCategory: 'Developer' },

  // Unit Converters - Other
  { name: 'Sound', slug: 'sound', icon: <Volume2 className="size-5" />, category: 'Unit Converters', subCategory: 'Other' },
  { name: 'Luminance', slug: 'luminance', icon: <Sun className="size-5" />, category: 'Unit Converters', subCategory: 'Other' },
  { name: 'Luminous Flux', slug: 'luminous-flux', icon: <Lamp className="size-5" />, category: 'Unit Converters', subCategory: 'Other' },
  { name: 'Temp. Gradient', slug: 'temperature-gradient', icon: <Thermometer className="size-5" />, category: 'Unit Converters', subCategory: 'Other' },

  // --- IMAGE TOOLS ---
  { name: 'Resize Image', slug: 'resize-image', icon: <Scaling className="size-5" />, category: 'Image Tools' },
  { name: 'Crop Image', slug: 'crop-image', icon: <Crop className="size-5" />, category: 'Image Tools' },
  { name: 'Rounded Image', slug: 'rounded-image', icon: <Circle className="size-5" />, category: 'Image Tools' },
  { name: 'Gradient Maker', slug: 'gradient-wallpaper-maker', icon: <Layers className="size-5" />, category: 'Image Tools' },
  { name: 'Trim Transparency', slug: 'trim-transparency', icon: <Scissors className="size-5" />, category: 'Image Tools' },
  { name: 'Flip Image', slug: 'flip-image', icon: <FlipHorizontal className="size-5" />, category: 'Image Tools' },

  // --- PDF TOOLS ---
  { name: 'Merge PDF', slug: 'merge-pdf', icon: <Combine className="size-5" />, category: 'PDF Tools' },
  { name: 'Split PDF', slug: 'split-pdf', icon: <Scissors className="size-5" />, category: 'PDF Tools' },
  { name: 'Rearrange PDF', slug: 'rearrange-pdf', icon: <ArrowDownUp className="size-5" />, category: 'PDF Tools' },
  { name: 'Compress PDF', slug: 'compress-pdf', icon: <Minimize2 className="size-5" />, category: 'PDF Tools' },
  { name: 'PDF to Word', slug: 'pdf-to-word', icon: <FileText className="size-5" />, category: 'PDF Tools' },
  { name: 'Word to PDF', slug: 'word-to-pdf', icon: <FileText className="size-5" />, category: 'PDF Tools' },
  { name: 'Unlock PDF', slug: 'unlock-pdf', icon: <Unlock className="size-5" />, category: 'PDF Tools' },
  { name: 'Protect PDF', slug: 'protect-pdf', icon: <Lock className="size-5" />, category: 'PDF Tools' },

  // --- TEXT TOOLS ---
  // Basic Tools
  { name: 'Text Cases', slug: 'text-cases', icon: <CaseSensitive className="size-5" />, category: 'Text Tools', subCategory: 'Basic Tools' },
  { name: 'Find & Replace', slug: 'find-replace', icon: <Replace className="size-5" />, category: 'Text Tools', subCategory: 'Basic Tools' },
  { name: 'Sort Lines', slug: 'sort-lines', icon: <ArrowDownUp className="size-5" />, category: 'Text Tools', subCategory: 'Basic Tools' },
  { name: 'Text Counter', slug: 'text-counter', icon: <Sigma className="size-5" />, category: 'Text Tools', subCategory: 'Basic Tools' },
  { name: 'Repeat Text', slug: 'repeat-text', icon: <Repeat className="size-5" />, category: 'Text Tools', subCategory: 'Basic Tools' },
  // Remove Tools
  { name: 'Remove White Spaces', slug: 'remove-white-spaces', icon: <Eraser className="size-5" />, category: 'Text Tools', subCategory: 'Remove Tools' },
  { name: 'Remove Empty Lines', slug: 'remove-empty-lines', icon: <MinusSquare className="size-5" />, category: 'Text Tools', subCategory: 'Remove Tools' },
  { name: 'Remove Duplicate Lines', slug: 'remove-duplicate-lines', icon: <CopyX className="size-5" />, category: 'Text Tools', subCategory: 'Remove Tools' },
  { name: 'Remove Duplicate Words', slug: 'remove-duplicate-words', icon: <CopyX className="size-5" />, category: 'Text Tools', subCategory: 'Remove Tools' },
  { name: 'Remove Break Lines', slug: 'remove-break-lines', icon: <Eraser className="size-5" />, category: 'Text Tools', subCategory: 'Remove Tools' },
  // Edit Tools
  { name: 'Suffix/Prefix', slug: 'suffix-prefix', icon: <Brackets className="size-5" />, category: 'Text Tools', subCategory: 'Edit Tools' },
  { name: 'Add Numbers To Lines', slug: 'add-numbers-to-lines', icon: <ListOrdered className="size-5" />, category: 'Text Tools', subCategory: 'Edit Tools' },
  { name: 'Reverse Text', slug: 'reverse-text', icon: <Undo className="size-5" />, category: 'Text Tools', subCategory: 'Edit Tools' },
  { name: 'Reverse Lines', slug: 'reverse-lines', icon: <ArrowDownUp className="size-5" />, category: 'Text Tools', subCategory: 'Edit Tools' },
  { name: 'Reverse Words', slug: 'reverse-words', icon: <Undo2 className="size-5" />, category: 'Text Tools', subCategory: 'Edit Tools' },
  { name: 'Add Break Lines', slug: 'add-break-lines', icon: <Combine className="size-5" />, category: 'Text Tools', subCategory: 'Edit Tools' },
  // Stylish Tools
  { name: 'Stylish Font', slug: 'stylish-font', icon: <Palette className="size-5" />, category: 'Text Tools', subCategory: 'Stylish Tools' },
  { name: 'Text Decoration', slug: 'text-decoration', icon: <Underline className="size-5" />, category: 'Text Tools', subCategory: 'Stylish Tools' },
  { name: 'Japanese Emotion', slug: 'japanese-emotion', icon: <Smile className="size-5" />, category: 'Text Tools', subCategory: 'Stylish Tools' },
  { name: 'Big Text', slug: 'big-text', icon: <Type className="size-5" />, category: 'Text Tools', subCategory: 'Stylish Tools' },
  { name: 'Text To Emoji', slug: 'text-to-emoji', icon: <SmilePlus className="size-5" />, category: 'Text Tools', subCategory: 'Stylish Tools' },

  // --- DEVELOPMENT TOOLS ---
  { name: 'Base Converter', slug: 'base-converter', icon: <Binary className="size-5" />, category: 'Development Tools', subCategory: 'Converters' },
  { name: 'Beautify JSON', slug: 'beautify-json', icon: <FileJson2 className="size-5" />, category: 'Development Tools', subCategory: 'Beautify', keywords: ['formatter', 'linter', 'json lint', 'pretty print'] },
  { name: 'Beautify CSS', slug: 'beautify-css', icon: <FileCode2 className="size-5" />, category: 'Development Tools', subCategory: 'Beautify' },
  { name: 'Beautify XML', slug: 'beautify-xml', icon: <FileCode2 className="size-5" />, category: 'Development Tools', subCategory: 'Beautify' },
  { name: 'Beautify HTML', slug: 'beautify-html', icon: <FileCode2 className="size-5" />, category: 'Development Tools', subCategory: 'Beautify' },
  { name: 'Unicode Inspector', slug: 'unicode-inspector', icon: <Sigma className="size-5" />, category: 'Development Tools', subCategory: 'Analyse' },
  { name: 'Repo Explorer', slug: 'repo-explorer', icon: <Github className="size-5" />, category: 'Development Tools', subCategory: 'GitHub' },
  { name: 'Associated Organization Research Tool', slug: 'org-research-tool', icon: <Github className="size-5" />, category: 'Development Tools', subCategory: 'GitHub' },

  // --- COLORS TOOLS ---
  { name: 'Color Picker', slug: 'color-picker', icon: <Pipette className="size-5" />, category: 'Colors Tools', keywords: ['colour'] },
  { name: 'Image Color Picker', slug: 'image-color-picker', icon: <Pipette className="size-5" />, category: 'Colors Tools' },
  { name: 'Blend Colors', slug: 'blend-colors', icon: <Blend className="size-5" />, category: 'Colors Tools' },
  { name: 'Is Color Darkened', slug: 'is-color-darkened', icon: <Palette className="size-5" />, category: 'Colors Tools' },

  // --- RANDOMIZER TOOLS ---
  { name: 'Lucky Wheel', slug: 'lucky-wheel', icon: <LuckyWheelIcon className="size-5" />, category: 'Randomizer Tools' },
  { name: 'Flip Coin', slug: 'flip-coin', icon: <CircleDollarSign className="size-5" />, category: 'Randomizer Tools' },
  { name: 'Yes/No', slug: 'yes-no', icon: <ThumbsUp className="size-5" />, category: 'Randomizer Tools' },
  { name: 'Rock Paper Scissors', slug: 'rock-paper-scissors', icon: <Hand className="size-5" />, category: 'Randomizer Tools', keywords: ['roshambo'] },
  { name: 'Spin Bottle', slug: 'spin-bottle', icon: <Wine className="size-5" />, category: 'Randomizer Tools' },
  { name: 'Roll Dice', slug: 'roll-dice', icon: <Dice6 className="size-5" />, category: 'Randomizer Tools' },

  // --- GENERATOR TOOLS ---
  { name: 'QR Code', slug: 'qr-code', icon: <QrCode className="size-5" />, category: 'Generator Tools' },
  { name: 'Lorem Ipsum', slug: 'lorem-ipsum', icon: <FileText className="size-5" />, category: 'Generator Tools' },
  { name: 'Simple Number Generator', slug: 'simple-number-generator', icon: <Hash className="size-5" />, category: 'Generator Tools' },
  { name: 'Multiple Numbers Generator', slug: 'multiple-numbers-generator', icon: <ListOrdered className="size-5" />, category: 'Generator Tools' },
];

export const getSearchableItems = () => {
  const tools = TOOLS.map(tool => ({
    name: tool.name,
    slug: tool.slug,
    href: `/${tool.slug}`,
    icon: tool.icon,
    category: tool.category,
    subCategory: tool.subCategory,
    keywords: tool.keywords,
    description: `A tool for ${tool.name} in the ${tool.category} category.`,
  }));

  const apps = mainApps.map(app => ({
    name: app.name,
    slug: app.slug.replace('/', ''),
    href: app.slug,
    icon: app.icon,
    category: 'Apps',
    description: app.description,
    keywords: [app.name, 'app', 'application']
  }));

  const games = mainGames.map(game => ({
    name: game.name,
    slug: game.slug.replace('/', ''),
    href: game.slug,
    icon: game.icon,
    category: 'Games',
    description: game.description,
    keywords: [game.name, 'game']
  }));

  return [...tools, ...apps, ...games];
};
