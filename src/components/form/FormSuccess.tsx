import type { NotionRequestData } from '@hooks/useMantineFormRequest';
import { Box, Button, Text, Title } from '@mantine/core';
import { type FC, useMemo } from 'react';

type FormSuccessProps = {
  onReset: () => void;
} & NotionRequestData;

export const FormSuccess: FC<FormSuccessProps> = ({
  name,
  email,
  summary,
  message,
  onReset,
}) => {
  return useMemo(
    () => (
      <div className="h-auto min-h-full w-full max-w-[400px] mx-auto flex justify-center items-center">
        <div className="space-y-4">
          <Box pb="xl">
            <Text mx="auto" ta="center">
              以下の内容でお受付いたしました。
              <br />
              ご返信が必要な場合は、
              <br />
              あらためてご連絡いたします。
            </Text>
          </Box>
          <Box>
            <Title order={4} ta="justify">
              name
            </Title>
            <Text
              mx="auto"
              p={10}
              ta="justify"
              className="whitespace-pre-wrap break-words"
            >
              {name ? name : 'sample'}
            </Text>
          </Box>
          <Box>
            <Title order={4} ta="justify">
              email
            </Title>
            <Text
              mx="auto"
              p={10}
              ta="justify"
              className="whitespace-pre-wrap break-words"
            >
              {email ? email : 'sample@email.com'}
            </Text>
          </Box>
          <Box>
            <Title order={4} ta="justify">
              summary
            </Title>
            <Text
              mx="auto"
              p={10}
              ta="justify"
              className="whitespace-pre-wrap break-words"
            >
              {summary ? summary : 'sample summary'}
            </Text>
          </Box>
          <Box>
            <Title order={4} ta="justify">
              message
            </Title>
            <Text
              mx="auto"
              p={10}
              ta="justify"
              className="whitespace-pre-wrap break-words"
            >
              {message ? message : 'sample message'}
            </Text>
          </Box>
          <Box className="flex justyfy-end">
            <Button
              type="button"
              color="gray"
              ml="auto"
              mr={0}
              mt={30}
              p={10}
              onClick={onReset}
            >
              フォームを再送信する
            </Button>
          </Box>
        </div>
      </div>
    ),
    [name, email, summary, message, onReset],
  );
};
