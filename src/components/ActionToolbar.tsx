import React from 'react';
import {
  Printer,
  Download,
  Share2,
  Copy,
  Eye,
  Code,
  FileCheck,
} from 'lucide-react';

interface ActionToolbarProps {
  onSavePdf: () => void;
  onSaveTxt: () => void;
  onShareToPhone: () => void;
  onCopyText: () => void;
  viewMode: 'preview' | 'edit';
  onToggleViewMode: (mode: 'preview' | 'edit') => void;
  wordCount: number;
  readingTimeMin: number;
  hasDocument: boolean;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onSavePdf,
  onSaveTxt,
  onShareToPhone,
  onCopyText,
  viewMode,
  onToggleViewMode,
  wordCount,
  readingTimeMin,
  hasDocument,
}) => {
  return (
    <div
      id="action-toolbar"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 sm:p-4 mb-4 no-print transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Document Stats & View Mode Toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onToggleViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'edit'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Edit / Raw</span>
            </button>
          </div>

          {hasDocument && (
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                {wordCount} words
              </span>
              <span>•</span>
              <span>{readingTimeMin} min read</span>
            </div>
          )}
        </div>

        {/* Right Side: Action Download Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* 1. Save as PDF */}
          <button
            type="button"
            onClick={onSavePdf}
            disabled={!hasDocument}
            title="Isolates document to print as PDF on phone or desktop"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Save as PDF</span>
          </button>

          {/* 2. Save as .TXT */}
          <button
            type="button"
            onClick={onSaveTxt}
            disabled={!hasDocument}
            title="Download in-memory text file to local device storage"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Save as .TXT</span>
          </button>

          {/* 3. Save to Phone Files (Web Share API) */}
          <button
            type="button"
            onClick={onShareToPhone}
            disabled={!hasDocument}
            title="Share file directly to iOS Files, Android Downloads, or apps"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Save to Phone Files</span>
          </button>

          {/* 4. Copy Text */}
          <button
            type="button"
            onClick={onCopyText}
            disabled={!hasDocument}
            title="Copy full document text to clipboard"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Text</span>
          </button>
        </div>
      </div>
    </div>
  );
};
