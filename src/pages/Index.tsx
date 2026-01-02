import React, { useState, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { 
  Upload, 
  Download, 
  Undo, 
  Redo, 
  Crop, 
  Type, 
  Square, 
  Circle, 
  MousePointer2, 
  Pencil,
  Eraser,
  Trash2,
  Layers,
  Settings2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Canvas
  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
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

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

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

  const setDrawingMode = (isDrawing: boolean) => {
    if (!canvas) return;
    canvas.isDrawingMode = isDrawing;
    setActiveTool(isDrawing ? 'pencil' : 'select');
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
                onClick={() => setDrawingMode(false)}
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
                onClick={() => setDrawingMode(true)}
              >
                <Pencil className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Draw</TooltipContent>
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
      <aside className="w-72 border-l bg-white dark:bg-zinc-900 p-4">
        <Tabs defaultValue="adjust">
          <TabsList className="w-full">
            <TabsTrigger value="adjust" className="flex-1">Adjust</TabsTrigger>
            <TabsTrigger value="layers" className="flex-1">Layers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="adjust" className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Brightness</Label>
                <span className="text-xs text-muted-foreground">0%</span>
              </div>
              <Slider defaultValue={[0]} max={100} step={1} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Contrast</Label>
                <span className="text-xs text-muted-foreground">0%</span>
              </div>
              <Slider defaultValue={[0]} max={100} step={1} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Saturation</Label>
                <span className="text-xs text-muted-foreground">0%</span>
              </div>
              <Slider defaultValue={[0]} max={100} step={1} />
            </div>
          </TabsContent>

          <TabsContent value="layers" className="py-4">
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No layers yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  );
};

export default Index;