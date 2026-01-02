import React, { useState, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { 
  Upload, 
  Download, 
  Undo, 
  Redo, 
  Square, 
  Circle, 
  MousePointer2, 
  Pencil,
  Eraser,
  Trash2,
  Image as ImageIcon,
  Sun,
  Contrast,
  Palette,
  RotateCw,
  Type as TextIcon,
  Shapes,
  ArrowUpRight,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [selectedObjectColor, setSelectedObjectColor] = useState('#000000');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Canvas
  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        isDrawingMode: false,
      });
      setCanvas(fabricCanvas);

      const saveHistory = () => {
        const json = JSON.stringify(fabricCanvas.toJSON());
        setHistory(prev => [...prev.slice(0, historyIndex + 1), json]);
        setHistoryIndex(prev => prev + 1);
      };

      fabricCanvas.on('object:added', saveHistory);
      fabricCanvas.on('object:modified', saveHistory);
      fabricCanvas.on('object:removed', saveHistory);
      
      fabricCanvas.on('selection:created', (e) => {
        const obj = e.selected?.[0];
        if (obj) {
          const color = (obj.get('fill') as string) || (obj.get('stroke') as string) || '#000000';
          setSelectedObjectColor(color);
        }
      });

      fabricCanvas.on('selection:updated', (e) => {
        const obj = e.selected?.[0];
        if (obj) {
          const color = (obj.get('fill') as string) || (obj.get('stroke') as string) || '#000000';
          setSelectedObjectColor(color);
        }
      });

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  // Update brush settings
  useEffect(() => {
    if (canvas) {
      if (activeTool === 'pencil') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
      } else if (activeTool === 'eraser') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = '#ffffff'; // Simple eraser for white background
      } else {
        canvas.isDrawingMode = false;
      }
    }
  }, [canvas, activeTool, brushSize, brushColor]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result;
      fabric.FabricImage.fromURL(data as string).then((img) => {
        canvas.clear();
        img.scaleToWidth(canvas.width! * 0.8);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        showSuccess("Image uploaded successfully!");
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = dataURL;
    link.click();
    showSuccess("Image downloaded!");
  };

  const undo = () => {
    if (historyIndex > 0 && canvas) {
      const prevIndex = historyIndex - 1;
      canvas.loadFromJSON(history[prevIndex]).then(() => {
        canvas.renderAll();
        setHistoryIndex(prevIndex);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && canvas) {
      const nextIndex = historyIndex + 1;
      canvas.loadFromJSON(history[nextIndex]).then(() => {
        canvas.renderAll();
        setHistoryIndex(nextIndex);
      });
    }
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Type here...', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fill: brushColor,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    setActiveTool('select');
  };

  const addShape = (type: 'rect' | 'circle' | 'arrow') => {
    if (!canvas) return;
    let shape;
    if (type === 'rect') {
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        fill: brushColor,
        width: 100,
        height: 100,
      });
    } else if (type === 'circle') {
      shape = new fabric.Circle({
        left: 100,
        top: 100,
        fill: brushColor,
        radius: 50,
      });
    } else if (type === 'arrow') {
      const path = 'M 0 0 L 50 0 M 50 0 L 40 -10 M 50 0 L 40 10';
      shape = new fabric.Path(path, {
        left: 100,
        top: 100,
        stroke: brushColor,
        strokeWidth: 4,
        fill: 'transparent',
      });
    }
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      setActiveTool('select');
    }
  };

  const rotateObject = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 90);
      canvas?.requestRenderAll();
    }
  };

  const changeObjectColor = (color: string) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      if (activeObject.type === 'path' || activeObject.type === 'polyline') {
        activeObject.set('stroke', color);
      } else {
        activeObject.set('fill', color);
      }
      setSelectedObjectColor(color);
      canvas?.renderAll();
      canvas?.fire('object:modified');
    }
  };

  const applyFilter = (filterType: string) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
      const img = activeObject as fabric.FabricImage;
      img.filters = [];
      if (filterType === 'grayscale') {
        img.filters.push(new fabric.filters.Grayscale());
      } else if (filterType === 'sepia') {
        img.filters.push(new fabric.filters.Sepia());
      }
      img.applyFilters();
      canvas?.renderAll();
      showSuccess(`${filterType} filter applied!`);
    } else {
      showError("Please select an image to apply filters.");
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 border-r bg-white dark:bg-zinc-900 flex flex-col items-center py-4 gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'select' ? 'default' : 'ghost'} 
                size="icon"
                onClick={() => setActiveTool('select')}
              >
                <MousePointer2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Select</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'pencil' ? 'default' : 'ghost'} 
                size="icon"
                onClick={() => setActiveTool('pencil')}
              >
                <Pencil className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Draw</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeTool === 'eraser' ? 'default' : 'ghost'} 
                size="icon"
                onClick={() => setActiveTool('eraser')}
              >
                <Eraser className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Eraser</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={addText}>
                <TextIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Text</TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Shapes className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-40 p-2">
              <div className="flex flex-col gap-2">
                <Button variant="ghost" size="sm" onClick={() => addShape('rect')} className="justify-start">
                  <Square className="h-4 w-4 mr-2" /> Rectangle
                </Button>
                <Button variant="ghost" size="sm" onClick={() => addShape('circle')} className="justify-start">
                  <Circle className="h-4 w-4 mr-2" /> Circle
                </Button>
                <Button variant="ghost" size="sm" onClick={() => addShape('arrow')} className="justify-start">
                  <ArrowUpRight className="h-4 w-4 mr-2" /> Arrow
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={rotateObject}>
                <RotateCw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Rotate</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => canvas?.remove(canvas.getActiveObject()!)}>
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator className="w-10" />
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload}
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Upload Image</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <header className="h-14 border-b bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <h1 className="font-semibold text-lg">PhotoEditor</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="h-4 w-4 mr-2" /> Undo
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="h-4 w-4 mr-2" /> Redo
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-8 overflow-auto">
          <Card className="shadow-2xl overflow-hidden bg-white">
            <canvas ref={canvasRef} />
          </Card>
        </div>
      </main>

      {/* Right Panel */}
      <aside className="w-72 border-l bg-white dark:bg-zinc-900 p-4 overflow-y-auto">
        <Tabs defaultValue="adjust">
          <TabsList className="w-full">
            <TabsTrigger value="adjust" className="flex-1">Adjust</TabsTrigger>
            <TabsTrigger value="tools" className="flex-1">Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="adjust" className="space-y-6 py-4">
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Wind className="h-4 w-4" /> Quick Filters
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => applyFilter('grayscale')}>Grayscale</Button>
                <Button variant="outline" size="sm" onClick={() => applyFilter('sepia')}>Sepia</Button>
                <Button variant="outline" size="sm" onClick={() => applyFilter('none')}>Reset</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Sun className="h-4 w-4" /> Brightness
                </Label>
                <span className="text-xs text-muted-foreground">0%</span>
              </div>
              <Slider defaultValue={[0]} max={100} step={1} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Contrast className="h-4 w-4" /> Contrast
                </Label>
                <span className="text-xs text-muted-foreground">0%</span>
              </div>
              <Slider defaultValue={[0]} max={100} step={1} />
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6 py-4">
            <div className="space-y-4">
              <Label>Object Color (Fill/Stroke)</Label>
              <div className="flex flex-wrap gap-2">
                {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border ${selectedObjectColor === color ? 'ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => changeObjectColor(color)}
                  />
                ))}
                <input 
                  type="color" 
                  value={selectedObjectColor} 
                  onChange={(e) => changeObjectColor(e.target.value)}
                  className="w-8 h-8 rounded-full overflow-hidden border-none p-0 cursor-pointer"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Brush Size</Label>
              <Slider 
                value={[brushSize]} 
                onValueChange={(v) => setBrushSize(v[0])} 
                max={50} 
                min={1} 
                step={1} 
              />
            </div>

            <div className="space-y-4">
              <Label>Brush Color</Label>
              <div className="flex flex-wrap gap-2">
                {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border ${brushColor === color ? 'ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBrushColor(color)}
                  />
                ))}
                <input 
                  type="color" 
                  value={brushColor} 
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-8 h-8 rounded-full overflow-hidden border-none p-0 cursor-pointer"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  );
};

export default Index;