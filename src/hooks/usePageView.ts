import * as gtag from '@lib/gtag';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const usePageView = () => {
  const router = useRouter();
  useEffect(() => {
    if (!gtag.existsGaId) {
      return;
    }

    const handleRouteChange = (path, { shallow }) => {
      if (!shallow) {
        gtag.pageview(path);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
};
