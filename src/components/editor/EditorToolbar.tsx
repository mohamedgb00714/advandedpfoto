import React from 'react';
import { Undo, Redo, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface EditorToolbarProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  handleDownload: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  undo,
  redo,
  canUndo,
  canRedo,
  handleDownload
}) => {
  return (
    <header className="h-14 border-b bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="bg-brand-indigo p-1.5 rounded-lg">
          <ImageIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none tracking-tight text-brand-indigo">photoshop</h1>
          <p className="text-[10px] text-brand-slate font-medium uppercase tracking-widest">Edit. Create. Inspire.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo} className="border-brand-slate/20 text-brand-slate hover:bg-brand-slate/5">
          <Undo className="h-4 w-4 mr-2" /> Undo
        </Button>
        <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo} className="border-brand-slate/20 text-brand-slate hover:bg-brand-slate/5">
          <Redo className="h-4 w-4 mr-2" /> Redo
        </Button>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <Button size="sm" onClick={handleDownload} className="bg-brand-indigo hover:bg-brand-indigo/90 text-white shadow-sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>
    </header>
  );
};