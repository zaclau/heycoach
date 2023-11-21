import React from 'react';
import { useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function CalendarPicker() {
  const [value, setValue] = useState();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
      </div>
    </LocalizationProvider>
  );
}