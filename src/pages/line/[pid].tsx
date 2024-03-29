import { useSession } from "next-auth/react";

import LineEditor from "components/line/LineEditor";

import { prisma } from "server/db/client";
import { includeFullLine } from "server/trpc/router/line";

import type { GetServerSideProps } from "next";
import type { Page } from "types/app";
import type { FullLine } from "types/line";

const EditLinePage: Page<{ line: FullLine }> = ({ line }) => {
  useSession({ required: true });

  return <LineEditor line={line} />;
};
EditLinePage.title = "Stwórz nową linię";

export default EditLinePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { pid } = ctx.query;
  const id = (typeof pid === "string" && parseInt(pid)) || null;
  if (!id)
    return {
      redirect: {
        destination: "/line/",
        permanent: false,
      },
    };

  const line = await prisma.line.findFirst({
    where: { id: id },
    include: { ...includeFullLine },
  });

  return {
    props: {
      line: line,
    },
  };
};
