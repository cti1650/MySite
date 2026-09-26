import { act, render, screen } from '@testing-library/react';
import { StrictMode, useEffect, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { useViewLayer, useViewLayerPage, useViewLayerRootPath } from './hooks';
import { ViewLayerContext, ViewLayerProvider } from './ViewLayerProvider';

/**
 * Provider と hooks の結合。
 *
 * React のメジャー移行では以下が壊れやすいため、挙動を固定しておく。
 * - Provider が渡す value は毎レンダー新しい配列になる（参照の同一性に依存しない）
 * - useViewLayerPage の useEffect がマウント時にレイヤーを設定する
 *   （StrictMode の二重実行でも最終状態が同じであること）
 */

const LayerLabel = () => {
  const [layer] = useViewLayer();
  return <span data-testid="layer">{layer}</span>;
};

const RootPathLabel = () => {
  const path = useViewLayerRootPath();
  return <span data-testid="path">{path === '' ? '(empty)' : path}</span>;
};

describe('ViewLayerProvider', () => {
  it('既定レイヤーは private', () => {
    render(
      <ViewLayerProvider>
        <LayerLabel />
      </ViewLayerProvider>,
    );
    expect(screen.getByTestId('layer')).toHaveTextContent('private');
  });

  it('Provider 無しでも既定値が読める（context のデフォルト値）', () => {
    render(<LayerLabel />);
    expect(screen.getByTestId('layer')).toHaveTextContent('private');
  });

  it('Provider 無しの setLayer は no-op で例外にならない', () => {
    const Setter = () => {
      const [layer, setLayer] = useViewLayer();
      return (
        <button type="button" onClick={() => setLayer('biz')}>
          {layer}
        </button>
      );
    };
    render(<Setter />);
    expect(() => {
      act(() => {
        screen.getByRole('button').click();
      });
    }).not.toThrow();
  });

  it('setLayer で子に伝播する', () => {
    const Setter = () => {
      const [, setLayer] = useViewLayer();
      return (
        <button type="button" onClick={() => setLayer('biz')}>
          switch
        </button>
      );
    };

    render(
      <ViewLayerProvider>
        <LayerLabel />
        <Setter />
      </ViewLayerProvider>,
    );

    expect(screen.getByTestId('layer')).toHaveTextContent('private');
    act(() => {
      screen.getByRole('button').click();
    });
    expect(screen.getByTestId('layer')).toHaveTextContent('biz');
  });

  it('value は毎レンダー新しい配列になる（参照の同一性に依存しない設計）', () => {
    const seen: unknown[] = [];
    const Probe = () => {
      const value = useViewLayer();
      seen.push(value);
      const [, setLayer] = value;
      return (
        <button type="button" onClick={() => setLayer('biz')}>
          switch
        </button>
      );
    };

    render(
      <ViewLayerProvider>
        <Probe />
      </ViewLayerProvider>,
    );
    act(() => {
      screen.getByRole('button').click();
    });

    // レイヤーが変わった前後で別インスタンスになっている
    expect(seen.length).toBeGreaterThanOrEqual(2);
    expect(seen[0]).not.toBe(seen[seen.length - 1]);
  });

  it('setLayer の関数参照はレンダーをまたいで安定している', () => {
    // useState の setter は安定参照のため、useEffect の依存に入れても
    // 無限ループにならない（useViewLayerPage がこれに依存している）
    const setters: unknown[] = [];
    const Probe = () => {
      const [, setLayer] = useViewLayer();
      setters.push(setLayer);
      const [, force] = useState(0);
      return (
        <button type="button" onClick={() => force((n) => n + 1)}>
          rerender
        </button>
      );
    };

    render(
      <ViewLayerProvider>
        <Probe />
      </ViewLayerProvider>,
    );
    act(() => {
      screen.getByRole('button').click();
    });

    expect(setters.length).toBeGreaterThanOrEqual(2);
    expect(setters[0]).toBe(setters[setters.length - 1]);
  });
});

describe('useViewLayerPage', () => {
  const Page = ({ targetLayer }: { targetLayer: string }) => {
    useViewLayerPage({ targetLayer });
    return <LayerLabel />;
  };

  it('マウント時に対象レイヤーを設定する', () => {
    render(
      <ViewLayerProvider>
        <Page targetLayer="biz" />
      </ViewLayerProvider>,
    );
    expect(screen.getByTestId('layer')).toHaveTextContent('biz');
  });

  it('引数省略時は既定レイヤーを設定する', () => {
    const DefaultPage = () => {
      useViewLayerPage({});
      return <LayerLabel />;
    };
    render(
      <ViewLayerProvider>
        <DefaultPage />
      </ViewLayerProvider>,
    );
    expect(screen.getByTestId('layer')).toHaveTextContent('private');
  });

  it('StrictMode で effect が二重実行されても最終状態は同じ', () => {
    render(
      <StrictMode>
        <ViewLayerProvider>
          <Page targetLayer="libe" />
        </ViewLayerProvider>
      </StrictMode>,
    );
    expect(screen.getByTestId('layer')).toHaveTextContent('libe');
  });

  it('targetLayer が変わると追従する', () => {
    const Switcher = () => {
      const [target, setTarget] = useState('biz');
      useEffect(() => {
        // 初回描画後に別レイヤーへ切り替える
        setTarget('libe');
      }, []);
      return <Page targetLayer={target} />;
    };

    render(
      <ViewLayerProvider>
        <Switcher />
      </ViewLayerProvider>,
    );
    expect(screen.getByTestId('layer')).toHaveTextContent('libe');
  });
});

describe('useViewLayerRootPath', () => {
  it('path を持つレイヤーはその path を返す', () => {
    render(
      <ViewLayerContext.Provider value={['biz', () => {}]}>
        <RootPathLabel />
      </ViewLayerContext.Provider>,
    );
    expect(screen.getByTestId('path')).toHaveTextContent('/biz');
  });

  it('path を持たない既定レイヤーは空文字を返す', () => {
    render(
      <ViewLayerContext.Provider value={['private', () => {}]}>
        <RootPathLabel />
      </ViewLayerContext.Provider>,
    );
    expect(screen.getByTestId('path')).toHaveTextContent('(empty)');
  });

  it('未知のレイヤーでも落ちずに空文字を返す', () => {
    render(
      <ViewLayerContext.Provider value={['nope', () => {}]}>
        <RootPathLabel />
      </ViewLayerContext.Provider>,
    );
    expect(screen.getByTestId('path')).toHaveTextContent('(empty)');
  });

  it('入れ子のレイヤーは自身の path を返す', () => {
    render(
      <ViewLayerContext.Provider value={['libe', () => {}]}>
        <RootPathLabel />
      </ViewLayerContext.Provider>,
    );
    expect(screen.getByTestId('path')).toHaveTextContent('/from/libe');
  });
});
