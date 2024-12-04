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
  },
  {
    title: 'Advent of Code 2024 - Day 3',
    path: 'day/3',
    loadComponent: () => import('./components/day3').then(m => m.Day3Component)
  },
  {
    title: 'Advent of Code 2024 - Day 4',
    path: 'day/4',
    loadComponent: () => import('./components/day4').then(m => m.Day4Component)
  }
];
