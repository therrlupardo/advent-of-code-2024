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
}
