import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TitleBox } from './TitleBox';

/**
 * TitleBox は props の既定値とサイズ/色のバリアントで
 * Tailwind のクラスを組み立てるだけの表示コンポーネント。
 *
 * React の移行では props の既定値（defaultProps ではなく引数のデフォルト値を
 * 使っている点）が、Tailwind の移行ではクラス名の付与が壊れやすいため、
 * 「どのクラスが付くか」まで固定しておく。
 */

/** ルート要素（描画コンテナの直下）を取り出す */
const rootOf = (container: HTMLElement) => container.firstElementChild;

describe('TitleBox', () => {
  describe('既定値', () => {
    it('title 未指定なら "Title" を表示する', () => {
      render(<TitleBox />);
      expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('subTitle 未指定ならサブタイトルの行を描画しない', () => {
      const { container } = render(<TitleBox title="本文" />);
      // サブタイトル行が無いので、ルート直下の行は1つだけ
      expect(rootOf(container)?.children).toHaveLength(1);
    });

    it('既定は middle / blue のクラス構成になる', () => {
      const { container } = render(<TitleBox />);
      const root = rootOf(container);
      expect(root).toHaveClass('w-2/3', 'px-2', 'py-4', 'bg-gray-100');
    });
  });

  describe('title / subTitle', () => {
    it('指定した文字列をそれぞれ表示する', () => {
      render(<TitleBox title="見出し" subTitle="補足説明" />);
      expect(screen.getByText('見出し')).toBeInTheDocument();
      expect(screen.getByText('補足説明')).toBeInTheDocument();
    });

    it('subTitle を渡すと行が増える', () => {
      const { container } = render(<TitleBox title="見出し" subTitle="補足" />);
      expect(rootOf(container)?.children).toHaveLength(2);
    });

    it('空文字の subTitle は行を増やさない', () => {
      const { container } = render(<TitleBox title="見出し" subTitle="" />);
      expect(rootOf(container)?.children).toHaveLength(1);
    });

    it('改行を含む文字列でも折り返し用のクラスを保つ', () => {
      render(<TitleBox title={'1行目\n2行目'} />);
      const title = screen.getByText(/1行目/);
      expect(title).toHaveClass('whitespace-pre-wrap', 'break-all');
    });
  });

  describe('size バリアント', () => {
    it.each([
      ['small', 'w-2/3', 'px-2', 'py-3'],
      ['middle', 'w-2/3', 'px-2', 'py-4'],
      ['big', 'w-4/5', 'px-2.5', 'py-6'],
    ] as const)('%s は対応するパネルのクラスになる', (size, ...expected) => {
      const { container } = render(<TitleBox size={size} />);
      expect(rootOf(container)).toHaveClass(...expected);
    });

    it('big はタイトルの文字サイズが text-4xl になる', () => {
      render(<TitleBox title="見出し" size="big" />);
      expect(screen.getByText('見出し').parentElement).toHaveClass('text-4xl');
    });
  });

  describe('color バリアント', () => {
    it.each([
      ['black', 'text-black'],
      ['white', 'text-gray-50'],
      ['blue', 'text-gray-800'],
      ['red', 'text-gray-800'],
    ] as const)('%s は対応する文字色になる', (color, expected) => {
      render(<TitleBox title="見出し" color={color} />);
      expect(screen.getByText('見出し').parentElement).toHaveClass(expected);
    });

    it('black / white はパネルの背景色を持たない', () => {
      const { container: blackBox } = render(<TitleBox color="black" />);
      expect(rootOf(blackBox)).not.toHaveClass('bg-gray-100');

      const { container: whiteBox } = render(<TitleBox color="white" />);
      expect(rootOf(whiteBox)).not.toHaveClass('bg-gray-100');
    });

    it('red はバーの色が bg-red-600 になる', () => {
      const { container } = render(<TitleBox title="見出し" color="red" />);
      expect(container.querySelector('.bg-red-600')).not.toBeNull();
    });
  });

  it('size と color を組み合わせても両方のクラスが付く', () => {
    const { container } = render(<TitleBox size="big" color="red" />);
    expect(rootOf(container)).toHaveClass('w-4/5', 'bg-gray-100');
    expect(container.querySelector('.bg-red-600.w-6.h-1')).not.toBeNull();
  });
});
