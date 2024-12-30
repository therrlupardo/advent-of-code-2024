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
  },
  {
    title: 'Advent of Code 2024 - Day 5',
    path: 'day/5',
    loadComponent: () => import('./components/day5').then(m => m.Day5Component)
  },
  {
    title: 'Advent of Code 2024 - Day 6',
    path: 'day/6',
    loadComponent: () => import('./components/day6').then(m => m.Day6Component)
  },
  {
    title: 'Advent of Code 2024 - Day 7',
    path: 'day/7',
    loadComponent: () => import('./components/day7').then(m => m.Day7Component)
  },
  {
    title: 'Advent of Code 2024 - Day 8',
    path: 'day/8',
    loadComponent: () => import('./components/day8').then(m => m.Day8Component)
  },
  {
    title: 'Advent of Code 2024 - Day 9',
    path: 'day/9',
    loadComponent: () => import('./components/day9').then(m => m.Day9Component)
  },
  {
    title: 'Advent of Code 2024 - Day 10',
    path: 'day/10',
    loadComponent: () => import('./components/day10').then(m => m.Day10Component)
  },
  {
    title: 'Advent of Code 2024 - Day 11',
    path: 'day/11',
    loadComponent: () => import('./components/day11').then(m => m.Day11Component)
  },
  {
    title: 'Advent of Code 2024 - Day 12',
    path: 'day/12',
    loadComponent: () => import('./components/day12').then(m => m.Day12Component)
  },
  {
    title: 'Advent of Code 2024 - Day 13',
    path: 'day/13',
    loadComponent: () => import('./components/day13').then(m => m.Day13Component)
  },
  {
    title: 'Advent of Code 2024 - Day 14',
    path: 'day/14',
    loadComponent: () => import('./components/day14').then(m => m.Day14Component)
  },
  {
    title: 'Advent of Code 2024 - Day 15',
    path: 'day/15',
    loadComponent: () => import('./components/day15').then(m => m.Day15Component)
  },
  {
    title: 'Advent of Code 2024 - Day 16',
    path: 'day/16',
    loadComponent: () => import('./components/day16/day16').then(m => m.Day16Component)
  }
];
