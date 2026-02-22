declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '';

export const existsGaId = GA_ID !== '';

export const pageview = (path: string): void => {
  window.gtag('config', GA_ID, {
    page_path: path,
  });
};

type GtagEventParams = {
  action: string;
  category: string;
  label: string;
  value?: string;
};

export const event = ({
  action,
  category,
  label,
  value = '',
}: GtagEventParams): void => {
  if (!existsGaId) {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: JSON.stringify(label),
    value,
  });
};
