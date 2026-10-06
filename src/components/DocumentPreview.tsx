import React, { useMemo, useState } from 'react';
import { marked } from 'marked';
import {
  FileText,
  Calendar,
  Sparkles,
  Send,
  Loader2,
  Maximize2,
  Minimize2,
  Check,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { GeneratedDocument } from '../types';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

interface DocumentPreviewProps {
  document: GeneratedDocument | null;
  viewMode: 'preview' | 'edit';
  onChangeContent: (newContent: string) => void;
  isLoading: boolean;
  onRefineDocument: (instruction: string) => Promise<void>;
  isRefining: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  viewMode,
  onChangeContent,
  isLoading,
  onRefineDocument,
  isRefining,
}) => {
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Render markdown to safe HTML
  const parsedHtml = useMemo(() => {
    if (!document?.content) return '';
    try {
      const parsed = marked.parse(document.content);
      return typeof parsed === 'string' ? parsed : '';
    } catch (e) {
      console.error('Markdown parse error:', e);
      return document.content;
    }
  }, [document?.content]);

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt.trim() || isRefining) return;
    const prompt = refinePrompt;
    setRefinePrompt('');
    await onRefineDocument(prompt);
  };

  const handleQuickRefine = async (instruction: string) => {
    if (isRefining) return;
    await onRefineDocument(instruction);
  };

  // Loading skeleton during initial generation
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-12 text-center min-h-[460px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 relative">
          <Loader2 className="w-8 h-8 animate-spin" />
          <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
          Gemini is Drafting Your Document...
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Formatting professional hierarchy, structuring clauses, tables, and tone to exact requirements.
        </p>

        {/* Shimmer skeleton lines */}
        <div className="w-full max-w-lg space-y-3.5 opacity-60">
          <div className="h-6 bg-slate-200 rounded-lg animate-pulse w-3/4 mx-auto" />
          <div className="h-4 bg-slate-100 rounded-md animate-pulse w-full" />
          <div className="h-4 bg-slate-100 rounded-md animate-pulse w-5/6 mx-auto" />
          <div className="h-20 bg-slate-50 rounded-xl border border-slate-100 animate-pulse w-full mt-4" />
          <div className="h-4 bg-slate-100 rounded-md animate-pulse w-4/5 mx-auto" />
        </div>
      </div>
    );
  }

  // Placeholder when no document has been generated yet
  if (!document) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-14 text-center min-h-[460px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
          Your Document Preview Will Appear Here
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
          Select a template or fill out the form above, then tap <strong className="text-slate-700">Generate Document</strong>. You'll be able to review, edit, and instantly export to PDF, .TXT, or phone files.
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mobile-optimized Print to PDF</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant .TXT Local Download</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>iOS / Android Share to Files</span>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(document.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/40 p-4 overflow-y-auto backdrop-blur-xs' : ''}`}>
      {/* Document Sheet Container */}
      <div
        className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all ${
          isFullscreen ? 'max-w-4xl mx-auto my-4' : ''
        }`}
      >
        {/* Document Header Metadata Bar (Screen only) */}
        <div className="no-print bg-slate-50/80 border-b border-slate-200/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700">
              {document.docType}
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
              title={isFullscreen ? 'Exit full screen' : 'Expand preview'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Document Body Area */}
        {viewMode === 'preview' ? (
          /* Printable Paper Area */
          <div
            id="printable-document"
            className="document-sheet p-6 sm:p-10 md:p-12 bg-white max-w-full overflow-x-auto text-slate-900 font-sans"
          >
            {/* Header branding block for printed document */}
            <div className="border-b-2 border-slate-800 pb-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                    {document.title}
                  </h1>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    {document.docType}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500 space-y-0.5">
                  <p className="font-semibold text-slate-700">OFFICIAL DRAFT</p>
                  <p>Date: {formattedDate}</p>
                  <p>Ref: DOC-{document.id.substring(0, 8).toUpperCase()}</p>
                </div>
              </div>

              {document.recipient && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">Prepared For: </span>
                    {document.recipient}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Tone: </span>
                    {document.tone}
                  </div>
                </div>
              )}
            </div>

            {/* Markdown Rendered Content */}
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: parsedHtml }}
            />
          </div>
        ) : (
          /* Edit / Raw Markdown Mode */
          <div className="p-4 sm:p-6 no-print">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Edit Markdown Source Directly
              </label>
              <span className="text-[11px] text-slate-400">Edits sync to preview instantly</span>
            </div>
            <textarea
              value={document.content}
              onChange={(e) => onChangeContent(e.target.value)}
              rows={22}
              className="w-full font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
              placeholder="Write or edit document markdown..."
            />
          </div>
        )}
      </div>

      {/* AI Refinement Toolbar (No Print) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Document Refinement
          </div>
          <span className="text-[11px] text-slate-400">Fine-tune with 1-click</span>
        </div>

        {/* Quick refinement chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleQuickRefine('Add a formal confidentiality and non-disclosure clause.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-indigo-500" />
            + Confidentiality Clause
          </button>
          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleQuickRefine('Make this document more concise and punchy while retaining all critical terms and figures.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 transition-colors disabled:opacity-50"
          >
            ✂️ Make More Concise
          </button>
          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleQuickRefine('Add a structured breakdown table for pricing, milestones, or deliverable schedule.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 transition-colors disabled:opacity-50"
          >
            📊 Add Breakdown Table
          </button>
          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleQuickRefine('Add formal signature and authorization execution blocks at the bottom with Date, Name, Title, and Signature lines.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <Building className="w-3 h-3 text-indigo-500" />
            + Signature Blocks
          </button>
        </div>

        {/* Custom Refinement Input */}
        <form onSubmit={handleRefineSubmit} className="flex gap-2">
          <input
            type="text"
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            disabled={isRefining}
            placeholder="Ask AI to adjust, add clauses, translate, or refine (e.g. 'Add 30-day payment terms')..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isRefining || !refinePrompt.trim()}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5 shrink-0"
          >
            {isRefining ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Refine</span>
          </button>
        </form>
      </div>
    </div>
  );
};
