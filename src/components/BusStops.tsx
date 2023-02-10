import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { type MouseEvent, useEffect, useState } from "react";
import { trpc } from "utils/trpc";

import List from "./List";
import NewBusStop from "./dialogs/NewBusStop";
import Schedule from "./dialogs/Schedule";
import { MapContainer } from "./Misc";

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
  onSelect: (name: string) => void;
  onEdit: (id: number) => void;
  onShowSchedule: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleSelected = () => {
    if (!expanded) setExpanded(true);
    onSelect(busStop.name);
  };

  const handleExpanded = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  useEffect(() => {
    // got selected, should expand
    if (selected && !expanded) {
      return setExpanded(true);
    }
    // got unselected, should shrink
    if (!selected && expanded) {
      return setExpanded(false);
    }
  }, [selected]);

  return (
    <Paper
      onClick={handleSelected}
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

const BusStops = () => {
  const trpcContext = trpc.useContext();
  const { isLoading, data: busStops } = trpc.busStop.get.useQuery();
  const { mutate: deleteBusStop } = trpc.busStop.delete.useMutation();

  const [selected, setSelected] = useState<BusStop>();

  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<BusStop>();
  const [showSchedule, setShowSchedule] = useState<BusStop>();

  const handleSelect = (name: string) => {
    const stop = busStops?.find((x) => x.name === name);
    if (!stop) return;
    if (selected === stop) return;
    setSelected(stop);
  };

  const handleEdit = (id: number) => {
    const stop = busStops?.find((x) => x.id === id);
    if (!stop) return;
    setEditing(stop);
  };

  const handleShowSchedule = (id: number) => {
    const stop = busStops?.find((x) => x.id === id);
    if (!stop) return;
    setShowSchedule(stop);
  };

  const handleDelete = (id: number) => {
    deleteBusStop(id, {
      onSuccess: () => {
        trpcContext.busStop.invalidate();
      },
    });
  };

  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid item md={3} height="100%">
        <List
          title="Przystanki"
          isLoading={isLoading}
          options={busStops?.map((busStop) => busStop.name)}
          items={busStops?.map((busStop, key) => ({
            filterBy: busStop.name,
            component: (
              <BusStopCard
                key={key}
                busStop={busStop}
                selected={selected === busStop}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onShowSchedule={handleShowSchedule}
                onDelete={handleDelete}
              />
            ),
          }))}
        />
      </Grid>

      <Grid item sm>
        <MapContainer
          scrollWhell
          busStops={busStops}
          selectedBusStop={selected}
          zoom={selected ? 16 : undefined}
          center={selected ? [selected.gpsX, selected.gpsY] : undefined}
          onBusStopSelect={handleSelect}
          deps={[selected]}
          actionGroup={
            <Button
              variant="contained"
              color="success"
              onClick={() => setIsAdding(!isAdding)}
            >
              Nowy
            </Button>
          }
        />
      </Grid>

      {isAdding && <NewBusStop onClose={() => setIsAdding(false)} />}

      {editing && (
        <NewBusStop onClose={() => setEditing(undefined)} busStop={editing} />
      )}

      {showSchedule && (
        <Schedule
          busStop={showSchedule}
          onClose={() => setShowSchedule(undefined)}
        />
      )}
    </Grid>
  );
};

export default BusStops;
