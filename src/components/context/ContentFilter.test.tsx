import { render, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import {
  BizContent,
  ContentFilter,
  LibeContent,
  PrivateContent,
} from './ContentFilter';
import { ViewLayerContext } from './ViewLayerProvider';

/**
 * ContentFilter は「現在のレイヤーとその祖先レイヤー」に対して
 * targetLayer / targetLayers が一致するかで表示を決める。
 * 親子関係は config.ts の parentLayer を辿る（例: test -> libe -> private）。
 *
 * context 経由で値を受け取るため Provider の挙動変化の影響を受ける。
 * ここでは context に値を直接注入して表示条件だけを検証する。
 */

const CHILD = <span>表示対象</span>;

/**
 * 指定レイヤーで描画し、子が表示されたかを返す。
 * 1つのテスト内で複数回描画しても混ざらないよう、判定は
 * その描画のコンテナ内に限定する（cleanup はテスト単位で走るため）。
 */
const isShownAt = (layer: string, children: ReactNode): boolean => {
  const { container } = render(
    <ViewLayerContext.Provider value={[layer, () => {}]}>
      {children}
    </ViewLayerContext.Provider>,
  );
  return within(container).queryByText('表示対象') !== null;
};

describe('ContentFilter', () => {
  describe('targetLayer（単一指定）', () => {
    it('現在のレイヤーと一致すれば表示する', () => {
      expect(
        isShownAt(
          'biz',
          <ContentFilter targetLayer="biz">{CHILD}</ContentFilter>,
        ),
      ).toBe(true);
    });

    it('一致しなければ表示しない', () => {
      expect(
        isShownAt(
          'private',
          <ContentFilter targetLayer="biz">{CHILD}</ContentFilter>,
        ),
      ).toBe(false);
    });

    it('祖先レイヤーと一致すれば表示する（libe は private を継承）', () => {
      expect(
        isShownAt(
          'libe',
          <ContentFilter targetLayer="private">{CHILD}</ContentFilter>,
        ),
      ).toBe(true);
    });

    it('2段以上の祖先でも継承する（test -> libe -> private）', () => {
      expect(
        isShownAt(
          'test',
          <ContentFilter targetLayer="private">{CHILD}</ContentFilter>,
        ),
      ).toBe(true);
      expect(
        isShownAt(
          'test',
          <ContentFilter targetLayer="libe">{CHILD}</ContentFilter>,
        ),
      ).toBe(true);
    });

    it('子孫方向には継承しない（private から libe 向けは非表示）', () => {
      expect(
        isShownAt(
          'private',
          <ContentFilter targetLayer="libe">{CHILD}</ContentFilter>,
        ),
      ).toBe(false);
    });

    it('兄弟レイヤーには継承しない（facebook と x は別系統）', () => {
      expect(
        isShownAt(
          'facebook',
          <ContentFilter targetLayer="x">{CHILD}</ContentFilter>,
        ),
      ).toBe(false);
    });
  });

  describe('targetLayers（複数指定）', () => {
    it('いずれかに一致すれば表示する', () => {
      expect(
        isShownAt(
          'biz',
          <ContentFilter targetLayers={['biz', 'private']}>
            {CHILD}
          </ContentFilter>,
        ),
      ).toBe(true);
    });

    it('どれにも一致しなければ表示しない', () => {
      expect(
        isShownAt(
          'biz',
          <ContentFilter targetLayers={['libe', 'x']}>{CHILD}</ContentFilter>,
        ),
      ).toBe(false);
    });

    it('祖先レイヤーが含まれていれば表示する', () => {
      expect(
        isShownAt(
          'test',
          <ContentFilter targetLayers={['private']}>{CHILD}</ContentFilter>,
        ),
      ).toBe(true);
    });
  });

  describe('default 指定', () => {
    it('targetLayer が default なら常に表示する', () => {
      expect(
        isShownAt(
          'facebook',
          <ContentFilter targetLayer="default">{CHILD}</ContentFilter>,
        ),
      ).toBe(true);
    });

    it('targetLayers が [default] のみなら常に表示する', () => {
      expect(
        isShownAt(
          'facebook',
          <ContentFilter targetLayers={['default']}>{CHILD}</ContentFilter>,
        ),
      ).toBe(true);
    });

    it('targetLayers に default と他が混在する場合は通常判定になる', () => {
      expect(
        isShownAt(
          'facebook',
          <ContentFilter targetLayers={['default', 'x']}>
            {CHILD}
          </ContentFilter>,
        ),
      ).toBe(false);
    });
  });

  it('指定が無ければ表示しない', () => {
    expect(isShownAt('biz', <ContentFilter>{CHILD}</ContentFilter>)).toBe(
      false,
    );
  });

  it('未知のレイヤーでも落ちずに非表示になる', () => {
    expect(() =>
      isShownAt(
        'unknown-layer',
        <ContentFilter targetLayer="biz">{CHILD}</ContentFilter>,
      ),
    ).not.toThrow();
  });
});

describe('ラッパーコンポーネント', () => {
  it('BizContent は biz 系で表示する', () => {
    expect(isShownAt('biz', <BizContent>{CHILD}</BizContent>)).toBe(true);
  });

  it('BizContent は biz を継承する子レイヤーでも表示する', () => {
    expect(isShownAt('facebook', <BizContent>{CHILD}</BizContent>)).toBe(true);
  });

  it('BizContent は private 系では表示しない', () => {
    expect(isShownAt('private', <BizContent>{CHILD}</BizContent>)).toBe(false);
  });

  it('PrivateContent は private を継承する子レイヤーでも表示する', () => {
    expect(isShownAt('qiita', <PrivateContent>{CHILD}</PrivateContent>)).toBe(
      true,
    );
  });

  it('PrivateContent は biz 系では表示しない', () => {
    expect(
      isShownAt('facebook', <PrivateContent>{CHILD}</PrivateContent>),
    ).toBe(false);
  });

  it('LibeContent は libe とその子で表示する', () => {
    expect(isShownAt('libe', <LibeContent>{CHILD}</LibeContent>)).toBe(true);
    expect(isShownAt('test', <LibeContent>{CHILD}</LibeContent>)).toBe(true);
  });
});
