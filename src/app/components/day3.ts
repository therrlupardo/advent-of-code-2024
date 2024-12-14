import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractDay } from './abstract-day';
import { map, Observable, of } from 'rxjs';
import { Button } from 'primeng/button';

@Component({
  selector: 'aoc-day-3',
  standalone: true,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe, Button],
})
export class Day3Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(3);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }
  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => {
        const regexp = /mul\(\d+,\d+\)/g;
        const entries = [...data.matchAll(regexp)].map((match) =>
          match[0].split('mul(')[1].split(')')[0].split(',')
        );
        return entries
          .map(([a, b]) => parseInt(a) * parseInt(b))
          .reduce((acc, value) => acc + value, 0);
      })
    );
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => {
        const regexp = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g;
        const entries = [...data.matchAll(regexp)].map(match => match[0]);
        let include = true;
        const finalEntries: string[] = [];
        entries.forEach(entry => {
          if (entry === 'do()') {
            include = true;
            return;
          }
          if (entry === 'don\'t()') {
            include = false;
            return
          }
          if (include) {
            finalEntries.push(entry);
          }
        });
        return finalEntries.map(entry => entry.split('mul(')[1].split(')')[0].split(','))
          .map(([a, b]) => parseInt(a) * parseInt(b))
          .reduce((acc, value) => acc + value, 0);
      })
    );
  }
}
