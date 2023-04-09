import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import List from "components/List";

const SelectDialog = ({
  title,
  options,
  onSelect,
  onClose,
}: {
  title: string;
  options: {
    id: number;
    name: string;
    disabled?: boolean;
  }[];
  onSelect: (id: number) => void;
  onClose: () => void;
}) => {
  return (
    <Dialog open maxWidth="sm" fullWidth onClose={onClose}>
      <Stack
        direction="column"
        spacing={2}
        p={2}
        height={"90vh"}
        overflow="hidden"
      >
        <List
          title={title}
          flexGrow
          options={options.map((item) => item.name)}
          items={options.map((item, key) => ({
            filterBy: item.name,
            component: (
              <Stack
                key={key}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  mb: 2,
                  p: 1,
                  background: (theme) =>
                    item.disabled
                      ? theme.gradient.selected
                      : theme.gradient.primary,
                  "&:hover": {
                    background: (theme) =>
                      item.disabled ? "" : theme.gradient.hover,
                  },
                }}
              >
                <Typography color={item.disabled ? "text.disabled" : "inherit"}>
                  {item.name}
                </Typography>

                <Button
                  variant="contained"
                  color="success"
                  disabled={item.disabled}
                  onClick={() => onSelect(item.id)}
                >
                  Wybierz
                </Button>
              </Stack>
            ),
          }))}
        />

        <Button
          variant="contained"
          color="error"
          onClick={onClose}
          sx={{ alignSelf: "flex-end" }}
        >
          Zamknij
        </Button>
      </Stack>
    </Dialog>
  );
};

export default SelectDialog;
