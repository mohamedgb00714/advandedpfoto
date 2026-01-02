import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Wind, Sun, Contrast } from 'lucide-react';

interface EditorPropertiesProps {
  applyFilter: (filter: string) => void;
  selectedObjectColor: string;
  changeObjectColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
}

const COLORS = ['#000000', '#ffffff', '#4A90E2', '#5A6C7D', '#FF6B6B', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

export const EditorProperties: React.FC<EditorPropertiesProps> = ({
  applyFilter,
  selectedObjectColor,
  changeObjectColor,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor
}) => {
  return (
    <aside className="w-72 border-l bg-white dark:bg-zinc-900 p-4 overflow-y-auto">
      <Tabs defaultValue="tools">
        <TabsList className="w-full bg-zinc-100 dark:bg-zinc-800">
          <TabsTrigger value="adjust" className="flex-1 data-[state=active]:text-brand-indigo">Adjust</TabsTrigger>
          <TabsTrigger value="tools" className="flex-1 data-[state=active]:text-brand-indigo">Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="adjust" className="space-y-6 py-4">
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-brand-slate">
              <Wind className="h-4 w-4" /> Quick Filters
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => applyFilter('grayscale')} className="hover:border-brand-indigo hover:text-brand-indigo">Grayscale</Button>
              <Button variant="outline" size="sm" onClick={() => applyFilter('sepia')} className="hover:border-brand-indigo hover:text-brand-indigo">Sepia</Button>
              <Button variant="outline" size="sm" onClick={() => applyFilter('none')} className="col-span-2 hover:bg-zinc-100">Reset Filters</Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-brand-slate">
                <Sun className="h-4 w-4" /> Brightness
              </Label>
              <span className="text-xs text-muted-foreground">0%</span>
            </div>
            <Slider defaultValue={[0]} max={100} step={1} className="[&_[role=slider]]:bg-brand-indigo" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-brand-slate">
                <Contrast className="h-4 w-4" /> Contrast
              </Label>
              <span className="text-xs text-muted-foreground">0%</span>
            </div>
            <Slider defaultValue={[0]} max={100} step={1} className="[&_[role=slider]]:bg-brand-indigo" />
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6 py-4">
          <div className="space-y-4">
            <Label className="text-sm font-bold text-brand-slate">Object Color (Fill/Stroke)</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedObjectColor === color ? 'border-brand-indigo scale-110 shadow-sm' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => changeObjectColor(color)}
                />
              ))}
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-zinc-200 hover:scale-110 transition-transform">
                <input 
                  type="color" 
                  value={selectedObjectColor} 
                  onChange={(e) => changeObjectColor(e.target.value)}
                  className="absolute inset-0 w-full h-full scale-150 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-bold text-brand-slate">Brush Settings</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Size</span>
                <span className="text-brand-indigo font-medium">{brushSize}px</span>
              </div>
              <Slider 
                value={[brushSize]} 
                onValueChange={(v) => setBrushSize(v[0])} 
                max={50} 
                min={1} 
                step={1} 
                className="[&_[role=slider]]:bg-brand-indigo"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {COLORS.slice(0, 6).map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border transition-all ${brushColor === color ? 'ring-2 ring-brand-indigo ring-offset-1' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setBrushColor(color)}
                />
              ))}
              <input 
                type="color" 
                value={brushColor} 
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-6 h-6 rounded-full overflow-hidden border-none p-0 cursor-pointer hover:scale-110 transition-transform"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
};