export class Solver {
  private towelPatterns: string[] = [];
  private designs: string[] = [];

  // region getters
  public getTowelPatterns(): string[] {
    return this.towelPatterns;
  }

  public getDesigns(): string[] {
    return this.designs;
  }

  // endregion getters

  // region setters
  public setTowelPatterns(towelPatterns: string[]): void {
    this.towelPatterns = towelPatterns;
  }

  public setDesigns(designs: string[]): void {
    this.designs = designs;
  }

  // endregion setters

  public parseInput(input: string): void {
    const lines = input.split('\n').filter((line) => line.length > 0);
    this.setTowelPatterns(lines[0].split(', '));
    this.setDesigns(lines.slice(1, lines.length));
  }

  public printData(): void {
    console.log(this.towelPatterns);
    console.log(this.designs);
  }

  public removeUnusedTowelPatterns(): void {
    this.towelPatterns = this.towelPatterns.filter(pattern => this.designs.some(design => design.includes(pattern)));
  }

  public getTowelPatternsThatCanBeUsedInDesign(design: string): string[] {
    return this.towelPatterns.filter(pattern => design.includes(pattern));
  }

  public checkIfDesignCanBeCreated(design: string): boolean {
    // console.debug(`Checking if ${design} can be created using available towel patterns`);
    const result = this.towelPatterns.some(pattern => {
      if (design === pattern) {
        // console.debug(`Found exact match for design ${design}`);
        return true;
      }
      if (design.startsWith(pattern)) {
        // console.debug(`Design can start with ${pattern}. Checking again with ${design.slice(pattern.length)}`);
        return this.checkIfDesignCanBeCreated(design.slice(pattern.length));
      }
      return false;
    });
    // console.debug(`Design ${design} can be created: ${result}`);

    return result;
  }

  private possibleNumberOfWays: Record<string, number> = {};

  public countWaysDesignCanBeCreated(design: string): number {
    // console.debug(`Checking how many times design ${design} can be created using available towel patterns`);
    if (design in this.possibleNumberOfWays) {
      return this.possibleNumberOfWays[design];
    }
    if (design === '') {
      // console.debug('Found matching design')
      return 1;
    }
    const result = this.towelPatterns.map(pattern => {
      if (design.startsWith(pattern)) {
        const counter = this.countWaysDesignCanBeCreated(design.slice(pattern.length));
        return counter;
      }
      return 0;
    }).reduce((sum, current) => sum += current, 0);
    this.possibleNumberOfWays[design] = result;

    // console.debug(`Design ${design} can be created ${result} ways`);
    return result;
  }

  public countTotalNumberOfWaysToCreateDesigns(): number {
    return this.designs.map(design => {
      // const allPatterns = cloneDeep(this.towelPatterns);
      // const possiblePatterns = this.getTowelPatternsThatCanBeUsedInDesign(design);
      // console.debug(`Possible patterns for ${design} are (total of ${possiblePatterns.length})`, possiblePatterns);
      // this.setTowelPatterns(possiblePatterns);
      const result = this.countWaysDesignCanBeCreated(design);
      // this.setTowelPatterns(allPatterns);
      // console.debug(`Design ${design} can be created ${result} ways.`)
      return result;
    })
      .reduce((sum, current) => sum += current, 0);
  }

  public countDesignsThatCanBeCreated(): number {
    return this.designs.filter(design => this.checkIfDesignCanBeCreated(design)).length;
  }
}
