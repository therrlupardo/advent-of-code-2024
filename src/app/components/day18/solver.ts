export class Solver {

  private board: Field[][] = [];

  public initBoard(size: number): void {
    this.board = [];
    for (let i = 0; i <= size; i++) {
      this.board.push([]);
      for (let j = 0; j <= size; j++) {
        this.board[i].push({ x: j, y: i, distance: Number.MAX_SAFE_INTEGER, canPass: true });
      }
    }
  }

  public parseInputData(data: string, numberOfBytes: number): void {
    if (!this.board) {
      throw new Error('Board not initialized');
    }
    // console.log(this.board);
    data.split('\n').filter(line => line !== undefined)
      .map(line => {
        const array = line.split(',');
        return { x: +array[0], y: +array[1] };
      })
      .forEach((point, index) => {
        if (index >= numberOfBytes) {
          return;
        }
        this.board[point.y][point.x].canPass = false;
      });
  }

  public findShortestPathFrom(startPoint: { x: number, y: number }): void {
    this.board[startPoint.y][startPoint.x].distance = 0;
    let changed = true;
    while (changed) {
      changed = false;
      this.board.forEach(row => {
        row.forEach(field => {
          if (!field.canPass) {
            return;
          }
          const neighbors = this.getNeighbors(field);
          neighbors.forEach(neighbor => {
            if (neighbor.distance > field.distance + 1) {
              neighbor.distance = field.distance + 1;
              changed = true;
              // console.debug('Set value of field (x=%d, y=%d) to %d', neighbor.x, neighbor.y, neighbor.distance);
            }
          });
        });
      });
    }
  }

  public printBoard(): void {
    console.log(this.board.map(row => row.map(field => field.canPass ? '.' : '#').join('')).join('\n'));

    console.log(this.board.map(row => row.map(field => field.distance === Number.MAX_SAFE_INTEGER ? 'X' : field.distance).join(' | ')).join('\n'));
  }

  private getNeighbors(field: Field): Field[] {
    // console.debug(`Checking neighbors for (x=${field.x}, y=${field.y})`);
    const neighbours = [];
    if (field.x > 0) {
      if (this.board[field.y][field.x - 1].canPass) {
        neighbours.push(this.board[field.y][field.x - 1]);
        // console.debug(`Adding left neighbor (x=${field.x - 1}, y=${field.y})`);
      }
    }
    if (field.y > 0) {
      if (this.board[field.y - 1][field.x].canPass) {
        neighbours.push(this.board[field.y - 1][field.x]);
        // console.debug(`Adding top neighbor (x=${field.x}, y=${field.y - 1})`);
      }
    }
    if (field.x < this.board[0].length - 1) {
      if (this.board[field.y][field.x + 1].canPass) {
        neighbours.push(this.board[field.y][field.x + 1]);
        // console.debug(`Adding right neighbor (x=${field.x + 1}, y=${field.y})`);
      }
    }
    if (field.y < this.board.length - 1) {
      if (this.board[field.y + 1][field.x].canPass) {
        neighbours.push(this.board[field.y + 1][field.x]);
        // console.debug(`Adding bottom neighbor (x=${field.x}, y=${field.y + 1})`);
      }
    }
    return neighbours;
  }

  public getDistanceTo(x: number, y: number): number {
    return this.board[y][x].distance;
  }

  /**
   * It could be faster if:
   * 1. we would skip the first 1024 steps (in final example) - as we know that they are not blocking
   * 2. we could use some kind of binary search - check if the middle step is blocking, if not, check the middle of the second half, etc.
   *
   * We have now max 3450 iterations (in final example) - it's not that bad, but we could reduce it with (1) to 2426 and with (2) to 12.
   * So it would be 200 times faster :D
   * TODO
   */
  public findStepToBlockPath(input: string): string {
    const numberOfPoints = input.split('\n').length;
    for (let i = 0; i < numberOfPoints; i++) {
      console.debug('Checking for step %d', i);
      this.resetDistances();
      this.parseInputData(input, i);
      this.findShortestPathFrom({ x: 0, y: 0 });
      if (this.getDistanceTo(this.board.length - 1, this.board.length - 1) === Number.MAX_SAFE_INTEGER) {
        console.log('Found step %d', i);
        this.printBoard();
        return input.split('\n')[i - 1];
      }
    }
    throw new Error('No blocking step found');
  }

  private resetDistances(): void {
    this.board.forEach(row => {
      row.forEach(field => {
        field.distance = Number.MAX_SAFE_INTEGER;
      });
    });
  }
}

interface Field {
  x: number;
  y: number;
  distance: number;
  canPass: boolean;
}
