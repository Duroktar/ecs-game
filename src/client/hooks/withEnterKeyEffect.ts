import {useEffect} from 'react';
import { Keyboard } from '../../extern/Keyboard';

export const withEnterKeyEffect = (onEnter: () => void) => useEffect(() => {
  const enterKeyHandler = (e: KeyboardEvent) => {
    if (e.keyCode === Keyboard.ENTER) {
      onEnter();
    }
  }

  document.addEventListener('keypress', enterKeyHandler)

  return function cleanup() {
    document.removeEventListener('keypress', enterKeyHandler);
  }
});
