import React, { useState, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { Card } from '@/components/ui/card';
import { showSuccess, showError } from '@/utils/toast';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { EditorProperties } from '../components/editor/EditorProperties';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [selectedObjectColor, setSelectedObjectColor] = useState('#000000');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Initialize Canvas
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: containerWidth > 800 ? 800 : containerWidth - 40,
        height: containerHeight > 600 ? 600 : containerHeight - 40,
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

      // Handle window resize
      const handleResize = () => {
        if (containerRef.current && fabricCanvas) {
          const newWidth = containerRef.current.clientWidth - 40;
          const newHeight = containerRef.current.clientHeight - 40;
          fabricCanvas.setDimensions({
            width: newWidth > 800 ? 800 : newWidth,
            height: newHeight > 600 ? 600 : newHeight
          });
          fabricCanvas.renderAll();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        fabricCanvas.dispose();
        window.removeEventListener('resize', handleResize);
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
        canvas.freeDrawingBrush.color = '#ffffff'; 
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
        const scale = Math.min(
          (canvas.width! * 0.8) / img.width!,
          (canvas.height! * 0.8) / img.height!
        );
        img.scale(scale);
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
      left: 50,
      top: 50,
      fontFamily: 'Arial',
      fill: brushColor,
      fontSize: isMobile ? 20 : 40
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    setActiveTool('select');
  };

  const addShape = (type: 'rect' | 'circle' | 'arrow') => {
    if (!canvas) return;
    let shape;
    const size = isMobile ? 50 : 100;
    if (type === 'rect') {
      shape = new fabric.Rect({
        left: 50,
        top: 50,
        fill: brushColor,
        width: size,
        height: size,
      });
    } else if (type === 'circle') {
      shape = new fabric.Circle({
        left: 50,
        top: 50,
        fill: brushColor,
        radius: size / 2,
      });
    } else if (type === 'arrow') {
      const path = `M 0 0 L ${size} 0 M ${size} 0 L ${size - 10} -10 M ${size} 0 L ${size - 10} 10`;
      shape = new fabric.Path(path, {
        left: 50,
        top: 50,
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

  const bringToFront = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && canvas) {
      canvas.bringObjectToFront(activeObject);
      canvas.renderAll();
    }
  };

  const sendToBack = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && canvas) {
      canvas.sendObjectToBack(activeObject);
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      canvas?.remove(activeObject);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <EditorSidebar 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        addText={addText}
        addShape={addShape}
        rotateObject={rotateObject}
        bringToFront={bringToFront}
        sendToBack={sendToBack}
        deleteSelected={deleteSelected}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <EditorToolbar 
          undo={undo}
          redo={redo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          handleDownload={handleDownload}
        />

        <div ref={containerRef} className="flex-1 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-4 md:p-8 overflow-hidden">
          <Card className="shadow-2xl overflow-hidden bg-white max-w-full max-h-full">
            <canvas ref={canvasRef} />
          </Card>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload}
        />
      </main>

      <EditorProperties 
        applyFilter={applyFilter}
        selectedObjectColor={selectedObjectColor}
        changeObjectColor={changeObjectColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        brushColor={brushColor}
        setBrushColor={setBrushColor}
      />
    </div>
  );
};

export default Index;