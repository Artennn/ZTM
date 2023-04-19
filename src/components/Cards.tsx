import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";

import NewInfo from "./dialogs/NewInfo";

import { type ReactNode, useState } from "react";
import { trpc } from "utils/trpc";

import type { SvgIconComponent } from "@mui/icons-material";
import type { Info } from "@prisma/client";

export const StatCard = ({
  title,
  Icon,
  stats,
  actionGroup,
}: {
  title: string;
  Icon: SvgIconComponent;
  stats: {
    key: string;
    icon: ReactNode;
    label: string;
    count?: number | string;
  }[];
  actionGroup?: ReactNode;
}) => {
  return (
    <Stack
      direction="column"
      height={1}
      sx={{
        p: 1,
        pb: 1,
        border: (theme) => theme.border.primary,
        background: (theme) => theme.gradient.primary,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Icon fontSize="large" />
        <Typography variant="h6">{title}</Typography>
      </Stack>

      <Stack
        direction="column"
        spacing={2}
        sx={{ overflowY: "auto", height: 1, pr: 1 }}
      >
        {stats?.map((stat) => (
          <Stack
            key={stat.key}
            direction="row"
            p={1}
            spacing={1}
            sx={{ borderBottom: (theme) => theme.border.primary }}
          >
            {stat.icon}
            <Typography flexGrow={1}>{stat.label}</Typography>
            <Typography fontSize={20}>{stat.count || 0}</Typography>
          </Stack>
        ))}
      </Stack>

      <Stack direction="column" mt="auto" pt={1} justifyContent="flex-end">
        {actionGroup}
      </Stack>
    </Stack>
  );
};

export const InfoCard = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<Info>();

  const { isLoading, data: infoMessages, refetch } = trpc.info.get.useQuery();
  const { mutate: addInfo } = trpc.info.add.useMutation();
  const { mutate: editInfo } = trpc.info.edit.useMutation();
  const { mutate: deleteInfo } = trpc.info.delete.useMutation();

  const handleAddInfo = (info: Omit<Info, "id">) => {
    addInfo(info, {
      onSuccess: () => {
        setIsAdding(false);
        refetch();
      },
    });
  };

  const handleEditInfo = (info: Info) => {
    editInfo(info, {
      onSuccess: () => {
        setEditing(undefined);
        refetch();
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteInfo(id, { onSuccess: () => refetch() });
  };

  return (
    <>
      <Stack
        direction="column"
        height={1}
        sx={{
          p: 1,
          pb: 1,
          border: (theme) => theme.border.primary,
          background: (theme) => theme.gradient.primary,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <InfoIcon fontSize="large" />
          <Typography variant="h6">Informacje w pojazdach</Typography>
        </Stack>

        <Stack
          direction="column"
          spacing={2}
          sx={{ overflowY: "auto", height: 1, pr: 1 }}
        >
          {infoMessages?.map((message, key) => (
            <Stack
              key={key}
              direction="column"
              sx={{ pb: 1, borderBottom: (theme) => theme.border.primary }}
            >
              <Typography variant="h6">{message.title}</Typography>
              <Typography variant="subtitle1">{message.content}</Typography>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                pt={1}
              >
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => setEditing(message)}
                >
                  Edytuj
                </Button>

                <Button variant="contained" color="error" onClick={() => handleDelete(message.id)}>
                  Usun
                </Button>
              </Stack>
            </Stack>
          ))}

          {isLoading && (
            <Box alignSelf="center" mt={3}>
              <CircularProgress size={60} />
            </Box>
          )}
        </Stack>

        <Stack direction="column" flexGrow={1} mt={1} justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            onClick={() => setIsAdding(true)}
          >
            Dodaj
          </Button>
        </Stack>
      </Stack>

      {(isAdding || editing) && (
        <NewInfo
          info={editing}
          onAdd={handleAddInfo}
          onEdit={handleEditInfo}
          onClose={() => isAdding ? setIsAdding(false) : setEditing(undefined)}
        />
      )}
    </>
  );
};
