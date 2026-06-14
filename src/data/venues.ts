import type { Venue } from '../types/domain';

export const venues: Venue[] = [
  {
    id: 'v_chatswood',
    name: 'Chatswood High School Oval',
    suburb: 'Chatswood',
    weekdays: ['Mon'],
    ageRange: { min: 4, max: 14 },
  },
  {
    id: 'v_mowbray',
    name: 'Mowbray Public School',
    suburb: 'Lane Cove North',
    weekdays: ['Tue'],
    ageRange: { min: 6, max: 12 },
    isNew: true,
  },
  {
    id: 'v_naremburn',
    name: 'Naremburn Park',
    suburb: 'Naremburn',
    weekdays: ['Wed', 'Fri'],
    ageRange: { min: 4, max: 15 },
  },
  {
    id: 'v_wentworth',
    name: 'Wentworth Park Field 4',
    suburb: 'Ultimo',
    weekdays: ['Sat'],
    ageRange: { min: 4, max: 12 },
  },
];

export const venueById = (id?: string) => venues.find((v) => v.id === id);
