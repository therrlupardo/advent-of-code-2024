export class Solver {
  protected codes: string[] = [];

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

  public solveFirstStep(input: string): string {
    const pairs = [`A${input[0]}`].concat(Array.from(
      { length: input.length - 1 },
      (_, i) => input.slice(i, i + 2)
    ));
    // console.debug(pairs);
    return pairs
      .map(pair => this.shortestPathsOnNumPad[pair as keyof typeof this.shortestPathsOnNumPad])
      .join('');
  }

  public solveSecondStep(input: string): string {
    // console.debug(input);
    const pairs = [`A${input[0]}`].concat(Array.from(
      { length: input.length - 1 },
      (_, i) => input.slice(i, i + 2)
    ));
    // console.debug(pairs);
    const pairPaths = pairs
      .map(pair => this.shortestPathsOnArrowPad[pair as keyof typeof this.shortestPathsOnArrowPad]);
    // console.debug(pairs.map((pair, i) => `${pair}:  ${pairPaths[i]}`));
    return pairPaths.join('');
  }

  public solveFirstTaskFor(input: string): number {
    const pairs = [`A${input[0]}`].concat(Array.from(
      { length: input.length - 1 },
      (_, i) => input.slice(i, i + 2)
    ));
    // console.debug(pairs);
    const solution = pairs
      .map(pair => this.findShortestPathForNums(pair))
      .join('');
    // console.debug(solution);
    return solution.length;
  }

  public getNumberFromInput(input: string): number {
    return Number.parseInt(input.replace(/A/g, ''));
  }

  public findShortestPathForNums(input: string): string {
    const paths = this.shortestPathsOnNumPad[input as keyof typeof this.shortestPathsOnNumPad];
    const results = paths.map(path => {
      // console.debug(path);
      return this.findAllPathsForArrows(path);
    }).flat();
    // console.debug(results);
    const shortest = results.reduce((acc, path) => {
      return acc.length < path.length ? acc : path;
    }, results[0]);

    return shortest;
  }

  public findAllPathsForArrows(input: string): string[] {
    const pairs = [`A${input[0]}`].concat(Array.from(
      { length: input.length - 1 },
      (_, i) => input.slice(i, i + 2)
    ));
    // console.debug(pairs);
    const maps = pairs.map(pair => this.shortestPathsOnArrowPad[pair as keyof typeof this.shortestPathsOnArrowPad]
      .map(path => {
        // console.debug(`Checking pair ${pair} path ${path}`);
        const pathPairs = [`A${path[0]}`].concat(Array.from(
          { length: path.length - 1 },
          (_, i) => path.slice(i, i + 2)
        ));
        const subpairs = pathPairs.map(subpair => this.shortestPathsOnArrowPad[subpair as keyof typeof this.shortestPathsOnArrowPad]);
        return this.generateCombinations(subpairs).map(comb => comb.join(''));
      }).flat());
    // maps.forEach( console.debug);
    return this.generateCombinations(maps).map(x => x.join(''));

  }

  private generateCombinations(lists: string[][]): string[][] {
    // Handle empty input or single empty list
    if (!lists.length) return [];
    if (lists.length === 1) return lists[0].map(item => [item]);

    // Take the first list and generate combinations with the rest
    const [first, ...rest] = lists;
    const combinationsOfRest = this.generateCombinations(rest);

    // Combine each item from the first list with all combinations of the rest
    return first.flatMap(item =>
      combinationsOfRest.map(combination => [item, ...combination])
    );
  }

  protected shortestPathsOnNumPad = {
    '0A': ['>A'],
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
  };
  protected shortestPathsOnArrowPad = {
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
};
