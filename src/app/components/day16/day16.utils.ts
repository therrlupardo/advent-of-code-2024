import cloneDeep from 'lodash.clonedeep';
import {
  BORDER,
  Cell,
  CURRENT,
  Direction,
  EMPTY,
  END,
  MoveType,
  Path,
  Point,
  VISITED,
} from './day16.models';

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

let currentMinimum = Number.MAX_SAFE_INTEGER;

export function buildPathTree(board: Cell[][], direction: Direction, moves: MoveType[]): Path[] {
  if (currentMinimum < calculateResultForPath(moves)) {
    return [];
  }
  const currentPosition = findCurrentPosition(board);
  if (!currentPosition) {
    throw new Error('Current position not found');
  }
  let possiblePaths: Path[] = [];
  if (canMoveForward(board, currentPosition, direction)) {
    if (isNextStepEnd(board, currentPosition, direction)) {
      possiblePaths.push({ foundEnd: true, moves: [...moves, 'change_position'] });
      const result = calculateResultForPath([...moves, 'change_position']);
      if (result < currentMinimum) {
        console.debug('Found new minimum', result);
        printMap(board);
        currentMinimum = result;
      }
    } else {
      const newBoard = moveForward(board, currentPosition, direction);
      const nextPaths = buildPathTree(newBoard, direction, [...moves, 'change_position']);
      possiblePaths = possiblePaths.concat(...nextPaths);
    }
  }
  if (canMoveLeft(board, currentPosition, direction)) {
    const newDirection = getNewDirection(direction, 'left');
    if (isNextStepEnd(board, currentPosition, newDirection)) {
      possiblePaths.push({ foundEnd: true, moves: [...moves, 'change_direction', 'change_position'] });
      const result = calculateResultForPath([...moves, 'change_direction', 'change_position']);
      if (result < currentMinimum) {
        console.debug('Found new minimum', result);
        printMap(board);
        currentMinimum = result;
      }
    } else {
      const newBoard = moveForward(board, currentPosition, newDirection);
      const nextPaths = buildPathTree(newBoard, newDirection, [...moves, 'change_direction', 'change_position']);
      possiblePaths = possiblePaths.concat(...nextPaths);
    }
  }
  if (canMoveRight(board, currentPosition, direction)) {
    const newDirection = getNewDirection(direction, 'right');
    if (isNextStepEnd(board, currentPosition, newDirection)) {
      possiblePaths.push({ foundEnd: true, moves: [...moves, 'change_direction', 'change_position'] });
      const result = calculateResultForPath([...moves, 'change_direction', 'change_position']);
      if (result < currentMinimum) {
        console.debug('Found new minimum', result);
        printMap(board);
        currentMinimum = result;
      }
    } else {
      const newBoard = moveForward(board, currentPosition, newDirection);
      const nextPaths = buildPathTree(newBoard, newDirection, [...moves, 'change_direction', 'change_position']);
      possiblePaths = possiblePaths.concat(...nextPaths);
    }
  }
  if (possiblePaths.length === 0) {
    // console.debug('Found blind end');
  }
  return possiblePaths;
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
