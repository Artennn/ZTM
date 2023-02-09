import { useState } from "react";
import { trpc } from "utils/trpc";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useMapContainer } from "components/Misc";

import type { BusStop } from "@prisma/client";

const NewBusStop = ({
  busStop,
  onClose,
}: {
  busStop?: BusStop;
  onClose: () => void;
}) => {
  const trpcContext = trpc.useContext();
  const { data: busStops } = trpc.busStop.get.useQuery();
  const { mutate: addBusStop } = trpc.busStop.add.useMutation();
  const { mutate: editBusStop } = trpc.busStop.edit.useMutation();

  const [editing, setEditing] = useState<BusStop | undefined>(busStop);
  const [name, setName] = useState(editing?.name || "");
  const [GPS, setGPS] = useState<[number, number] | undefined>(
    editing ? [editing.gpsX, editing.gpsY] : undefined
  );

  const Map = useMapContainer([editing]);

  const handleSelected = (name: string) => {
    const selected = busStops?.find((x) => x.name === name);
    if (!selected) return;
    setEditing(selected);
    setName(selected.name);
    setGPS([selected.gpsX, selected.gpsY]);
  };

  const handleSave = () => {
    if (!GPS) return;

    const onSuccess = () => {
      setName("");
      setGPS(undefined);
      trpcContext.busStop.invalidate();
      busStop && onClose();
    };

    const data = {
      name,
      gpsX: GPS[0],
      gpsY: GPS[1],
    };

    if (editing) {
      return editBusStop({ ...data, id: editing.id }, { onSuccess: onSuccess });
    }
    addBusStop(data, { onSuccess: onSuccess });
  };

  const handleSelectPos = (pGPS: [number, number]) => {
    setGPS(pGPS);
  };

  return (
    <Dialog open={true} maxWidth="lg" onClose={onClose}>
      <Stack direction="column" p={2} borderRadius={5} spacing={2}>
        <Typography variant="h5" textAlign="center">
          {editing ? "Edycja Przystanku" : "Dodawanie Przystanku"}
        </Typography>

        <Box width={750} height={500}>
          <Map
            scrollWhell
            zoom={editing ? 17 : undefined}
            center={editing ? GPS : undefined}
            onBusStopSelect={handleSelected}
            busStops={busStops?.filter((x) => x.id !== editing?.id)}
            selectedPos={GPS}
            onClick={handleSelectPos}
          />
        </Box>

        <Typography>
          Wspolrzedne: {GPS && `${GPS[0].toFixed(5)} ${GPS[1].toFixed(5)}`}
        </Typography>

        <TextField
          label="Nazwa"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="error" onClick={onClose}>
            Anuluj
          </Button>
          <Button variant="contained" color="success" onClick={handleSave}>
            Zapisz
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
export default NewBusStop;
