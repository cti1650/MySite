import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * happy-dom は FontFaceSet API (document.fonts) を実装していない。
 * Mantine 9 の Textarea は autosize を自前実装に変えた際に
 * `document.fonts.addEventListener('loadingdone', ...)` を無防備に呼ぶため、
 * スタブが無いと autosize 付き Textarea を描画した瞬間に
 * `Cannot read properties of undefined (reading 'addEventListener')` で落ちる。
 * (同じ実装内の ResizeObserver は typeof ガードがあるので不要)
 *
 * フォント読み込み完了は happy-dom では発生しないため、購読を受け流すだけでよい。
 */
if (!('fonts' in document)) {
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: {
      addEventListener: () => {},
      removeEventListener: () => {},
    },
  });
}

// happy-dom は describe/it をまたいで同じ document を使い回すため、
// 前のテストが描画したDOMが次のテストの getBy* に引っかからないよう毎回破棄する
afterEach(() => {
  cleanup();
});
