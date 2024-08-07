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
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(2, { message: 'お名前は2文字以上入力してください。' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください。' }),
  summary: z.string().min(1, { message: 'お問い合わせの種類を選択してください。' }),
  body: z.string().min(10, { message: '内容は10文字以上入力してください。' }),
  termsOfService: z.boolean().refine((val) => val === true, { message: 'プライバシーポリシーに同意する必要があります。' }),
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
    <div className="h-auto min-h-full w-full max-w-lg mx-auto flex justify-center items-center">
      <div className="w-full">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Box sx={(t) => ({ paddingBottom: t.spacing.xl })}>
            <Text mx="auto" align="center">
              ご質問、ご依頼、その他お問い合わせは
              <Space />
              下のフォームからお願いいたします。
            </Text>
          </Box>
          <TextInput
            required
            label="お名前"
            placeholder="山田 太郎"
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
            label="お問い合わせの種類"
            placeholder="お問い合わせの種類を選択してください"
            classNames={{
              input: 'text-base',
            }}
            data={[
              'ポートフォリオに関するお問い合わせ',
              '開発したツールに関するお問い合わせ',
              'お仕事のご依頼・ご相談',
              'フリーランス業務に関するお問い合わせ',
              '採用に関するお問い合わせ',
              'その他'
            ]}
            {...form.getInputProps('summary')}
          />

          <Textarea
            required
            label="お問い合わせ内容"
            placeholder="具体的な内容をご記入ください"
            minRows={8}
            classNames={{
              input: 'text-base',
            }}
            {...form.getInputProps('body')}
          />

          <Checkbox
            required
            mt="md"
            label={<span>
              <Link href='/privacy_policy' target='_blank' className="text-blue-500 hover:text-blue-400 action:text-blue-300">プライバシーポリシー</Link>
              に同意します
            </span>}
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