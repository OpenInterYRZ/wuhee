import { useEffect, useCallback } from 'react';

interface KeyboardHandlers {
  onEscape?: () => void;
  onSpace?: () => void;
  onEnter?: () => void;
  onNumber?: (number: number) => void;
  onCtrlS?: () => void;
  onCtrlL?: () => void;
}

export const useKeyboard = (handlers: KeyboardHandlers, enabled: boolean = true) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // 防止在输入框中触发快捷键
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.code) {
      case 'Escape':
        event.preventDefault();
        handlers.onEscape?.();
        break;
      
      case 'Space':
        event.preventDefault();
        handlers.onSpace?.();
        break;
      
      case 'Enter':
        event.preventDefault();
        handlers.onEnter?.();
        break;
      
      case 'Digit1':
      case 'Numpad1':
        event.preventDefault();
        handlers.onNumber?.(1);
        break;
      
      case 'Digit2':
      case 'Numpad2':
        event.preventDefault();
        handlers.onNumber?.(2);
        break;
      
      case 'Digit3':
      case 'Numpad3':
        event.preventDefault();
        handlers.onNumber?.(3);
        break;
      
      case 'Digit4':
      case 'Numpad4':
        event.preventDefault();
        handlers.onNumber?.(4);
        break;
      
      case 'Digit5':
      case 'Numpad5':
        event.preventDefault();
        handlers.onNumber?.(5);
        break;
      
      case 'KeyS':
        if (event.ctrlKey) {
          event.preventDefault();
          handlers.onCtrlS?.();
        }
        break;
      
      case 'KeyL':
        if (event.ctrlKey) {
          event.preventDefault();
          handlers.onCtrlL?.();
        }
        break;
    }
  }, [handlers, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);

  return {
    // 可以返回一些状态或方法供组件使用
  };
};

export default useKeyboard;