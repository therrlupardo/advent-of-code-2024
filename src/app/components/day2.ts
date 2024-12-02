import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractDay } from './abstract-day';
import { map, min, Observable, of, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'aoc-day-2',
  standalone: true,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Day2Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(2);
    this.firstTaskSolved.set(false);
    this.secondTaskSolved.set(false);
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
          .map((row) => {
            if (row[0] === row[1]) {
              return false;
            }
            const sortingDirection = row[0] < row[1] ? 1 : -1;
            for (let i = 0; i < row.length - 1; i++) {
              const currentOrder = row[i] < row[i + 1] ? 1 : -1;
              if (currentOrder !== sortingDirection) {
                return false;
              }
              const diff = Math.abs(row[i] - row[i + 1]);
              if (diff < 1 || diff > 3) {
                return false;
              }
            }
            return true;
          })
      ),
      map((result) => result.filter(Boolean).length)
    );
  }

  protected secondTask(data: string): Observable<number> {
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
          .map((row) => {
            // console.group('Checking row', row);
            const fullRowCheck = this.checkRowForTask2(row);
            if (fullRowCheck.isSafe) {
              // console.log('Row is SAFE (without any issues)');
              // console.groupEnd();
              return true;
            }
            const wrongIndex = fullRowCheck.wrongIndex;
            const modifiedRowVersionA = row.filter((_, index) => index !== wrongIndex);
            const modifiedRowVersionACheck = this.checkRowForTask2(modifiedRowVersionA);
            // console.log(`Row is ${modifiedRowVersionACheck.isSafe ? 'SAFE' : 'UNSAFE'} (after removing ${wrongIndex})`, modifiedRowVersionA);
            if (modifiedRowVersionACheck.isSafe) {
              // console.groupEnd();
              return true;
            }
            const modifiedRowVersionB = row.filter((_, index) => index !== (wrongIndex ?? 0) + 1);
            const modifiedRowVersionBCheck = this.checkRowForTask2(modifiedRowVersionB);
            // console.log(`Row is ${modifiedRowVersionBCheck.isSafe ? 'SAFE' : 'UNSAFE'} (after removing ${(wrongIndex ?? 0) + 1})`, modifiedRowVersionB);
            if (modifiedRowVersionBCheck.isSafe) {
              // console.groupEnd();
              return true;
            }
            const modifiedRowVersionC = row.filter((_, index) => index !== (wrongIndex ?? 0) - 1);
            const modifiedRowVersionCCheck = this.checkRowForTask2(modifiedRowVersionC);
            // console.log(`Row is ${modifiedRowVersionCCheck.isSafe ? 'SAFE' : 'UNSAFE'} (after removing ${(wrongIndex ?? 0) - 1})`, modifiedRowVersionC);
            // console.groupEnd();
            return modifiedRowVersionCCheck.isSafe;
          })
      ),
      map((result) => result.filter(Boolean).length)
    );
  }

  private checkRowForTask2(row: number[]): { isSafe: boolean, wrongIndex?: number} {
    const sortingDirection = row[0] < row[1] ? 1 : -1;
    for (let i = 0; i < row.length - 1; i++) {
      const currentOrder = row[i] < row[i + 1] ? 1 : -1;
      if (currentOrder !== sortingDirection) {
        // console.log('Row is UNSAFE (sorting direction issue)', row);
        return { isSafe: false, wrongIndex: i };
      }
      const diff = Math.abs(row[i] - row[i + 1]);
      if (diff < 1 || diff > 3) {
        // console.log('Row is UNSAFE (diff issue)', row);
        return { isSafe: false, wrongIndex: i };
      }
    }
    // console.log('Row is SAFE (without any issues)', row);
    return {isSafe: true};
  }


}
