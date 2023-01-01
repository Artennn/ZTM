import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

const Home: NextPage = () => {
  const { data, status } = useSession({ required: true });

  return (
    <>
      <Head>
        <title>System ZTM</title>
      </Head>

      <main>
        <pre>{JSON.stringify({ data, status }, null, 2)}</pre>
      </main>
    </>
  );
};

export default Home;
