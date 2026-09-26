import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// happy-dom は describe/it をまたいで同じ document を使い回すため、
// 前のテストが描画したDOMが次のテストの getBy* に引っかからないよう毎回破棄する
afterEach(() => {
  cleanup();
});
