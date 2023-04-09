import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";
import Time, { Days } from "utils/time";

import type { BusStop } from "@prisma/client";

import { RouteColors } from "styles/theme";

const Schedule = ({
  busStop,
  onClose,
}: {
  busStop: BusStop;
  onClose: () => void;
}) => {
  const { isLoading, data: routes } = trpc.schedule.getByStop.useQuery(
    busStop.id
  );
  const [selectedRoutes, setSelectedRoutes] = useState<number[]>([]);

  useEffect(() => {
    if (!routes) return;
    setSelectedRoutes(routes.map((route) => route.routeID));
  }, [isLoading]);

  const departures = routes
    ?.filter((route) => selectedRoutes.includes(route.routeID))
    .map((route) =>
      route.departures.map((departure) => ({
        ...departure,
        time: departure.time + route.timeOffset,
        routeName: route.name,
        routeID: route.routeID,
        lineName: route.lineName,
      }))
    )
    .flat(1);

  const handleSelect = (id: number) => {
    if (selectedRoutes.includes(id)) {
      setSelectedRoutes(selectedRoutes.filter((routeID) => routeID !== id));
      return;
    }
    setSelectedRoutes([...selectedRoutes, id]);
  };

  return (
    <Dialog
      open={true}
      maxWidth="lg"
      fullWidth
      sx={{ overflowY: "hidden" }}
      onClose={onClose}
    >
      <Stack direction="column" p={2} height="90vh">
        <Typography variant="h4" textAlign="center">
          {`Rozkład Przystanku ${busStop.name}`}
        </Typography>

        <Stack direction="row" ml={2} spacing={1}>
          {routes?.map((route, key) => (
            <Chip
              key={route.routeID}
              label={`${route.lineName} (${route.name})`}
              clickable
              onClick={() => handleSelect(route.routeID)}
              sx={{
                bgcolor: selectedRoutes.includes(route.routeID)
                  ? RouteColors[key] || "pink"
                  : "grey",
              }}
              /* color={
                selectedRoutes.includes(route.routeID) ? "primary" : "error"
              } */
            />
          ))}
        </Stack>

        <Grid
          container
          border="4px solid grey"
          borderRadius={2}
          m={1}
          height="100%"
          overflow="hidden"
        >
          {Days.map((day, key) => (
            <Grid
              key={key}
              item
              md
              height="100%"
              borderRight={key !== 6 ? "4px solid grey" : "none"}
            >
              <Stack direction="column" height="100%">
                <Typography
                  variant="h5"
                  p={0.5}
                  textAlign="center"
                  borderBottom="4px solid grey"
                >
                  {day}
                </Typography>

                <Stack
                  direction="column"
                  sx={{ overflowY: "auto" }}
                  spacing={1}
                  p={1}
                >
                  {departures
                    ?.filter((entry) => entry.day === key)
                    .sort((a, b) => a.time - b.time)
                    .map((entry, key) => (
                      <div key={key}>
                        <Chip
                          label={`${Time.toDisplay(entry.time)} (${
                            entry.lineName
                          })`}
                          sx={{
                            bgcolor:
                              RouteColors[
                                selectedRoutes.findIndex(
                                  (x) => x === entry.routeID
                                )
                              ] || "pink",
                          }}
                        />
                      </div>
                    ))}
                </Stack>

                {/* <Stack direction="row" marginTop="auto" p={1} pr={0}>
                  <TextField
                    placeholder="hh:mm"
                    size="small"
                    value={newEntries[key]}
                    onChange={(e) =>
                      handleChangeNewEntries(key, e.target.value)
                    }
                  />
                  <IconButton onClick={() => handleAddEntry(key)}>
                    <Add />
                  </IconButton>
                </Stack> */}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={1}>
          {/* <TextField
            size="small"
            placeholder="hh:mm"
            value={newGlobalEntry}
            onChange={(e) => setNewGlobalEntry(e.target.value)}
            sx={{ width: "6rem", mr: 0 }}
          />
          <IconButton onClick={handleAddGlobalEntry}>
            <Add />
          </IconButton> */}

          <Button variant="contained" color="error" onClick={onClose}>
            Zamknij
          </Button>
          {/* <Button
            variant="contained"
            color="success"
            onClick={handleSaveSchedule}
          >
            Zapisz
          </Button> */}
        </Stack>
      </Stack>
    </Dialog>
  );
};
export default Schedule;
