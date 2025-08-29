export async function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://app.rc.ovice.com/ws/p4ofxd8oeo/',
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}
