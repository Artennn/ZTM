import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { type MouseEvent, useEffect, useState, useRef } from "react";

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

  const handleExpanded = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  useEffect(() => {
    // got selected, should expand
    if (selected && !expanded) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return setExpanded(true);
    }

    // got unselected, should shrink
    if (!selected && expanded) {
      return setExpanded(false);
    }
  }, [selected]);

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
        <Stack direction="row" justifyContent="space-between">
          <Typography>{busStop.name}</Typography>

          <IconButton onClick={handleExpanded}>
            {expanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>

        <Collapse in={expanded}>
          <Stack direction="row" justifyContent="space-between" mt={1}>
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
