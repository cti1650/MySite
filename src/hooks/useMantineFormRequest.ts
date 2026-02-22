import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';

export type NotionRequestData = {
  name: string;
  email: string;
  summary: string;
  message: string;
};

export const useMantineFormRequest = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setError(false);
  }, []);

  const notionRequest = useCallback((requestData: NotionRequestData) => {
    setLoading(true);
    setSuccess(false);
    setError(false);
    const data = new FormData();
    data.append('name', requestData?.name);
    data.append('email', requestData?.email);
    data.append('summary', requestData?.summary);
    data.append('body', requestData?.message);
    axios
      .post(`${location.origin}/api/notion/form`, data)
      .then((res) => {
        if (res.status === 400) {
          setError(true);
          throw new Error('Bad request');
        }
        if (res.status === 200) {
          notifications.show({
            title: '送信完了',
            message: '送信を完了しました！',
          });
          setSuccess(true);
        } else {
          setError(true);
          throw new Error('Bad response');
        }
      })
      .catch(() => {
        notifications.show({
          title: '送信失敗',
          message: '送信に失敗しました！時間を置いて再度送信してください！',
        });
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return useMemo(
    () => ({ loading, success, error, notionRequest, reset }),
    [notionRequest, reset, loading, success, error],
  );
};
