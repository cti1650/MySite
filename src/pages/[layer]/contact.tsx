import { ViewLayerPageContainer, viewLayerList } from '@comp/context';
import { ContactPage } from '@comp/page/contact';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const ViewLayerContact: NextPage = () => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <ContactPage />
    </ViewLayerPageContainer>
  );
};

export const getServerSideProps = createPageProps({ layers: viewLayerList });

export default ViewLayerContact;
