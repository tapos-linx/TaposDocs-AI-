/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { DocumentForm } from './components/DocumentForm';
import { ActionToolbar } from './components/ActionToolbar';
import { DocumentPreview } from './components/DocumentPreview';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  DocumentFormData,
  GeneratedDocument,
} from './types';
import { PRESET_TEMPLATES } from './data/presets';
import {
  saveAsTxt,
  shareToPhoneFiles,
  copyToClipboard,
  printAsPdf,
  getWordAndCharCount,
} from './utils/documentUtils';
import { Sparkles, FileText, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'ai_document_studio_history_v1';

// Initial preloaded sample document to give an instant wow factor
const INITIAL_SAMPLE_DOC: GeneratedDocument = {
  id: 'seed-proposal-2026',
  title: 'Enterprise Mobile App Modernization Proposal',
  docType: 'Business Proposal',
  tone: 'Persuasive',
  recipient: 'Acme Global Ventures (Attn: Marcus Vance, CTO)',
  requirements:
    'Deliver modern React Native mobile app with cloud sync, offline support, and biometrics. Project scope: 12 weeks. Budget breakdown: Milestone 1 UI/UX ($15k), Milestone 2 Core Engineering ($35k), Milestone 3 QA & Launch ($12k). Includes 90-day SLA support warranty.',
  createdAt: new Date().toISOString(),
  content: `# Enterprise Mobile App Modernization Proposal

**Prepared For:** Acme Global Ventures (Attn: Marcus Vance, CTO)  
**Date:** October 6, 2026  
**Document Ref:** DOC-AGV-2026-904  
**Classification:** Confidential & Proprietary  

---

## 1. Executive Summary

Acme Global Ventures requires an agile, resilient mobile application architecture to serve over 250,000 active global field operatives. This proposal outlines the end-to-end modernization strategy transitioning legacy mobile web wrappers into a native-performance cross-platform application with full offline capability, military-grade biometrics, and real-time cloud synchronization.

Our engineering team will deliver this project within a **12-week accelerated sprint roadmap**, ensuring seamless continuous deployment and zero operational downtime.

---

## 2. Project Scope & Deliverables

| Phase | Milestone | Key Deliverables | Timeline | Investment |
| :--- | :--- | :--- | :--- | :--- |
| **01** | UI/UX & Design System | High-fidelity Figma prototypes, design tokens, accessibility audit (WCAG AA) | Weeks 1–3 | $15,000 |
| **02** | Core Mobile Engineering | Offline-first sync engine, biometric auth, encrypted SQLite caching, API layer | Weeks 4–8 | $35,000 |
| **03** | QA, Security & App Stores | Penetration testing, automated end-to-end suites, iOS App Store & Google Play submission | Weeks 9–12 | $12,000 |
| **Total** | **Full Implementation** | **Turnkey Enterprise Mobile Solution** | **12 Weeks** | **$62,000** |

---

## 3. Architecture & Technical Specifications

* **Frontend Engine:** React Native 0.76+ with Turbopack native architecture.
* **Security & Auth:** Hardware-backed FaceID / TouchID biometric keys with OAuth 2.0 PKCE.
* **Offline Resilience:** Local encrypted datastore with conflict-free replicated data types (CRDTs).
* **Compliance:** SOC 2 Type II compliant storage with TLS 1.3 in-flight transport encryption.
* **Warranty:** 90-day comprehensive SLA warranty covering all bug triage and OS updates.

---

## 4. Payment Terms & Schedule

Payment obligations are tied directly to agreed milestone verification:
1. **Initial Retainer (Deposit):** 25% upon contract execution.
2. **Phase 1 Completion:** 25% upon design approval.
3. **Phase 2 Completion:** 30% upon beta engineering sign-off.
4. **Final Acceptance:** 20% following store deployment.

---

## 5. Authorization & Sign-Off

In witness whereof, the parties have executed this Proposal as of the date first written above.

| Authorized Representative | Client Representative |
| :--- | :--- |
| **Name:** Amanda Sterling, VP Delivery | **Name:** Marcus Vance, Chief Technology Officer |
| **Signature:** __________________________ | **Signature:** __________________________ |
| **Date:** October 6, 2026 | **Date:** ______________________________ |
`,
};

export default function App() {
  const [formData, setFormData] = useState<DocumentFormData>({
    docType: 'Business Proposal',
    title: 'Enterprise Mobile App Modernization Proposal',
    recipient: 'Acme Global Ventures (Attn: Marcus Vance, CTO)',
    requirements:
      'Deliver modern React Native mobile app with cloud sync, offline support, and biometrics. Project scope: 12 weeks. Budget breakdown: Milestone 1 UI/UX ($15k), Milestone 2 Core Engineering ($35k), Milestone 3 QA & Launch ($12k). Includes 90-day SLA support warranty.',
    tone: 'Persuasive',
  });

  const [currentDocument, setCurrentDocument] = useState<GeneratedDocument | null>(
    INITIAL_SAMPLE_DOC
  );
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [history, setHistory] = useState<GeneratedDocument[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('preview');

  const previewRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          return;
        }
      }
      // initialize with sample doc in history if empty
      setHistory([INITIAL_SAMPLE_DOC]);
    } catch (e) {
      console.error('Failed to parse history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newDoc: GeneratedDocument) => {
    setHistory((prev) => {
      const filtered = prev.filter((d) => d.id !== newDoc.id);
      const updated = [newDoc, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return updated;
    });
  };

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Preset quick fill
  const handleApplyPreset = (presetData: DocumentFormData) => {
    setFormData(presetData);
    addToast('info', `Loaded "${presetData.title}" template.`);
  };

  // New Document Reset
  const handleNewDocument = () => {
    setFormData({
      docType: 'Business Proposal',
      title: '',
      recipient: '',
      requirements: '',
      tone: 'Formal & Professional',
    });
    setMobileTab('form');
    addToast('info', 'New blank document form ready.');
  };

  // Generate Document
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('error', 'Please enter a document title or subject.');
      return;
    }

    setIsLoading(true);
    setMobileTab('preview');

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docType: formData.docType,
          title: formData.title,
          recipient: formData.recipient,
          requirements: formData.requirements,
          tone: formData.tone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate document');
      }

      const newDoc: GeneratedDocument = {
        id: Math.random().toString(36).substring(2, 10),
        title: formData.title,
        docType: formData.docType,
        tone: formData.tone,
        recipient: formData.recipient,
        requirements: formData.requirements,
        content: data.document,
        createdAt: new Date().toISOString(),
      };

      setCurrentDocument(newDoc);
      setViewMode('preview');
      saveToHistory(newDoc);
      addToast('success', 'Document generated successfully!');

      // Scroll to preview smoothly on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          previewRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      addToast('error', err.message || 'Failed to generate document.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refine Document
  const handleRefineDocument = async (instruction: string) => {
    if (!currentDocument) return;

    setIsRefining(true);
    try {
      const response = await fetch('/api/refine-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDocument: currentDocument.content,
          instruction,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to refine document');
      }

      const updatedDoc: GeneratedDocument = {
        ...currentDocument,
        content: data.document,
      };

      setCurrentDocument(updatedDoc);
      saveToHistory(updatedDoc);
      addToast('success', 'Document updated with your refinement!');
    } catch (err: any) {
      console.error('Refinement error:', err);
      addToast('error', err.message || 'Failed to refine document.');
    } finally {
      setIsRefining(false);
    }
  };

  // Content manual editing
  const handleChangeContent = (newContent: string) => {
    if (!currentDocument) return;
    const updated = {
      ...currentDocument,
      content: newContent,
    };
    setCurrentDocument(updated);
    saveToHistory(updated);
  };

  // Word & character stats
  const stats = useMemo(() => {
    return getWordAndCharCount(currentDocument?.content || '');
  }, [currentDocument?.content]);

  // Actions
  const handleSavePdf = () => {
    if (!currentDocument) return;
    addToast('info', 'Opening native Print to PDF manager...');
    printAsPdf();
  };

  const handleSaveTxt = () => {
    if (!currentDocument) return;
    saveAsTxt(currentDocument.title, currentDocument.content, '.txt');
    addToast('success', 'Downloaded .TXT file to local phone storage!');
  };

  const handleShareToPhone = async () => {
    if (!currentDocument) return;
    const res = await shareToPhoneFiles(currentDocument.title, currentDocument.content);
    addToast(res.success ? 'success' : 'info', res.message);
  };

  const handleCopyText = async () => {
    if (!currentDocument) return;
    const ok = await copyToClipboard(currentDocument.content);
    if (ok) {
      addToast('success', 'Document text copied to clipboard!');
    } else {
      addToast('error', 'Unable to copy text.');
    }
  };

  // Delete / Clear History
  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    addToast('info', 'Document removed from history.');
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    addToast('info', 'Cleared all local history.');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNewDocument={handleNewDocument}
      />

      {/* Mobile Segmented Navigation Bar (Only on small screens) */}
      <div className="lg:hidden sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2 no-print flex gap-2">
        <button
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'form'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. Document Form</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>2. Live Preview & Save</span>
          {currentDocument && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Controls (Hidden on mobile if user selected preview tab) */}
          <div
            id="document-form-section"
            className={`lg:col-span-5 space-y-4 ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between no-print px-1">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Drafting Parameters
                </h2>
                <p className="text-xs text-slate-500">
                  Configure structure, tone & details
                </p>
              </div>

              {currentDocument && (
                <button
                  onClick={() => setMobileTab('preview')}
                  className="lg:hidden text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg"
                >
                  <span>View Preview</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <DocumentForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              onApplyPreset={handleApplyPreset}
            />
          </div>

          {/* Right Column: Action Toolbar & Live Document Preview */}
          <div
            ref={previewRef}
            className={`lg:col-span-7 space-y-4 ${
              mobileTab === 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Action Toolbar with Save as PDF, Save as .TXT, Save to Phone Files, Copy */}
            <ActionToolbar
              onSavePdf={handleSavePdf}
              onSaveTxt={handleSaveTxt}
              onShareToPhone={handleShareToPhone}
              onCopyText={handleCopyText}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              wordCount={stats.words}
              readingTimeMin={stats.readingTimeMin}
              hasDocument={Boolean(currentDocument)}
            />

            {/* Document Paper Preview */}
            <DocumentPreview
              document={currentDocument}
              viewMode={viewMode}
              onChangeContent={handleChangeContent}
              isLoading={isLoading}
              onRefineDocument={handleRefineDocument}
              isRefining={isRefining}
            />
          </div>
        </div>
      </main>

      {/* Document History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        documents={history}
        onSelectDocument={(doc) => {
          setCurrentDocument(doc);
          setFormData({
            docType: doc.docType,
            title: doc.title,
            recipient: doc.recipient || '',
            requirements: doc.requirements || '',
            tone: doc.tone,
          });
          setMobileTab('preview');
          addToast('success', `Loaded "${doc.title}"`);
        }}
        onDeleteDocument={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
