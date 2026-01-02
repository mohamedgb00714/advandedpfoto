import React from 'react';
import { 
  MousePointer2, 
  Pencil, 
  Eraser, 
  Type as TextIcon, 
  Shapes, 
  RotateCw, 
  Layers, 
  Trash2, 
  Upload,
  Square,
  Circle,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EditorSidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  addText: () => void;
  addShape: (type: 'rect' | 'circle' | 'arrow') => void;
  rotateObject: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  deleteSelected: () => void;
  onUploadClick: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeTool,
  setActiveTool,
  addText,
  addShape,
  rotateObject,
  bringToFront,
  sendToBack,
  deleteSelected,
  onUploadClick
}) => {
  return (
    <aside className="w-16 border-r bg-white dark:bg-zinc-900 flex flex-col items-center py-4 gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={activeTool === 'select' ? 'default' : 'ghost'} 
              size="icon"
              onClick={() => setActiveTool('select')}
              className={activeTool === 'select' ? 'bg-brand-indigo text-white' : 'text-brand-slate hover:text-brand-indigo hover:bg-brand-indigo/10'}
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
              className={activeTool === 'pencil' ? 'bg-brand-indigo text-white' : 'text-brand-slate hover:text-brand-indigo hover:bg-brand-indigo/10'}
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
              className={activeTool === 'eraser' ? 'bg-brand-indigo text-white' : 'text-brand-slate hover:text-brand-indigo hover:bg-brand-indigo/10'}
            >
              <Eraser className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Eraser</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={addText} className="text-brand-slate hover:text-brand-indigo hover:bg-brand-indigo/10">
              <TextIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Add Text</TooltipContent>
        </Tooltip>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-brand-slate hover:text-brand-indigo hover:bg-brand-indigo/10">
              <Shapes className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-40 p-2">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="sm" onClick={() => addShape('rect')} className="justify-start hover:text-brand-indigo hover:bg-brand-indigo/10">
                <Square className="h-4 w-4 mr-2" /> Rectangle
              </Button>
              <Button variant="ghost" size="sm" onClick={() => addShape('circle')} className="justify-start hover:text-brand-indigo hover:bg-brand-indigo/10">
                <Circle className="h-4 w-4 mr-2" /> Circle
              </Button>
              <Button variant="ghost" size="sm" onClick={() => addShape('arrow')} className="justify-start hover:text-brand-indigo hover:bg-brand-indigo/10">
                <ArrowUpRight className="h-4 w-4 mr-2" /> Arrow
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={rotateObject} className="text-brand-slate hover:text-brand-indigo hover:bg-brand-indigo/10">
              <RotateCw className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Rotate</TooltipContent>
        </Tooltip>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-brand-slate hover:text-brand-indigo hover:bg-brand-indigo/10">
              <Layers className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-40 p-2">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="sm" onClick={bringToFront} className="justify-start hover:text-brand-indigo hover:bg-brand-indigo/10">
                Bring to Front
              </Button>
              <Button variant="ghost" size="sm" onClick={sendToBack} className="justify-start hover:text-brand-indigo hover:bg-brand-indigo/10">
                Send to Back
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={deleteSelected} className="text-brand-slate hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Delete</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Separator className="w-10" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onUploadClick} className="text-brand-slate hover:text-brand-indigo hover:bg-brand-indigo/10">
              <Upload className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Upload Image</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </aside>
  );
};