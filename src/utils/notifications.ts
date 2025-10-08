import { toast } from 'react-hot-toast';

const recentToasts = new Map<string, number>();
const TOAST_COOLDOWN = 2000;

const createToastKey = (message: string, type: string) => `${type}:${message}`;

const shouldShowToast = (key: string): boolean => {
  const now = Date.now();
  const lastShown = recentToasts.get(key);
  
  if (!lastShown || now - lastShown > TOAST_COOLDOWN) {
    recentToasts.set(key, now);
    return true;
  }
  
  return false;
};

export const showError = (message: string) => {
  const key = createToastKey(message, 'error');
  if (shouldShowToast(key)) {
    toast.error(message, { position: 'top-center' });
  }
};

export const showSuccess = (message: string) => {
  const key = createToastKey(message, 'success');
  if (shouldShowToast(key)) {
    toast.success(message, { position: 'top-center' });
  }
};

export const showWarning = (message: string) => {
  const key = createToastKey(message, 'warning');
  if (shouldShowToast(key)) {
    toast(message, { 
      position: 'top-center',
      icon: '⚠️',
      style: {
        background: '#ff9800',
        color: '#fff',
      },
    });
  }
};

export const showInfo = (message: string) => {
  const key = createToastKey(message, 'info');
  if (shouldShowToast(key)) {
    toast(message, { 
      position: 'top-center',
      icon: 'ℹ️',
      style: {
        background: '#2196f3',
        color: '#fff',
      },
    });
  }
};

export const clearToastHistory = () => {
  recentToasts.clear();
};