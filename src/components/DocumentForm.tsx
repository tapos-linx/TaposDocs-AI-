import React from 'react';
import {
  Sparkles,
  Loader2,
  FileSpreadsheet,
  Users,
  Compass,
  FileCheck,
  Zap,
} from 'lucide-react';
import { DocumentFormData, DocumentTone, DocumentType } from '../types';
import { PRESET_TEMPLATES } from '../data/presets';

interface DocumentFormProps {
  formData: DocumentFormData;
  onChange: (data: DocumentFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onApplyPreset: (data: DocumentFormData) => void;
}

const DOC_TYPES: DocumentType[] = [
  'Business Proposal',
  'Official Letter',
  'Contract / Agreement',
  'Report & Executive Summary',
  'Invoice / Quote Overview',
  'Meeting Minutes',
  'Custom',
];

const TONES: DocumentTone[] = [
  'Formal & Professional',
  'Persuasive',
  'Legal',
  'Casual',
];

export const DocumentForm: React.FC<DocumentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  onApplyPreset,
}) => {
  const handleChange = (
    field: keyof DocumentFormData,
    value: string
  ) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 no-print">
      {/* Quick Preset Pills */}
      <div className="mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Quick One-Tap Presets
          </span>
          <span className="text-[11px] text-slate-400">Mobile ready</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200 no-scrollbar">
          {PRESET_TEMPLATES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset.data)}
              className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 transition-colors flex items-center gap-1.5"
            >
              <span className="font-semibold">{preset.label}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-200/70 text-slate-600 font-medium">
                {preset.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Document Type Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
            Document Type
          </label>
          <div className="relative">
            <select
              value={formData.docType}
              onChange={(e) => handleChange('docType', e.target.value as DocumentType)}
              disabled={isLoading}
              className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer disabled:opacity-50"
            >
              {DOC_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Document Title / Subject */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
            Document Title / Subject <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Master Services Agreement or Q4 Financial Review"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all disabled:opacity-50"
          />
        </div>

        {/* Target Audience / Recipient */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            Target Audience / Recipient
          </label>
          <input
            type="text"
            value={formData.recipient}
            onChange={(e) => handleChange('recipient', e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Acme Corp Leadership / Marcus Cole (VP)"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all disabled:opacity-50"
          />
        </div>

        {/* Tone & Style Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            Tone & Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONES.map((tone) => (
              <button
                type="button"
                key={tone}
                onClick={() => handleChange('tone', tone)}
                disabled={isLoading}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all border ${
                  formData.tone === tone
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Requirements & Key Details */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Requirements & Key Details
            </label>
            <span className="text-[11px] text-slate-400">Notes, clauses, figures, dates</span>
          </div>
          <textarea
            rows={4}
            value={formData.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            disabled={isLoading}
            placeholder="Include key pricing figures, specific clauses, project scope milestones, deliverable dates, or special terms..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-y disabled:opacity-50"
          />
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.title.trim()}
          className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generating Document with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Document</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
