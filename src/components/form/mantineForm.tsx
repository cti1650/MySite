import React, { FC, useCallback } from 'react';
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  Textarea,
  Text,
  Space,
  Select
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useMantineFormRequest } from '@hooks/useMantineFormRequest';
import { FormSuccess } from './FormSuccess';
import { FormLoading } from './FormLoading';

const schema = z.object({
  name: z.string().min(2, { message: '名前は2文字以上入力してください！' }),
  email: z.string().email({ message: 'メールアドレスを入力してください！' }),
  summary: z.string().min(10, { message: '概要は必ず選択してください！' }),
  body: z.string().min(10, { message: '内容は10文字以上入力してください！' }),
  termsOfService: z.boolean().default(false),
});

export const MantineForm: FC = () => {
  const { success, loading, notionRequest, reset } = useMantineFormRequest();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      summary: '',
      body: '',
      termsOfService: false,
    },
    schema: zodResolver(schema),
  });

  const handleSubmit = useCallback(
    (values) => {
      notionRequest({
        name: values.name,
        email: values.email,
        summary: values.summary,
        message: values.body,
      });
    },
    [notionRequest]
  );

  const handleReset = useCallback(() => {
    reset();
    form.reset();
  }, [form, reset]);

  if (loading) {
    return <FormLoading />;
  }

  if (success) {
    return (
      <FormSuccess
        name={form.values.name}
        email={form.values.email}
        summary={form.values.summary}
        message={form.values.body}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="h-auto min-h-full w-full max-w-[400px] mx-auto flex justify-center items-center">
      <div>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Box sx={(t) => ({ paddingBottom: t.spacing.xl })}>
            <Text mx="auto" align="center">
              お問い合わせがありましたら、
              <Space />
              下のフォームからお問い合わせください。
            </Text>
          </Box>
          <TextInput
            required
            label="名前"
            placeholder="氏 名"
            classNames={{
              input: 'text-base',
            }}
            {...form.getInputProps('name')}
          />

          <TextInput
            required
            label="メールアドレス"
            type="email"
            placeholder="your@email.com"
            classNames={{
              input: 'text-base',
            }}
            {...form.getInputProps('email')}
          />

          <Select
            required
            label="概要"
            placeholder="お問い合わせの概要について"
            classNames={{
              input: 'text-base',
            }}
            data={['ポートフォリオに関するお問い合わせ', 'ポートフォリオの機能追加のご要望', 'ポートフォリオの不具合のご報告', 'お仕事のご依頼・ご相談', 'その他']}
            {...form.getInputProps('summary')}
          />

          <Textarea
            required
            label="内容"
            placeholder="お問い合わせやご要望など"
            minRows={8}
            classNames={{
              input: 'text-base',
            }}
            {...form.getInputProps('body')}
          />

          <Checkbox
            required
            mt="md"
            label="プライバシーポリシーに同意"
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />

          <Group position="right" mt="md">
            <Button type="submit">送信</Button>
          </Group>
        </form>
      </div>
    </div>
  );
};
