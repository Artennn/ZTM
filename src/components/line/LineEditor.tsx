import React, { useState } from "react";
import { useRouter } from "next/dist/client/router";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Send";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { trpc } from "utils/trpc";
import { z } from "zod";

import { RouteColors } from "styles/theme";
import List from "components/List";
import { MapContainer } from "components/Misc";
import SelectDialog from "components/dialogs/Select";

import type { FullLine } from "types/line";

export const newLineValidator = z.object({
  id: z.number().optional(),
  name: z.string(),
  routes: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string(),
      entries: z.array(
        z.object({
          estimatedTime: z.number(),
          busStop: z.object({
            id: z.number(),
            name: z.string(),
            gpsX: z.number(),
            gpsY: z.number(),
          }),
        })
      ),
    })
  ),
});

export type NewLine = z.infer<typeof newLineValidator>;

const NewRoutes = ({
  activeRouteID,
  routes,
  setRoutes,
  setActiveRouteID,
}: {
  activeRouteID: number;
  routes: NewLine["routes"];
  setRoutes: (pRoutes: NewLine["routes"]) => void;
  setActiveRouteID: (id: number) => void;
}) => {
  const handleAddNewRoute = () => {
    setRoutes([
      ...routes,
      {
        name: "",
        entries: [],
      },
    ]);
  };

  const handleDeleteRoute = (id: number) => {
    const updatedRoutes = [...routes];
    updatedRoutes.splice(id, 1);
    setRoutes(updatedRoutes);
  };

  const handleChangeRouteName = (routeKey: number, newValue: string) => {
    const updatedRoutes = [...routes];
    const updatedRoute = updatedRoutes[routeKey];
    if (!updatedRoute) return;
    updatedRoute.name = newValue;
    setRoutes(updatedRoutes);
  };

  return (
    <List
      title="Kierunki"
      flexGrow
      items={routes.map((route, key) => ({
        filterBy: route.name,
        component: (
          <Paper
            key={key}
            sx={{
              p: 1,
              mb: 2,
              background:
                activeRouteID === key
                  ? (theme) => theme.gradient.selected
                  : (theme) => theme.gradient.primary,
            }}
          >
            <TextField
              variant="standard"
              placeholder="Kierunek"
              value={route.name}
              onChange={(e) => handleChangeRouteName(key, e.target.value)}
              sx={{ width: "80%", minWidth: "13rem" }}
            />

            <Stack direction="row" spacing="auto" marginTop={2}>
              <Button
                variant="contained"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteRoute(key)}
              >
                Usun
              </Button>

              <Button
                variant="contained"
                size="small"
                endIcon={<EditIcon />}
                onClick={() => setActiveRouteID(key)}
              >
                Edytuj
              </Button>
            </Stack>
          </Paper>
        ),
      }))}
      actionGroup={
        <Button variant="contained" color="success" onClick={handleAddNewRoute}>
          Dodaj kierunek
        </Button>
      }
    />
  );
};

const NewRoute = ({
  activeRouteID,
  routes,
  setRoutes,
  onSelect,
}: {
  activeRouteID: number;
  routes: NewLine["routes"];
  setRoutes: (routes: NewLine["routes"]) => void;
  onSelect: (id: number) => void;
}) => {
  const activeRoute = routes[activeRouteID];
  const [selecting, setSelecting] = useState(false);

  const { data: busStops } = trpc.busStop.get.useQuery();

  const handleRemoveBusStop = (id: number) => {
    const updatedRoutes = [...routes];
    const updatedRoute = updatedRoutes[activeRouteID];
    if (!updatedRoute) return;

    updatedRoute.entries = updatedRoute.entries.filter(
      (entry) => entry.busStop.id !== id
    );
    setRoutes(updatedRoutes);
  };

  const handleChangeEstimatedTime = (entryID: number, value: string) => {
    const updatedRoutes = [...routes];
    const updatedEntry = updatedRoutes[activeRouteID]?.entries[entryID];
    if (!updatedEntry) return;
    const newValue = parseInt(value);
    if (!newValue) return;

    updatedEntry.estimatedTime = newValue;
    setRoutes(updatedRoutes);
  };

  const handleChangeOrder = (entryID: number, reverse: boolean) => {
    const updatedRoutes = [...routes];
    const updatedEntries = updatedRoutes[activeRouteID]?.entries;
    if (!updatedEntries) return;

    const swapWithID = reverse ? entryID - 1 : entryID + 1;

    // first => last
    if (swapWithID < 0) {
      const entry = updatedEntries.shift();
      if (!entry) return;
      updatedEntries.push(entry);
      setRoutes(updatedRoutes);
      return;
    }

    // last => first
    if (swapWithID > updatedEntries.length - 1) {
      const entry = updatedEntries.pop();
      if (!entry) return;
      updatedEntries.unshift(entry);
      setRoutes(updatedRoutes);
      return;
    }

    // swap
    const entry = updatedEntries[entryID];
    const swapWith = updatedEntries[swapWithID];
    if (!entry || !swapWith) return;

    [updatedEntries[entryID], updatedEntries[swapWithID]] = [swapWith, entry];
    setRoutes(updatedRoutes);
  };

  return (
    <>
      <List
        title="Trasa"
        noAutoFocus
        autocomplete
        options={activeRoute?.entries.map((entry) => entry.busStop.name) || []}
        items={activeRoute?.entries.map((entry, key) => ({
          filterBy: entry.busStop.name,
          component: (
            <Paper key={key} sx={{ p: 1, mb: 2 }}>
              <Stack direction="row" spacing="auto">
                <Typography variant="subtitle1">
                  {entry.busStop.name}
                </Typography>

                <TextField
                  variant="standard"
                  size="small"
                  sx={{ width: "2rem", input: { textAlign: "center" } }}
                  value={entry.estimatedTime}
                  onChange={(e) =>
                    handleChangeEstimatedTime(key, e.target.value)
                  }
                />
              </Stack>

              <Stack direction="row" spacing="auto" marginTop={2}>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemoveBusStop(entry.busStop.id)}
                >
                  Usun
                </Button>

                <Stack direction="row">
                  <IconButton onClick={() => handleChangeOrder(key, true)}>
                    <ArrowUpwardIcon />
                  </IconButton>

                  <IconButton onClick={() => handleChangeOrder(key, false)}>
                    <ArrowDownwardIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          ),
        }))}
        actionGroup={
          <Button
            variant="contained"
            color="success"
            onClick={() => setSelecting(true)}
          >
            Dodaj Przystanek
          </Button>
        }
      />

      {selecting ? (
        <SelectDialog
          title="Wybierz Przystanek"
          options={
            busStops?.map((busStop) => ({
              id: busStop.id,
              name: busStop.name,
              disabled: !!activeRoute?.entries.find(
                (entry) => entry.busStop.id === busStop.id
              ),
            })) || []
          }
          onSelect={onSelect}
          onClose={() => setSelecting(false)}
        />
      ) : null}
    </>
  );
};

const LineEditor = ({ line }: { line?: FullLine }) => {
  const router = useRouter();

  const { mutate: addLine } = trpc.line.add.useMutation();
  const { mutate: editLine } = trpc.line.edit.useMutation();
  const { data: busStops } = trpc.busStop.get.useQuery();

  const [name, setName] = useState<string>(line?.name || "");
  const [routes, setRoutes] = useState<NewLine["routes"]>(line?.routes || []);

  const [activeRouteID, setActiveRouteID] = useState(0);

  const handleAddBusStop = (id: number) => {
    const selectedBusStop = busStops?.find((busStop) => busStop.id === id);
    if (!selectedBusStop) return;

    const updatedRoutes = [...routes];
    const updatedRoute = updatedRoutes[activeRouteID];
    if (!updatedRoute) return;

    if (
      updatedRoute.entries.find(
        (entry) => entry.busStop.id === selectedBusStop.id
      )
    )
      return;

    updatedRoute.entries.push({
      estimatedTime: 0,
      busStop: selectedBusStop,
    });
    setRoutes(updatedRoutes);
  };

  const handleSaveLine = () => {
    const newLine: NewLine = {
      id: line?.id,
      name,
      routes,
    };
    if (!newLineValidator.parse(newLine)) return;

    if (!newLine?.id) return addLine(newLine);
    editLine(newLine);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid item xs lg="auto" height={{ xs: 0.5, lg: 1.0 }}>
        <Stack direction="column" height={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            mb={1}
            sx={{
              border: (theme) => theme.border.primary,
            }}
          >
            <Typography variant="h5" textAlign="center" m={1}>
              Linia:
            </Typography>

            <TextField
              autoFocus
              disabled={!!line}
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                pr: 1,
                width: "5rem",
                input: {
                  pr: 1,
                  pb: 0,
                  textAlign: "right",
                  fontSize: "1.7rem",
                },
                ".Mui-disabled": {
                  WebkitTextFillColor: (theme) => theme.palette.text.primary,
                },
              }}
            />
          </Stack>

          <NewRoutes
            activeRouteID={activeRouteID}
            routes={routes}
            setRoutes={setRoutes}
            setActiveRouteID={setActiveRouteID}
          />
        </Stack>
      </Grid>

      <Grid item xs lg="auto" height={{ xs: 0.5, lg: 1.0 }}>
        <NewRoute
          activeRouteID={activeRouteID}
          routes={routes}
          setRoutes={setRoutes}
          onSelect={handleAddBusStop}
        />
      </Grid>

      <Grid item xs={12} lg height={{ xs: 0.5, lg: 1.0 }}>
        <MapContainer
          scrollWhell
          markers={busStops?.map((busStop) => ({
            id: busStop.id,
            text: busStop.name,
            pos: [busStop.gpsX, busStop.gpsY],
          }))}
          onMarkerSelect={handleAddBusStop}
          routes={routes.map((route, key) => ({
            color: RouteColors[key] || "pink",
            label: route.name || undefined,
            stops: route.entries.map((entry) => entry.busStop),
          }))}
          actionGroup={
            <>
              <Button variant="contained" color="error" onClick={handleCancel}>
                Anuluj
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={handleSaveLine}
              >
                Zapisz
              </Button>
            </>
          }
        />
      </Grid>
    </Grid>
  );
};
export default LineEditor;
