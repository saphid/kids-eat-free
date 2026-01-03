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

export const dayColors: Record<DayOfWeek, string> = {
  monday: 'bg-monday',
  tuesday: 'bg-tuesday',
  wednesday: 'bg-wednesday',
  thursday: 'bg-thursday',
  friday: 'bg-friday',
  saturday: 'bg-saturday',
  sunday: 'bg-sunday',
};
