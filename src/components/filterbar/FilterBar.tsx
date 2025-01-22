import React, { useState } from "react";
import dayjs from "dayjs";
import { TextField, MenuItem, Button, Grid } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {MenuItemProps} from "../../type/Api";
interface FilterBarProps {
  onFilter: (filters: { date?: string; category?: string }) => void;
}

const options = [
  { value: "all categories", label: "All Categories" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "science", label: "Science" },
  { value: "technology", label: "Technology" },
];


const FilterBar: React.FC<FilterBarProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<{
    date: string;
    category: string;
  }>({
    date: dayjs().subtract(1, "day").format("YYYY-MM-DD"), // default to today's date minus 1
    category: "", // default to "All Categories"
  });

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      setFilters({
        ...filters,
        date: newValue.format("YYYY-MM-DD"), // update the date filter
      });
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      category: event.target.value,
    });
  };

  const handleSubmit = () => {
    onFilter(filters); // Pass the filters to the parent
  };

  return (
    <Grid
    container
    spacing={2}
    direction="row"
    justifyContent="center"
    alignItems="center"
  >
    <Grid item xs={12} sm={4} md={4}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            value={dayjs(filters.date)} // Set the current value of the date field
            onChange={handleDateChange}
            slotProps={{ textField: { fullWidth: true,size:"small" } }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Grid>
    <Grid item xs={12} sm={4} md={4}>
      <TextField
        id="category"
        select
        label="Filter by Category"
        value={filters.category || ""}
        size="small"
        fullWidth
        onChange={handleCategoryChange}
        sx={{ minWidth: 200, marginTop: 1 }}
      >
        {options.map((option: MenuItemProps) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
    <Grid item xs={12} sm={4} md={4}>
      <Button variant="contained" color="primary" onClick={handleSubmit}
      sx={{ marginTop: 1 }}
      >
        Filter
      </Button>
    </Grid>
  </Grid>
  
  );
};

export default FilterBar;
