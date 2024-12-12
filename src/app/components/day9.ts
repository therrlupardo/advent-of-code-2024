import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AbstractDay } from './abstract-day';
import { map, Observable, of, tap } from 'rxjs';

const EMPTY_SPACE = '.';

@Component({
  selector: 'aoc-day-9',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe],
})
export class Day9Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(9);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => {
        let result: string[] = [];
        let currentId = 0;
        data.split('').map(x => parseInt(x))
          .forEach((sign, index) => {
            if(index % 2 !== 0) {
              result = result.concat(Array.from({length: sign}).map(x => EMPTY_SPACE));
            } else {
              result = result.concat(Array.from({length: sign}).map(x => `${currentId}`));
              currentId++;
            }
          })
        return result;
      }),
      map(data => {
        for (let i = data.length - 1; i>=0; i--) {
          if (data[i] === EMPTY_SPACE) {
            continue;
          }
          const movedId = data[i];
          for (let j = 0; j <= i; j++) {
            if (data[j] === EMPTY_SPACE) {
              data[j] = movedId;
              data[i] = EMPTY_SPACE;
              break;
            }
          }
        }
        return data;
      }),
      // tap(data => console.debug(data.join(''))),
      map(data => {
        let checksum = 0;
        data.forEach((value, index) => {
          if (value === EMPTY_SPACE) {
            return;
          }
          checksum += index * parseInt(value);
        });
        return checksum;
      }),
      // tap(console.debug)
    );
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => {
        let result: string[] = [];
        let currentId = 0;
        data.split('').map(x => parseInt(x))
          .forEach((sign, index) => {
            if(index % 2 !== 0) {
              result = result.concat(Array.from({length: sign}).map(x => EMPTY_SPACE));
            } else {
              result = result.concat(Array.from({length: sign}).map(x => `${currentId}`));
              currentId++;
            }
          })
        return result;
      }),
      // tap(console.debug),
      map((data: string[]) => {
        // console.debug(data.join(''))
        for (let i = data.length - 1; i>=0; i--) {
          if (data[i] === EMPTY_SPACE) {
            continue;
          }
          const movedId = data[i];
          const blockSize = data.filter(x => x === movedId).length;
          for (let j = 0; j <= i; j++) {
            if (data[j] === EMPTY_SPACE) {
              let hasEnoughSpace = true;
              for (let k = 0; k<blockSize; k++) {
                if (data[j+k] !== EMPTY_SPACE) {
                  hasEnoughSpace = false;
                  break;
                }
              }
              if (hasEnoughSpace) {
                for (let k = 0; k<blockSize; k++) {
                  data[j+k] = movedId;
                  data[i - k] = EMPTY_SPACE;
                }
                // console.debug(data.join(''))
                break;
              }
            }
          }
        }
        return data;
      }),
      // tap(data => console.debug(data.join(''))),
      map(data => {
        let checksum = 0;
        data.forEach((value, index) => {
          if (value === EMPTY_SPACE) {
            return;
          }
          checksum += index * parseInt(value);
        });
        return checksum;
      }),
      // tap(console.debug),
      // map(() => 0)
    );
  }


}
