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
  monday: 'bg-blue-500',
  tuesday: 'bg-green-500',
  wednesday: 'bg-yellow-500',
  thursday: 'bg-orange-500',
  friday: 'bg-red-500',
  saturday: 'bg-purple-500',
  sunday: 'bg-pink-500',
};
