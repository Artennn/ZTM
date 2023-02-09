import { MainLayout } from "components/Misc";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  useSession({ required: true });

  return (
    <MainLayout title="System ZTM">
      <></>
    </MainLayout>
  );
};

export default Home;
