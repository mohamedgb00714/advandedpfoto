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
        <ImageIcon className="h-6 w-6 text-primary" />
        <h1 className="font-semibold text-lg">PhotoEditor</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
          <Undo className="h-4 w-4 mr-2" /> Undo
        </Button>
        <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
          <Redo className="h-4 w-4 mr-2" /> Redo
        </Button>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <Button size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>
    </header>
  );
};