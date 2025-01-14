export class Solver {
  protected codes: string[] = [];
  private cache: Record<string, number> = {}

  // region getters
  public getCodes(): string[] {
    return this.codes;
  }

  // endregion getters

  // region setters
  public setCodes(codes: string[]): void {
    this.codes = codes;
  }

  // endregion setters

  public parseInput(input: string): string[] {
    const codes = input.split('\n').filter(line => line.length > 0);
    this.setCodes(codes);
    return codes;
  }

  public calculateShortestPathFor(input: string, numberOfRobotSteps: number): number {
    const entryKey = `${input}-${numberOfRobotSteps}`;
    if (entryKey in this.cache) {
      // console.debug(`Read ${entryKey} from cache`, this.cache[entryKey]);
      return this.cache[entryKey];
    }
    const pairs = [`A${input[0]}`].concat(Array.from(
      { length: input.length - 1 },
      (_, i) => input.slice(i, i + 2)
    ));

    if (numberOfRobotSteps === 0) {
      // take first one, as they are all the same length so it has no meaning
      const result = pairs.map(pair => shortestPaths[pair as keyof typeof shortestPaths][0]).join('').length;
      if (!(entryKey in this.cache)) {
        this.cache[entryKey] = result;
      }
      return result;
    }
    const result = pairs.map(pair => {
      const options = shortestPaths[pair as keyof typeof shortestPaths];
      return options.map(option => this.calculateShortestPathFor(option, numberOfRobotSteps - 1))
        .reduce((acc, val) => Math.min(acc, val), Number.MAX_SAFE_INTEGER);
    }).reduce((acc, val) => acc + val, 0);
    if (!(entryKey in this.cache)) {
      this.cache[entryKey] = result;
    }
    return result;
  }

  public getNumberFromInput(input: string): number {
    return Number.parseInt(input.replace(/A/g, ''));
  }

  // public createShortestPathFor(input: string, totalLoops: number): string {
  //   const path = shortestPaths[input as keyof typeof shortestPaths];
  //   return this.findAllPathsForArrows(path, 1, totalLoops);
  // }

  // private findAllPathsForArrows(input: string, loopIndex: number, totalLoops: number): string {
  //   const pairs = [`A${input[0]}`].concat(Array.from(
  //     { length: input.length - 1 },
  //     (_, i) => input.slice(i, i + 2)
  //   ));
  //   const maps = pairs.map(pair => {
  //     const path = shortestPaths[pair as keyof typeof shortestPaths];
  //     return loopIndex !== totalLoops ? this.findAllPathsForArrows(path, loopIndex + 1, totalLoops) : this.findAllPathsForArrowsFinalLoop(path)
  //   });
  //   return maps.join('');
  //
  // }

  private findAllPathsForArrowsFinalLoop(input: string): string {
    const pathPairs = [`A${input[0]}`].concat(Array.from(
      { length: input.length - 1 },
      (_, i) => input.slice(i, i + 2)
    ));
    const subpairs = pathPairs.map(subpair => shortestPaths[subpair as keyof typeof shortestPaths]);
    return subpairs.join('');
  }
}

const shortestPaths = {'0A': ['>A'],
  '02': ['^A'],
  '05': ['^^A'],
  'A0': ['<A'],
  'A1': ['^<<A', '<^<A'],
  'A3': ['^A'],
  'A4': ['^^<<A', '^<^<A', '^<<^A', '<^^<A', '<^<^A'],
  'A6': ['^^A'],
  'A8': ['^^^<A', '^^<^A', '^<^^A', '<^^^A'],
  'A9': ['^^^A'],
  '1A': ['>>vA', '>v>A'],
  '17': ['^^A'],
  '29': ['^^>A'],
  '37': ['<<^^A', '<^<^A', '<^^<A', '^<<^A', '^<^<A', '^^<<A'],
  '4A': ['>>vvA', '>v>vA', '>vv>A', 'v>v>A', 'v>>vA'],
  '45': ['>A'],
  '5A': ['>vvA', 'v>vA', 'vv>A'],
  '56': ['>A'],
  '59': ['^>A', '>^A'],
  '6A': ['vvA'],
  '64': ['<<A'],
  '67': ['^<<A', '<^<A', '<<^A'],
  '68': ['^<A', '<^A'],
  '71': ['vvA'],
  '79': ['>>A'],
  '80': ['vvvA'],
  '8A': ['>vvvA', 'v>vvA', 'vv>vA', 'vvv>A'],
  '9A': ['vvvA'],
  '96': ['vA'],
  '98': ['<A'],
  'AA': ['A'],
  'A>': ['vA'],
  'A<': ['v<<A', '<v<A'],
  'A^': ['<A'],
  'Av': ['<vA', 'v<A'],

  '>A': ['^A'],
  '>>': ['A'],
  '>^': ['<^A', '^<A'],
  '><': ['<<A'],
  '>v': ['<A'],

  '<A': ['>>^A', '>^>A'],
  '<>': ['>>A'],
  '<^': ['>^A'],
  '<<': ['A'],
  '<v': ['>A'],

  '^A': ['>A'],
  '^>': ['>vA', 'v>A'],
  '^<': ['v<A'],
  '^v': ['vA'],
  '^^': ['A'],

  'vA': ['^>A', '<^A'],
  'v>': ['>A'],
  'v<': ['<A'],
  'v^': ['^A'],
  'vv': ['A'],
};
