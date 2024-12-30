import cloneDeep from 'lodash.clonedeep';
import {
  BORDER,
  Cell,
  CURRENT,
  Direction,
  EMPTY,
  END,
  MoveType,
  Point,
  VISITED,
} from './day16.models';
import * as fs from 'fs';
import * as path from 'path';

export function canMoveForward(
  map: Cell[][],
  currentPosition: Point,
  direction: Direction
): boolean {
  // console.debug(
  //   'Checking if can move forward from (%d, %d) facing %s',
  //   currentPosition.x,
  //   currentPosition.y,
  //   direction
  // );
  switch (direction) {
    case 'right':
      // console.debug(
      //   'Checking right - (%d, %d) is %s',
      //   currentPosition.x + 1,
      //   currentPosition.y,
      //   map[currentPosition.y][currentPosition.x + 1]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y][currentPosition.x + 1]
      );
    case 'left':
      // console.debug(
      //   'Checking left - (%d, %d) is %s',
      //   currentPosition.x - 1,
      //   currentPosition.y,
      //   map[currentPosition.y][currentPosition.x - 1]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y][currentPosition.x - 1]
      );
    case 'up':
      // console.debug(
      //   'Checking up - (%d, %d) is %s',
      //   currentPosition.x,
      //   currentPosition.y - 1,
      //   map[currentPosition.y - 1][currentPosition.x]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y - 1][currentPosition.x]
      );
    case 'down':
      // console.debug(
      //   'Checking down - (%d, %d) is %s',
      //   currentPosition.x,
      //   currentPosition.y + 1,
      //   map[currentPosition.y + 1][currentPosition.x]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y + 1][currentPosition.x]
      );
  }
}

export function canMoveLeft(
  map: Cell[][],
  currentPosition: Point,
  direction: Direction
): boolean {
  // console.debug(
  //   'Checking if can move left from (%d, %d) facing %s',
  //   currentPosition.x,
  //   currentPosition.y,
  //   direction
  // );
  switch (direction) {
    case 'right':
      // console.debug(
      //   'Checking right - (%d, %d) is %s',
      //   currentPosition.x,
      //   currentPosition.y - 1,
      //   map[currentPosition.y - 1][currentPosition.x]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y - 1][currentPosition.x]
      );
    case 'left':
      // console.debug(
      //   'Checking left - (%d, %d) is %s',
      //   currentPosition.x,
      //   currentPosition.y + 1,
      //   map[currentPosition.y + 1][currentPosition.x]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y + 1][currentPosition.x]
      );
    case 'up':
      // console.debug(
      //   'Checking up - (%d, %d) is %s',
      //   currentPosition.x - 1,
      //   currentPosition.y,
      //   map[currentPosition.y][currentPosition.x - 1]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y][currentPosition.x - 1]
      );
    case 'down':
      // console.debug(
      //   'Checking down - (%d, %d) is %s',
      //   currentPosition.x + 1,
      //   currentPosition.y,
      //   map[currentPosition.y][currentPosition.x + 1]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y][currentPosition.x + 1]
      );
  }
}

export function canMoveRight(
  map: Cell[][],
  currentPosition: Point,
  direction: Direction
): boolean {
  // console.debug(
  //   'Checking if can move right from (%d, %d) facing %s',
  //   currentPosition.x,
  //   currentPosition.y,
  //   direction
  // );
  switch (direction) {
    case 'right':
      // console.debug(
      //   'Checking right - (%d, %d) is %s',
      //   currentPosition.x,
      //   currentPosition.y + 1,
      //   map[currentPosition.y + 1][currentPosition.x]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y + 1][currentPosition.x]
      );
    case 'left':
      // console.debug(
      //   'Checking left - (%d, %d) is %s',
      //   currentPosition.x,
      //   currentPosition.y - 1,
      //   map[currentPosition.y - 1][currentPosition.x]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y - 1][currentPosition.x]
      );
    case 'up':
      // console.debug(
      //   'Checking up - (%d, %d) is %s',
      //   currentPosition.x + 1,
      //   currentPosition.y,
      //   map[currentPosition.y][currentPosition.x + 1]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y][currentPosition.x + 1]
      );
    case 'down':
      // console.debug(
      //   'Checking down - (%d, %d) is %s',
      //   currentPosition.x - 1,
      //   currentPosition.y,
      //   map[currentPosition.y][currentPosition.x - 1]
      // );
      return ![BORDER, VISITED].includes(
        map[currentPosition.y][currentPosition.x - 1]
      );
  }
}

export function printMap(map: Cell[][]): void {
  console.debug(map.map((line) => line.join('')).join('\n'));
}

export function findCurrentPosition(map: Cell[][]): Point | undefined {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === CURRENT) {
        return { x: j, y: i };
      }
    }
  }
  return undefined;
}

export function findEndPosition(map: Cell[][]): Point | undefined {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === END) {
        return { x: j, y: i };
      }
    }
  }
  return undefined;
}

export function parseInput(data: string): Cell[][] {
  return data
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('').filter((char) => char !== ''))
    .map((line) => line as Cell[]);
}

export function calculateResult(paths: MoveType[][]): number {
  return paths.map(path => calculateResultForPath(path))
    .reduce((acc, val) => Math.min(acc, val), Number.MAX_SAFE_INTEGER);
}

export function calculateResultForPath(path: MoveType[]): number {
  return path.reduce((acc, moveType) => acc += moveType === 'change_position' ? 1 : 1000, 0);
}

export function eliminateBlindSpots(board: Cell[][]): {blindSpotsEliminated: number, board: Cell[][] } {
  let blindSpotsEliminated = 0;
  for (let i = 1; i<board.length - 1; i++) {
    for (let j = 1; j<board[i].length - 1; j++) {
      if (board[i][j] !== EMPTY) {
        continue;
      }
      const surrounding = [
        board[i - 1][j],
        board[i + 1][j],
        board[i][j - 1],
        board[i][j + 1],
      ];
      const passableFields = surrounding.filter(cell => [EMPTY, CURRENT, END].includes(cell));
      if (passableFields.length <= 1) {
        board[i][j] = BORDER;
        blindSpotsEliminated++;
      }
    }
  }
  return { blindSpotsEliminated, board };
}

export function eliminateAllBlindSpots(board: Cell[][]): Cell[][] {
  let result = eliminateBlindSpots(board);
  while(result.blindSpotsEliminated > 0) {
    result = eliminateBlindSpots(result.board);
  }
  printMap(result.board);
  return result.board;
}

export let boardWithMinimumPaths: number[][];

export function initBoard(board: Cell[][]): void {
  boardWithMinimumPaths = [];
  for(let i = 0; i<board.length; i++) {
    const row = [];
    for(let j = 0; j<board[i].length; j++) {
      if (board[i][j] === BORDER) {
        row.push(-1);
      } else if (board[i][j] === CURRENT) {
        row.push(0);
      } else {
        row.push(Number.MAX_SAFE_INTEGER);
      }
    }
    boardWithMinimumPaths.push(row);
  }
}

export function getNextStep(board: Cell[][], currentPosition: Point, direction: Direction): Point {
  switch (direction) {
    case 'right':
      return { x: currentPosition.x + 1, y: currentPosition.y };
    case 'left':
      return { x: currentPosition.x - 1, y: currentPosition.y };
    case 'up':
      return { x: currentPosition.x, y: currentPosition.y - 1 };
    case 'down':
      return { x: currentPosition.x, y: currentPosition.y + 1 };
  }
}

const shortestPaths = new Set<string>();

export function buildPathTree(board: Cell[][], direction: Direction): void {
  const currentPosition = findCurrentPosition(board);
  if (!currentPosition) {
    throw new Error('Current position not found');
  }
  if (canMoveForward(board, currentPosition, direction)) {
    const nextPoint = getNextStep(board, currentPosition, direction);
    if (isNextStepEnd(board, currentPosition, direction)) {
      if (boardWithMinimumPaths[nextPoint.y][nextPoint.x] >= boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1) {
        boardWithMinimumPaths[nextPoint.y][nextPoint.x] = boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1;
      }
    } else {
      if (boardWithMinimumPaths[nextPoint.y][nextPoint.x] >= boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1) {
        boardWithMinimumPaths[nextPoint.y][nextPoint.x] = boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1;
        const newBoard = moveForward(board, currentPosition, direction);
        buildPathTree(newBoard, direction);
      }
    }
  }
  if (canMoveLeft(board, currentPosition, direction)) {
    const newDirection = getNewDirection(direction, 'left');
    const nextPoint = getNextStep(board, currentPosition, newDirection);
    if (isNextStepEnd(board, currentPosition, newDirection)) {
      if (boardWithMinimumPaths[nextPoint.y][nextPoint.x] >= boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1001) {
        boardWithMinimumPaths[nextPoint.y][nextPoint.x] = boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1001;
      }
    } else {
      if (boardWithMinimumPaths[nextPoint.y][nextPoint.x] >= boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1001) {
        boardWithMinimumPaths[nextPoint.y][nextPoint.x] = boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1001;
        const newBoard = moveForward(board, currentPosition, newDirection);
        buildPathTree(newBoard, newDirection);
      }
    }
  }
  if (canMoveRight(board, currentPosition, direction)) {
    const newDirection = getNewDirection(direction, 'right');
    const nextPoint = getNextStep(board, currentPosition, newDirection);
    if (isNextStepEnd(board, currentPosition, newDirection)) {
      if (boardWithMinimumPaths[nextPoint.y][nextPoint.x] >= boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1001) {
        boardWithMinimumPaths[nextPoint.y][nextPoint.x] = boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1001;
      }
    } else {
      if (boardWithMinimumPaths[nextPoint.y][nextPoint.x] >= boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1001) {
        boardWithMinimumPaths[nextPoint.y][nextPoint.x] = boardWithMinimumPaths[currentPosition.y][currentPosition.x] + 1001;
        const newBoard = moveForward(board, currentPosition, newDirection);
        buildPathTree(newBoard, newDirection);
      }
    }
  }
}

export function printMapWithShortestPaths(board: Cell[][]): void {
  const map = [];
  for (let i = 0; i < board.length; i++) {
    const row = [];
    for (let j = 0; j < board[i].length; j++) {
      if (shortestPaths.has(`${j}:${i}`)) {
        row.push('O');
      } else {
        row.push(board[i][j]);
      }
    }
    map.push(row);
  }
  console.debug(map.map(row => row.join('')).join('\n'));
}

export function findShortestPaths(board: Cell[][], currentPosition: Point | undefined = findEndPosition(board)): void {
  if (!currentPosition) {
    throw new Error('End position not found');
  }
  shortestPaths.add(`${currentPosition.x}:${currentPosition.y}`);
  // point above
  if (currentPosition.y > 0 && board[currentPosition.y - 1][currentPosition.x] === EMPTY) {
    const currentMinusAbove = boardWithMinimumPaths[currentPosition.y][currentPosition.x] - boardWithMinimumPaths[currentPosition.y - 1][currentPosition.x];
    if (currentMinusAbove === 1 || currentMinusAbove === 1001) {
      findShortestPaths(board, { x: currentPosition.x, y: currentPosition.y - 1 });
    }
    if (currentMinusAbove === -999) {
      const belowMinusCurrent = boardWithMinimumPaths[currentPosition.y + 1][currentPosition.x] - boardWithMinimumPaths[currentPosition.y][currentPosition.x];
      if (belowMinusCurrent === 1001) {
        findShortestPaths(board, { x: currentPosition.x, y: currentPosition.y - 1 });
      }
    }
  }
  // point below
  if (currentPosition.y < board.length - 1 && board[currentPosition.y + 1][currentPosition.x] === EMPTY) {
    const currentMinusBelow = boardWithMinimumPaths[currentPosition.y][currentPosition.x] - boardWithMinimumPaths[currentPosition.y + 1][currentPosition.x];
    if (currentMinusBelow === 1 || currentMinusBelow === 1001) {
      findShortestPaths(board, { x: currentPosition.x, y: currentPosition.y + 1 });
    }
    if (currentMinusBelow === -999) {
      const aboveMinusCurrent = boardWithMinimumPaths[currentPosition.y - 1][currentPosition.x] - boardWithMinimumPaths[currentPosition.y][currentPosition.x];
      if (aboveMinusCurrent === 1001) {
        findShortestPaths(board, { x: currentPosition.x, y: currentPosition.y + 1 });
      }
    }
  }

  // point left
  if (currentPosition.x > 0 && board[currentPosition.y][currentPosition.x - 1] === EMPTY) {
    const currentMinusLeft = boardWithMinimumPaths[currentPosition.y][currentPosition.x] - boardWithMinimumPaths[currentPosition.y][currentPosition.x - 1];
    if (currentMinusLeft === 1 || currentMinusLeft === 1001) {
      findShortestPaths(board, { x: currentPosition.x - 1, y: currentPosition.y });
    }
    if (currentMinusLeft === -999) {
      const rightMinusCurrent = boardWithMinimumPaths[currentPosition.y][currentPosition.x + 1] - boardWithMinimumPaths[currentPosition.y][currentPosition.x];
      if (rightMinusCurrent === 1001) {
        findShortestPaths(board, { x: currentPosition.x - 1, y: currentPosition.y });
      }
    }
  }

  // point right
  if (currentPosition.x < board[0].length - 1 && board[currentPosition.y][currentPosition.x + 1] === EMPTY) {
    const currentMinusRight = boardWithMinimumPaths[currentPosition.y][currentPosition.x] - boardWithMinimumPaths[currentPosition.y][currentPosition.x + 1];
    if (currentMinusRight === 1 || currentMinusRight === 1001) {
      findShortestPaths(board, { x: currentPosition.x + 1, y: currentPosition.y });
    }
    if (currentMinusRight === -999) {
      const leftMinusCurrent = boardWithMinimumPaths[currentPosition.y][currentPosition.x - 1] - boardWithMinimumPaths[currentPosition.y][currentPosition.x];
      if (leftMinusCurrent === 1001) {
        findShortestPaths(board, { x: currentPosition.x + 1, y: currentPosition.y });
      }
    }
  }
}

export function getNumberOfPointsOnShortestPaths(): number {
  return shortestPaths.size + 1;
}

export function updateBoardWithMinimumPaths(board: number[][]): void {
  boardWithMinimumPaths = board;
}

export function printBoardWithMinimumPaths(): void {
  console.debug(boardWithMinimumPaths);
}

export function boardWithMinimumPathsToCSV(): void {
  const csv = boardWithMinimumPaths.map(row => row.join(',')).join('\n');
  const assetsPath = path.join(__dirname, 'boardWithMinimumPaths.csv');

  fs.writeFileSync(assetsPath, csv);
  console.debug('Board with minimum paths saved to', assetsPath);
}

export function getResultFromBoardWithMinimumPaths(board: Cell[][]): number {
  const endPosition = findEndPosition(board);
  if (!endPosition) {
    throw new Error('End position not found');
  }
  return boardWithMinimumPaths[endPosition.y][endPosition.x];
}

export function getNewDirection(currentDirection: Direction, rotation: 'left' | 'right'): Direction {
  switch(currentDirection) {
    case 'right':
      return rotation === 'left' ? 'up' : 'down';
    case 'left':
      return rotation === 'left' ? 'down' : 'up';
    case 'up':
      return rotation === 'left' ? 'left' : 'right';
    case 'down':
      return rotation === 'left' ? 'right' : 'left';
  }
}

export function moveForward(board: Cell[][], position: Point, direction: Direction): Cell[][] {
  const newBoard = cloneDeep(board);
  newBoard[position.y][position.x] = VISITED;
  switch (direction) {
    case 'right':
      newBoard[position.y][position.x + 1] = CURRENT;
      break;
    case 'left':
      newBoard[position.y][position.x - 1] = CURRENT;
      break;
    case 'up':
      newBoard[position.y - 1][position.x] = CURRENT;
      break;
    case 'down':
      newBoard[position.y + 1][position.x] = CURRENT;
      break;
  }
  return newBoard;
}

export function isNextStepEnd(
  board: Cell[][],
  currentPosition: Point,
  direction: Direction
): boolean {
  switch (direction) {
    case 'right':
      return board[currentPosition.y][currentPosition.x + 1] === END;
    case 'left':
      return board[currentPosition.y][currentPosition.x - 1] === END;
    case 'up':
      return board[currentPosition.y - 1][currentPosition.x] === END;
    case 'down':
      return board[currentPosition.y + 1][currentPosition.x] === END;
  }
}
