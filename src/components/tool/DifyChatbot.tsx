import { OS, useOs } from '@mantine/hooks';
import { useEffect } from 'react';

type Global = (Window & typeof globalThis) & {
  difyChatbotConfig?: {
    token?: string;
  };
};

const DifyChatbot = () => {
  const token = process.env.NEXT_PUBLIC_DIFY_TOKEN;
  const os: OS = useOs();

  useEffect(() => {
    if (!os || ['ios'].includes(os)) return;
    const global: Global = window;

    // Create the script tag
    const script = document.createElement('script');
    script.src = 'https://udify.app/embed.min.js';
    script.id = token;
    script.defer = true;

    // Create the style tag
    const style = document.createElement('style');
    style.textContent =
      '#dify-chatbot-bubble-button { background-color: #1C64F2 !important; }';

    // Inject the script and style elements into the head
    document.head.appendChild(script);
    document.head.appendChild(style);

    // Set the global Dify chatbot configuration
    global.difyChatbotConfig = {
      token: token,
    };

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(style);
    };
  }, [os, token, global]);

  return null;
};

export default DifyChatbot;
