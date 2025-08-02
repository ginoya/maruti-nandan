import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '../../utils/cn.js';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  className,
  placeholder = "Select date"
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-sm">
          {label}
        </label>
      )}
      
      <input
        type="date"
        value={value}
        onChange={handleDateChange}
        className="w-full px-md py-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
        placeholder={placeholder}
      />
    </div>
  );
};

export default DatePicker; 