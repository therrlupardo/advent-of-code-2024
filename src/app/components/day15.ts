import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractDay } from './abstract-day';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { Button } from 'primeng/button';
import { AsyncPipe } from '@angular/common';

const EMPTY_SPACE = '.';
const WALL = '#';
const ROBOT = '@';
const BOX = 'O';
const BIG_BOX_LEFT = '[';
const BIG_BOX_RIGHT = ']';
const MOVE_RIGHT = '>';
const MOVE_LEFT = '<';
const MOVE_UP = '^';
const MOVE_DOWN = 'v';
type Direction = '>' | '<' | '^' | 'v';
type BoardElement = '.' | '#' | '@' | 'O' | '[' | ']';

@Component({
  selector: 'aoc-day-15',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, Button, AsyncPipe],
})
export class Day15Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(15);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(false);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => {
        const parts = data.split('\n\n');
        const map: BoardElement[][] = parts[0]
          .split('\n')
          .filter(Boolean)
          .map(
            (row) => row.split('').filter((x) => x !== '') as BoardElement[]
          );
        const moves: Direction[] = parts[1]
          .split('\n')
          .filter(Boolean)
          .map((row) => row.split('').filter((x) => x !== ''))
          .flat() as Direction[];
        return { map, moves };
      }),
      tap((data) => console.debug(data)),
      map(({ map, moves }) => this.performAllMoves(map, moves)),
      map((map) => {
        let counter = 0;
        for (let y = 0; y < map.length; y++) {
          for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === BOX) {
              counter += 100 * y + x;
            }
          }
        }
        return counter;
      })
    );
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => {
        const parts = data.split('\n\n');
        const map: BoardElement[][] = parts[0]
          .split('\n')
          .filter(Boolean)
          .map(
            (row) => row.split('').filter((x) => x !== '') as BoardElement[]
          );
        const moves: Direction[] = parts[1]
          .split('\n')
          .filter(Boolean)
          .map((row) => row.split('').filter((x) => x !== ''))
          .flat() as Direction[];
        return { map, moves };
      }),
      map(({ map, moves }) => {
        const wideMap: BoardElement[][] = [];
        map.forEach((row) => {
          const wideRow: BoardElement[] = [];
          row.forEach((element) => {
            switch (element) {
              case EMPTY_SPACE:
                wideRow.push(EMPTY_SPACE);
                wideRow.push(EMPTY_SPACE);
                break;
              case WALL:
                wideRow.push(WALL);
                wideRow.push(WALL);
                break;
              case ROBOT:
                wideRow.push(ROBOT);
                wideRow.push(EMPTY_SPACE);
                break;
              case BOX:
                wideRow.push(BIG_BOX_LEFT);
                wideRow.push(BIG_BOX_RIGHT);
                break;
            }
          });
          wideMap.push(wideRow);
        });
        this.printMap(wideMap);
        return { map: wideMap, moves };
      }),
      map(({ map, moves }) => this.performAllMovesOnWideBoard(map, moves)),
      tap((data) => this.printMap(data)),
      map(map => {
        let counter = 0;
        for (let y = 0; y < map.length; y++) {
          for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === BIG_BOX_LEFT) {
              counter += 100 * y + x;
            }
          }
        }
        return counter;
      }),
      // map(() => 0)
    );
  }

  private performAllMoves(
    map: BoardElement[][],
    moves: Direction[]
  ): BoardElement[][] {
    moves.forEach((move, index) => {
      console.debug(`\nMove ${move}:`);
      this.printMap(map);
      const robotPosition = this.findRobotPosition(map);
      if (!robotPosition) {
        console.error('Robot not found');
        return;
      }
      const nextPosition = this.getNextPositionInDirection(robotPosition, move);
      const nextElement = map[nextPosition.y][nextPosition.x];
      if (nextElement === EMPTY_SPACE) {
        map[robotPosition.y][robotPosition.x] = EMPTY_SPACE;
        map[nextPosition.y][nextPosition.x] = ROBOT;
        console.debug(
          `Robot moved to x=${nextPosition.x}, y=${nextPosition.y}`
        );
        return;
      }
      if (nextElement === BOX) {
        this.tryToMoveBoxAt(map, nextPosition, move);
        if (map[nextPosition.y][nextPosition.x] === EMPTY_SPACE) {
          map[robotPosition.y][robotPosition.x] = EMPTY_SPACE;
          map[nextPosition.y][nextPosition.x] = ROBOT;
          console.debug(
            `Robot moved to x=${nextPosition.x}, y=${nextPosition.y} after moving box`
          );
          return;
        }
      }
      console.debug(
        `Robot position after ${index} moves: x=${robotPosition?.x}, y=${robotPosition?.y}`
      );
    });
    this.printMap(map);
    return map;
  }

  private printMap(map: BoardElement[][]): void {
    console.debug(map.map((row) => row.join('')).join('\n'));
  }

  private tryToMoveBoxAt(
    map: BoardElement[][],
    position: Position,
    direction: Direction
  ): boolean {
    if (direction === MOVE_RIGHT) {
      for (let i = position.x + 1; i < map[position.y].length; i++) {
        if (map[position.y][i] === WALL) {
          return false;
        }
        if (map[position.y][i] === EMPTY_SPACE) {
          map[position.y][position.x] = EMPTY_SPACE;
          map[position.y][i] = BOX;
          return true;
        }
      }
    }
    if (direction === MOVE_LEFT) {
      for (let i = position.x - 1; i >= 0; i--) {
        if (map[position.y][i] === WALL) {
          return false;
        }
        if (map[position.y][i] === EMPTY_SPACE) {
          map[position.y][position.x] = EMPTY_SPACE;
          map[position.y][i] = BOX;
          return true;
        }
      }
    }
    if (direction === MOVE_DOWN) {
      for (let i = position.y + 1; i < map.length; i++) {
        if (map[i][position.x] === WALL) {
          return false;
        }
        if (map[i][position.x] === EMPTY_SPACE) {
          map[position.y][position.x] = EMPTY_SPACE;
          map[i][position.x] = BOX;
          return true;
        }
      }
    }
    if (direction === MOVE_UP) {
      for (let i = position.y - 1; i >= 0; i--) {
        if (map[i][position.x] === WALL) {
          return false;
        }
        if (map[i][position.x] === EMPTY_SPACE) {
          map[position.y][position.x] = EMPTY_SPACE;
          map[i][position.x] = BOX;
          return true;
        }
      }
    }
    return false;
  }

  private tryToMoveBoxAtWideBoard(
    map: BoardElement[][],
    position: Position,
    direction: Direction
  ): boolean {
    if (direction === MOVE_RIGHT) {
      for (let i = position.x + 1; i < map[position.y].length; i++) {
        if (map[position.y][i] === WALL) {
          return false;
        }
        if (map[position.y][i] === EMPTY_SPACE) {
          for (let j = i; j >= position.x; j--) {
            const tmp = map[position.y][j];
            map[position.y][j] = map[position.y][j - 1];
            map[position.y][j - 1] = tmp;
          }
          return true;
        }
      }
    }
    if (direction === MOVE_LEFT) {
      for (let i = position.x - 1; i >= 0; i--) {
        if (map[position.y][i] === WALL) {
          return false;
        }
        if (map[position.y][i] === EMPTY_SPACE) {
          console.debug(`Found empty space at (${position.y}, ${i}) while moving ${direction}`);
          for (let j = i; j <= position.x; j++) {
            console.debug(`Swapping ${map[position.y][j + 1]} -> ${map[position.y][j]} [(${position.y}, ${j + 1}) -> (${position.y}, ${j})]`);
            const tmp = map[position.y][j];
            map[position.y][j] = map[position.y][j + 1];
            map[position.y][j + 1] = tmp;
            // this.printMap(map);
          }
          return true;
        }
      }
    }
    if (direction === MOVE_DOWN) {
      if (map[position.y][position.x] === BIG_BOX_LEFT) {
        const canBeMoved = this.canWideBoxBeMoved(
          map,
          {
            left: { x: position.x, y: position.y },
            right: { x: position.x + 1, y: position.y },
          },
          direction
        );
        console.debug(`Wide box can ${canBeMoved ? '' : 'not '}be moved`);
        if (!canBeMoved) {
          return false;
        }
        this.moveWideBox(
          map,
          {
            left: { x: position.x, y: position.y },
            right: { x: position.x + 1, y: position.y },
          },
          direction
        );
        return true;
      }
      if (map[position.y][position.x] === BIG_BOX_RIGHT) {
        const canBeMoved = this.canWideBoxBeMoved(
          map,
          {
            left: { x: position.x - 1, y: position.y },
            right: { x: position.x, y: position.y },
          },
          direction
        );
        console.debug(`Wide box can ${canBeMoved ? '' : 'not '}be moved`);
        if (!canBeMoved) {
          return false;
        }
        this.moveWideBox(
          map,
          {
            left: { x: position.x-1, y: position.y },
            right: { x: position.x, y: position.y },
          },
          direction
        );
        return true;

      }
    }
    if (direction === MOVE_UP) {
      console.debug('Moving up to face: ', map[position.y][position.x]);
      if (map[position.y][position.x] === BIG_BOX_LEFT) {
        const canBeMoved = this.canWideBoxBeMoved(
          map,
          {
            left: { x: position.x, y: position.y },
            right: { x: position.x + 1, y: position.y },
          },
          direction
        );
        if (!canBeMoved) {
          console.debug('Cannot move wide box');
          return false;
        }
        this.moveWideBox(
          map,
          {
            left: { x: position.x, y: position.y },
            right: { x: position.x + 1, y: position.y },
          },
          direction
        );
        return true;
      }
      if (map[position.y][position.x] === BIG_BOX_RIGHT) {
        const canBeMoved = this.canWideBoxBeMoved(
          map,
          {
            left: { x: position.x - 1, y: position.y },
            right: { x: position.x, y: position.y },
          },
          direction
        );
        if (!canBeMoved) {
          return false;
        }
        this.moveWideBox(
          map,
          {
            left: { x: position.x - 1, y: position.y },
            right: { x: position.x, y: position.y },
          },
          direction
        );
        return true;
      }
    }
    return false;
  }

  private canWideBoxBeMoved(
    map: BoardElement[][],
    wideBoxPosition: {
      left: Position;
      right: Position;
    },
    direction: Direction
  ): boolean {
    console.debug(`Checking if box [(${wideBoxPosition.left.x}, ${wideBoxPosition.left.y}) and (${wideBoxPosition.right.x}, ${wideBoxPosition.right.y})] can be moved ${direction}`);
    if (direction === MOVE_DOWN) {
      console.debug('Checking if wide box can be moved down', {
        left: map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x],
        right: map[wideBoxPosition.right.y + 1][wideBoxPosition.right.x],
      });
      if (
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] ===
          EMPTY_SPACE &&
        map[wideBoxPosition.right.y + 1][wideBoxPosition.right.x] ===
          EMPTY_SPACE
      ) {
        return true;
      }
      if (
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] === WALL ||
        map[wideBoxPosition.right.y + 1][wideBoxPosition.right.x] === WALL
      ) {
        console.debug('There is a wall')
        return false;
      }
      if (
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] === BIG_BOX_LEFT
      ) {
        console.debug('Left element is big box left');
        return this.canWideBoxBeMoved(
          map,
          {
            left: { x: wideBoxPosition.left.x, y: wideBoxPosition.left.y + 1 },
            right: {
              x: wideBoxPosition.right.x,
              y: wideBoxPosition.right.y + 1,
            },
          },
          direction
        );
      }
      if (
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] ===
        BIG_BOX_RIGHT
      ) {
        console.debug('Left element is big box right');
        return this.canWideBoxBeMoved(
          map,
          {
            left: {
              x: wideBoxPosition.left.x - 1,
              y: wideBoxPosition.left.y + 1,
            },
            right: {
              x: wideBoxPosition.left.x,
              y: wideBoxPosition.left.y + 1,
            },
          },
          direction
        );
      }
      if (
        map[wideBoxPosition.right.y + 1][wideBoxPosition.right.x] ===
        BIG_BOX_LEFT
      ) {
        console.debug('Right element is big box left');
        return this.canWideBoxBeMoved(
          map,
          {
            left: { x: wideBoxPosition.right.x, y: wideBoxPosition.right.y + 1 },
            right: {
              x: wideBoxPosition.right.x + 1,
              y: wideBoxPosition.right.y + 1,
            },
          },
          direction
        );
      }
    }
    if (direction === MOVE_UP) {
      console.debug('Checking if wide box can be moved up', {
        left: map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x],
        right: map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x],
      });
      if (map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] === EMPTY_SPACE &&
        map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x] === EMPTY_SPACE ) {
        return true;
      }
      if (
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] === WALL ||
        map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x] === WALL
      ) {
        console.debug('One of elements is wall');
        return false;
      }
      if (map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] === BIG_BOX_LEFT) {
        console.debug(`Left element is ${BIG_BOX_LEFT}. Checking if can move`, {
          left: { x: wideBoxPosition.left.x, y: wideBoxPosition.left.y - 1 },
          right: {
            x: wideBoxPosition.right.x,
            y: wideBoxPosition.right.y - 1,
          },
        });
        return this.canWideBoxBeMoved(
          map,
          {
            left: { x: wideBoxPosition.left.x, y: wideBoxPosition.left.y - 1 },
            right: {
              x: wideBoxPosition.right.x,
              y: wideBoxPosition.right.y - 1,
            },
          },
          direction
        );
      }
      if (map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] === BIG_BOX_RIGHT) {
        // console.debug(`Left element is ${BIG_BOX_RIGHT}`, {
        //   left: {
        //     x: wideBoxPosition.left.x - 1,
        //     y: wideBoxPosition.left.y - 1,
        //     value: map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x - 1]
        //   },
        //   right: {
        //     x: wideBoxPosition.left.x,
        //     y: wideBoxPosition.left.y - 1,
        //     value: map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x]
        //   },
        // });
        return this.canWideBoxBeMoved(
          map,
          {
            left: {
              x: wideBoxPosition.left.x - 1,
              y: wideBoxPosition.left.y - 1,
            },
            right: {
              x: wideBoxPosition.left.x,
              y: wideBoxPosition.left.y - 1,
            },
          },
          direction
        );
      }
      if (
        map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x] ===
        BIG_BOX_LEFT
      ) {
        console.debug(`Right element is ${BIG_BOX_LEFT}`);
        return this.canWideBoxBeMoved(
          map,
          {
            left: { x: wideBoxPosition.right.x, y: wideBoxPosition.right.y - 1 },
            right: {
              x: wideBoxPosition.right.x + 1,
              y: wideBoxPosition.right.y - 1,
            },
          },
          direction
        );
      }
    }
    return false;
  }

  private moveWideBox(
    map: BoardElement[][],
    wideBoxPosition: {
      left: Position;
      right: Position;
    },
    direction: Direction
  ): void {
    console.debug(
      `Moving wide box from (${wideBoxPosition.left.x}, ${wideBoxPosition.left.y}) and (${wideBoxPosition.right.x}, ${wideBoxPosition.right.y}) in direction ${direction}`
    );
    if (direction === MOVE_DOWN) {
      if (
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] === BIG_BOX_LEFT
      ) {
        console.debug('Need to move other wide box before - left left');
        this.moveWideBox(
          map,
          {
            left: { x: wideBoxPosition.left.x, y: wideBoxPosition.left.y + 1 },
            right: {
              x: wideBoxPosition.right.x,
              y: wideBoxPosition.right.y + 1,
            },
          },
          direction
        );
      }
      if (
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] ===
        BIG_BOX_RIGHT
      ) {
        console.debug('Need to move other wide box before - left right');
        this.moveWideBox(
          map,
          {
            left: {
              x: wideBoxPosition.left.x - 1,
              y: wideBoxPosition.left.y + 1,
            },
            right: { x: wideBoxPosition.left.x, y: wideBoxPosition.left.y + 1 },
          },
          direction
        );
      }
      if (
        map[wideBoxPosition.right.y + 1][wideBoxPosition.right.x] ===
        BIG_BOX_LEFT
      ) {
        console.debug('Need to move other wide box before - right left');
        this.moveWideBox(
          map,
          {
            left: {
              x: wideBoxPosition.right.x,
              y: wideBoxPosition.right.y + 1,
            },
            right: {
              x: wideBoxPosition.right.x + 1,
              y: wideBoxPosition.right.y + 1,
            },
          },
          direction
        );
      }
      if (
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] ===
          EMPTY_SPACE &&
        map[wideBoxPosition.right.y + 1][wideBoxPosition.right.x] ===
          EMPTY_SPACE
      ) {
        console.debug(`Moving wide box down`);
        console.debug(`Setting (${wideBoxPosition.left.x}, ${wideBoxPosition.left.y}) to ${EMPTY_SPACE}`);
        map[wideBoxPosition.left.y][wideBoxPosition.left.x] = EMPTY_SPACE;
        console.debug(`Setting (${wideBoxPosition.right.x}, ${wideBoxPosition.right.y}) to ${EMPTY_SPACE}`);
        map[wideBoxPosition.right.y][wideBoxPosition.right.x] = EMPTY_SPACE;
        console.debug(`Setting (${wideBoxPosition.left.x}, ${wideBoxPosition.left.y + 1}) to ${BIG_BOX_LEFT}`);
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] = BIG_BOX_LEFT;
        console.debug(`Setting (${wideBoxPosition.right.x}, ${wideBoxPosition.right.y + 1}) to ${BIG_BOX_RIGHT}`);
        map[wideBoxPosition.right.y + 1][wideBoxPosition.right.x] =
          BIG_BOX_RIGHT;
      }
      // this.printMap(map);
    }
    if (direction === MOVE_UP) {
      if (
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] === BIG_BOX_LEFT
      ) {
        console.debug('Need to move other wide box before - left left');
        this.moveWideBox(
          map,
          {
            left: { x: wideBoxPosition.left.x, y: wideBoxPosition.left.y - 1 },
            right: {
              x: wideBoxPosition.right.x,
              y: wideBoxPosition.right.y - 1,
            },
          },
          direction
        );
      }
      if (
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] ===
        BIG_BOX_RIGHT
      ) {
        console.debug('Need to move other wide box before - left right');
        this.moveWideBox(
          map,
          {
            left: {
              x: wideBoxPosition.left.x - 1,
              y: wideBoxPosition.left.y - 1,
            },
            right: { x: wideBoxPosition.left.x, y: wideBoxPosition.left.y - 1 },
          },
          direction
        );
      }
      if (
        map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x] ===
        BIG_BOX_LEFT
      ) {
        console.debug('Need to move other wide box before - right left');
        this.moveWideBox(
          map,
          {
            left: {
              x: wideBoxPosition.right.x,
              y: wideBoxPosition.right.y - 1,
            },
            right: {
              x: wideBoxPosition.right.x + 1,
              y: wideBoxPosition.right.y - 1,
            },
          },
          direction
        );
      }
      if (
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] ===
          EMPTY_SPACE &&
        map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x] ===
          EMPTY_SPACE
      ) {
        console.debug(`Moving wide box down`);
        console.debug(
          `Setting (${wideBoxPosition.left.x}, ${wideBoxPosition.left.y}) to ${EMPTY_SPACE}`
        );
        map[wideBoxPosition.left.y][wideBoxPosition.left.x] = EMPTY_SPACE;
        console.debug(
          `Setting (${wideBoxPosition.right.x}, ${wideBoxPosition.right.y}) to ${EMPTY_SPACE}`
        );
        map[wideBoxPosition.right.y][wideBoxPosition.right.x] = EMPTY_SPACE;
        console.debug(
          `Setting (${wideBoxPosition.left.x}, ${
            wideBoxPosition.left.y - 1
          }) to ${BIG_BOX_LEFT}`
        );
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] = BIG_BOX_LEFT;
        console.debug(
          `Setting (${wideBoxPosition.right.x}, ${
            wideBoxPosition.right.y - 1
          }) to ${BIG_BOX_RIGHT}`
        );
        map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x] =
          BIG_BOX_RIGHT;
      }
      // this.printMap(map);
    }
  }

  private findRobotPosition(map: BoardElement[][]): Position | undefined {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === ROBOT) {
          return { x, y };
        }
      }
    }
    return undefined;
  }

  private getNextPositionInDirection(
    position: Position,
    direction: Direction
  ): Position {
    switch (direction) {
      case MOVE_RIGHT:
        return { x: position.x + 1, y: position.y };
      case MOVE_LEFT:
        return { x: position.x - 1, y: position.y };
      case MOVE_UP:
        return { x: position.x, y: position.y - 1 };
      case MOVE_DOWN:
        return { x: position.x, y: position.y + 1 };
    }
  }

  private performAllMovesOnWideBoard(
    map: BoardElement[][],
    moves: Direction[]
  ): BoardElement[][] {
    moves.forEach((move, index) => {
      // console.groupCollapsed(`Move [${index}] - ${move}`);
      console.debug(`[${index}] Move ${move}`);
      console.debug('Board before move');
      this.printMap(map);
      const robotPosition = this.findRobotPosition(map);
      if (!robotPosition) {
        console.error('[${index}] Robot not found');
        return;
      }
      const nextPosition = this.getNextPositionInDirection(robotPosition, move);
      const nextElement = map[nextPosition.y][nextPosition.x];
      console.debug(`[${index}] Element on next position (${nextPosition.x}, ${nextPosition.y}): ${nextElement}`);
      if (nextElement === EMPTY_SPACE) {
        map[robotPosition.y][robotPosition.x] = EMPTY_SPACE;
        map[nextPosition.y][nextPosition.x] = ROBOT;
        console.debug(`[${index}] Robot moved to x=${nextPosition.x}, y=${nextPosition.y}`);
        // console.groupEnd();
        return;
      }
      if (nextElement === BIG_BOX_RIGHT || nextElement === BIG_BOX_LEFT) {
        console.debug(`[${index}] Found wide box at (${nextPosition.x}, ${nextPosition.y})`);
        this.tryToMoveBoxAtWideBoard(map, nextPosition, move);
        if (map[nextPosition.y][nextPosition.x] === EMPTY_SPACE) {
          map[robotPosition.y][robotPosition.x] = EMPTY_SPACE;
          map[nextPosition.y][nextPosition.x] = ROBOT;
          console.debug(`[${index}] Robot moved to x=${nextPosition.x}, y=${nextPosition.y} after moving box`);
        }
        // console.groupEnd();
        return;
      }
      console.debug(`[${index}] Robot position after ${index} moves: x=${robotPosition?.x}, y=${robotPosition?.y}`);
      // console.groupEnd();
    });
    // this.printMap(map);
    return map;
  }
}

interface Position {
  x: number;
  y: number;
}
