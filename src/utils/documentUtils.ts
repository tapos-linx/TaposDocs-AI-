/**
 * Document export, print, share, and clipboard utilities
 */

export function saveAsTxt(title: string, content: string, extension: string = '.txt') {
  const sanitized = (title || 'document')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .substring(0, 45) || 'document';
  
  const fileName = `${sanitized}${extension}`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function shareToPhoneFiles(
  title: string,
  content: string
): Promise<{ success: boolean; message: string }> {
  const sanitized = (title || 'document')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .substring(0, 45) || 'document';
  const fileName = `${sanitized}.md`;

  try {
    const file = new File([content], fileName, {
      type: 'text/markdown;charset=utf-8',
    });

    // Check if device supports sharing files
    if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: title || 'Document',
        text: `Here is the drafted document: ${title}`,
      });
      return { success: true, message: 'Shared to phone files / apps successfully!' };
    }

    // Check if standard text sharing is supported
    if (navigator.share) {
      await navigator.share({
        title: title || 'Document',
        text: content,
      });
      return { success: true, message: 'Shared text via native share dialog!' };
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { success: false, message: 'Share action cancelled.' };
    }
    console.warn('Navigator share error, falling back to download:', err);
  }

  // Fallback for browsers without share API (desktop or unsupported webviews)
  saveAsTxt(title, content, '.txt');
  return {
    success: true,
    message: 'Saved directly to your local downloads directory.',
  };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback below
    }
  }

  // Fallback
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
  textArea.setAttribute('readonly', '');
  document.body.appendChild(textArea);
  textArea.select();
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (err) {
    console.error('execCommand error:', err);
  }
  document.body.removeChild(textArea);
  return success;
}

export function printAsPdf() {
  window.print();
}

export function getWordAndCharCount(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const readingTimeMin = Math.max(1, Math.ceil(words / 200));
  return { words, chars, readingTimeMin };
}
