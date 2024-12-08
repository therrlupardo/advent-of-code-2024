import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AbstractDay } from './abstract-day';
import { map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'aoc-day-7',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe],
})
export class Day7Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(7);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => {
        const records = data.split('\n').filter(Boolean);
        return records.map((record) => {
          const sum = parseInt(record.split(':')[0]);
          const values = record
            .split(':')[1]
            .split(' ')
            .filter(Boolean)
            .map((value) => parseInt(value));
          return { sum, values };
        });
      }),
      map((data: { sum: number; values: number[] }[]) => {
        return data.map((record) => {
          const numberOfSpaces = record.values.length - 1;
          for (let i = 0; i < Math.pow(2, numberOfSpaces); i++) {
            const operations = i
              .toString(2)
              .padStart(numberOfSpaces, '0')
              .replace(/0/g, '+')
              .replace(/1/g, '*');
            const result = record.values.reduce((acc, value, index) => {
              if (index === 0) {
                return acc;
              }
              const operator = operations[index - 1];
              if (operator === '+') {
                return acc + value;
              }
              if (operator === '*') {
                return acc * value;
              }
              return acc;
            }, record.values[0]);
            // const equation = record.values
            //   .map((value, index) => {
            //     if (index < operations.length) {
            //       return `${value} ${operations[index]} `;
            //     }
            //     return `${value}`;
            //   })
            //   .join('');
            // console.debug(`Equation: ${equation} = ${result} and should be ${record.sum}. This is ${result === record.sum ? 'OK': 'NOT OK'}`);
            // console.debug('--------------------------')
            if (result === record.sum) {
              return result;
            }
          }
          return 0;
        });
      }),
      map((data) => data.reduce((acc, value) => acc + value, 0))
    );
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => {
        const records = data.split('\n').filter(Boolean);
        return records.map((record) => {
          const sum = parseInt(record.split(':')[0]);
          const values = record
            .split(':')[1]
            .split(' ')
            .filter(Boolean)
            .map((value) => parseInt(value));
          return { sum, values };
        });
      }),
      map((data: { sum: number; values: number[] }[]) => {
        return data.map((record) => {
          const numberOfSpaces = record.values.length - 1;
          for (let i = 0; i < Math.pow(3, numberOfSpaces); i++) {
            const operations = i
              .toString(3)
              .padStart(numberOfSpaces, '0')
              .replace(/0/g, '+')
              .replace(/1/g, '*')
              .replace(/2/g, '|');
            const result = record.values.reduce((acc, value, index) => {
              if (index === 0) {
                return acc;
              }
              const operator = operations[index - 1];
              if (operator === '+') {
                return acc + value;
              }
              if (operator === '*') {
                return acc * value;
              }
              if (operator === '|') {
                return parseInt(`${acc}${value}`);
              }
              return acc;
            }, record.values[0]);
            if (result === record.sum) {
              const equation = record.values
                .map((value, index) => {
                  if (index < operations.length) {
                    return `${value} ${operations[index]} `;
                  }
                  return `${value}`;
                })
                .join('');
              console.debug(`Equation: ${equation} = ${result} and should be ${record.sum}. This is ${result === record.sum ? 'OK': 'NOT OK'}`);
              return result;
            }
          }
          return 0;
        });
      }),
      map((data) => data.reduce((acc, value) => acc + value, 0))
    );
  }
}
