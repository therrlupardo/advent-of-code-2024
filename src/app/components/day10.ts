import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AbstractDay } from './abstract-day';
import { map, Observable, of, tap } from 'rxjs';

const TRAIL_START = 0;
const TRAIL_END = 9;

@Component({
  selector: 'aoc-day-10',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe],
})
export class Day10Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(10);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => data.split('\n').filter(Boolean).map(line => line.split('').map(x => parseInt(x)))),
      map(topographicMap => {
        const trailStarts: TopographicPoint[] = [];
        for(let i = 0; i < topographicMap.length; i++) {
          for(let j = 0; j < topographicMap[i].length; j++) {
            if(topographicMap[i][j] === TRAIL_START) {
              trailStarts.push({x: i, y: j});
            }
          }
        }
        return {trailStarts, topographicMap};
      }),
      map(({trailStarts, topographicMap}: {trailStarts: TopographicPoint[], topographicMap: number[][]}) => {
        return trailStarts
          .map((end) => {
            return this.getFullPathsFrom(end, topographicMap)
              .filter((path) => path.length === 10)
              .map((path) => path[0]);
          })
          .map((points) =>
              new Set(points.map((point) => `${point.x}:${point.y}`)).size
          )
          .reduce((acc, value) => acc + value, 0);
      }),
    );
  }

  private getFullPathsFrom(point: TopographicPoint, topographicMap: number[][]): TopographicPoint[][] {
    const nextPoints = this.getPathsFrom(point, topographicMap);

    if (nextPoints.length === 0) {
      return [[point]];
    }

    const paths: TopographicPoint[][] = [];
    nextPoints.forEach(nextPoint => {
      const nextPaths = this.getFullPathsFrom(nextPoint, topographicMap);
      nextPaths.forEach(path => {
        path.push(point);
        paths.push(path);
      });
    });
    return paths;
  }

  private getPathsFrom(currentPoint: TopographicPoint, topographicMap: number[][]): TopographicPoint[] {
    const possibleNextPoints: TopographicPoint[] = [];
    const currentPointValue = topographicMap[currentPoint.x][currentPoint.y];
    if (currentPointValue === TRAIL_END) {
      return [];
    }
    const pointAbove = {x: currentPoint.x - 1, y: currentPoint.y};
    if (this.isPointOnMap(pointAbove, topographicMap) && topographicMap[pointAbove.x][pointAbove.y] === currentPointValue + 1) {
      possibleNextPoints.push(pointAbove);
    }
    const pointBelow = {x: currentPoint.x + 1, y: currentPoint.y};
    if (this.isPointOnMap(pointBelow, topographicMap) && topographicMap[pointBelow.x][pointBelow.y] === currentPointValue + 1) {
      possibleNextPoints.push(pointBelow);
    }
    const pointLeft = {x: currentPoint.x, y: currentPoint.y - 1};
    if (this.isPointOnMap(pointLeft, topographicMap) && topographicMap[pointLeft.x][pointLeft.y] === currentPointValue + 1) {
      possibleNextPoints.push(pointLeft);
    }
    const pointRight = {x: currentPoint.x, y: currentPoint.y + 1};
    if (this.isPointOnMap(pointRight, topographicMap) && topographicMap[pointRight.x][pointRight.y] === currentPointValue + 1) {
      possibleNextPoints.push(pointRight);
    }
    return possibleNextPoints;
  }

  private isPointOnMap(point: TopographicPoint, topographicMap: number[][]): boolean {
    return point.x >= 0 && point.x < topographicMap.length && point.y >= 0 && point.y < topographicMap[0].length;
  }

  private getValuesFromPath(path: TopographicPoint[], topographicMap: number[][]): (TopographicPoint & {value: number})[] {
    return path.map(point => ({...point, value: topographicMap[point.x][point.y]}));
  }

  private printPathMap(path: TopographicPoint[], topographicMap: number[][]): void {
    const pathMap = topographicMap.map(row => row.map(() => '.'));
    path.forEach(point => pathMap[point.x][point.y] = topographicMap[point.x][point.y].toString());
    console.log(pathMap.map(row => row.join('')).join('\n'));
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map(data => data.split('\n').filter(Boolean).map(line => line.split('').map(x => parseInt(x)))),
      map(topographicMap => {
        const trailStarts: TopographicPoint[] = [];
        for(let i = 0; i < topographicMap.length; i++) {
          for(let j = 0; j < topographicMap[i].length; j++) {
            if(topographicMap[i][j] === TRAIL_START) {
              trailStarts.push({x: i, y: j});
            }
          }
        }
        return {trailStarts, topographicMap};
      }),
      map(({trailStarts, topographicMap}: {trailStarts: TopographicPoint[], topographicMap: number[][]}) => {
        return trailStarts
          .map((end) =>
            this.getFullPathsFrom(end, topographicMap)
              .filter((path) => path.length === 10)
          )
          .map(paths => paths.length)
          .reduce((acc, value) => acc + value, 0);
      }),
    );
  }
}

interface TopographicPoint {
  x: number;
  y: number;
}
