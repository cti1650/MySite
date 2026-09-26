import { MantineProvider } from '@mantine/core';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MantineForm } from './mantineForm';

/**
 * このテストが守る契約は「検証エラーが画面に出ること」そのものではなく、
 * **zod と resolver の組み合わせが実行時に壊れていないこと**。
 *
 * zodResolver(v3向け) は zod 4 のスキーマを渡しても型が通ってしまうため、
 * typecheck / build では検知できない。検証が失敗する経路を1度でも通せば
 * 実行時例外として現れるので、送信してエラー表示まで確認する。
 */

/** 送信成功パスは axios を叩くため、検証失敗だけを見るこのテストでは呼ばれない */
const notionRequest = vi.fn();
vi.mock('@hooks/useMantineFormRequest', () => ({
  useMantineFormRequest: () => ({
    success: false,
    loading: false,
    error: false,
    notionRequest,
    reset: () => {},
  }),
}));

const renderForm = () =>
  render(
    <MantineProvider>
      <MantineForm />
    </MantineProvider>,
  );

describe('MantineForm', () => {
  it('初期表示では検証エラーを出さない', () => {
    renderForm();
    expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
    expect(
      screen.queryByText('お名前は2文字以上入力してください。'),
    ).not.toBeInTheDocument();
  });

  it('空のまま送信すると各項目の検証エラーを表示する', async () => {
    const { container } = renderForm();
    const form = container.querySelector('form');
    if (!form) throw new Error('form が描画されていない');

    // Mantine の onSubmit が validate を呼ぶ経路を通す
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText('お名前は2文字以上入力してください。'),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText('有効なメールアドレスを入力してください。'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('お問い合わせの種類を選択してください。'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('内容は10文字以上入力してください。'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('プライバシーポリシーに同意する必要があります。'),
    ).toBeInTheDocument();

    // 検証が落ちている間は送信処理に進まない
    expect(notionRequest).not.toHaveBeenCalled();
  });
});
