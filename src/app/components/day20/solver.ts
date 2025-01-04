import { disposeEmitNodes } from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export class Solver {
  private board: BoardField[][] = [];
  private startingPosition!: BoardField;
  private endPosition!: BoardField;

  // region getters
  public getBoard(): BoardField[][] {
    return this.board;
  }

  // endregion

  // region setters
  public setBoard(board: BoardField[][]): void {
    this.board = board;
  }

  // endregion setters

  public parseInput(input: string): void {
    const board = input.split('\n').filter(row => row.length > 0)
      .map(row => row.split(''));
    const finalBoard = [];
    for (let y = 0; y < board.length; y++) {
      const row = [];
      for (let x = 0; x < board.length; x++) {
        const field = {
          y,
          x,
          type: board[y][x] as BoardFieldType,
        } as BoardField;
        row.push(field);
        if (board[y][x] === BoardFieldType.START) {
          this.startingPosition = field;
        }
        if (board[y][x] === BoardFieldType.END) {
          this.endPosition = field;
        }
      }
      finalBoard.push(row);
    }
    this.setBoard(finalBoard);
  }

  public getPath(): string[] {
    let currentPoint = this.startingPosition;
    const path: string[] = [];
    while(currentPoint) {
      path.push(`${currentPoint.x}:${currentPoint.y}`);
      currentPoint = this.getNeighboursWhichAreNotBorders(currentPoint).filter(n => !path.includes(`${n.x}:${n.y}`))[0];

    }
    console.debug(path);
    return path;
  }

  public findCheatsOnPath(): number {
    const path = this.getPath();
    let cheats = 0;
    path.forEach((point, index) => {
      const x = point.split(':')[0];
      const y = point.split(':')[1];
      if (path.includes(`${+x - 2}:${y}`)) {
        const nextIndex = path.indexOf(`${+x - 2}:${y}`);
        if (nextIndex - index >= 102) {
          cheats++;
        }
      }
      if (path.includes(`${+x + 2}:${y}`)) {
        const nextIndex = path.indexOf(`${+x + 2}:${y}`);
        if (nextIndex - index >= 102) {
          cheats++;
        }
      }
      if (path.includes(`${x}:${+y - 2}`)) {
        const nextIndex = path.indexOf(`${x}:${+y - 2}`);
        if (nextIndex - index >= 102) {
          cheats++;
        }
      }
      if (path.includes(`${x}:${+y + 2}`)) {
        const nextIndex = path.indexOf(`${x}:${+y + 2}`);
        if (nextIndex - index >= 102) {
          cheats++;
        }
      }
    })
    return cheats;
  }

  public solveTask2(): number {
    const path = this.getPath();
    let cheats = 0;
    const resultMap: Record<number, number> = {}
    console.debug(path.length )
    path.forEach((p1, index1) => {
      const x1 = +p1.split(':')[0];
      const y1 = +p1.split(':')[1];
      path.forEach((p2, index2) => {
        const x2 = +p2.split(':')[0];
        const y2 = +p2.split(':')[1];
        const distance = Math.abs(x1-x2) + Math.abs(y1-y2);
        if (distance <= 20 && index2 - index1 - distance >= 100) {
          cheats++;
        }
        // if (distance <= 20 && index2 - index1 - distance >= 50) {
        //   if (!resultMap[index2-index1-distance]) {
        //     resultMap[index2-index1 - distance] = 0;
        //   }
        //   resultMap[index2-index1 - distance]++
        // }
        // if (distance <= 20 && index2-index1 === 84) {
        //   console.debug(
        //     this.board.map(row => row.map(field => {
        //       if (field.x === x1 && field.y === y1) {
        //         return '1';
        //       }
        //       if (field.x === x2 && field.y === y2) {
        //         return '2';
        //       }
        //       return field.type;
        //     }).join('')).join('\n')
        //   )
        // }
      })
    })
    console.debug(resultMap);
    return cheats;
  }

  private getNeighboursWhichAreNotBorders(point: Position): BoardField[] {
    const neighbours: BoardField[] = [];
    if (point.y > 1 && this.board[point.y - 1][point.x].type !== BoardFieldType.BORDER) {
      neighbours.push(this.board[point.y - 1][point.x]);
    }
    if (point.y < this.board.length - 1 && this.board[point.y + 1][point.x].type !== BoardFieldType.BORDER) {
      neighbours.push(this.board[point.y + 1][point.x]);
    }
    if (point.x > 1 && this.board[point.y][point.x - 1].type !== BoardFieldType.BORDER) {
      neighbours.push(this.board[point.y][point.x - 1]);
    }
    if (point.x < this.board.length - 1 && this.board[point.y][point.x + 1].type !== BoardFieldType.BORDER) {
      neighbours.push(this.board[point.y][point.x + 1]);
    }
    // console.log(neighbours);
    return neighbours;
  }
}

interface Position {
  x: number;
  y: number;
}

interface BoardField extends Position {
  type: BoardFieldType;
}

enum BoardFieldType {
  BORDER = '#',
  START = 'S',
  END = 'E',
  EMPTY = '.'
}
