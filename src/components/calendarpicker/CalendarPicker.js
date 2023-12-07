import React from 'react';
import { useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';

export default function CalendarPicker({ calendar, setCalendar }) {
  // const [value, setValue] = useState();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <DateTimePicker value={calendar} onChange={(newValue) => setCalendar(newValue)} />
      </div>
    </LocalizationProvider>
  );
}