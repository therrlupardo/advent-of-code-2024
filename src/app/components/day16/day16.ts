import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractDay } from '../abstract-day';
import { map, Observable, of, tap } from 'rxjs';
import { Button } from 'primeng/button';
import { AsyncPipe } from '@angular/common';
import {
  Cell,
  CURRENT,
  Direction,
  DirectionPoint,
  Point,
  VISITED,
} from './day16.models';
import {
  buildPathTree,
  calculateResult,
  canMoveForward,
  canMoveLeft,
  canMoveRight,
  findCurrentPosition,
  findEndPosition, getResultFromBoardWithMinimumPaths,
  parseInput,
  printMap
} from './day16.utils';

@Component({
  selector: 'aoc-day-16',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: '../day.component.html',
  imports: [RouterLink, Button, AsyncPipe],
})
export class Day16Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(16);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => parseInput(data)),
      tap((data) => console.debug(data)),
      tap((data) => printMap(data)),
      tap((data) => console.debug(findCurrentPosition(data))),
      map((board) => {
        buildPathTree(board, 'right')
        return getResultFromBoardWithMinimumPaths(board);
      }),
      tap((result) => console.debug(result))
      // map((result) =>
      //   result.reduce((acc, val) => Math.min(acc, val), Number.MAX_SAFE_INTEGER)
      // )
    );
  }

  private findAllPaths(map: Cell[][]): DirectionPoint[][] {
    const currentPosition = findCurrentPosition(map);
    if (!currentPosition) {
      return [];
    }
    /**
     * Path rules:
     * 1. Start at start (S), facing east (right)
     * 2. For each step you have 5 options:
     * - go straight by adding next point to path. Available only if next step was not visited and is not a wall
     * - turn left by adding next point to path and changing direction to left. Available only if next step was not visited and is not a wall
     * - turn right by adding next point to path and changing direction to right. Available only if next step was not visited and is not a wall
     * - end path as there is blind end
     * - end path as you reached end (E)
     */
    return this.findPathsFrom(map, currentPosition, 'right');
  }

  private findPathsFrom(
    board: Cell[][],
    currentPosition: Point,
    direction: Direction,
    path: DirectionPoint[] = []
  ): DirectionPoint[][] {
    // console.group('Finding paths from (%d, %d) facing %s', currentPosition.x, currentPosition.y, direction);
    let pathsForward: DirectionPoint[][] = [];
    let pathsRight: DirectionPoint[][] = [];
    let pathsLeft: DirectionPoint[][] = [];
    if (!findEndPosition(board)) {
      console.debug(
        `Found END at (${currentPosition.x}, ${currentPosition.y})`
      );
      printMap(board);
      console.groupEnd();
      return [path];
    }
    board[currentPosition.y][currentPosition.x] = VISITED;
    if (canMoveForward(board, currentPosition, direction)) {
      console.debug(
        'Can move forward from (%d, %d) facing %s',
        currentPosition.x,
        currentPosition.y,
        direction
      );
      const nextPosition = structuredClone(currentPosition);
      switch (direction) {
        case 'right':
          nextPosition.x++;
          break;
        case 'left':
          nextPosition.x--;
          break;
        case 'up':
          nextPosition.y--;
          break;
        case 'down':
          nextPosition.y++;
          break;
      }
      console.debug(
        'Next position is (%d, %d) facing %s',
        nextPosition.x,
        nextPosition.y,
        direction
      );
      const currentBoard = structuredClone(board);
      currentBoard[nextPosition.y][nextPosition.x] = CURRENT;
      printMap(currentBoard);
      pathsForward = this.findPathsFrom(
        currentBoard,
        nextPosition,
        direction,
        path.concat({
          ...nextPosition,
          turned: false,
        })
      );
    } else {
      console.debug(
        'Cannot move forward from (%d, %d) facing %s',
        currentPosition.x,
        currentPosition.y,
        direction
      );
    }
    if (canMoveRight(board, currentPosition, direction)) {
      console.debug(
        'Can move right from (%d, %d) facing %s',
        currentPosition.x,
        currentPosition.y,
        direction
      );
      const nextPosition = structuredClone(currentPosition);
      switch (direction) {
        case 'right':
          nextPosition.y++;
          direction = 'down';
          break;
        case 'left':
          nextPosition.y--;
          direction = 'up';
          break;
        case 'up':
          nextPosition.x++;
          direction = 'right';
          break;
        case 'down':
          nextPosition.x--;
          direction = 'left';
          break;
      }
      console.debug(
        'Next position is (%d, %d) facing %s',
        nextPosition.x,
        nextPosition.y,
        direction
      );
      const currentBoard = structuredClone(board);
      currentBoard[nextPosition.y][nextPosition.x] = CURRENT;
      printMap(currentBoard);
      pathsRight = this.findPathsFrom(
        currentBoard,
        nextPosition,
        direction,
        path.concat({
          ...nextPosition,
          turned: true,
        })
      );
    } else {
      console.debug(
        'Cannot move right from (%d, %d) facing %s',
        currentPosition.x,
        currentPosition.y,
        direction
      );
    }
    if (canMoveLeft(board, currentPosition, direction)) {
      console.debug(
        'Can move left from (%d, %d) facing %s',
        currentPosition.x,
        currentPosition.y,
        direction
      );
      const nextPosition = structuredClone(currentPosition);
      switch (direction) {
        case 'right':
          nextPosition.y--;
          direction = 'up';
          break;
        case 'left':
          nextPosition.y++;
          direction = 'down';
          break;
        case 'up':
          nextPosition.x--;
          direction = 'left';
          break;
        case 'down':
          nextPosition.x++;
          direction = 'right';
          break;
      }
      console.debug(
        'Next position is (%d, %d) facing %s',
        nextPosition.x,
        nextPosition.y,
        direction
      );
      const currentBoard = structuredClone(board);
      currentBoard[nextPosition.y][nextPosition.x] = CURRENT;
      printMap(currentBoard);
      pathsLeft = this.findPathsFrom(
        currentBoard,
        nextPosition,
        direction,
        path.concat({
          ...nextPosition,
          turned: true,
        })
      );
    } else {
      console.debug(
        'Cannot move left from (%d, %d) facing %s',
        currentPosition.x,
        currentPosition.y,
        direction
      );
    }
    // console.groupEnd();
    return pathsForward.concat(pathsRight).concat(pathsLeft);
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      tap((data) => console.debug(data)),
      map(() => 0)
    );
  }
}
