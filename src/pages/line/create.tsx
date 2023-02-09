import { MainLayout } from "components/Misc";
import LineEditor from "components/line/LineEditor";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";

const CreateLinePage: NextPage = () => {
  useSession({ required: true });

  return (
    <MainLayout title="Stwórz nową linię">
      <LineEditor />
    </MainLayout>
  );
};

export default CreateLinePage;
