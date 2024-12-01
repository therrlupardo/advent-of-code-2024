import { Component } from '@angular/core';
import { AbstractDay } from './abstract-day';
import { map, Observable, of, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'aoc-day-1',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './day.component.html',
})
export class Day1Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(1);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) =>
        data
          .split('\n')
          .map((row) =>
            row
              .split(' ')
              .filter((value) => value !== '')
              .map((value) => parseInt(value))
          )
          .filter((row) => row.length > 0)
      ),
      map((data) => {
        const firstList = data.map((row) => row[0]).sort();
        const secondList = data.map((row) => row[1]).sort();
        return data.map((_, index) => Math.abs(firstList[index] - secondList[index]))
          .reduce((acc, value) => acc + value, 0);
      })
    );
  }

  protected secondTask(data: string): Observable<number> {
    console.log(data);
    return of(data).pipe(
      map((data) =>
        data
          .split('\n')
          .map((row) =>
            row
              .split(' ')
              .filter((value) => value !== '')
              .map((value) => parseInt(value))
          )
          .filter((row) => row.length > 0)
      ),
      map((data) => {
        const firstList = data.map((row) => row[0]);
        const secondList = data.map((row) => row[1]);
        return firstList.map(entry => secondList.filter(value => value === entry).length * entry)
          .reduce((acc, value) => acc + value, 0);
      }),
      // tap(console.log),
      // map(() => 0)
    );
  }
}
