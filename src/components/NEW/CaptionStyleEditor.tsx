import React, { useState } from 'react';
import { 
  Type, Palette, AlignLeft, AlignCenter, AlignRight,
  ChevronDown, Eye, EyeOff
} from 'lucide-react';

interface CaptionStyle {
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  backgroundColor: string;
  position: 'top' | 'center' | 'bottom';
  opacity: number;
}

const CaptionStyleEditor = ({ 
  style, 
  onChange 
}: { 
  style: CaptionStyle, 
  onChange: (updates: Partial<CaptionStyle>) => void 
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const fonts = [
    'Inter, sans-serif',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Impact, sans-serif',
    'Comic Sans MS, cursive',
  ];

  const presetColors = [
    '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  return (
    <div className="space-y-6 p-6 bg-[#141414]">
      
      {/* Section Header */}
      <div>
        <h3 className="text-sm font-bold text-white mb-1">Caption Styling</h3>
        <p className="text-xs text-gray-500">Customize appearance for all captions</p>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Type className="w-3 h-3" />
          Font Family
        </label>
        <div className="relative">
          <select
            value={style.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm appearance-none focus:outline-none focus:border-purple-500 cursor-pointer"
            style={{ fontFamily: style.fontFamily }}
          >
            {fonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font.split(',')[0]}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Font Size & Weight */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Size
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="12"
              max="72"
              value={style.fontSize}
              onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
              className="flex-1 accent-purple-500"
            />
            <span className="text-sm font-mono text-white w-10 text-right">
              {style.fontSize}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Weight
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onChange({ fontWeight: 'normal' })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                style.fontWeight === 'normal'
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onChange({ fontWeight: 'bold' })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition ${
                style.fontWeight === 'bold'
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
              }`}
            >
              Bold
            </button>
          </div>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Alignment
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ textAlign: 'left' })}
            className={`flex-1 p-2.5 rounded-lg transition ${
              style.textAlign === 'left'
                ? 'bg-purple-600 text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
            }`}
          >
            <AlignLeft className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => onChange({ textAlign: 'center' })}
            className={`flex-1 p-2.5 rounded-lg transition ${
              style.textAlign === 'center'
                ? 'bg-purple-600 text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
            }`}
          >
            <AlignCenter className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => onChange({ textAlign: 'right' })}
            className={`flex-1 p-2.5 rounded-lg transition ${
              style.textAlign === 'right'
                ? 'bg-purple-600 text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
            }`}
          >
            <AlignRight className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-3 h-3" />
          Text Color
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-12 h-10 rounded-lg border-2 border-gray-700 hover:border-purple-500 transition"
            style={{ backgroundColor: style.color }}
          />
          <input
            type="color"
            value={style.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="flex-1 h-10 rounded-lg border border-gray-700 bg-[#1a1a1a] cursor-pointer"
          />
        </div>
        {showColorPicker && (
          <div className="grid grid-cols-5 gap-2 p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => onChange({ color })}
                className="w-full aspect-square rounded-lg border-2 hover:scale-110 transition"
                style={{ 
                  backgroundColor: color,
                  borderColor: style.color === color ? '#a855f7' : 'transparent'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Background
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBgPicker(!showBgPicker)}
            className="w-12 h-10 rounded-lg border-2 border-gray-700 hover:border-purple-500 transition relative overflow-hidden"
            style={{ backgroundColor: style.backgroundColor }}
          >
            {style.backgroundColor === 'transparent' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <EyeOff className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
          <input
            type="color"
            value={style.backgroundColor === 'transparent' ? '#000000' : style.backgroundColor}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="flex-1 h-10 rounded-lg border border-gray-700 bg-[#1a1a1a] cursor-pointer"
          />
          <button
            onClick={() => onChange({ backgroundColor: 'transparent' })}
            className={`px-3 h-10 rounded-lg text-sm font-medium transition ${
              style.backgroundColor === 'transparent'
                ? 'bg-purple-600 text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
            }`}
          >
            None
          </button>
        </div>
      </div>

      {/* Position */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Position
        </label>
        <div className="flex gap-2">
          {(['top', 'center', 'bottom'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => onChange({ position: pos })}
              className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium capitalize transition ${
                style.position === pos
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="w-3 h-3" />
            Opacity
          </span>
          <span className="font-mono text-white">{Math.round(style.opacity * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={style.opacity}
          onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })}
          className="w-full accent-purple-500"
        />
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Preview
        </label>
        <div className="bg-black rounded-lg p-8 border border-gray-800 relative overflow-hidden min-h-[120px] flex items-center justify-center">
          {/* Position indicator */}
          <div className={`absolute inset-x-0 flex ${
            style.position === 'top' ? 'top-8 justify-center' :
            style.position === 'center' ? 'top-1/2 -translate-y-1/2 justify-center items-center' :
            'bottom-8 justify-center'
          }`}>
            <div
              className="px-6 py-3 rounded-xl"
              style={{
                backgroundColor: style.backgroundColor,
                opacity: style.opacity,
              }}
            >
              <p
                style={{
                  color: style.color,
                  fontSize: style.fontSize * 0.5, // Scale down for preview
                  fontFamily: style.fontFamily,
                  fontWeight: style.fontWeight,
                  textAlign: style.textAlign,
                  margin: 0,
                }}
              >
                Sample Caption Text
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CaptionStyleEditor;