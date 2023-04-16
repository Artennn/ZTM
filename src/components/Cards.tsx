import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import InfoIcon from "@mui/icons-material/Info";

import type { ReactNode } from "react";
import type { SvgIconComponent } from "@mui/icons-material";

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

const InfoMessages = [
  {
    title: "Funkcjonowanie linii Gaj w dniach 8 kwietnia i 10 kwietnia",
    content:
      "Informujemy, że w dniach 8 kwietnia br. (Wielka Sobota) i 10 kwietnia br. (Poniedziałek Wielkanocny) linia Gaj nie będzie funkcjonować.",
  },
  {
    title: "Zmiany w rozkładach jazdy ważne od 3 kwietnia",
    content:
      "Od 3 kwietnia br. (poniedziałek) obowiązywać będą zmiany w rozkładach komunikacji miejskie. Nowe rozkłady można na stronie ztm.lublin.eu.",
  },
];

export const InfoCard = () => {
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
        <InfoIcon fontSize="large" />
        <Typography variant="h6">Informacje w pojazdach</Typography>
      </Stack>

      <Stack
        direction="column"
        spacing={2}
        sx={{ overflowY: "auto", height: 1, pr: 1 }}
      >
        {InfoMessages.map((message, key) => (
          <Stack
            key={key}
            direction="column"
            sx={{ pb: 1, borderBottom: (theme) => theme.border.primary }}
          >
            <Typography variant="h6">{message.title}</Typography>
            <Typography variant="subtitle1">{message.content}</Typography>

            <Stack direction="row" spacing={2} justifyContent="flex-end" pt={1}>
              <Button variant="contained" color="info">
                Edytuj
              </Button>

              <Button variant="contained" color="error">
                Usun
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Stack direction="column" flexGrow={1} mt={1} justifyContent="flex-end">
        <Button variant="contained" color="success">
          Dodaj
        </Button>
      </Stack>
    </Stack>
  );
};
