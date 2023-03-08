import { useSession } from "next-auth/react";

import LineEditor from "components/line/LineEditor";

import type { Page } from "types/app";

const CreateLinePage: Page = () => {
  useSession({ required: true });

  return <LineEditor />;
};
CreateLinePage.title = "Stwórz nową linię";

export default CreateLinePage;
