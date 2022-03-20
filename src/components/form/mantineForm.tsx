import React, { VFC } from 'react';
import { TextInput, Checkbox, Button, Group, Box, Textarea, Text, Title, Space } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import axios from 'axios';
import { useNotifications } from '@mantine/notifications';

const schema = z.object({
  name: z.string().min(2, { message: '名前は2文字以上入力してください！' }),
  email: z.string().email({ message: 'メールアドレスを入力してください！' }),
  body: z.string().min(10, { message: '内容は10文字以上入力してください！' }),
});

export const MantineForm: VFC = () => {
  const notifications = useNotifications();
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      body: '',
      termsOfService: false,
    },
    schema: zodResolver(schema),
  });

  const handleSubmit = (values) => {
    const database_id = process.env.NEXT_PUBLIC_NOTION_CONTACT_DATABASE_ID ?? '';
    const data = new FormData();
    data.append('name', values.name);
    data.append('email', values.email);
    data.append('body', values.body);
    axios({
      method: 'post',
      url: `https://notion-flask-api-test.herokuapp.com/db/${database_id}/form/add/`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data
    })
      .then((res) => {
        if (res.status === 400) {
          throw new Error('Bad request');
        }
        if (res.status === 200) {
          notifications.showNotification({
            title: '送信完了',
            message: '送信を完了しました！',
          });
          form.reset();
        } else {
          throw new Error('Bad response');
        }
      })
      .catch(() => {
        notifications.showNotification({
          title: '送信失敗',
          message: '送信に失敗しました！時間を置いて再度送信してください！',
        });
      });
  };

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <Box sx={(t) => ({ paddingBottom: t.spacing.xl })}>
        <Text mx="auto" align="center">
          お問い合わせがありましたら、<Space />下のフォームからお問い合わせください。
        </Text>
      </Box>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          required
          label="名前"
          placeholder="氏 名"
          {...form.getInputProps('name')}
        />

        <TextInput
          required
          label="メールアドレス"
          type="email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <Textarea
          required
          label="内容"
          placeholder="お問い合わせやご要望など"
          minRows={8}
          {...form.getInputProps('body')}
        />

        <Checkbox
          mt="md"
          label="プライバシーポリシーに同意"
          {...form.getInputProps('termsOfService', { type: 'checkbox' })}
        />

        <Group position="right" mt="md">
          <Button type="submit">送信</Button>
        </Group>
      </form>
    </Box>
  );
};