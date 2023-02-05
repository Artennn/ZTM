import { useState } from "react";
import { trpc } from "utils/trpc";

import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { Schedule } from "@prisma/client";
import type { Line, NewSchedule } from "types/line";

import Time, { Days } from "utils/time";

const ScheduleEditor = ({
  line,
  schedule,
  onClose,
}: {
  line: Line;
  schedule: Schedule[];
  onClose: () => void;
}) => {
  const trpcContext = trpc.useContext();
  const { mutate: saveSchedule } = trpc.schedule.save.useMutation();

  const [selectedRouteID, setSelectedRouteID] = useState(line.routes[0]?.id);
  const [entries, setEntries] = useState<NewSchedule[]>(schedule);
  const displayedEntries = entries.filter(
    (entry) => entry.routeID === selectedRouteID
  );

  const [newEntries, setNewEntries] = useState<string[]>(Days.map(() => ""));
  const [newGlobalEntry, setNewGlobalEntry] = useState<string>("");

  const handleAddEntry = (entryID: number) => {
    if (!selectedRouteID) return;
    const inputTime = newEntries[entryID];
    if (!inputTime) return;

    const time = Time.toMinutes(inputTime);
    if (!time) return;

    if (
      entries.find(
        (entry) =>
          entry.day === entryID &&
          entry.time === time &&
          entry.routeID === selectedRouteID
      )
    )
      return;

    setEntries([
      ...entries,
      { day: entryID, time: time, routeID: selectedRouteID },
    ]);
    handleChangeNewEntries(entryID, "");
  };

  const handleAddGlobalEntry = () => {
    if (!selectedRouteID) return;
    const time = Time.toMinutes(newGlobalEntry);
    if (!time) return;

    const added = Days.map((_, key) => ({
      day: key,
      time: time,
      routeID: selectedRouteID,
    }));
    setEntries([...entries, ...added]);
  };

  const handleDeleteEntry = (entry: Partial<Schedule>) => {
    setEntries(
      entries.filter(
        (x) =>
          !(
            x.day === entry.day &&
            x.time == entry.time &&
            x.routeID === selectedRouteID
          )
      )
    );
  };

  const handleChangeNewEntries = (entryID: number, value: string) => {
    if (value.length > 5) return;
    if (value.length > 2 && value.charAt(2) !== ":") {
      value = value.slice(0, 2) + ":" + value.slice(2);
    }

    const updated = [...newEntries];
    updated[entryID] = value;
    setNewEntries(updated);
  };

  const handleSaveSchedule = () => {
    saveSchedule(
      {
        lineID: line.id,
        schedule: entries,
      },
      {
        onSuccess: async () => {
          const hey = await trpcContext.schedule.getByLine.fetch(line.id);
          setEntries(hey);
        },
      }
    );
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
          {`Rozkład linii ${line.name}`}
        </Typography>

        <Tabs
          value={selectedRouteID}
          onChange={(e, v) => setSelectedRouteID(v)}
        >
          {line.routes.map((route, key) => (
            <Tab key={key} value={route.id} label={`Kierunek ${route.name}`} />
          ))}
        </Tabs>

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
              item
              md
              height="100%"
              key={key}
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
                  {displayedEntries
                    .filter((entry) => entry.day === key)
                    .sort((a, b) => a.time - b.time)
                    .map((entry, key) => (
                      <div key={key}>
                        <Chip
                          key={key}
                          label={Time.toDisplay(entry.time)}
                          color={entry.id ? "success" : "primary"}
                          onDelete={() => handleDeleteEntry(entry)}
                        />
                      </div>
                    ))}
                </Stack>

                <Stack direction="row" marginTop="auto" p={1} pr={0}>
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
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={1}>
          <TextField
            size="small"
            placeholder="hh:mm"
            value={newGlobalEntry}
            onChange={(e) => setNewGlobalEntry(e.target.value)}
            sx={{ width: "6rem", mr: 0 }}
          />
          <IconButton onClick={handleAddGlobalEntry}>
            <Add />
          </IconButton>

          <Button variant="contained" color="error" onClick={onClose}>
            Anuluj
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSaveSchedule}
          >
            Zapisz
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
export default ScheduleEditor;
