import React, { useMemo, useState } from "react";
import { useRouter } from "next/dist/client/router";
import dynamic from "next/dynamic";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Send";
import ImportExportIcon from "@mui/icons-material/ImportExport";

import { trpc } from "utils/trpc";
import { z } from "zod";

import { RouteColors } from "styles/theme";

export const newLineValidator = z.object({
  name: z.string(),
  routes: z.array(
    z.object({
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
    <>
      <Typography variant="h6" textAlign="center" mb={1}>
        Kierunki:
      </Typography>

      <Stack direction="column" overflow="auto" mb={1}>
        {routes.map((route, key) => (
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
        ))}
      </Stack>

      <Button
        variant="contained"
        color="success"
        onClick={handleAddNewRoute}
        sx={{ mr: "auto", ml: "auto", mt: "auto" }}
      >
        Dodaj kierunek
      </Button>
    </>
  );
};

const NewRoute = ({
  activeRouteID,
  routes,
  setRoutes,
}: {
  activeRouteID: number;
  routes: NewLine["routes"];
  setRoutes: (routes: NewLine["routes"]) => void;
}) => {
  const activeRoute = routes[activeRouteID];

  const handleRemoveBusStop = (name: string) => {
    const updatedRoutes = [...routes];
    const updatedRoute = updatedRoutes[activeRouteID];
    if (!updatedRoute) return;

    updatedRoute.entries = updatedRoute.entries.filter(
      (entry) => entry.busStop.name !== name
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

  return (
    <>
      <Typography variant="h6" textAlign="center" mb={1}>
        Trasa:
      </Typography>

      <Stack direction="column" overflow="auto" mb={1}>
        {activeRoute?.entries?.map((entry, key) => (
          <Paper sx={{ p: 1, mb: 2 }} key={key}>
            <Stack direction="row" spacing="auto">
              <Typography variant="subtitle1">{entry.busStop.name}</Typography>

              <TextField
                variant="standard"
                size="small"
                sx={{ width: "2rem", input: { textAlign: "center" } }}
                value={entry.estimatedTime}
                onChange={(e) => handleChangeEstimatedTime(key, e.target.value)}
              />
            </Stack>

            <Stack direction="row" spacing="auto" marginTop={2}>
              <Button
                variant="contained"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleRemoveBusStop(entry.busStop.name)}
              >
                Usun
              </Button>

              <Button
                variant="contained"
                size="small"
                endIcon={<ImportExportIcon />}
              >
                Przenies
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Button
        variant="contained"
        color="success"
        sx={{ mr: "auto", ml: "auto", mt: "auto" }}
      >
        Wyszukaj przystanek
      </Button>
    </>
  );
};

const LineEditor = () => {
  const router = useRouter();

  const { mutate: saveLine } = trpc.line.add.useMutation();
  const { data: busStops } = trpc.busStop.get.useQuery();

  const [name, setName] = useState<NewLine["name"]>("");
  const [routes, setRoutes] = useState<NewLine["routes"]>([]);

  const [activeRouteID, setActiveRouteID] = useState(0);

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    []
  );

  const handleAddBusStop = (name: string) => {
    const selectedBusStop = busStops?.find((busStop) => busStop.name === name);
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
      name,
      routes,
    };
    if (!newLineValidator.parse(newLine)) return;

    saveLine({
      name,
      routes,
    });
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
            <Typography variant="h6" textAlign="center" m={1}>
              Linia:
            </Typography>

            <TextField
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                pr: 1,
                width: "5rem",
                input: {
                  pr: 1,
                  textAlign: "right",
                  fontSize: "1.5rem",
                },
              }}
            />
          </Stack>

          <Stack
            direction="column"
            sx={{
              p: 1,
              flexGrow: 1,
              height: 0,
              minWidth: "35vmin",
              border: (theme) => theme.border.primary,
            }}
          >
            <NewRoutes
              activeRouteID={activeRouteID}
              routes={routes}
              setRoutes={setRoutes}
              setActiveRouteID={setActiveRouteID}
            />
          </Stack>
        </Stack>
      </Grid>

      <Grid item xs lg="auto" height={{ xs: 0.5, lg: 1.0 }}>
        <Stack
          sx={{
            p: 1,
            height: 1,
            minWidth: "35vmin",
            overflowY: "auto",
            border: (theme) => theme.border.primary,
          }}
        >
          <NewRoute
            activeRouteID={activeRouteID}
            routes={routes}
            setRoutes={setRoutes}
          />
        </Stack>
      </Grid>

      <Grid item xs={12} lg height={{ xs: 0.5, lg: 1.0 }}>
        <Box height="100%" position="relative">
          <Map
            scrollWhell
            busStops={busStops}
            onBusStopSelect={handleAddBusStop}
            routes={routes.map((route, key) => ({
              color: RouteColors[key] || "pink",
              label: route.name || undefined,
              stops: route.entries.map((entry) => entry.busStop),
            }))}
          />

          <Box position="absolute" right={25} bottom={35} zIndex={500}>
            <Stack direction="row" spacing={2}>
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
            </Stack>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
export default LineEditor;
