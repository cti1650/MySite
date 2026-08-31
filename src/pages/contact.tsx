import { ContactPage } from '@comp/page/contact';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';

const Contact: NextPage = () => {
  return <ContactPage />;
};

export const getServerSideProps = createPageProps();

export default Contact;
