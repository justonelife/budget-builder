import { SelectOption } from '@shared/data-access/types';

export enum MONTHS_ENUM {
  JANUARY = 'JANUARY',
  FEBRUARY = 'FEBRUARY',
  MARCH = 'MARCH',
  APRIL = 'APRIL',
  MAY = 'MAY',
  JUNE = 'JUNE',
  JULY = 'JULY',
  AUGUST = 'AUGUST',
  SEPTEMBER = 'SEPTEMBER',
  OCTOBER = 'OCTOBER',
  NOVEMBER = 'NOVEMBER',
  DECEMBER = 'DECEMBER',
}

export const MONTHS_OF_YEAR: Record<MONTHS_ENUM, number> = {
  [MONTHS_ENUM.JANUARY]: 1,
  [MONTHS_ENUM.FEBRUARY]: 2,
  [MONTHS_ENUM.MARCH]: 3,
  [MONTHS_ENUM.APRIL]: 4,
  [MONTHS_ENUM.MAY]: 5,
  [MONTHS_ENUM.JUNE]: 6,
  [MONTHS_ENUM.JULY]: 7,
  [MONTHS_ENUM.AUGUST]: 8,
  [MONTHS_ENUM.SEPTEMBER]: 9,
  [MONTHS_ENUM.OCTOBER]: 10,
  [MONTHS_ENUM.NOVEMBER]: 11,
  [MONTHS_ENUM.DECEMBER]: 12,
};

export const MONTHS: SelectOption<number>[] = [
  {
    label: 'January',
    value: MONTHS_OF_YEAR.JANUARY,
  },
  {
    label: 'February',
    value: MONTHS_OF_YEAR.FEBRUARY,
  },
  {
    label: 'March',
    value: MONTHS_OF_YEAR.MARCH,
  },
  {
    label: 'April',
    value: MONTHS_OF_YEAR.APRIL,
  },
  {
    label: 'May',
    value: MONTHS_OF_YEAR.MAY,
  },
  {
    label: 'June',
    value: MONTHS_OF_YEAR.JUNE,
  },
  {
    label: 'July',
    value: MONTHS_OF_YEAR.JULY,
  },
  {
    label: 'August',
    value: MONTHS_OF_YEAR.AUGUST,
  },
  {
    label: 'September',
    value: MONTHS_OF_YEAR.SEPTEMBER,
  },
  {
    label: 'October',
    value: MONTHS_OF_YEAR.OCTOBER,
  },
  {
    label: 'November',
    value: MONTHS_OF_YEAR.NOVEMBER,
  },
  {
    label: 'December',
    value: MONTHS_OF_YEAR.DECEMBER,
  },
] as const;
