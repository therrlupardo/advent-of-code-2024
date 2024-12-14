import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AbstractDay } from './abstract-day';
import { map, Observable, of, tap } from 'rxjs';
import { Button } from 'primeng/button';

const OBSTACLE = '#';
const GUARD_UP = '^';
const GUARD_DOWN = 'v';
const GUARD_LEFT = '<';
const GUARD_RIGHT = '>';
const VISITED = 'X';
const VISITED_BOTH = '+';
const VISITED_VERTICAL = '|';
const VISITED_HORIZONTAL = '-';
const ARTIFICIAL_OBSTACLE = 'O';
const EMPTY_SPACE = '.';

@Component({
  selector: 'aoc-day-6',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe, Button],
})
export class Day6Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(6);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) =>
        data
          .split('\n')
          .map((line) => line.split('').filter((char) => char !== ''))
          .filter((line) => line.length > 0)
      ),
      map((data) => {
        let guardPosition = this.locateGuard(data);
        while (guardPosition) {
          // this.printMap(data);
          const guardDirection = data[guardPosition.y][guardPosition.x];
          this.markGuardPositionAsVisited(data, guardPosition);
          this.moveGuard(data, guardPosition, guardDirection);
          guardPosition = this.locateGuard(data);
        }
        return data;
      }),
      map((data) => {
        let result = 0;
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] === VISITED) {
              result++;
            }
          }
        }
        return result;
      })
    );
  }

  private printMap(map: string[][]) {
    console.log(map.map((line) => line.join('')).join('\n'));
  }

  private printMapWithArtificialObstacle(map: string[][],
                                         position: { x: number; y: number },
                                         direction: string
  ) {
    const mapCopy = map.map((line) => line.slice());
    switch(direction) {
      case GUARD_UP:
        mapCopy[position.y - 1][position.x] = ARTIFICIAL_OBSTACLE;
        break;
      case GUARD_DOWN:
        mapCopy[position.y + 1][position.x] = ARTIFICIAL_OBSTACLE;
        break;
      case GUARD_LEFT:
        mapCopy[position.y][position.x - 1] = ARTIFICIAL_OBSTACLE;
        break;
    }
    // mapCopy[position.y][position.x] = STUCK_OBSTACLE;
    console.log(mapCopy.map((line) => line.join('')).join('\n'));
  }

  private locateGuard(map: string[][]): { x: number; y: number } | undefined {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (
          map[i][j] === GUARD_UP ||
          map[i][j] === GUARD_DOWN ||
          map[i][j] === GUARD_LEFT ||
          map[i][j] === GUARD_RIGHT
        ) {
          return { x: j, y: i };
        }
      }
    }
    return undefined;
  }

  private markGuardPositionAsVisited(
    map: string[][],
    position: { x: number; y: number },
    direction?: string
  ) {
    if (!direction) {
      map[position.y][position.x] = VISITED;
      return;
    }
    if (direction === GUARD_UP || direction === GUARD_DOWN) {
      if (map[position.y][position.x] === VISITED_HORIZONTAL) {
        map[position.y][position.x] = VISITED_BOTH;
      } else {
        map[position.y][position.x] = VISITED_VERTICAL;
      }
      return;
    }
    if (direction === GUARD_LEFT || direction === GUARD_RIGHT) {
      if (map[position.y][position.x] === VISITED_VERTICAL) {
        map[position.y][position.x] = VISITED_BOTH;
      } else {
        map[position.y][position.x] = VISITED_HORIZONTAL;
      }
      return;
    }
  }

  private moveGuard(
    map: string[][],
    position: { x: number; y: number },
    direction: string
  ) {
    switch (direction) {
      case GUARD_UP:
        if (position.y === 0) {
          map[position.y][position.x] = VISITED;
          break;
        }
        if (position.y > 0 && ![OBSTACLE, ARTIFICIAL_OBSTACLE].includes(map[position.y - 1][position.x])) {
          map[position.y - 1][position.x] = GUARD_UP;
        } else {
          map[position.y][position.x] = GUARD_RIGHT;
        }
        break;
      case GUARD_DOWN:
        if (position.y === map.length - 1) {
          // console.log('Reached border of map');
          map[position.y][position.x] = VISITED;
          break;
        }
        if (
          position.y < map.length - 1 &&
          ![OBSTACLE, ARTIFICIAL_OBSTACLE].includes(map[position.y + 1][position.x])
        ) {
          map[position.y + 1][position.x] = GUARD_DOWN;
        } else {
          map[position.y][position.x] = GUARD_LEFT;
        }
        break;
      case GUARD_LEFT:
        if (position.x === 0) {
          // console.log('Reached border of map');
          map[position.y][position.x] = VISITED;
          break;
        }
        if (position.x > 0 && ![OBSTACLE, ARTIFICIAL_OBSTACLE].includes(map[position.y][position.x - 1])) {
          map[position.y][position.x - 1] = GUARD_LEFT;
        } else {
          map[position.y][position.x] = GUARD_UP;
        }
        break;
      case GUARD_RIGHT:
        if (position.x === map[position.y].length - 1) {
          // console.log('Reached border of map');
          map[position.y][position.x] = VISITED;
          break;
        }
        if (
          position.x < map[position.y].length - 1 &&
          ![OBSTACLE, ARTIFICIAL_OBSTACLE].includes(map[position.y][position.x + 1])
        ) {
          map[position.y][position.x + 1] = GUARD_RIGHT;
        } else {
          map[position.y][position.x] = GUARD_DOWN;
        }
        break;
    }
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) =>
        data
          .split('\n')
          .map((line) => line.split('').filter((char) => char !== ''))
          .filter((line) => line.length > 0)
      ),
      map((data) => {
        let result = 0;
        let guardPosition = this.locateGuard(data);
        while (guardPosition) {
          // console.log('-----------------------------------');
          // this.printMap(data);
          const guardDirection = data[guardPosition.y][guardPosition.x];
          this.markGuardPositionAsVisited(data, guardPosition);
          if (this.guardWillBeStuckIfNextStepIsTimeLoopObstacle(data, guardPosition, guardDirection)) {
            // console.log(`GUARD WILL BE STUCK AT (x=${guardPosition.x}, y=${guardPosition.y}) for the ${result + 1} time`);
            // this.printMapWithArtificialObstacle(data, guardPosition, guardDirection);
            // return result + 1;
            result++;
          }
          this.moveGuard(data, guardPosition, guardDirection);
          guardPosition = this.locateGuard(data);
          // return result;
        }
        return result;
      })
    );
  }

  private guardWillBeStuckIfNextStepIsTimeLoopObstacle(
    map: string[][],
    position: {
      x: number;
      y: number;
    },
    direction: string
  ): boolean {
    // console.log('checking if guard will be stuck at', position, 'with direction', direction);
    const tmpMap = structuredClone(map);
    for(let i = 0; i < tmpMap.length; i++) {
      for (let j = 0; j < tmpMap[i].length; j++) {
        if (tmpMap[i][j] === VISITED) {
          // console.log(`TmpMap[${i}][${j}]=${tmpMap[i][j]} (is visited)`);
          tmpMap[i][j] = EMPTY_SPACE;
        }
      }
    }
    tmpMap[position.y][position.x] = direction;
    switch(direction) {
      case GUARD_UP:
        if (position.y === 0) {
          return false;
        }
        if (map[position.y - 1][position.x] === VISITED) {
          return false;
        }
        tmpMap[position.y - 1][position.x] = ARTIFICIAL_OBSTACLE;
        break;
      case GUARD_DOWN:
        if (position.y === map.length - 1) {
          return false;
        }
        if (map[position.y + 1][position.x] === VISITED) {
          return false;
        }
        tmpMap[position.y + 1][position.x] = ARTIFICIAL_OBSTACLE;
        break;
      case GUARD_LEFT:
        if (position.x === 0) {
          return false;
        }
        if (map[position.y][position.x - 1] === VISITED) {
          return false;
        }
        tmpMap[position.y][position.x - 1] = ARTIFICIAL_OBSTACLE;
        break;
      case GUARD_RIGHT:
        if (position.x === map[position.y].length - 1) {
          return false;
        }
        if (map[position.y][position.x + 1] === VISITED) {
          return false;
        }
        tmpMap[position.y][position.x + 1] = ARTIFICIAL_OBSTACLE;
        break;
    }
    // console.log('Initial map');
    // this.printMap(tmpMap);
    const visited: string[] = [`${position.y}:${position.x}:${direction}`];
    let guardPosition = this.locateGuard(tmpMap);
    // console.log('guardPosition', guardPosition);
    while (guardPosition) {
      // this.printMap(tmpMap);
      const guardDirection = tmpMap[guardPosition.y][guardPosition.x];
      this.markGuardPositionAsVisited(tmpMap, guardPosition);
      this.moveGuard(tmpMap, guardPosition, guardDirection);
      guardPosition = this.locateGuard(tmpMap);
      if (!guardPosition) {
        return false;
      }
      if (visited.includes(`${guardPosition.y}:${guardPosition.x}:${tmpMap[guardPosition.y][guardPosition.x]}`)) {
        // console.log('Already visited', guardPosition);
        // this.printMap(tmpMap);
        return true;
      }
      visited.push(`${guardPosition.y}:${guardPosition.x}:${tmpMap[guardPosition.y][guardPosition.x]}`);
    }
    return false;
  }

  private getRightSideOffset(
    map: string[][],
    position: { x: number; y: number }
  ): number | undefined {
    for (let i = position.x + 1; i < map[position.y].length; i++) {
      if (map[position.y][i] === OBSTACLE) {
        return i - 1;
      }
    }
    return undefined;
  }

  private getBottomSideOffset(
    map: string[][],
    position: { x: number; y: number }
  ): number | undefined {
    for (let i = position.y + 1; i < map.length; i++) {
      // console.log(`Checking if there is an obstacle at (${i}, ${position.x}): ${map[i][position.x]}`);
      if (map[i][position.x] === OBSTACLE) {
        return i - 1;
      }
    }
    return undefined;
  }

  private getTopSideOffset(
    map: string[][],
    position: { x: number; y: number }
  ): number | undefined {
    for (let i = position.y - 1; i >= 0; i--) {
      // console.log(`Checking if there is an obstacle at (${i}, ${position.x}): ${map[i][position.x]}`);
      if (map[i][position.x] === OBSTACLE) {
        return i + 1;
      }
    }
    return undefined;
  }

  private getLeftSideOffset(
    map: string[][],
    position: { x: number; y: number }
  ): number | undefined {
    for (let i = position.x - 1; i >= 0; i--) {
      // console.log(`Checking left side offset (${position.y}, ${i}):${map[position.y][i]}`);
      if (map[position.y][i] === OBSTACLE) {
        return i + 1;
      }
    }
    return undefined;
  }
}
