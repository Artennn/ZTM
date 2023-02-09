import { useState } from "react";
import { trpc } from "utils/trpc";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";

import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

import ScheduleEditor from "components/dialogs/ScheduleEditor";

import type { Line } from "types/line";
import { RouteColors } from "styles/theme";

const LineCard = ({
  line,
  selected,
  onSelect,
}: {
  line: Line;
  selected?: boolean;
  onSelect: (id: number) => void;
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const { isLoading: isScheduleLoading, data: schedule } =
    trpc.schedule.getByLine.useQuery(line.id, { enabled: showSchedule });

  return (
    <>
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
            <Typography>{line.name}</Typography>

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
                onClick={() => setShowSchedule(!showSchedule)}
              >
                Rozklad
              </Button>
            </Stack>
          </Collapse>
        </Stack>
      </Paper>

      {showSchedule && !isScheduleLoading && schedule && (
        <ScheduleEditor
          line={line}
          schedule={schedule}
          onClose={() => setShowSchedule(false)}
        />
      )}
    </>
  );
};
export default LineCard;
