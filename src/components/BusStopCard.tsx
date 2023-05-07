import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RoomIcon from "@mui/icons-material/Room";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { type MouseEvent, useState, useRef, useMemo } from "react";
import { useScrollAndExpand } from "utils/hooks";

import { type Status, Statuses, Definitions } from "definitions/busStop";

import type { BusStop } from "@prisma/client";

const BusStopCard = ({
  busStop,
  selected,
  onSelect,
  onEdit,
  onShowSchedule,
  onDelete,
}: {
  busStop: BusStop;
  selected: boolean;
  onSelect: (id: number) => void;
  onEdit: (id: number) => void;
  onShowSchedule: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  useScrollAndExpand(ref, selected, expanded, setExpanded);

  const handleExpanded = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // generate random status only once
  const status = useMemo(
    () => Statuses[Math.floor(Math.random() * Statuses.length)] as Status,
    []
  );
  const Icon = Definitions[status].Icon;

  return (
    <Paper
      ref={ref}
      onClick={() => onSelect(busStop.id)}
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
        <Stack direction="row" spacing={0.5} alignItems="center">
          <RoomIcon color={Definitions[status].color} fontSize="large" />
          <Typography flexGrow={1}>{busStop.name}</Typography>

          <IconButton onClick={handleExpanded}>
            {expanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>

        <Collapse in={expanded}>
          <Stack direction="column" spacing={1} p={0.5}>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Status" placement="top" arrow>
                <Icon />
              </Tooltip>
              <Typography>{Definitions[status].label}</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Ostatnia aktualizacja" placement="top" arrow>
                <AccessTimeIcon />
              </Tooltip>
              <Typography>{new Date().toLocaleString()}</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Współrzędne" placement="top" arrow>
                <GpsFixedIcon />
              </Tooltip>
              <Typography>{`(${busStop.gpsX}, ${busStop.gpsY})`}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1}>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => onDelete(busStop.id)}
            >
              Usun
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={() => onEdit(busStop.id)}
            >
              Edytuj
            </Button>

            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={() => onShowSchedule(busStop.id)}
            >
              Rozklad
            </Button>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default BusStopCard;
