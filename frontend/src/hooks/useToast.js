import { useState, useCallback } from 'react';

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastIdCounter;
    const toast = { id, type, title, message, duration };
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (title, message) => addToast({ type: 'success', title, message }),
    [addToast]
  );

  const error = useCallback(
    (title, message) => addToast({ type: 'error', title, message }),
    [addToast]
  );

  const info = useCallback(
    (title, message) => addToast({ type: 'info', title, message }),
    [addToast]
  );

  return { toasts, addToast, removeToast, success, error, info };
}
