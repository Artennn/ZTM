import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import NoTransferIcon from "@mui/icons-material/NoTransfer";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { useRef, useState } from "react";
import { useScrollAndExpand } from "utils/hooks";

import type { MouseEvent } from "react";
import type { VehicleStatus } from "@prisma/client";
import type { VehicleWithDriver } from "server/trpc/router/vehicle";

const StatusIcons: Record<VehicleStatus, JSX.Element> = {
  parked: <LocalParkingIcon color="info" />,
  enroute: <AirportShuttleIcon color="success" />,
  service: <NoTransferIcon color="warning" />,
  emergency: <WarningAmberIcon color="error" />,
};

const VehicleCard = ({
  vehicle,
  selected,
  onSelect,
  onEdit,
  onShowSchedule,
  onDelete,
}: {
  vehicle: VehicleWithDriver;
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

  return (
    <Paper
      ref={ref}
      onClick={() => onSelect(vehicle.id)}
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
        <Stack direction="row" spacing={1} alignItems="center">
          {StatusIcons[vehicle.status]}
          <Typography flexGrow={1}>{vehicle.name}</Typography>

          <IconButton onClick={handleExpanded} sx={{ justifySelf: "flex-end" }}>
            {expanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>

        <Collapse in={expanded}>
          <Stack direction="column" spacing={1} mt={1}>
            <Stack direction="row" spacing={1}>
              <AssignmentIcon />
              <Typography> {vehicle.plate} </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <PersonIcon />
              <Typography> {vehicle.driver?.name} </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => onDelete(vehicle.id)}
              >
                Usun
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={() => onEdit(vehicle.id)}
              >
                Edytuj
              </Button>

              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => onShowSchedule(vehicle.id)}
              >
                Rozklad
              </Button>
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default VehicleCard;
