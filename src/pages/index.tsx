import { useSession } from "next-auth/react";
import type { Page } from "types/app";

const Home: Page = () => {
  useSession({ required: true });

  return <></>;
};

export default Home;
