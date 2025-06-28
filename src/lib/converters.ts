
import { differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths, addDays, addWeeks, formatDistanceStrict, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

const conversions: Record<string, Record<string, number>> = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.34,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
  },
  data: {
    'B': 1,
    'KB': 1000,
    'MB': 1e6,
    'GB': 1e9,
    'TB': 1e12,
    'KiB': 1024,
    'MiB': 1024 ** 2,
    'GiB': 1024 ** 3,
    'TiB': 1024 ** 4,
    'b': 0.125,
    'kb': 125,
    'Mb': 1.25e5,
    'Gb': 1.25e8,
    'Tb': 1.25e11,
    'kib': 128,
    'Mib': 131072,
    'Gib': 134217728,
    'Tib': 1.37438953472e11,
  },
  speed: {
    'm/s': 1,
    'km/h': 0.277778,
    mph: 0.44704,
    knot: 0.514444,
  },
  energy: {
    'joule': 1,
    'millijoule': 0.001,
    'kilojoule': 1000,
    'megajoule': 1_000_000,
    'calorie': 4.184,
    'kilocalorie': 4184,
    'watt second': 1,
    'watt hour': 3600,
    'kilowatt hour': 3_600_000,
  },
  angle: {
    'degree': 1,
    'radian': 180 / Math.PI,
    'gradian': 0.9,
    'gon': 0.9,
    'minute': 1 / 60,
    'second': 1 / 3600,
    'sign': 30,
    'mil': 360 / 6400,
    'revolution': 360,
    'circle': 360,
    'quadrant': 90,
    'sextant': 60,
  },
  cooking: {
    'liter': 1,
    'cup (metric)': 0.25,
    'teaspoon': 0.00492892,
    'tablespoon': 0.0147868,
    'fluid ounce': 0.0295735,
    'cup': 0.236588,
    'pint': 0.473176,
    'quart': 0.946353,
    'gallon': 3.78541,
    'bushel': 35.2391,
    'barrel': 119.24,
  },
  time: {
    'second': 1,
    'week': 604800,
    'day': 86400,
    'hour': 3600,
    'minute': 60,
    'millisecond': 1e-3,
    'microsecond': 1e-6,
    'nanosecond': 1e-9,
    'picosecond': 1e-12,
    'femtosecond': 1e-15,
  },
  prefix: {
    'yotta': 1e24,
    'zetta': 1e21,
    'exa': 1e18,
    'peta': 1e15,
    'tera': 1e12,
    'giga': 1e9,
    'mega': 1e6,
    'kilo': 1e3,
    'hecto': 1e2,
    'deca': 10,
    '(none)': 1,
    'deci': 0.1,
    'centi': 0.01,
    'milli': 1e-3,
    'micro': 1e-6,
    'nano': 1e-9,
    'pico': 1e-12,
    'femto': 1e-15,
    'atto': 1e-18,
    'zepto': 1e-21,
    'yocto': 1e-24,
  },
  area: {
    'm2': 1,
    'km2': 1e6,
    'cm2': 1e-4,
    'mm2': 1e-6,
    'ha': 1e4,
    'acre': 4046.86,
    'ft2': 0.092903,
    'in2': 0.00064516,
  },
  volume: {
    'm3': 1,
    'L': 0.001,
    'mL': 1e-6,
    'gal': 0.00378541,
    'qt': 0.000946353,
    'pt': 0.000473176,
    'cup': 0.000236588,
    'fl oz': 2.95735e-5,
    'ft3': 0.0283168,
    'in3': 1.6387e-5,
  },
  current: {
    'A': 1,
    'mA': 1e-3,
    'kA': 1e3,
  },
  pressure: {
    'Pa': 1,
    'kPa': 1000,
    'bar': 100000,
    'psi': 6894.76,
    'atm': 101325,
  },
  voltage: {
    'V': 1,
    'mV': 1e-3,
    'kV': 1e3,
  },
  electricCharge: {
    'C': 1,
    'mC': 1e-3,
    'µC': 1e-6,
    'nC': 1e-9,
  },
  force: {
    'N': 1,
    'kN': 1000,
    'lbf': 4.44822,
  },
  resistance: {
    'Ω': 1,
    'mΩ': 1e-3,
    'kΩ': 1e3,
    'MΩ': 1e6,
  },
  capacitance: {
    'F': 1,
    'mF': 1e-3,
    'µF': 1e-6,
    'nF': 1e-9,
    'pF': 1e-12,
  },
  acceleration: {
    'm/s2': 1,
    'km/s2': 1000,
    'g': 9.80665,
  },
  torque: {
    'N·m': 1,
    'lbf·ft': 1.35582,
  },
  dataTransfer: {
    'bps': 1,
    'Kbps': 1e3,
    'Mbps': 1e6,
    'Gbps': 1e9,
    'Tbps': 1e12,
  },
  pixelDensity: {
    'ppi': 1,
    'ppcm': 2.54,
  },
  sound: {
    'dB': 1,
    'B': 10,
  },
  luminance: {
    'cd/m2': 1,
    'nit': 1,
    'apostilb': 1 / Math.PI,
    'lambert': 10000 / Math.PI,
    'foot-lambert': 3.426,
  },
  temperatureGradient: {
    'K/m': 1,
    'C/m': 1,
    'F/ft': 1.8 / 0.3048,
  },
};

export function convertUnit(
  value: number,
  type: 'length' | 'weight' | 'data' | 'speed' | 'energy' | 'angle' | 'cooking' | 'time' | 'prefix' | 'area' | 'volume' | 'current' | 'pressure' | 'voltage' | 'electricCharge' | 'force' | 'resistance' | 'capacitance' | 'acceleration' | 'torque' | 'dataTransfer' | 'pixelDensity' | 'sound' | 'luminance' | 'temperatureGradient',
  fromUnit: string,
  toUnit: string
): number {
  if (isNaN(value)) return 0;
  // 'work' is an alias for 'energy'
  const conversionType = type === 'work' ? 'energy' : type;
  if (!conversions[conversionType]) throw new Error(`Invalid conversion type: ${conversionType}`);

  const fromFactor = conversions[conversionType][fromUnit];
  const toFactor = conversions[conversionType][toUnit];

  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error(`Invalid unit for type ${conversionType}`);
  }

  const valueInBase = value * fromFactor;
  const valueInTarget = valueInBase / toFactor;

  return valueInTarget;
}

export function convertTypography(value: number, fromUnit: 'px' | 'pt' | 'em' | 'rem', toUnit: 'px' | 'pt' | 'em' | 'rem', baseSize: number): number {
    if (isNaN(value) || isNaN(baseSize) || baseSize <= 0) return 0;

    let valueInPx: number;

    // Convert fromUnit to pixels
    switch(fromUnit) {
        case 'px': valueInPx = value; break;
        case 'pt': valueInPx = value * (96 / 72); break;
        case 'em': valueInPx = value * baseSize; break;
        case 'rem': valueInPx = value * baseSize; break;
        default: return 0;
    }

    // Convert from pixels to toUnit
    switch(toUnit) {
        case 'px': return valueInPx;
        case 'pt': return valueInPx * (72 / 96);
        case 'em': return valueInPx / baseSize;
        case 'rem': return valueInPx / baseSize;
        default: return 0;
    }
}

export function getCssEquivalents(pxValue: number) {
    if (isNaN(pxValue) || pxValue < 0) return { px: 0, pt: 0, pc: 0, in: 0, cm: 0, mm: 0 };
    return {
        px: pxValue,
        pt: pxValue * (72 / 96),
        pc: pxValue / 16,
        in: pxValue / 96,
        cm: pxValue / (96 / 2.54),
        mm: pxValue / (96 / 25.4),
    }
}


export function convertTemperature(value: number, fromUnit: 'C' | 'F' | 'K' | 'R' | 'De' | 'N' | 'Re' | 'Ro', toUnit: 'C' | 'F' | 'K' | 'R' | 'De' | 'N' | 'Re' | 'Ro'): number {
  if (isNaN(value)) return 0;
  if (fromUnit === toUnit) return value;

  let celsius: number;

  // Convert input to Celsius
  switch (fromUnit) {
    case 'F':
      celsius = (value - 32) * 5 / 9;
      break;
    case 'K':
      celsius = value - 273.15;
      break;
    case 'R': // Rankine
      celsius = (value - 491.67) * 5 / 9;
      break;
    case 'De': // Delisle
      celsius = 100 - value * 2 / 3;
      break;
    case 'N': // Newton
      celsius = value * 100 / 33;
      break;
    case 'Re': // Réaumur
      celsius = value * 5 / 4;
      break;
    case 'Ro': // Rømer
      celsius = (value - 7.5) * 40 / 21;
      break;
    default: // 'C'
      celsius = value;
  }

  // Convert from Celsius to target unit
  switch (toUnit) {
    case 'F':
      return (celsius * 9 / 5) + 32;
    case 'K':
      return celsius + 273.15;
    case 'R': // Rankine
      return (celsius + 273.15) * 9 / 5;
    case 'De': // Delisle
      return (100 - celsius) * 3 / 2;
    case 'N': // Newton
      return celsius * 33 / 100;
    case 'Re': // Réaumur
      return celsius * 4 / 5;
    case 'Ro': // Rømer
      return celsius * 21 / 40 + 7.5;
    default: // 'C'
      return celsius;
  }
}

export function calculateBmi(weight: number, height: number, weightUnit: 'kg' | 'lb', heightUnit: 'cm' | 'in' | 'm' | 'ft'): number {
  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) return 0;

  const weightInKg = weightUnit === 'kg' ? weight : convertUnit(weight, 'weight', 'lb', 'kg');
  
  let heightInM: number;
  if (heightUnit === 'm') {
    heightInM = height;
  } else if (heightUnit === 'cm') {
    heightInM = convertUnit(height, 'length', 'cm', 'm');
  } else if (heightUnit === 'in') {
    heightInM = convertUnit(height, 'length', 'in', 'm');
  } else { 
    heightInM = convertUnit(height, 'length', 'ft', 'm');
  }

  if (heightInM === 0) return 0;

  const bmi = weightInKg / (heightInM * heightInM);
  return bmi;
}

export function calculateWaterIntake(weight: number, weightUnit: 'kg' | 'lb', activityLevel: 'sedentary' | 'moderate' | 'high'): number {
  if (isNaN(weight) || weight <= 0) return 0;

  const weightInKg = weightUnit === 'kg' ? weight : convertUnit(weight, 'weight', 'lb', 'kg');
  const baseIntake = weightInKg * 33; // in ml

  let activityBonus = 0;
  if (activityLevel === 'moderate') {
    activityBonus = 500; // ml
  } else if (activityLevel === 'high') {
    activityBonus = 750; // ml
  }

  const totalIntakeMl = baseIntake + activityBonus;
  return totalIntakeMl / 1000; // convert to Liters
}

export function calculateAge(birthDate: Date, atDate: Date) {
  const years = differenceInYears(atDate, birthDate);
  const monthAnchor = addYears(birthDate, years);
  const months = differenceInMonths(atDate, monthAnchor);
  const dayAnchor = addMonths(monthAnchor, months);
  const days = differenceInDays(atDate, dayAnchor);
  
  const totalDays = differenceInDays(atDate, birthDate);
  const totalHours = differenceInHours(atDate, birthDate);
  const totalMinutes = differenceInMinutes(atDate, birthDate);
  const totalSeconds = differenceInSeconds(atDate, birthDate);

  let nextBirthdayDate = new Date(atDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthdayDate < atDate) {
    nextBirthdayDate.setFullYear(atDate.getFullYear() + 1);
  }

  const nextBirthdayMonths = differenceInMonths(nextBirthdayDate, atDate);
  const nextBirthdayMonthAnchor = addMonths(atDate, nextBirthdayMonths);
  const nextBirthdayDays = differenceInDays(nextBirthdayDate, nextBirthdayMonthAnchor);
  
  const nextBirthday = {
    months: nextBirthdayMonths,
    days: nextBirthdayDays
  };

  return { years, months, days, totalDays, totalHours, totalMinutes, totalSeconds, nextBirthday };
}

export function calculateDiscount(originalPrice: number, discountPercent: number) {
  if (isNaN(originalPrice) || isNaN(discountPercent)) return { finalPrice: 0, savedAmount: 0 };
  const savedAmount = originalPrice * (discountPercent / 100);
  const finalPrice = originalPrice - savedAmount;
  return { finalPrice, savedAmount };
}

export function calculateGst(amount: number, rate: number, type: 'add' | 'remove') {
  if (isNaN(amount) || isNaN(rate)) return { originalAmount: 0, gstAmount: 0, finalAmount: 0 };
  
  if (type === 'add') {
    const gstAmount = amount * (rate / 100);
    const finalAmount = amount + gstAmount;
    return { originalAmount: amount, gstAmount, finalAmount };
  } else {
    const originalAmount = amount / (1 + rate / 100);
    const gstAmount = amount - originalAmount;
    return { originalAmount, gstAmount, finalAmount: amount };
  }
}

export function calculateLoan(amount: number, annualRate: number, termYears: number) {
  const principal = amount;
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  if (monthlyRate === 0) {
    const monthlyPayment = principal / numberOfPayments;
    return {
      monthlyPayment,
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - principal;

  return { monthlyPayment, totalPayment, totalInterest };
}

export function calculateInvestment(principal: number, monthlyContribution: number, annualRate: number, termYears: number) {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPeriods = termYears * 12;
  const totalContribution = principal + (monthlyContribution * numberOfPeriods);

  if (monthlyRate === 0) {
    return {
      futureValue: totalContribution,
      totalContribution,
      totalInterest: 0,
    };
  }
  
  const futureValueOfPrincipal = principal * Math.pow(1 + monthlyRate, numberOfPeriods);
  const futureValueOfContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, numberOfPeriods) - 1) / monthlyRate);
  
  const futureValue = futureValueOfPrincipal + futureValueOfContributions;
  const totalInterest = futureValue - totalContribution;
  
  return { futureValue, totalContribution, totalInterest };
}

export function calculatePercentage(mode: string, val1: number, val2: number) {
  if (isNaN(val1) || isNaN(val2)) return null;
  switch (mode) {
    case 'p_of_n': // 5% of 100
      return (val1 / 100) * val2;
    case 'n_is_p_of': // 5 is what % of 100
      if (val2 === 0) return Infinity;
      return (val1 / val2) * 100;
    case 'increase': // % increase from 100 to 105
      if (val1 === 0) return Infinity;
      return ((val2 - val1) / val1) * 100;
    case 'decrease': // % decrease from 100 to 95
      if (val1 === 0) return Infinity;
      return ((val1 - val2) / val1) * 100;
    default:
      return null;
  }
}

export function calculateAverage(numbers: number[]) {
  if (numbers.length === 0) return { sum: 0, count: 0, average: 0 };
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const count = numbers.length;
  const average = sum / count;
  return { sum, count, average };
}

export function calculateIdealWeight(height: number, heightUnit: 'cm' | 'in' | 'm' | 'ft', gender: 'male' | 'female') {
  if (isNaN(height) || height <= 0) return { idealWeightKg: 0 };

  let heightInInches: number;
  if (heightUnit === 'cm') {
    heightInInches = height / 2.54;
  } else if (heightUnit === 'm') {
    heightInInches = height * 39.3701;
  } else if (heightUnit === 'ft') {
    heightInInches = height * 12;
  } else { // 'in'
    heightInInches = height;
  }

  const heightOver5FtInches = heightInInches - 60; // 5 feet = 60 inches

  if (heightOver5FtInches < 0) {
    return { idealWeightKg: 0 };
  }

  let idealWeightKg;
  if (gender === 'male') {
    idealWeightKg = 52 + (1.9 * heightOver5FtInches);
  } else { // female
    idealWeightKg = 49 + (1.7 * heightOver5FtInches);
  }
  
  return { idealWeightKg };
}

export function calculateBmr(weight: number, height: number, age: number, gender: 'male' | 'female', weightUnit: 'kg' | 'lb', heightUnit: 'cm' | 'm') {
  if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
    return { bmr: 0 };
  }

  const weightInKg = weightUnit === 'kg' ? weight : convertUnit(weight, 'weight', 'lb', 'kg');
  const heightInCm = heightUnit === 'cm' ? height : convertUnit(height, 'length', 'm', 'cm');

  let bmr;
  if (gender === 'male') {
    bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
  } else { // female
    bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
  }
  
  return { bmr };
}

// --- GEOMETRY CALCULATORS ---

// 2D Shapes

export function calculateSquareFrom(value: number, from: 'side' | 'perimeter' | 'area' | 'diagonal') {
  let side = 0;
  if (isNaN(value) || value <= 0) return { area: 0, perimeter: 0, side: 0, diagonal: 0 };
  
  switch (from) {
    case 'side':
      side = value;
      break;
    case 'perimeter':
      side = value / 4;
      break;
    case 'area':
      side = Math.sqrt(value);
      break;
    case 'diagonal':
        side = value / Math.sqrt(2);
        break;
  }
  
  if (side <= 0 || !isFinite(side)) return { area: 0, perimeter: 0, side: 0, diagonal: 0 };
  
  return {
    side: side,
    perimeter: side * 4,
    area: side * side,
    diagonal: side * Math.sqrt(2),
  };
}

export function calculateCircleFrom(value: number, from: 'radius' | 'diameter' | 'circumference' | 'area') {
    let radius = 0;
    if (isNaN(value) || value <= 0) return { area: 0, circumference: 0, diameter: 0, radius: 0 };

    switch(from) {
        case 'radius':
            radius = value;
            break;
        case 'diameter':
            radius = value / 2;
            break;
        case 'circumference':
            radius = value / (2 * Math.PI);
            break;
        case 'area':
            radius = Math.sqrt(value / Math.PI);
            break;
    }

    if (radius <= 0 || !isFinite(radius)) return { area: 0, circumference: 0, diameter: 0, radius: 0 };

    return {
        radius: radius,
        diameter: radius * 2,
        circumference: 2 * Math.PI * radius,
        area: Math.PI * radius * radius,
    };
}


export function calculateRectangleFrom(value1: number, value2: number, from: 'width_height' | 'area_width' | 'perimeter_width' | 'diagonal_width') {
  let width = 0, height = 0;
  if (isNaN(value1) || isNaN(value2) || value1 <= 0 || value2 <= 0) {
    return { area: 0, perimeter: 0, width: 0, height: 0, diagonal: 0 };
  }

  switch (from) {
    case 'width_height':
      width = value1;
      height = value2;
      break;
    case 'area_width':
      width = value2;
      height = value1 / value2; // area / width
      break;
    case 'perimeter_width':
      width = value2;
      height = (value1 / 2) - value2; // (perimeter/2) - width
      break;
    case 'diagonal_width':
      width = value2;
      if (value1 <= value2) return { area: 0, perimeter: 0, width: 0, height: 0, diagonal: 0 }; // diagonal must be > width
      height = Math.sqrt(value1**2 - value2**2); // sqrt(d^2 - w^2)
      break;
  }

  if (width <= 0 || height <= 0 || !isFinite(width) || !isFinite(height)) return { area: 0, perimeter: 0, width: 0, height: 0, diagonal: 0 };

  return {
    width: width,
    height: height,
    area: width * height,
    perimeter: 2 * (width + height),
    diagonal: Math.sqrt(width**2 + height**2)
  };
}


export function calculateRhombus(p: number, q: number) {
    if (isNaN(p) || isNaN(q) || p <= 0 || q <= 0) return { area: 0, side: 0, perimeter: 0 };
    const side = Math.sqrt((p/2)**2 + (q/2)**2);
    return {
        area: (p * q) / 2,
        side: side,
        perimeter: 4 * side,
    }
}

export function calculateTriangle(a: number, b: number, c: number) {
    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0 || (a + b <= c) || (a + c <= b) || (b + c <= a)) {
        return { area: 0, perimeter: 0, type: 'Invalid' };
    }
    const perimeter = a + b + c;
    const s = perimeter / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    let type = 'Scalene';
    if (a === b && b === c) {
        type = 'Equilateral';
    } else if (a === b || b === c || a === c) {
        type = 'Isosceles';
    }

    return { area, perimeter, type };
}

export function calculateTriangleFromBaseHeight(base: number, height: number) {
    if (isNaN(base) || isNaN(height) || base <= 0 || height <= 0) return { area: 0, perimeter: 0, type: 'N/A' };
    return { area: (base * height) / 2, perimeter: 0, type: 'N/A' };
}

export function calculateRightTriangleFrom(val1: number, val2: number, from: 'leg_leg' | 'leg_hypotenuse') {
    if (isNaN(val1) || isNaN(val2) || val1 <= 0 || val2 <= 0) return { area: 0, legA: 0, legB: 0, hypotenuse: 0, perimeter: 0 };
    let legA = 0, legB = 0, hypotenuse = 0;

    if (from === 'leg_leg') {
        legA = val1;
        legB = val2;
        if (legA <= 0 || legB <= 0) return { area: 0, legA: 0, legB: 0, hypotenuse: 0, perimeter: 0 };
        hypotenuse = Math.sqrt(legA**2 + legB**2);
    } else { // leg_hypotenuse
        legA = val1;
        hypotenuse = val2;
        if (hypotenuse <= legA) return { area: 0, legA: val1, legB: 0, hypotenuse: val2, perimeter: 0 };
        legB = Math.sqrt(hypotenuse**2 - legA**2);
    }
    
    if(legA <= 0 || legB <= 0 || !isFinite(legB)) return { area: 0, legA: 0, legB: 0, hypotenuse: 0, perimeter: 0 };

    return {
        legA: legA,
        legB: legB,
        hypotenuse: hypotenuse,
        area: (legA * legB) / 2,
        perimeter: legA + legB + hypotenuse,
    }
}

export function calculateTrapezoid(base1: number, base2: number, height: number) {
    if (isNaN(base1) || isNaN(base2) || isNaN(height) || base1 <= 0 || base2 <= 0 || height <= 0) return { area: 0 };
    return {
        area: ((base1 + base2) / 2) * height,
    }
}

export function calculateRegularPolygonFrom(sides: number, value: number, from: 'side' | 'perimeter' | 'area') {
  if (isNaN(sides) || isNaN(value) || sides < 3 || value <= 0) return { area: 0, perimeter: 0, sideLength: 0 };
  let sideLength = 0;
  
  switch(from) {
    case 'side':
        sideLength = value;
        break;
    case 'perimeter':
        sideLength = value / sides;
        break;
    case 'area':
        sideLength = Math.sqrt((4 * value * Math.tan(Math.PI/sides)) / sides);
        break;
  }
  
  if (sideLength <= 0 || !isFinite(sideLength)) return { area: 0, perimeter: 0, sideLength: 0 };

  const perimeter = sides * sideLength;
  const area = (sides * sideLength ** 2) / (4 * Math.tan(Math.PI / sides));
  return { area, perimeter, sideLength };
}

export function calculateCircleArc(radius: number, angleDegrees: number) {
  if (isNaN(radius) || isNaN(angleDegrees) || radius <= 0 || angleDegrees <= 0) {
    return { arcLength: 0, sectorArea: 0, chordLength: 0 };
  }
  const angleRadians = angleDegrees * (Math.PI / 180);
  const arcLength = radius * angleRadians;
  const sectorArea = (1/2) * (radius ** 2) * angleRadians;
  const chordLength = 2 * radius * Math.sin(angleRadians / 2);

  return { arcLength, sectorArea, chordLength };
}

// 3D
export function calculateCubeFrom(value: number, from: 'side' | 'volume' | 'surfaceArea' | 'spaceDiagonal') {
  let side = 0;
  if (isNaN(value) || value <= 0) return { volume: 0, surfaceArea: 0, spaceDiagonal: 0, side: 0 };

  switch (from) {
    case 'side':
        side = value;
        break;
    case 'volume':
        side = Math.cbrt(value);
        break;
    case 'surfaceArea':
        side = Math.sqrt(value / 6);
        break;
    case 'spaceDiagonal':
        side = value / Math.sqrt(3);
        break;
  }

  if (side <= 0 || !isFinite(side)) return { volume: 0, surfaceArea: 0, spaceDiagonal: 0, side: 0 };

  return {
    side: side,
    volume: side ** 3,
    surfaceArea: 6 * side ** 2,
    spaceDiagonal: Math.sqrt(3) * side,
  };
}

export function calculateSphereFrom(value: number, from: 'radius' | 'diameter' | 'volume' | 'surfaceArea') {
  let radius = 0;
  if (isNaN(value) || value <= 0) return { volume: 0, surfaceArea: 0, radius: 0, diameter: 0 };

  switch (from) {
    case 'radius':
        radius = value;
        break;
    case 'diameter':
        radius = value / 2;
        break;
    case 'volume':
        radius = Math.cbrt((3 * value) / (4 * Math.PI));
        break;
    case 'surfaceArea':
        radius = Math.sqrt(value / (4 * Math.PI));
        break;
  }
  
  if (radius <= 0 || !isFinite(radius)) return { volume: 0, surfaceArea: 0, radius: 0, diameter: 0 };

  return {
    radius: radius,
    diameter: radius * 2,
    volume: (4 / 3) * Math.PI * radius ** 3,
    surfaceArea: 4 * Math.PI * radius ** 2,
  };
}

export function calculateSquarePyramid(baseSide: number, height: number) {
  if (isNaN(baseSide) || isNaN(height) || baseSide <= 0 || height <= 0) return { volume: 0, slantHeight: 0, surfaceArea: 0 };
  const baseArea = baseSide ** 2;
  const volume = (1/3) * baseArea * height;
  const slantHeight = Math.sqrt(height**2 + (baseSide/2)**2);
  const lateralSurfaceArea = 2 * baseSide * slantHeight;
  const surfaceArea = baseArea + lateralSurfaceArea;
  return { volume, slantHeight, surfaceArea };
}

export function calculateRectangularPrism(length: number, width: number, height: number) {
  if (isNaN(length) || isNaN(width) || isNaN(height) || length <= 0 || width <= 0 || height <= 0) return { volume: 0, surfaceArea: 0 };
  const volume = length * width * height;
  const surfaceArea = 2 * (width * length + height * length + height * width);
  return { volume, surfaceArea };
}

export function calculateCone(radius: number, height: number) {
  if (isNaN(radius) || isNaN(height) || radius <= 0 || height <= 0) return { volume: 0, slantHeight: 0, surfaceArea: 0 };
  const slantHeight = Math.sqrt(radius**2 + height**2);
  const volume = (1/3) * Math.PI * radius**2 * height;
  const surfaceArea = Math.PI * radius * (radius + slantHeight);
  return { volume, slantHeight, surfaceArea };
}

export function calculateCylinder(radius: number, height: number) {
  if (isNaN(radius) || isNaN(height) || radius <= 0 || height <= 0) return { volume: 0, surfaceArea: 0 };
  const volume = Math.PI * radius**2 * height;
  const surfaceArea = 2 * Math.PI * radius * (radius + height);
  return { volume, surfaceArea };
}

// --- NEWLY ADDED CALCULATORS ---

// ALGEBRA
export function calculateProportion(a: number, b: number, c: number) {
  if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) return { d: 0 };
  return { d: (b * c) / a };
}

export function calculateAspectRatio(w1: number, h1: number, w2: number | null, h2: number | null) {
  if (isNaN(w1) || isNaN(h1) || w1 <= 0 || h1 <= 0) return { width: w2 || 0, height: h2 || 0 };
  if (w2 !== null && !isNaN(w2)) {
    return { width: w2, height: (h1 / w1) * w2 };
  }
  if (h2 !== null && !isNaN(h2)) {
    return { width: (w1 / h1) * h2, height: h2 };
  }
  return { width: 0, height: 0 };
}

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}
export function simplifyFraction(numerator: number, denominator: number) {
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return { n: 0, d: 0 };
    const commonDivisor = gcd(Math.abs(numerator), Math.abs(denominator));
    let n = numerator / commonDivisor;
    let d = denominator / commonDivisor;
    if (d < 0) {
      d = -d;
      n = -n;
    }
    return { n, d };
}

export function decimalToFraction(decimal: number) {
    if (isNaN(decimal)) return { n: 0, d: 1 };
    if (decimal === 0) return { n: 0, d: 1 };
    const tolerance = 1.0E-9;
    let h1 = 1; let h2 = 0;
    let k1 = 0; let k2 = 1;
    let b = decimal;
    do {
        let a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
    return { n: h1, d: k1 };
}

export function isPrime(num: number) {
  if (isNaN(num) || num <= 1 || !Number.isInteger(num)) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i = i + 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

export function calculateExponent(base: number, exp: number) {
    if (isNaN(base) || isNaN(exp)) return 0;
    return Math.pow(base, exp);
}

export function calculateFactorial(n: number): number {
    if (isNaN(n) || n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity; // Prevent overflow
    if (n === 0) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

export function solveQuadratic(a: number, b: number, c: number) {
    if (isNaN(a) || isNaN(b) || isNaN(c)) return { roots: [], description: 'Invalid coefficients' };
    if (a === 0) {
      if (b === 0) return { roots: [], description: 'Not a valid equation.' };
      return { roots: [-c/b], description: 'This is a linear equation with one root.' };
    }
    
    const discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return { roots: [x1, x2], description: 'Two distinct real roots.' };
    } else if (discriminant === 0) {
        const x = -b / (2 * a);
        return { roots: [x], description: 'One real root (repeated).' };
    } else {
        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
        const root1 = `${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`;
        const root2 = `${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`;
        return { roots: [root1, root2], description: `Two complex roots.` };
    }
}

// FINANCIAL
export function calculateCommission(salePrice: number, commissionRate: number) {
    if (isNaN(salePrice) || isNaN(commissionRate)) return { commission: 0, netProceeds: 0 };
    const commission = salePrice * (commissionRate / 100);
    const netProceeds = salePrice - commission;
    return { commission, netProceeds };
}

// TIME
export function calculateDate(startDate: Date, value: number, unit: 'days' | 'weeks' | 'months' | 'years', operation: 'add' | 'subtract') {
  if (!startDate || isNaN(value)) return null;
  const multiplier = operation === 'add' ? 1 : -1;
  
  switch(unit) {
    case 'days': return addDays(startDate, value * multiplier);
    case 'weeks': return addWeeks(startDate, value * multiplier);
    case 'months': return addMonths(startDate, value * multiplier);
    case 'years': return addYears(startDate, value * multiplier);
    default: return null;
  }
}

export function calculateDaysUntil(targetDate: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Make a copy to avoid mutating the original state
  const target = new Date(targetDate.getTime());
  target.setHours(0, 0, 0, 0);

  if (today > target) {
    return formatDistanceStrict(target, today, { addSuffix: true, roundingMethod: 'floor' });
  }
  return formatDistanceStrict(today, target, { addSuffix: true, roundingMethod: 'floor' });
}


export function calculateTime(hours1: number, minutes1: number, seconds1: number, hours2: number, minutes2: number, seconds2: number, operation: 'add' | 'subtract') {
  if(isNaN(hours1) || isNaN(minutes1) || isNaN(seconds1) || isNaN(hours2) || isNaN(minutes2) || isNaN(seconds2)) return { h: 0, m: 0, s: 0 };
  
  const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
  const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;

  let resultSeconds;
  if (operation === 'add') {
    resultSeconds = totalSeconds1 + totalSeconds2;
  } else {
    resultSeconds = totalSeconds1 - totalSeconds2;
  }
  
  const h = Math.floor(Math.abs(resultSeconds) / 3600);
  const m = Math.floor((Math.abs(resultSeconds) % 3600) / 60);
  const s = Math.abs(resultSeconds) % 60;
  
  return { h, m, s };
}

export function sumDurations(durations: { hours: number, minutes: number, seconds: number }[]) {
  const totalSeconds = durations.reduce((acc, curr) => {
    const h = isNaN(curr.hours) ? 0 : curr.hours;
    const m = isNaN(curr.minutes) ? 0 : curr.minutes;
    const s = isNaN(curr.seconds) ? 0 : curr.seconds;
    return acc + (h * 3600) + (m * 60) + s;
  }, 0);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { h, m, s };
}

// DEVELOPER
export function convertBase(value: string, fromBase: number, toBase: number): string {
  if (!value || isNaN(fromBase) || isNaN(toBase) || fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) return 'Invalid input';
  try {
    const decimalValue = parseInt(value, fromBase);
    if(isNaN(decimalValue)) return 'Invalid number for base';
    return decimalValue.toString(toBase).toUpperCase();
  } catch (e) {
    return 'Conversion Error';
  }
}

// 3D Geometry
export function calculateEllipsoid(a: number, b: number, c: number) {
  if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) return { volume: 0, surfaceArea: 0 };
  const volume = (4 / 3) * Math.PI * a * b * c;
  // Knud Thomsen's formula for approximate surface area
  const p = 1.6075;
  const surfaceArea = 4 * Math.PI * Math.pow(((a ** p * b ** p + a ** p * c ** p + b ** p * c ** p) / 3), 1 / p);
  return { volume, surfaceArea };
}

export function calculatePyramidFrustum(baseSide1: number, baseSide2: number, height: number) {
  if (isNaN(baseSide1) || isNaN(baseSide2) || isNaN(height) || baseSide1 < 0 || baseSide2 < 0 || height <= 0) return { volume: 0 };
  const area1 = baseSide1 ** 2;
  const area2 = baseSide2 ** 2;
  const volume = (1 / 3) * height * (area1 + area2 + Math.sqrt(area1 * area2));
  return { volume };
}

export function calculateConeFrustum(radius1: number, radius2: number, height: number) {
  if (isNaN(radius1) || isNaN(radius2) || isNaN(height) || radius1 < 0 || radius2 < 0 || height <= 0) {
    return { volume: 0, slantHeight: 0, surfaceArea: 0 };
  }
  const volume = (1 / 3) * Math.PI * height * (radius1 ** 2 + radius2 ** 2 + radius1 * radius2);
  const slantHeight = Math.sqrt(height ** 2 + (radius1 - radius2) ** 2);
  const surfaceArea = Math.PI * (radius1 + radius2) * slantHeight + Math.PI * radius1 ** 2 + Math.PI * radius2 ** 2;
  return { volume, slantHeight, surfaceArea };
}

export function calculateSphereCap(sphereRadius: number, capHeight: number) {
  if (isNaN(sphereRadius) || isNaN(capHeight) || sphereRadius <= 0 || capHeight <= 0 || capHeight > 2 * sphereRadius) {
    return { volume: 0, surfaceArea: 0 };
  }
  const volume = (1 / 3) * Math.PI * capHeight ** 2 * (3 * sphereRadius - capHeight);
  const surfaceArea = 2 * Math.PI * sphereRadius * capHeight;
  return { volume, surfaceArea };
}

export function calculateSphereSegment(radius1: number, radius2: number, height: number) {
  if (isNaN(radius1) || isNaN(radius2) || isNaN(height) || radius1 < 0 || radius2 < 0 || height <= 0) {
    return { volume: 0 };
  }
  const volume = (1 / 6) * Math.PI * height * (3 * radius1 ** 2 + 3 * radius2 ** 2 + height ** 2);
  return { volume };
}

// Morse Code
const morseCodeMap: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
  ' ': '/', '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};

const textCodeMap = Object.entries(morseCodeMap).reduce((acc, [key, val]) => {
  acc[val] = key;
  return acc;
}, {} as {[key: string]: string});

export function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(char => morseCodeMap[char] || '').join(' ');
}

export function morseToText(morse: string): string {
  return morse.split(' ').map(code => textCodeMap[code] || '').join('');
}

// Roman Numerals
const romanMap: { [key: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
const arabicMap = [
  { value: 1000, symbol: 'M' }, { value: 900, symbol: 'CM' }, { value: 500, symbol: 'D' }, { value: 400, symbol: 'CD' }, { value: 100, symbol: 'C' }, { value: 90, symbol: 'XC' }, { value: 50, symbol: 'L' }, { value: 40, symbol: 'XL' }, { value: 10, symbol: 'X' }, { value: 9, symbol: 'IX' }, { value: 5, symbol: 'V' }, { value: 4, symbol: 'IV' }, { value: 1, symbol: 'I' }
];

export function toRoman(num: number): string {
  if (isNaN(num) || num <= 0 || num >= 4000 || !Number.isInteger(num)) return '';
  let roman = '';
  for (const { value, symbol } of arabicMap) {
    while (num >= value) {
      roman += symbol;
      num -= value;
    }
  }
  return roman;
}

export function fromRoman(roman: string): number {
    roman = roman.toUpperCase().trim();
    if (!/^[MDCLXVI]+$/.test(roman)) return NaN;
    
    let result = 0;
    for (let i = 0; i < roman.length; i++) {
        const current = romanMap[roman[i]];
        const next = romanMap[roman[i + 1]];
        if (current < next) {
            result -= current;
        } else {
            result += current;
        }
    }
    if (toRoman(result) !== roman) return NaN;
    return result;
}

// Number to Words
const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

function convertChunk(num: number): string {
    if (num === 0) return '';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
    return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' ' + convertChunk(num % 100) : '');
}

export function numberToWords(num: number): string {
    if (isNaN(num) || !Number.isInteger(num)) return 'Invalid Number';
    if (num === 0) return 'zero';
    if (num > Number.MAX_SAFE_INTEGER) return 'Number is too large.';
    if (num < 0) return 'negative ' + numberToWords(Math.abs(num));

    const trillions = Math.floor(num / 1000000000000);
    const billions = Math.floor((num % 1000000000000) / 1000000000);
    const millions = Math.floor((num % 1000000000) / 1000000);
    const thousands = Math.floor((num % 1000000) / 1000);
    const remainder = num % 1000;

    let result = '';
    if (trillions > 0) result += convertChunk(trillions) + ' trillion ';
    if (billions > 0) result += convertChunk(billions) + ' billion ';
    if (millions > 0) result += convertChunk(millions) + ' million ';
    if (thousands > 0) result += convertChunk(thousands) + ' thousand ';
    if (remainder > 0) result += convertChunk(remainder);

    return result.trim();
}
