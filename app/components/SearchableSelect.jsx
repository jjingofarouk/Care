"use client";

import React from 'react';
import { Autocomplete, TextField, InputLabel, FormControl } from '@mui/material';

export default function SearchableSelect({
  label,
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
  required,
  sx,
}) {
  return (
    <FormControl fullWidth margin="normal" sx={sx}>
      <InputLabel>{label}</InputLabel>
      <Autocomplete
        options={options}
        getOptionLabel={(option) =>
          getOptionLabel ? getOptionLabel(option) : option?.user?.name || option?.id || 'Unknown'
        }
        value={options.find((option) => getOptionValue(option) === value) || null}
        onChange={(event, newValue) => onChange(newValue ? getOptionValue(newValue) : '')}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" required={required} />
        )}
        isOptionEqualToValue={(option, selected) => getOptionValue(option) === getOptionValue(selected)}
      />
    </FormControl>
  );
}