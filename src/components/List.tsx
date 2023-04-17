import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";

import SearchIcon from "@mui/icons-material/Search";

import { useState, type ReactNode, type ReactElement } from "react";
import type { SxProps } from "@mui/material";

const List = ({
  title,
  isLoading,
  autocomplete,
  filters,
  onFilterToggle,
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
  autocomplete?: boolean;
  filters?: {
    key: string;
    enabled: boolean;
    label: string;
    icon: ReactNode;
  }[];
  onFilterToggle?: (key: string) => void;
  options?: string[];
  items?: {
    filterBy: string;
    component: ReactNode;
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

      {autocomplete && (
        <Autocomplete
          freeSolo
          options={options || []}
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

      {filters && (
        <Stack direction="row" mt={1} gap={1} flexWrap="wrap">
          {filters.map((filter) => (
            <Chip
              key={filter.key}
              label={filter.label}
              icon={filter.icon as ReactElement}
              sx={{ opacity: filter.enabled ? 1.0 : 0.6, p: 0.5 }}
              onClick={() => onFilterToggle && onFilterToggle(filter.key)}
            />
          ))}
        </Stack>
      )}

      <Stack direction="column" sx={{ overflowY: "auto", height: 1 }}>
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
