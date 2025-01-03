export class Solver {
  private board: BoardField[][] = [];

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
        row.push({
          type: board[y][x] as BoardFieldType,
          shortestPathTo: this.getDefaultShortestPathToType(board[y][x] as BoardFieldType),
          canBeRemovedForCheating: false
        } as BoardField);
      }
      finalBoard.push(row);
    }
    this.setBoard(finalBoard);
  }

  public printBoard(): void {
    console.debug(this.board.map(row => row.map(row => {
      return row.canBeRemovedForCheating ? 'O' : row.type;
    }).join('')).join('\n'));
  }

  public printBoardDistances(): void {

    console.debug(this.board.map(row => row.map(row => row.shortestPathTo.toString().padStart(3).concat(' ')).join('|')).join('\n'));
  }

  private getDefaultShortestPathToType(type: BoardFieldType): number {
    switch (type) {
      case BoardFieldType.BORDER:
        return -1;
      case BoardFieldType.START:
        return 0;
      default:
        return Number.MAX_SAFE_INTEGER;
    }
  }

  public calculateShortestPaths(point: Position, currentDistance: number): void {
    this.board[point.y][point.x].shortestPathTo = currentDistance;
    const neighbours = this.getNeighboursWhichAreNotBorders(point);
    neighbours.forEach(neighbour => {
      if (this.board[neighbour.y][neighbour.x].shortestPathTo > currentDistance + 1) {
        this.calculateShortestPaths(neighbour, currentDistance + 1);
      }
    });
  }

  public findShortestPathFrom(startPoint: Position): void {
    this.board[startPoint.y][startPoint.x].shortestPathTo = 0;
    let changed = true;
    while (changed) {
      changed = false;
      this.board.forEach(row => {
        row.forEach(field => {
          if (field.type === BoardFieldType.BORDER) {
            return;
          }
          const neighbors = this.getNeighboursWhichAreNotBorders(field);
          neighbors.forEach(neighbor => {
            if (neighbor.shortestPathTo > field.shortestPathTo + 1) {
              neighbor.shortestPathTo = field.shortestPathTo + 1;
              changed = true;
              // console.debug('Set value of field (x=%d, y=%d) to %d', neighbor.x, neighbor.y, neighbor.distance);
            }
          });
        });
      });
    }
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
    return neighbours;
  }

  public findStartingPoint(): Position | undefined {
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board.length; x++) {
        if (this.board[y][x].type === BoardFieldType.START) {
          return { x, y };
        }
      }
    }
    return undefined;
  }

  public findAllBordersThatCanBeRemoved(): Position[] {
    const borders: Position[] = [];
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board.length; x++) {
        if (this.board[y][x].type !== BoardFieldType.BORDER) {
          continue;
        }
        const neighbours = this.getNeighboursWhichAreNotBorders({ x, y });
        if (neighbours.length >= 2) {
          borders.push({ x, y });
          this.board[y][x].canBeRemovedForCheating = true;
          const neighboursAsBoardFields = neighbours.map(coords => this.board[coords.y][coords.x]);
          const pointClosestToStart = neighboursAsBoardFields.sort((a, b) => a.shortestPathTo - b.shortestPathTo)[0];
          const pointFurthestToStart = neighboursAsBoardFields.sort((a, b) => a.shortestPathTo - b.shortestPathTo)[neighbours.length - 1];
          this.board[y][x].removingSaves = pointFurthestToStart.shortestPathTo - pointClosestToStart.shortestPathTo - 2;
          // console.debug(`Removing border on (${x}, ${y}) saves ${pointFurthestToStart.shortestPathTo - pointClosestToStart.shortestPathTo - 2} moves`)
        }
      }
    }
    return borders;
  }

  public getGroupedRemoving(): Record<number, number> {
    const groupedRemoving: Record<number, number> = {};
    this.board.forEach(row => {
      row.forEach(field => {
        if (field.type !== BoardFieldType.BORDER) {
          return;
        }
        if (!field.removingSaves) {
          return;
        }
        if (!(field.removingSaves in groupedRemoving)) {
          groupedRemoving[field.removingSaves] = 0;
        }
        groupedRemoving[field.removingSaves]++;
      });
    });
    console.debug(groupedRemoving);
    return groupedRemoving;
  }

  public getNumberOfCheatsThatSaveOver100Moves(): number {
    const groupedRemoving = this.getGroupedRemoving();
    return Object.keys(groupedRemoving).reduce((sum, current) => groupedRemoving[+current] >= 100 ? sum + groupedRemoving[+current] : sum, 0);
  }
}

interface Position {
  x: number;
  y: number;
}

interface BoardField extends Position {
  type: BoardFieldType;
  shortestPathTo: number;
  canBeRemovedForCheating: boolean;
  removingSaves?: number;
}

export enum BoardFieldType {
  BORDER = '#',
  START = 'S',
  END = 'E',
  EMPTY = '.'
}
