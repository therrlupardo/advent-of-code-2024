export class Solver {
  public parseInput(input: string): {
    map: BoardElement[][];
    moves: Direction[];
  } {
    const parts = input.split('\n\n');
    const map: BoardElement[][] = parts[0]
      .split('\n')
      .filter(Boolean)
      .map((row) => row.split('').filter((x) => x !== '') as BoardElement[]);
    const moves: Direction[] = parts[1]
      .split('\n')
      .filter(Boolean)
      .map((row) => row.split('').filter((x) => x !== ''))
      .flat() as Direction[];
    return { map, moves };
  }

  public solve(input: string): number {
    const { map, moves } = this.parseInput(input);
    const finalMap = this.performAllMoves(map, moves);
    let counter = 0;
    for (let y = 0; y < finalMap.length; y++) {
      for (let x = 0; x < finalMap[y].length; x++) {
        if (finalMap[y][x] === BOX) {
          counter += 100 * y + x;
        }
      }
    }
    return counter;
  }

  public performAllMoves(
    map: BoardElement[][],
    moves: Direction[]
  ): BoardElement[][] {
    moves.forEach((move, index) => {
      // console.log(`\nMove ${move}:`);
      this.printMap(map);
      const robotPosition = this.findRobotPosition(map);
      if (!robotPosition) {
        // console.error('Robot not found');
        return;
      }
      const nextPosition = this.getNextPositionInDirection(robotPosition, move);
      const nextElement = map[nextPosition.y][nextPosition.x];
      if (nextElement === EMPTY_SPACE) {
        map[robotPosition.y][robotPosition.x] = EMPTY_SPACE;
        map[nextPosition.y][nextPosition.x] = ROBOT;
        // console.log(
        //   `Robot moved to x=${nextPosition.x}, y=${nextPosition.y}`
        // );
        return;
      }
      if (nextElement === BOX) {
        this.tryToMoveBoxAt(map, nextPosition, move);
        if (map[nextPosition.y][nextPosition.x] === EMPTY_SPACE) {
          map[robotPosition.y][robotPosition.x] = EMPTY_SPACE;
          map[nextPosition.y][nextPosition.x] = ROBOT;
          // console.log(
          //   `Robot moved to x=${nextPosition.x}, y=${nextPosition.y} after moving box`
          // );
          return;
        }
      }
      // console.log(
      //   `Robot position after ${index} moves: x=${robotPosition?.x}, y=${robotPosition?.y}`
      // );
    });
    this.printMap(map);
    return map;
  }

  protected printMap(map: BoardElement[][]): void {
    // console.log(map.map((row) => row.join('')).join('\n'));
  }

  protected findRobotPosition(map: BoardElement[][]): Position | undefined {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === ROBOT) {
          return { x, y };
        }
      }
    }
    return undefined;
  }

  protected tryToMoveBoxAt(
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

  protected getNextPositionInDirection(
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
}

export class SolverPart2 extends Solver {
  public override parseInput(input: string): {
    map: BoardElement[][];
    moves: Direction[];
  } {
    const { map, moves } = super.parseInput(input);
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
  }

  public override solve(input: string): number {
    const { map, moves } = this.parseInput(input);
    const finalMap = this.performAllMovesOnWideBoard(map, moves);
    this.printMap(finalMap);
    let counter = 0;
    for (let y = 0; y < finalMap.length; y++) {
      for (let x = 0; x < finalMap[y].length; x++) {
        if (finalMap[y][x] === BIG_BOX_LEFT) {
          counter += 100 * y + x;
        }
      }
    }
    return counter;
  }

  private performAllMovesOnWideBoard(
    map: BoardElement[][],
    moves: Direction[]
  ): BoardElement[][] {
    moves.forEach((move, index) => {
      // console.groupCollapsed(`Move [${index}] - ${move}`);
      console.log(`[${index}] Move ${move}`);
      console.log('Board before move');
      this.printMap(map);
      const robotPosition = this.findRobotPosition(map);
      if (!robotPosition) {
        console.error('[${index}] Robot not found');
        return;
      }
      const nextPosition = this.getNextPositionInDirection(robotPosition, move);
      const nextElement = map[nextPosition.y][nextPosition.x];
      console.log(
        `[${index}] Element on next position (${nextPosition.x}, ${nextPosition.y}): ${nextElement}`
      );
      if (nextElement === EMPTY_SPACE) {
        map[robotPosition.y][robotPosition.x] = EMPTY_SPACE;
        map[nextPosition.y][nextPosition.x] = ROBOT;
        console.log(
          `[${index}] Robot moved to x=${nextPosition.x}, y=${nextPosition.y}`
        );
        // console.groupEnd();
        return;
      }
      if (nextElement === BIG_BOX_RIGHT || nextElement === BIG_BOX_LEFT) {
        console.log(
          `[${index}] Found wide box at (${nextPosition.x}, ${nextPosition.y})`
        );
        this.tryToMoveBoxAtWideBoard(map, nextPosition, move);
        if (map[nextPosition.y][nextPosition.x] === EMPTY_SPACE) {
          map[robotPosition.y][robotPosition.x] = EMPTY_SPACE;
          map[nextPosition.y][nextPosition.x] = ROBOT;
          console.log(
            `[${index}] Robot moved to x=${nextPosition.x}, y=${nextPosition.y} after moving box`
          );
        }
        // console.groupEnd();
        return;
      }
      console.log(
        `[${index}] Robot position after ${index} moves: x=${robotPosition?.x}, y=${robotPosition?.y}`
      );
      // console.groupEnd();
    });
    // this.printMap(map);
    return map;
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
          console.log(
            `Found empty space at (${position.y}, ${i}) while moving ${direction}`
          );
          for (let j = i; j <= position.x; j++) {
            console.log(
              `Swapping ${map[position.y][j + 1]} -> ${map[position.y][j]} [(${
                position.y
              }, ${j + 1}) -> (${position.y}, ${j})]`
            );
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
        console.log(`Wide box can ${canBeMoved ? '' : 'not '}be moved`);
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
        console.log(`Wide box can ${canBeMoved ? '' : 'not '}be moved`);
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
    if (direction === MOVE_UP) {
      console.log('Moving up to face: ', map[position.y][position.x]);
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
          console.log('Cannot move wide box');
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
        console.log(`Box can ${canBeMoved ? '' : 'not '}be moved\n\n`);
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
    console.log(
      `Checking if box [(${wideBoxPosition.left.x}, ${wideBoxPosition.left.y}) and (${wideBoxPosition.right.x}, ${wideBoxPosition.right.y})] can be moved ${direction}`
    );
    if (direction === MOVE_DOWN) {
      console.log('Checking if wide box can be moved down', {
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
        console.log('There is a wall');
        return false;
      }
      if (map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] === BIG_BOX_LEFT) {
        console.log('Left element is big box left');
        const checkResult = this.canWideBoxBeMoved(
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
        if (!checkResult) {
          console.log('Cannot move left box');
          return false;
        }
      }
      if (
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] ===
        BIG_BOX_RIGHT
      ) {
        console.log('Left element is big box right');
        const checkResult = this.canWideBoxBeMoved(
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
        if (!checkResult) {
          console.log('Cannot move left box');
          return false;
        }
      }
      if (
        map[wideBoxPosition.right.y + 1][wideBoxPosition.right.x] ===
        BIG_BOX_LEFT
      ) {
        console.log('Right element is big box left');
        const checkResult = this.canWideBoxBeMoved(
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
        if (!checkResult) {
          console.log('Cannot move right box');
          return false;
        }
      }
    }
    if (direction === MOVE_UP) {
      console.log('Checking if wide box can be moved up', {
        left: map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x],
        right: map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x],
      });
      // if (
      //   map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] ===
      //     EMPTY_SPACE &&
      //   map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x] ===
      //     EMPTY_SPACE
      // ) {
        // return true;
      // }
      if (
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] === WALL ||
        map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x] === WALL
      ) {
        console.log('One of elements is wall');
        return false;
      }
      if (
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] === BIG_BOX_LEFT
      ) {
        console.log(`Left element is ${BIG_BOX_LEFT}. Checking if can move`, {
          left: { x: wideBoxPosition.left.x, y: wideBoxPosition.left.y - 1 },
          right: {
            x: wideBoxPosition.right.x,
            y: wideBoxPosition.right.y - 1,
          },
        });
        const checkResult = this.canWideBoxBeMoved(
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
        if (!checkResult) {
          return false;
        }
      }
      if (
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] ===
        BIG_BOX_RIGHT
      ) {
        // console.log(`Left element is ${BIG_BOX_RIGHT}`, {
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
        const checkResult = this.canWideBoxBeMoved(
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
        if (!checkResult) {
          return false;
        }
      }
      if (
        map[wideBoxPosition.right.y - 1][wideBoxPosition.right.x] ===
        BIG_BOX_LEFT
      ) {
        console.log(`Right element is ${BIG_BOX_LEFT}`);
        const checkResult = this.canWideBoxBeMoved(
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
        if (!checkResult) {
          return false;
        }
      }
    }
    return true;
  }

  private moveWideBox(
    map: BoardElement[][],
    wideBoxPosition: {
      left: Position;
      right: Position;
    },
    direction: Direction
  ): void {
    console.log(
      `Moving wide box from (${wideBoxPosition.left.x}, ${wideBoxPosition.left.y}) and (${wideBoxPosition.right.x}, ${wideBoxPosition.right.y}) in direction ${direction}`
    );
    if (direction === MOVE_DOWN) {
      if (
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] === BIG_BOX_LEFT
      ) {
        console.log('Need to move other wide box before - left left');
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
        console.log('Need to move other wide box before - left right');
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
        console.log('Need to move other wide box before - right left');
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
        console.log(`Moving wide box down`);
        console.log(
          `Setting (${wideBoxPosition.left.x}, ${wideBoxPosition.left.y}) to ${EMPTY_SPACE}`
        );
        map[wideBoxPosition.left.y][wideBoxPosition.left.x] = EMPTY_SPACE;
        console.log(
          `Setting (${wideBoxPosition.right.x}, ${wideBoxPosition.right.y}) to ${EMPTY_SPACE}`
        );
        map[wideBoxPosition.right.y][wideBoxPosition.right.x] = EMPTY_SPACE;
        console.log(
          `Setting (${wideBoxPosition.left.x}, ${
            wideBoxPosition.left.y + 1
          }) to ${BIG_BOX_LEFT}`
        );
        map[wideBoxPosition.left.y + 1][wideBoxPosition.left.x] = BIG_BOX_LEFT;
        console.log(
          `Setting (${wideBoxPosition.right.x}, ${
            wideBoxPosition.right.y + 1
          }) to ${BIG_BOX_RIGHT}`
        );
        map[wideBoxPosition.right.y + 1][wideBoxPosition.right.x] =
          BIG_BOX_RIGHT;
      }
      // this.printMap(map);
    }
    if (direction === MOVE_UP) {
      if (
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] === BIG_BOX_LEFT
      ) {
        console.log('Need to move other wide box before - left left');
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
        console.log('Need to move other wide box before - left right');
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
        console.log('Need to move other wide box before - right left');
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
        console.log(`Moving wide box down`);
        console.log(
          `Setting (${wideBoxPosition.left.x}, ${wideBoxPosition.left.y}) to ${EMPTY_SPACE}`
        );
        map[wideBoxPosition.left.y][wideBoxPosition.left.x] = EMPTY_SPACE;
        console.log(
          `Setting (${wideBoxPosition.right.x}, ${wideBoxPosition.right.y}) to ${EMPTY_SPACE}`
        );
        map[wideBoxPosition.right.y][wideBoxPosition.right.x] = EMPTY_SPACE;
        console.log(
          `Setting (${wideBoxPosition.left.x}, ${
            wideBoxPosition.left.y - 1
          }) to ${BIG_BOX_LEFT}`
        );
        map[wideBoxPosition.left.y - 1][wideBoxPosition.left.x] = BIG_BOX_LEFT;
        console.log(
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
}

interface Position {
  x: number;
  y: number;
}

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
