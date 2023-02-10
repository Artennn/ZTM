import { useState } from "react";
import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";

import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

import type { Line, Route } from "types/line";
import { RouteColors } from "styles/theme";

const LineCard = ({
  line,
  selected,
  onSelect,
  onShowSchedule,
}: {
  line: Line & {
    routes: Route[];
  };
  selected?: boolean;
  onSelect: (id: number) => void;
  onShowSchedule: (id: number) => void;
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper
      onClick={() => onSelect(line.id)}
      sx={{
        borderRadius: 2,
        mt: 2,
        p: 1,
        cursor: "pointer",
        background: selected
          ? (theme) => theme.gradient.selected
          : (theme) => theme.gradient.primary,
        "&:hover": {
          background: (theme) => theme.gradient.hover,
        },
      }}
    >
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize={25}>{line.name}</Typography>

          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Stack>

        <Collapse in={expanded} unmountOnExit>
          <Typography>Kierunki:</Typography>

          {line.routes.map((route, key) => (
            <Typography key={key} color={RouteColors[key] || "red"}>
              {route.name}
            </Typography>
          ))}

          <Stack direction="row" justifyContent="space-between" mt={1}>
            <Button size="small" variant="contained" color="error">
              Usun
            </Button>

            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => router.push(`/line/${line.id}`)}
            >
              Edytuj
            </Button>

            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => onShowSchedule(line.id)}
            >
              Rozklad
            </Button>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
};
export default LineCard;
