export class Solver {
  public calculateSecretNumberForDays(initialNumber: bigint, days: number): bigint {
    if (days === 0) {
      return initialNumber;
    }
    const step1 = this.prune(this.mix(initialNumber, initialNumber * BigInt(64)));
    const step2 = this.prune(this.mix(step1, BigInt(step1 / BigInt(32))));
    const step3 = this.prune(this.mix(step2, step2 * BigInt(2048)));
    return this.calculateSecretNumberForDays(step3, days - 1);
  }

  private mix(value1: bigint, value2: bigint): bigint {
    return value1 ^ value2;
  }

  private prune(value: bigint): bigint {
    return value % BigInt(16777216);
  }

  public parseInput(input: string): bigint[] {
    return input.split('\n').filter(x => x.length > 0).map(x => BigInt(x));
  }

  public solveTask1(input: bigint[]): bigint {
    return input.map(entry => this.calculateSecretNumberForDays(entry, 2000))
      .reduce((acc, curr) => acc + curr, BigInt(0));
  }

  public solveTask2(input: bigint[]): bigint {
    const combinations = this.prepareCombinations();
    const maps = input.map(entry => this.getStringValueOfDiffs(entry, 2000));
    const result = this.getNumberOfCombinationsFor(combinations, maps);
    console.debug(result);

    const max = result.reduce((acc, curr) => Math.max(acc, curr.count), -1);
    console.debug(`Max: ${max}`);
    const combination = result.find(x => x.count === max)?.combination ?? '';
    console.debug(`Combination: ${combination}`);
    if (!combination) {
      throw new Error('Combination not found');
    }
    return BigInt(max);
  }

  public getNumberOfCombinationsFor(combinations: string[], maps: Data[]) {
    return combinations.map(combination => {
      // console.debug(`Get number of occurrences of ${combination} in maps`);
      return { combination, count: maps.map((map, _index) => {
          const index = map.diff.indexOf(combination);
          // console.debug(`Searching in map ${_index}. ` + (index !== -1 ? `Found at ${index}. Adding price of ${map.prices[index + 4]}.`: 'Adding 0'))
          // moving 4 ahead -> as there is 1 more entry in prices (as for initial value) + next ones for length of searched string
          return index === -1 ? 0 : +map.prices[index + 4];
        }).reduce((sum, curr) => sum + curr, 0) };
    });
  }

  public getStringValueOfDiffs(value: bigint, days: number, prev: Data = { diff: '', prices: ''}): Data {
    if (prev.prices === '') {
      prev.prices += (value % BigInt(10)).toString();
    }
    if (days === 0) {
      return prev;
    }
    const nextValue = this.calculateSecretNumberForDays(value, 1);
    const currentPrice = value % BigInt(10);
    const nextPrice = nextValue % BigInt(10);
    const diff = nextPrice - currentPrice;
    // console.debug(`Checking diff ${diff} from ${value} to ${nextValue}`);
    // console.debug(`${value % BigInt(10)} % ${nextValue % BigInt(10)} = ${diff}`);
    return this.getStringValueOfDiffs(nextValue, days - 1, {
      diff: prev.diff + this.getSequenceCharacter(diff),
      prices: prev.prices + (nextValue % BigInt(10))?.toString()
    });
  }

  public prepareCombinations(): string[] {
    const numbers = Array.from({ length: 19 }, (_, i) => BigInt(i - 9));
    const results: string[] = [];
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < numbers.length; j++) {
        for (let k = 0; k < numbers.length; k++) {
          for (let l = 0; l < numbers.length; l++) {
            const combination = [
              this.getSequenceCharacter(numbers[i]),
              this.getSequenceCharacter(numbers[j]),
              this.getSequenceCharacter(numbers[k]),
              this.getSequenceCharacter(numbers[l])
            ].join('');
            results.push(combination);
          }
        }
      }
    }
    return results;
  }

  private getSequenceCharacter(value: bigint): string {
    // console.debug(`Get sequence value for ${value}`);
    if (value >= 0) {
      return String(value);
    }
    switch(value) {
      case BigInt(-1): return 'A';
      case BigInt(-2): return 'B';
      case BigInt(-3): return 'C';
      case BigInt(-4): return 'D';
      case BigInt(-5): return 'E';
      case BigInt(-6): return 'F';
      case BigInt(-7): return 'G';
      case BigInt(-8): return 'H';
      case BigInt(-9): return 'I';
    }
    throw new Error(`Invalid value ${value}`);
  }
}

interface Data {
  diff: string;
  prices: string;
}
