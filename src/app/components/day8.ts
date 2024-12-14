import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AbstractDay } from './abstract-day';
import { map, Observable, of, tap } from 'rxjs';
import { Button } from 'primeng/button';

@Component({
  selector: 'aoc-day-8',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe, Button],
})
export class Day8Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(8);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    let entryMap: string[][]=[];
    return of(data).pipe(
      map(data => data.split('\n')
        .filter(Boolean)
        .map(line => line.split('').filter(Boolean))),
      tap(data => entryMap = structuredClone(data)),
      map(data => {
        const result: Record<string, {x: number, y: number}[]> = {};
        for (let y = 0; y < data.length; y++) {
          for (let x = 0; x < data[y].length; x++) {
            const entry = data[y][x];
            if (result[entry] === undefined) {
              result[entry] = [];
            }
            result[entry].push({x, y});
          }
        }
        return result;
      }),
      map((data: Record<string, {x: number, y: number}[]>) => {
        const result: {x: number, y: number}[] = [];
        Object.keys(data).filter(key => key !== '.')
          .map(key => {
            const entries = data[key];
            if (entries.length <= 1) {
              return;
            }
            for (let x = 0; x < entries.length; x++) {
              for (let y = x + 1; y < entries.length; y++) {
                const xDiff = entries[x].x - entries[y].x;
                const yDiff = entries[x].y - entries[y].y;
                const firstPoint = { x: entries[x].x + xDiff, y: entries[x].y + yDiff };
                const secondPoint = { x: entries[y].x - xDiff, y: entries[y].y - yDiff };
                if (firstPoint.x >= 0 && firstPoint.x < entryMap[0].length && firstPoint.y >= 0 && firstPoint.y < entryMap.length) {
                  result.push(firstPoint);
                }
                if (secondPoint.x >= 0 && secondPoint.x < entryMap[0].length && secondPoint.y >= 0 && secondPoint.y < entryMap.length) {
                  result.push(secondPoint);
                }
              }
            }
          });
        result.forEach(entry => {
          const currentMapEntry = entryMap[entry.y][entry.x];
          if (currentMapEntry === '.') {
            entryMap[entry.y][entry.x] = '#';
          }
        })
        // this.printMap(entryMap);
        return result;
      }),
      map(data => new Set(data.map(entry => `${entry.x}:${entry.y}`))),
      // tap(console.debug),
      map(data => data.size)
    );
  }

  private printMap(map: string[][]): void {
    console.debug(map.map(line => line.join('')).join('\n'));
  }

  protected secondTask(data: string): Observable<number> {
    let entryMap: string[][]=[];
    return of(data).pipe(
      map(data => data.split('\n')
        .filter(Boolean)
        .map(line => line.split('').filter(Boolean))),
      tap(data => entryMap = structuredClone(data)),
      map(data => {
        const result: Record<string, {x: number, y: number}[]> = {};
        for (let y = 0; y < data.length; y++) {
          for (let x = 0; x < data[y].length; x++) {
            const entry = data[y][x];
            if (result[entry] === undefined) {
              result[entry] = [];
            }
            result[entry].push({x, y});
          }
        }
        return result;
      }),
      map((data: Record<string, {x: number, y: number}[]>) => {
        const result: {x: number, y: number}[] = [];
        Object.keys(data).filter(key => key !== '.')
          .map(key => {
            const entries = data[key];
            if (entries.length <= 1) {
              return;
            }
            for (let x = 0; x < entries.length; x++) {
              for (let y = x + 1; y < entries.length; y++) {
                const xDiff = entries[x].x - entries[y].x;
                const yDiff = entries[x].y - entries[y].y;
                let multiplier = 0;
                let point: {x: number, y: number} = { x: entries[x].x + xDiff * multiplier, y: entries[x].y + yDiff * multiplier};
                // console.debug(`Checking initial point ${point.x}:${point.y}`);
                while(point.x >= 0 && point.x < entryMap[0].length && point.y >= 0 && point.y < entryMap.length) {
                  result.push(point);
                  multiplier--;
                  point = { x: entries[x].x + xDiff * multiplier, y: entries[x].y + yDiff * multiplier};
                  // console.debug(`Checking point ${point.x}:${point.y}`);
                }
                multiplier = 0;
                // console.debug(`Checking initial point ${point.x}:${point.y}`);
                point = { x: entries[x].x + xDiff * multiplier, y: entries[x].y + yDiff * multiplier};
                while(point.x >= 0 && point.x < entryMap[0].length && point.y >= 0 && point.y < entryMap.length) {
                  result.push(point);
                  multiplier++;
                  point = { x: entries[x].x + xDiff * multiplier, y: entries[x].y + yDiff * multiplier};
                  // console.debug(`Checking point ${point.x}:${point.y}`);
                }
              }
            }
          });
        result.forEach(entry => {
          const currentMapEntry = entryMap[entry.y][entry.x];
          if (currentMapEntry === '.') {
            entryMap[entry.y][entry.x] = '#';
          }
        })
        // this.printMap(entryMap);
        return result;
      }),
      map(data => new Set(data.map(entry => `${entry.x}:${entry.y}`))),
      // tap(console.debug),
      map(data => data.size)
    );
  }

}
