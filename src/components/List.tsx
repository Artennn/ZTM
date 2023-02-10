import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import SearchIcon from "@mui/icons-material/Search";

import { useState, type ReactNode } from "react";
import type { SxProps } from "@mui/material";

const List = ({
  title,
  isLoading,
  options,
  items = [],
  actionGroup,
  noAutoFocus: noFocus,
  flexGrow,
  minWidth,
  sx,
}: {
  title: string;
  isLoading?: boolean;
  options?: string[];
  items?: {
    filterBy: string;
    component: JSX.Element;
  }[];
  actionGroup?: ReactNode;
  noAutoFocus?: boolean;
  flexGrow?: boolean;
  minWidth?: string;
  sx?: SxProps;
}) => {
  const [value, setValue] = useState("");

  const displayItems = items.filter(({ filterBy }) =>
    filterBy.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <Stack
      sx={{
        p: 1,
        height: 1,
        minWidth: minWidth || "18rem",
        border: (theme) => theme.border.primary,
        ...(flexGrow && { height: 0, flexGrow: 1 }),
        ...sx,
      }}
    >
      <Typography variant="h5" textAlign="center">
        {title}
      </Typography>

      {options && (
        <Autocomplete
          freeSolo
          options={options}
          inputValue={value}
          onInputChange={(_, newValue) => setValue(newValue)}
          sx={{ pl: 1, pr: 1 }}
          renderInput={(params) => (
            <TextField
              label="Szukaj"
              autoFocus={!noFocus}
              variant="standard"
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      )}

      <Stack direction="column" sx={{ overflowY: "auto", height: 1, mt: 1.5 }}>
        {isLoading && (
          <Box alignSelf="center" mt={3}>
            <CircularProgress size={60} />
          </Box>
        )}
        {displayItems.map(({ component }) => component)}
      </Stack>

      <Box mt="auto" pt={1} width={1} textAlign="center">
        {actionGroup}
      </Box>
    </Stack>
  );
};

export default List;
