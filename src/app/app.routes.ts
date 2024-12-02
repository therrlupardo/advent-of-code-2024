import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/calendar.component').then(m => m.CalendarComponent)
  },
  {
    title: 'Advent of Code 2024 - Day 1',
    path: 'day/1',
    loadComponent: () => import('./components/day1').then(m => m.Day1Component)
  },
  {
    title: 'Advent of Code 2024 - Day 2',
    path: 'day/2',
    loadComponent: () => import('./components/day2').then(m => m.Day2Component)
  }
];
