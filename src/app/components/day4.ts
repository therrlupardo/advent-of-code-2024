import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractDay } from './abstract-day';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { map, Observable, of } from 'rxjs';
import { Button } from 'primeng/button';

@Component({
  selector: 'aoc-day-4',
  standalone: true,
  templateUrl: './day.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AsyncPipe, Button],
})
export class Day4Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(4);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => {
        // console.log(data);
        const lettersMatrix = data.split('\n').map((line) => line.split(''));

        const matrixSize = lettersMatrix.length;
        const usedMatrix = Array.from({ length: matrixSize - 1 }, () =>
          Array.from({ length: matrixSize - 1 }, () => '.')
        );
        let result = 0;
        for (let i = 0; i < matrixSize; i++) {
          for (let j = 0; j < matrixSize; j++) {
            if (lettersMatrix[i][j] === 'X') {
              // console.log(`X found at (${i}, ${j})`);
              // check horizontal to the right
              if (j + 3 < matrixSize) {
                if (
                  lettersMatrix[i][j + 1] === 'M' &&
                  lettersMatrix[i][j + 2] === 'A' &&
                  lettersMatrix[i][j + 3] === 'S'
                ) {
                  usedMatrix[i][j] = 'X';
                  usedMatrix[i][j + 1] = 'M';
                  usedMatrix[i][j + 2] = 'A';
                  usedMatrix[i][j + 3] = 'S';
                  result++;
                  // console.log(`Found XMAS (${result}) horizontally to the right at`, i, j);
                }
              }
              // check horizontal to the left
              if (j >= 3) {
                if (
                  lettersMatrix[i][j - 1] === 'M' &&
                  lettersMatrix[i][j - 2] === 'A' &&
                  lettersMatrix[i][j - 3] === 'S'
                ) {
                  usedMatrix[i][j] = 'X';
                  usedMatrix[i][j - 1] = 'M';
                  usedMatrix[i][j - 2] = 'A';
                  usedMatrix[i][j - 3] = 'S';
                  result++;
                  // console.log(`Found XMAS (${result}) horizontally to the left at`, i, j);
                }
              }
              // check vertical down
              if (i + 3 < matrixSize) {
                if (
                  lettersMatrix[i + 1][j] === 'M' &&
                  lettersMatrix[i + 2][j] === 'A' &&
                  lettersMatrix[i + 3][j] === 'S'
                ) {
                  usedMatrix[i][j] = 'X';
                  usedMatrix[i + 1][j] = 'M';
                  usedMatrix[i + 2][j] = 'A';
                  usedMatrix[i + 3][j] = 'S';
                  result++;
                  // console.log(`Found XMAS (${result}) vertically down at`, i, j);
                }
              }
              // check vertical up
              if (i >= 3) {
                if (
                  lettersMatrix[i - 1][j] === 'M' &&
                  lettersMatrix[i - 2][j] === 'A' &&
                  lettersMatrix[i - 3][j] === 'S'
                ) {
                  usedMatrix[i][j] = 'X';
                  usedMatrix[i - 1][j] = 'M';
                  usedMatrix[i - 2][j] = 'A';
                  usedMatrix[i - 3][j] = 'S';
                  result++;
                  // console.log(`Found XMAS (${result}) vertically up at`, i, j);
                }
              }
              // check diagonal down-right
              if (i + 3 < matrixSize && j + 3 < matrixSize) {
                if (
                  lettersMatrix[i + 1][j + 1] === 'M' &&
                  lettersMatrix[i + 2][j + 2] === 'A' &&
                  lettersMatrix[i + 3][j + 3] === 'S'
                ) {
                  usedMatrix[i][j] = 'X';
                  usedMatrix[i + 1][j + 1] = 'M';
                  usedMatrix[i + 2][j + 2] = 'A';
                  usedMatrix[i + 3][j + 3] = 'S';
                  result++;
                  // console.log(`Found XMAS (${result}) diagonally down-right at`, i, j);
                }
              }
              // check diagonal down-left
              if (i + 3 < matrixSize && j >= 3) {
                if (
                  lettersMatrix[i + 1][j - 1] === 'M' &&
                  lettersMatrix[i + 2][j - 2] === 'A' &&
                  lettersMatrix[i + 3][j - 3] === 'S'
                ) {
                  usedMatrix[i][j] = 'X';
                  usedMatrix[i + 1][j - 1] = 'M';
                  usedMatrix[i + 2][j - 2] = 'A';
                  usedMatrix[i + 3][j - 3] = 'S';
                  result++;
                  // console.log(`Found XMAS (${result}) diagonally down-left at`, i, j);
                }
              }
              // check diagonal up-right
              if (i >= 3 && j + 3 < matrixSize) {
                if (
                  lettersMatrix[i - 1][j + 1] === 'M' &&
                  lettersMatrix[i - 2][j + 2] === 'A' &&
                  lettersMatrix[i - 3][j + 3] === 'S'
                ) {
                  usedMatrix[i][j] = 'X';
                  usedMatrix[i - 1][j + 1] = 'M';
                  usedMatrix[i - 2][j + 2] = 'A';
                  usedMatrix[i - 3][j + 3] = 'S';
                  result++;
                  // console.log(`Found XMAS (${result}) diagonally up-right at`, i, j);
                }
              }
              // check diagonal up-left
              if (i >= 3 && j >= 3) {
                if (
                  lettersMatrix[i - 1][j - 1] === 'M' &&
                  lettersMatrix[i - 2][j - 2] === 'A' &&
                  lettersMatrix[i - 3][j - 3] === 'S'
                ) {
                  usedMatrix[i][j] = 'X';
                  usedMatrix[i - 1][j - 1] = 'M';
                  usedMatrix[i - 2][j - 2] = 'A';
                  usedMatrix[i - 3][j - 3] = 'S';
                  result++;
                  // console.log(`Found XMAS (${result}) diagonally up-left at`, i, j);
                }
              }
            }
          }
        }
        // console.log(usedMatrix.map(line => line.join('')).join('\n'));
        return result;
      })
    );
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => {
        // console.log(data);
        const lettersMatrix = data.split('\n').map((line) => line.split(''));

        const matrixSize = lettersMatrix.length;
        const usedMatrix = Array.from({ length: matrixSize - 1 }, () =>
          Array.from({ length: matrixSize - 1 }, () => '.')
        );
        let result = 0;
        for (let i = 1; i < matrixSize - 1; i++) {
          for (let j = 1; j < matrixSize - 1; j++) {
            if (lettersMatrix[i][j] === 'A') {
              // console.log(`A found at (${x}, ${y})`);
              /**
               * Check for:
               * M . M
               * . A .
               * S . S
               */
              if (
                lettersMatrix[i - 1][j - 1] === 'M' &&
                lettersMatrix[i - 1][j + 1] === 'M' &&
                lettersMatrix[i + 1][j - 1] === 'S' &&
                lettersMatrix[i + 1][j + 1] === 'S'
              ) {
                usedMatrix[i][j] = 'A';
                usedMatrix[i - 1][j - 1] = 'M';
                usedMatrix[i - 1][j + 1] = 'M';
                usedMatrix[i + 1][j - 1] = 'S';
                usedMatrix[i + 1][j + 1] = 'S';
                result++;
                // console.log(`Found X-MAS (${result}) at (${i}, ${j})`);
              }
              /**
               * Check for:
               * M . S
               * . A .
               * M . S
               */
              if (
                lettersMatrix[i - 1][j - 1] === 'M' &&
                lettersMatrix[i - 1][j + 1] === 'S' &&
                lettersMatrix[i + 1][j - 1] === 'M' &&
                lettersMatrix[i + 1][j + 1] === 'S'
              ) {
                usedMatrix[i][j] = 'A';
                usedMatrix[i - 1][j - 1] = 'M';
                usedMatrix[i - 1][j + 1] = 'S';
                usedMatrix[i + 1][j - 1] = 'M';
                usedMatrix[i + 1][j + 1] = 'S';
                result++;
                // console.log(`Found X-MAS (${result}) at (${i}, ${j})`);
              }
              /**
               * Check for:
               * S . S
               * . A .
               * M . M
               */
              if (
                lettersMatrix[i - 1][j - 1] === 'S' &&
                lettersMatrix[i - 1][j + 1] === 'S' &&
                lettersMatrix[i + 1][j - 1] === 'M' &&
                lettersMatrix[i + 1][j + 1] === 'M'
              ) {
                usedMatrix[i][j] = 'A';
                usedMatrix[i - 1][j - 1] = 'S';
                usedMatrix[i - 1][j + 1] = 'S';
                usedMatrix[i + 1][j - 1] = 'M';
                usedMatrix[i + 1][j + 1] = 'M';
                result++;
                // console.log(`Found X-MAS (${result}) at (${i}, ${j})`);
              }
              /**
               * Check for:
               * S . M
               * . A .
               * S . M
               */
              if (
                lettersMatrix[i - 1][j - 1] === 'S' &&
                lettersMatrix[i - 1][j + 1] === 'M' &&
                lettersMatrix[i + 1][j - 1] === 'S' &&
                lettersMatrix[i + 1][j + 1] === 'M'
              ) {
                usedMatrix[i][j] = 'A';
                usedMatrix[i - 1][j - 1] = 'S';
                usedMatrix[i - 1][j + 1] = 'M';
                usedMatrix[i + 1][j - 1] = 'S';
                usedMatrix[i + 1][j + 1] = 'M';
                result++;
                // console.log(`Found X-MAS (${result}) at (${i}, ${j})`);
              }
            }
          }
        }
        // console.log(usedMatrix.map(line => line.join('')).join('\n'));
        return result;
      })
    );
  }
}
