import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AbstractDay } from './abstract-day';
import { map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'aoc-day-12',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe],
})
export class Day12Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(12);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) =>
        data
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('').filter((x) => x !== ''))
      ),
      map((gardenMap) => {
        const regions: Record<string, GardenPoint[][]> = {};
        for (let i = 0; i < gardenMap.length; i++) {
          for (let j = 0; j < gardenMap[i].length; j++) {
            const plant = gardenMap[i][j];
            if (regions[plant]) {
              const regionsOfPlant = regions[plant];
              const index = this.findIndexOfRegionForPlant(
                { x: i, y: j },
                regionsOfPlant
              );
              if (index !== -1) {
                regionsOfPlant[index].push({ x: i, y: j });
                regions[plant] = regionsOfPlant;
              } else {
                regions[plant] = [...regionsOfPlant, [{ x: i, y: j }]];
              }
            } else {
              regions[plant] = [[{ x: i, y: j }]];
            }
          }
        }
        return this.mergeRegions(regions);
      }),
      map((regions) => {
        return Object.keys(regions).map((key) => ({
          key,
          regions: regions[key].map((region) => ({
            region,
            area: region.length,
            perimeter: this.calculatePerimeter(region),
            price: region.length * this.calculatePerimeter(region),
          })),
        }));
      }),
      tap(console.debug),
      map(
        (
          regions: {
            key: string;
            regions: {
              region: GardenPoint[];
              area: number;
              perimeter: number;
              price: number;
            }[];
          }[]
        ) =>
          regions.map((region) => ({
            key: region.key,
            totalPrice: region.regions.reduce(
              (acc, value) => acc + value.price,
              0
            ),
            totalArea: region.regions.reduce(
              (acc, value) => acc + value.area,
              0
            ),
            totalPerimeter: region.regions.reduce(
              (acc, value) => acc + value.perimeter,
              0
            ),
          }))
      ),
      tap(console.debug),
      map(
        (
          regions: {
            key: string;
            totalPrice: number;
          }[]
        ) => regions.reduce((acc, value) => acc + value.totalPrice, 0)
      ),
      tap(console.debug)
    );
  }

  private findIndexOfRegionForPlant(
    point: GardenPoint,
    regions: GardenPoint[][]
  ): number {
    return regions.findIndex((region) =>
      region.some((regionPoint) => this.hasNeighbour(point, region))
    );
  }

  private hasNeighbour(point: GardenPoint, region: GardenPoint[]): boolean {
    return region.some((regionPoint) => {
      return this.isNeighbour(point, regionPoint);
    });
  }

  private isNeighbour(regionPoint: GardenPoint, point: GardenPoint): boolean {
    return (
      (regionPoint.x === point.x &&
        (regionPoint.y === point.y + 1 || regionPoint.y === point.y - 1)) ||
      (regionPoint.y === point.y &&
        (regionPoint.x === point.x + 1 || regionPoint.x === point.x - 1))
    );
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      tap((data) => console.debug(data)),
      map((data) =>
        data
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('').filter((x) => x !== ''))
      ),
      map((gardenMap) => {
        const regions: Record<string, GardenPoint[][]> = {};
        for (let i = 0; i < gardenMap.length; i++) {
          for (let j = 0; j < gardenMap[i].length; j++) {
            const plant = gardenMap[i][j];
            if (regions[plant]) {
              const regionsOfPlant = regions[plant];
              const index = this.findIndexOfRegionForPlant(
                { x: i, y: j },
                regionsOfPlant
              );
              if (index !== -1) {
                regionsOfPlant[index].push({ x: i, y: j });
                regions[plant] = regionsOfPlant;
              } else {
                regions[plant] = [...regionsOfPlant, [{ x: i, y: j }]];
              }
            } else {
              regions[plant] = [[{ x: i, y: j }]];
            }
          }
        }
        return this.mergeRegions(regions);
      }),
      map((regions) => {
        return Object.keys(regions).map((key) => ({
          key,
          regions: regions[key].map((region) => ({
            region,
            area: region.length,
            price: region.length * this.calculateSides(region, key),
            sides: this.calculateSides(region, key),
          })),
        }));
      }),
      tap(console.debug),
      map(
        (
          regions: {
            key: string;
            regions: {
              region: GardenPoint[];
              area: number;
              price: number;
              sides: number;
            }[];
          }[]
        ) =>
          regions.map((region) => ({
            key: region.key,
            totalPrice: region.regions.reduce(
              (acc, value) => acc + value.price,
              0
            ),
            totalSides: region.regions.reduce(
              (acc, value) => acc + value.sides,
              0
            ),
            totalArea: region.regions.reduce(
              (acc, value) => acc + value.area,
              0
            ),
          }))
      ),
      tap(console.debug),
      map(
        (
          regions: {
            key: string;
            totalPrice: number;
          }[]
        ) => regions.reduce((acc, value) => acc + value.totalPrice, 0)
      ),
      tap(console.debug)
    );
  }

  private calculatePerimeter(region: GardenPoint[]): number {
    const numberOfAdjacentPoints = region
      .map((point) => {
        return region.filter((regionPoint) =>
          this.isNeighbour(point, regionPoint)
        ).length;
      })
      .reduce((acc, value) => acc + value, 0);
    // console.debug('Number of adjacent points', numberOfAdjacentPoints);
    // console.debug('Region length', region.length);
    // console.debug('Perimeter', region.length * 4 - numberOfAdjacentPoints);
    return region.length * 4 - numberOfAdjacentPoints;
  }

  private mergeRegions(
    regions: Record<string, GardenPoint[][]>
  ): Record<string, GardenPoint[][]> {
    Object.keys(regions).forEach((key) => {
      let sthWasMerged = true;
      while (sthWasMerged) {
        const { regions: merged, merged: mergedSome } =
          this.tryToMergeSomeRegions(regions[key]);
        regions[key] = merged;
        sthWasMerged = mergedSome;
      }
    });
    return regions;
  }

  private tryToMergeSomeRegions(regions: GardenPoint[][]): {
    regions: GardenPoint[][];
    merged: boolean;
  } {
    let mergedRegions = [regions[0]];
    let mergedSome = false;
    for (let i = 1; i < regions.length; i++) {
      let merged = false;
      for (let j = 0; j < mergedRegions.length; j++) {
        if (
          regions[i].some((point) => this.hasNeighbour(point, mergedRegions[j]))
        ) {
          mergedRegions[j] = mergedRegions[j].concat(regions[i]);
          merged = true;
          mergedSome = true;
          break;
        }
      }
      if (!merged) {
        mergedRegions = [...mergedRegions, regions[i]];
      }
    }
    return { regions: mergedRegions, merged: mergedSome };
  }

  private calculateSides(region: GardenPoint[], key: string): number {
    console.group(`Calculating sides ${key}`);
    const borders: GardenBorder[] = region
      .map((point) => [
        {
          a: point,
          b: { x: point.x, y: point.y + 1 },
          direction: 'right' as BorderDirection,
        },
        {
          a: point,
          b: { x: point.x + 1, y: point.y },
          direction: 'down' as BorderDirection,
        },
        {
          a: point,
          b: { x: point.x, y: point.y - 1 },
          direction: 'left' as BorderDirection,
        },
        {
          a: point,
          b: { x: point.x - 1, y: point.y },
          direction: 'up' as BorderDirection,
        },
      ])
      .flat();
    // console.debug(`Number of borders ${key}:`, borders.length, borders);
    const uniqueBorders = borders.filter(
      (border) => !region.some((point) => this.areTheSamePoint(point, border.b))
    );
    // console.debug(`Number of unique borders ${key}:`, uniqueBorders.length, uniqueBorders);
    const sides: Record<BorderDirection, GardenBorder[]> = {
      left: [],
      down: [],
      right: [],
      up: [],
    };
    uniqueBorders.forEach((border) => {
      sides[border.direction].push(border);
    });
    console.debug(`Number of sides ${key}:`, sides);
    const numberOfSides = Object.keys(sides).map((key) => ({
      key,
      numberOfSides: this.getNumberOfSides(sides[key as BorderDirection]),
    }));
    const total = numberOfSides.reduce((acc, value) => acc + value.numberOfSides, 0)
    console.debug(`Number of sides for ${key}`, total, numberOfSides);
    console.groupEnd();
    return total;
  }

  private getNumberOfSides(sides: GardenSide): number {
    const direction = sides[0].direction;
    console.debug(`Merging sides ${sides[0].direction}`, sides);
    if (direction === 'left' || direction === 'right') {
      const columns = sides.reduce(
        (obj: Record<string, GardenBorder[]>, entry) => {
          if (!obj[entry.a.y]) {
            obj[entry.a.y] = [];
          }
          obj[entry.a.y].push(entry);
          return obj;
        },
        {}
      );
      Object.keys(columns).forEach(key => {
        columns[parseInt(key)] = columns[parseInt(key)].sort((a, b) => a.a.x - b.a.x);
      })
      const numberOfSides = Object.keys(columns).reduce((acc, key) => {
        let numberOfGroups = 1;
        for (let i = 1; i < columns[key].length; i++) {
          if (columns[key][i].a.x - columns[key][i-1].a.x !== 1) {
            numberOfGroups++;
          }
        }
        return acc + numberOfGroups;
      }, 0);
      console.debug('Columns:', columns, numberOfSides);
      return numberOfSides;
    } else {
      const rows = sides.reduce(
        (obj: Record<string, GardenBorder[]>, entry) => {
          if (!obj[entry.a.x]) {
            obj[entry.a.x] = [];
          }
          obj[entry.a.x].push(entry);
          return obj;
        },
        {}
      );
      Object.keys(rows).forEach(key => {
        rows[parseInt(key)] = rows[parseInt(key)].sort((a, b) => a.a.y - b.a.y);
      });
      const numberOfSides = Object.keys(rows).reduce((acc, key) => {
        let numberOfGroups = 1;
        for (let i = 1; i < rows[key].length; i++) {
          if (rows[key][i].a.y - rows[key][i-1].a.y !== 1) {
            numberOfGroups++;
          }
        }
        return acc + numberOfGroups;
      }, 0)
      console.debug('Rows', rows, numberOfSides);
      return numberOfSides;
    }
  }

  private areTheSamePoint(a: GardenPoint, b: GardenPoint): boolean {
    return a.x === b.x && a.y === b.y;
  }
}

interface GardenPoint {
  x: number;
  y: number;
}

interface GardenBorder {
  a: GardenPoint;
  b: GardenPoint;
  direction: BorderDirection;
}

type BorderDirection = 'up' | 'right' | 'down' | 'left';
type GardenSide = GardenBorder[];
