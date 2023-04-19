import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { Info } from "@prisma/client";

const NewInfo = ({
  info,
  onEdit,
  onAdd,
  onClose,
}: {
  info?: Info;
  onEdit: (info: Info) => void;
  onAdd: (info: Omit<Info, "id">) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(info?.title || "");
  const [content, setContent] = useState(info?.content || "");

  const handleSave = () => {
    info ? onEdit({ ...info, title, content }) : onAdd({ title, content });
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth onClose={onClose}>
      <Stack direction="column" p={2} borderRadius={5} spacing={2}>
        <Typography variant="h5" textAlign="center">
          {info ? "Edycja Informacji" : "Dodawanie Informacji"}
        </Typography>

        <TextField
          label="Tytul"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Zawartosc"
          required
          multiline
          minRows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
export default NewInfo;
