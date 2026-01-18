import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, Ruler, Weight, Thermometer, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'length' | 'weight' | 'temperature' | 'time' | 'currency';

interface UnitConfig {
  name: string;
  units: { value: string; label: string; factor: number }[];
  convert: (value: number, from: string, to: string, units: { value: string; factor: number }[]) => number;
}

const categories: Record<Category, UnitConfig> = {
  length: {
    name: 'Length',
    units: [
      { value: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
      { value: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
      { value: 'm', label: 'Meters (m)', factor: 1 },
      { value: 'km', label: 'Kilometers (km)', factor: 1000 },
      { value: 'in', label: 'Inches (in)', factor: 0.0254 },
      { value: 'ft', label: 'Feet (ft)', factor: 0.3048 },
      { value: 'yd', label: 'Yards (yd)', factor: 0.9144 },
      { value: 'mi', label: 'Miles (mi)', factor: 1609.344 },
    ],
    convert: (value, from, to, units) => {
      const fromUnit = units.find(u => u.value === from);
      const toUnit = units.find(u => u.value === to);
      if (!fromUnit || !toUnit) return 0;
      return (value * fromUnit.factor) / toUnit.factor;
    }
  },
  weight: {
    name: 'Weight',
    units: [
      { value: 'mg', label: 'Milligrams (mg)', factor: 0.000001 },
      { value: 'g', label: 'Grams (g)', factor: 0.001 },
      { value: 'kg', label: 'Kilograms (kg)', factor: 1 },
      { value: 'oz', label: 'Ounces (oz)', factor: 0.0283495 },
      { value: 'lb', label: 'Pounds (lb)', factor: 0.453592 },
      { value: 't', label: 'Metric Tons (t)', factor: 1000 },
    ],
    convert: (value, from, to, units) => {
      const fromUnit = units.find(u => u.value === from);
      const toUnit = units.find(u => u.value === to);
      if (!fromUnit || !toUnit) return 0;
      return (value * fromUnit.factor) / toUnit.factor;
    }
  },
  temperature: {
    name: 'Temperature',
    units: [
      { value: 'c', label: 'Celsius (°C)', factor: 1 },
      { value: 'f', label: 'Fahrenheit (°F)', factor: 1 },
      { value: 'k', label: 'Kelvin (K)', factor: 1 },
    ],
    convert: (value, from, to) => {
      if (from === to) return value;
      // Convert to Celsius first
      let celsius: number;
      switch (from) {
        case 'c': celsius = value; break;
        case 'f': celsius = (value - 32) * 5/9; break;
        case 'k': celsius = value - 273.15; break;
        default: return 0;
      }
      // Convert from Celsius to target
      switch (to) {
        case 'c': return celsius;
        case 'f': return celsius * 9/5 + 32;
        case 'k': return celsius + 273.15;
        default: return 0;
      }
    }
  },
  time: {
    name: 'Time',
    units: [
      { value: 'ms', label: 'Milliseconds', factor: 0.001 },
      { value: 's', label: 'Seconds', factor: 1 },
      { value: 'min', label: 'Minutes', factor: 60 },
      { value: 'h', label: 'Hours', factor: 3600 },
      { value: 'd', label: 'Days', factor: 86400 },
      { value: 'w', label: 'Weeks', factor: 604800 },
      { value: 'mo', label: 'Months (30d)', factor: 2592000 },
      { value: 'y', label: 'Years (365d)', factor: 31536000 },
    ],
    convert: (value, from, to, units) => {
      const fromUnit = units.find(u => u.value === from);
      const toUnit = units.find(u => u.value === to);
      if (!fromUnit || !toUnit) return 0;
      return (value * fromUnit.factor) / toUnit.factor;
    }
  },
  currency: {
    name: 'Currency',
    units: [
      { value: 'usd', label: 'US Dollar ($)', factor: 1 },
      { value: 'eur', label: 'Euro (€)', factor: 0.92 },
      { value: 'gbp', label: 'British Pound (£)', factor: 0.79 },
      { value: 'jpy', label: 'Japanese Yen (¥)', factor: 149.50 },
      { value: 'inr', label: 'Indian Rupee (₹)', factor: 83.12 },
      { value: 'cad', label: 'Canadian Dollar (C$)', factor: 1.36 },
      { value: 'aud', label: 'Australian Dollar (A$)', factor: 1.53 },
      { value: 'cny', label: 'Chinese Yuan (¥)', factor: 7.24 },
    ],
    convert: (value, from, to, units) => {
      const fromUnit = units.find(u => u.value === from);
      const toUnit = units.find(u => u.value === to);
      if (!fromUnit || !toUnit) return 0;
      // Convert to USD first, then to target
      const inUsd = value / fromUnit.factor;
      return inUsd * toUnit.factor;
    }
  },
};

const categoryIcons: Record<Category, typeof Ruler> = {
  length: Ruler,
  weight: Weight,
  temperature: Thermometer,
  time: Clock,
  currency: DollarSign,
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [fromValue, setFromValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [result, setResult] = useState('');

  useEffect(() => {
    // Reset units when category changes
    const units = categories[category].units;
    setFromUnit(units[0].value);
    setToUnit(units[1].value);
  }, [category]);

  useEffect(() => {
    // Calculate result
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setResult('');
      return;
    }
    const config = categories[category];
    const converted = config.convert(value, fromUnit, toUnit, config.units);
    setResult(converted.toFixed(6).replace(/\.?0+$/, ''));
  }, [fromValue, fromUnit, toUnit, category]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(result);
  };

  const config = categories[category];
  const Icon = categoryIcons[category];

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Unit Converter</h1>
            <p className="text-muted-foreground">Convert between different units instantly</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(Object.keys(categories) as Category[]).map((cat) => {
              const CatIcon = categoryIcons[cat];
              return (
                <Button
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  onClick={() => setCategory(cat)}
                  className="gap-2"
                >
                  <CatIcon className="h-4 w-4" />
                  {categories[cat].name}
                </Button>
              );
            })}
          </div>

          {/* Converter Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
            <div className="p-6 border-b border-border bg-secondary/30 flex items-center gap-3">
              <div className="p-3 rounded-xl gradient-primary">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{config.name} Converter</h2>
                <p className="text-sm text-muted-foreground">
                  {category === 'currency' && 'Rates are approximate and for reference only'}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* From */}
              <div className="space-y-3">
                <label className="text-sm font-medium">From</label>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    placeholder="Enter value"
                    className="flex-1 text-lg h-12"
                  />
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="w-48 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  className="rounded-full h-12 w-12"
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </Button>
              </div>

              {/* To */}
              <div className="space-y-3">
                <label className="text-sm font-medium">To</label>
                <div className="flex gap-3">
                  <div className="flex-1 h-12 px-4 flex items-center bg-secondary rounded-lg text-lg font-medium">
                    {result || '0'}
                  </div>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="w-48 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Formula Display */}
              {result && (
                <div className="p-4 bg-secondary/50 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">
                    {fromValue} {config.units.find(u => u.value === fromUnit)?.label.split(' ')[0]} = {result} {config.units.find(u => u.value === toUnit)?.label.split(' ')[0]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
