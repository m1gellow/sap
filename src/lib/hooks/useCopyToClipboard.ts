import { useState, useCallback } from 'react';

export const useCopyToClipboard = (): [boolean, (text: string) => Promise<void>] => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Сбросить состояние через 2 секунды
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
      setIsCopied(false);
    }
  }, []);

  return [isCopied, copy];
};