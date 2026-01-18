import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Delete, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'basic' | 'scientific';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [mode, setMode] = useState<Mode>('basic');
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleNumber = useCallback((num: string) => {
    setDisplay(prev => {
      if (prev === '0' || lastResult !== null) {
        setLastResult(null);
        return num;
      }
      return prev + num;
    });
  }, [lastResult]);

  const handleOperator = useCallback((op: string) => {
    setExpression(prev => prev + display + ' ' + op + ' ');
    setDisplay('0');
    setLastResult(null);
  }, [display]);

  const handleEquals = useCallback(() => {
    try {
      const fullExpression = expression + display;
      // Replace visual operators with JS operators
      const evalExpression = fullExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');
      
      // Use Function constructor for safer eval
      const result = new Function('return ' + evalExpression)();
      const formattedResult = Number.isInteger(result) 
        ? result.toString() 
        : parseFloat(result.toFixed(10)).toString();
      
      setDisplay(formattedResult);
      setExpression('');
      setLastResult(formattedResult);
    } catch {
      setDisplay('Error');
      setExpression('');
    }
  }, [expression, display]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  }, []);

  const handleDecimal = useCallback(() => {
    if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  }, [display]);

  const handleScientific = useCallback((fn: string) => {
    try {
      const num = parseFloat(display);
      let result: number;
      
      switch (fn) {
        case 'sin': result = Math.sin(num * Math.PI / 180); break;
        case 'cos': result = Math.cos(num * Math.PI / 180); break;
        case 'tan': result = Math.tan(num * Math.PI / 180); break;
        case 'log': result = Math.log10(num); break;
        case 'ln': result = Math.log(num); break;
        case 'sqrt': result = Math.sqrt(num); break;
        case 'square': result = num * num; break;
        case 'pi': result = Math.PI; break;
        case 'e': result = Math.E; break;
        case 'abs': result = Math.abs(num); break;
        case 'inv': result = 1 / num; break;
        case 'fact': {
          if (num < 0 || !Number.isInteger(num)) {
            setDisplay('Error');
            return;
          }
          result = num <= 1 ? 1 : Array.from({length: num}, (_, i) => i + 1).reduce((a, b) => a * b, 1);
          break;
        }
        default: return;
      }
      
      setDisplay(parseFloat(result.toFixed(10)).toString());
      setLastResult(result.toString());
    } catch {
      setDisplay('Error');
    }
  }, [display]);

  const handleToggleSign = useCallback(() => {
    setDisplay(prev => {
      if (prev === '0') return prev;
      return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
    });
  }, []);

  const handlePercent = useCallback(() => {
    const num = parseFloat(display);
    setDisplay((num / 100).toString());
  }, [display]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
      else if (e.key === '+') handleOperator('+');
      else if (e.key === '-') handleOperator('-');
      else if (e.key === '*') handleOperator('×');
      else if (e.key === '/') { e.preventDefault(); handleOperator('÷'); }
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') handleClear();
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === '.') handleDecimal();
      else if (e.key === '%') handlePercent();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleEquals, handleClear, handleBackspace, handleDecimal, handlePercent]);

  const basicButtons = [
    { label: 'C', action: handleClear, variant: 'secondary' as const },
    { label: '±', action: handleToggleSign, variant: 'secondary' as const },
    { label: '%', action: handlePercent, variant: 'secondary' as const },
    { label: '÷', action: () => handleOperator('÷'), variant: 'accent' as const },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '×', action: () => handleOperator('×'), variant: 'accent' as const },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '-', action: () => handleOperator('-'), variant: 'accent' as const },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '+', action: () => handleOperator('+'), variant: 'accent' as const },
    { label: '0', action: () => handleNumber('0'), wide: true },
    { label: '.', action: handleDecimal },
    { label: '=', action: handleEquals, variant: 'primary' as const },
  ];

  const scientificButtons = [
    { label: 'sin', action: () => handleScientific('sin') },
    { label: 'cos', action: () => handleScientific('cos') },
    { label: 'tan', action: () => handleScientific('tan') },
    { label: 'log', action: () => handleScientific('log') },
    { label: 'ln', action: () => handleScientific('ln') },
    { label: '√', action: () => handleScientific('sqrt') },
    { label: 'x²', action: () => handleScientific('square') },
    { label: 'xʸ', action: () => handleOperator('^') },
    { label: 'π', action: () => handleScientific('pi') },
    { label: 'e', action: () => handleScientific('e') },
    { label: '|x|', action: () => handleScientific('abs') },
    { label: '1/x', action: () => handleScientific('inv') },
    { label: 'n!', action: () => handleScientific('fact') },
    { label: '(', action: () => handleNumber('(') },
    { label: ')', action: () => handleNumber(')') },
  ];

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Calculator</h1>
            <p className="text-muted-foreground">Basic and scientific calculations with keyboard support</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={mode === 'basic' ? 'default' : 'outline'}
              onClick={() => setMode('basic')}
              size="sm"
            >
              Basic
            </Button>
            <Button
              variant={mode === 'scientific' ? 'default' : 'outline'}
              onClick={() => setMode('scientific')}
              size="sm"
            >
              Scientific
            </Button>
          </div>

          {/* Calculator */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
            {/* Display */}
            <div className="p-6 bg-secondary/50">
              <div className="text-right text-sm text-muted-foreground h-6 overflow-x-auto">
                {expression}
              </div>
              <div className="text-right text-4xl font-bold truncate">
                {display}
              </div>
            </div>

            {/* Scientific Buttons */}
            {mode === 'scientific' && (
              <div className="grid grid-cols-5 gap-1 p-2 border-b border-border">
                {scientificButtons.map((btn) => (
                  <Button
                    key={btn.label}
                    variant="ghost"
                    size="sm"
                    onClick={btn.action}
                    className="h-10 text-xs font-medium"
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Basic Buttons */}
            <div className="grid grid-cols-4 gap-1 p-2">
              {basicButtons.map((btn, index) => (
                <Button
                  key={index}
                  variant={btn.variant === 'secondary' ? 'secondary' : btn.variant === 'accent' ? 'outline' : btn.variant === 'primary' ? 'default' : 'ghost'}
                  onClick={btn.action}
                  className={cn(
                    "h-16 text-xl font-medium",
                    btn.wide && "col-span-2",
                    btn.variant === 'accent' && "bg-accent/20 hover:bg-accent/30 text-accent-foreground border-accent/50",
                    btn.variant === 'primary' && "gradient-primary"
                  )}
                >
                  {btn.label}
                </Button>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex justify-between p-3 border-t border-border bg-secondary/30">
              <Button variant="ghost" size="sm" onClick={handleBackspace}>
                <Delete className="h-4 w-4 mr-1" />
                Backspace
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Tip: Use your keyboard for faster input!
          </p>
        </div>
      </div>
    </Layout>
  );
}
