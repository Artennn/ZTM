import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";

import { MainLayout } from "components/Misc";
import LineEditor from "components/line/LineEditor";

import { prisma } from "server/db/client";
import { includeFullLine } from "server/trpc/router/line";

import type { FullLine } from "types/line";

const EditLinePage: NextPage<{ line: FullLine }> = ({ line }) => {
  useSession({ required: true });

  return (
    <MainLayout title="Stwórz nową linię">
      <LineEditor line={line} />
    </MainLayout>
  );
};

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
