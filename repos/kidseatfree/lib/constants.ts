import { DayOfWeek } from './types';

export const daysOfWeek: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const dayDisplayNames: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export const dayShortNames: Record<DayOfWeek, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export const dayColors: Record<DayOfWeek, string> = {
  monday: 'day-monday',
  tuesday: 'day-tuesday',
  wednesday: 'day-wednesday',
  thursday: 'day-thursday',
  friday: 'day-friday',
  saturday: 'day-saturday',
  sunday: 'day-sunday',
};

export const dayBgColors: Record<DayOfWeek, string> = {
  monday: 'bg-day-monday',
  tuesday: 'bg-day-tuesday',
  wednesday: 'bg-day-wednesday',
  thursday: 'bg-day-thursday',
  friday: 'bg-day-friday',
  saturday: 'bg-day-saturday',
  sunday: 'bg-day-sunday',
};

export const dayTextColors: Record<DayOfWeek, string> = {
  monday: 'text-day-monday',
  tuesday: 'text-day-tuesday',
  wednesday: 'text-day-wednesday',
  thursday: 'text-day-thursday',
  friday: 'text-day-friday',
  saturday: 'text-day-saturday',
  sunday: 'text-day-sunday',
};
