export class Day17Solver {
  private readonly registries: Registries = {
    a: BigInt(0),
    b: BigInt(0),
    c: BigInt(0)
  };
  private instructions: InstructionType[] = [];
  private output: bigint[] = [];

  // region getters
  public getRegistryA(): bigint {
    return this.registries.a;
  }

  public getRegistryB(): bigint {
    return this.registries.b;
  }

  public getRegistryC(): bigint {
    return this.registries.c;
  }

  public getInstructions(): string {
    return this.instructions.join(',');
  }

  public getOutput(): string {
    return this.output.join(',');
  }

  // endregion getters

  // region setters
  public setRegistryA(value: bigint): void {
    this.registries.a = value;
  }

  public setRegistryB(value: bigint): void {
    this.registries.b = value;
  }

  public setRegistryC(value: bigint): void {
    this.registries.c = value;
  }

  public setInstructions(instructions: (InstructionType)[]): void {
    this.instructions = instructions;
  }

  // endregion setters

  private addToOutput(value: bigint): void {
    this.output.push(value);
  }

  public parseInput(input: string): void {
    const lines = input.split('\n').filter(Boolean);
    this.setRegistryA(BigInt(+lines[0].split(': ')[1]));
    this.setRegistryB(BigInt(+lines[1].split(': ')[1]));
    this.setRegistryC(BigInt(+lines[2].split(': ')[1]));
    this.setInstructions(lines[3].split(': ')[1].split(',') as InstructionType[]);
  }

  // region operator handlers
  public handleADV(combo: ComboOperand): void {
    const numerator = this.getRegistryA();
    const denominator = BigInt(2) ** this.getComboValue(combo);
    const result = numerator / denominator;
    // console.debug(`Handling ADV floor(${numerator}/${denominator})=${result}`);
    this.setRegistryA(result);
  }

  public handleBXL(literalOperand: LiteralOperand): void {
    const registryB = this.getRegistryB();
    const result = registryB ^ BigInt(+literalOperand);
    // console.debug(`Handling BXL ${registryB} ^ ${literalOperand} = ${result}`);
    this.setRegistryB(result);
  }

  public handleBST(combo: ComboOperand): void {
    const comboValue = this.getComboValue(combo);
    const result = comboValue % BigInt(8);
    // console.debug(`Handling BST ${comboValue} % 8 = ${result}`);
    this.setRegistryB(result);
  }

  public handleJNZ(literalOperand: LiteralOperand): number | undefined {
    const registryA = this.getRegistryA();
    const nextStep = registryA === BigInt(0) ? undefined : +literalOperand;
    // console.debug(`Handling JNZ - next step is ${nextStep} because REG_A=${registryA}`);
    return nextStep;
  }

  public handleBXC(): void {
    const registryB = this.getRegistryB();
    const registryC = this.getRegistryC();
    const result = registryB ^ registryC;
    // console.debug(`Handling BXC ${registryB} ^ ${registryC} = ${result}`);
    this.setRegistryB(result);
  }

  public handleOUT(combo: ComboOperand, withComparingOutput = false): void {
    const comboValue = this.getComboValue(combo);
    const result = comboValue % BigInt(8);
    // console.debug(`Handling OUT ${comboValue} % 8 = ${result}`);
    this.addToOutput(result);
    if (withComparingOutput) {
      for (let i = 0; i < this.output.length; i++) {
        if (this.output[i]?.toString() !== this.instructions[i]) {
          throw new Error(`Output ${this.output} is not equal to instructions ${this.instructions}`);
        }
      }
    }
  }

  public handleBDV(combo: ComboOperand): void {
    const numerator = this.getRegistryA();
    const denominator = BigInt(2) ** this.getComboValue(combo);
    const result = numerator / denominator;
    // console.debug(`Handling BDV floor(${numerator}/${denominator})=${result}`);
    this.setRegistryB(result);
  }

  public handleCDV(combo: ComboOperand): void {
    const numerator = this.getRegistryA();
    const denominator = BigInt(2) ** this.getComboValue(combo);
    const result = numerator / denominator;
    // console.debug(`Handling CDV floor(${numerator}/${denominator})=${result}`);
    this.setRegistryC(result);
  }

  // endregion operator handlers

  public runInstructions(withComparingOutput = false): void {
    let index: number | undefined = 0;
    // console.debug('Running instructions', this.instructions, this.instructions.length);
    // let iterations = 0;
    while (index !== undefined && index < this.instructions.length) {
      // // console.debug(`Index ${index} is not undefined and it's smaller than ${this.instructions.length}`)
      const instruction = this.instructions[index];
      // console.debug(`Handling instruction ${instruction} on index ${index}`);
      switch (instruction) {
        case Operator.ADV:
          this.handleADV(this.instructions[index + 1] as ComboOperand);
          index += 2;
          break;
        case Operator.BXL:
          this.handleBXL(this.instructions[index + 1] as LiteralOperand);
          index += 2;
          break;
        case Operator.BST:
          this.handleBST(this.instructions[index + 1] as ComboOperand);
          index += 2;
          break;
        case Operator.JNZ:
          index = this.handleJNZ(this.instructions[index + 1] as LiteralOperand);
          break;
        case Operator.BXC:
          this.handleBXC();
          index += 2;
          break;
        case Operator.OUT:
          this.handleOUT(this.instructions[index + 1] as ComboOperand, withComparingOutput);
          index += 2;
          break;
        case Operator.BDV:
          this.handleBDV(this.instructions[index + 1] as ComboOperand);
          index += 2;
          break;
        case Operator.CDV:
          this.handleCDV(this.instructions[index + 1] as ComboOperand);
          index += 2;
          break;
      }
      // // console.debug(`Index after loop: ${index}`);
      // if(iterations > 10) {
      //   // console.debug('Early break');
      //   return;
      // }
      // iterations++;
    }
  }

  public task2Slow(): bigint {
    let regA = BigInt(0);
    while (true) {
      if (regA % BigInt(100_000) === BigInt(0)) {
        console.debug(`Checking ${regA}`);
      }
      this.setRegistryA(regA);
      this.setRegistryB(BigInt(0));
      this.setRegistryC(BigInt(0));
      this.output = [];
      try {
        this.runInstructions(true);
        // console.debug(`Compare output=${this.getOutput()} to instructions=${this.getInstructions()}`);
        if (this.getOutput() === this.getInstructions()) {
          console.debug(`Found solution for REG_A=${regA}`);
          return regA;
        }
      } catch (error) {
        // do nothing
      } finally {
        regA++;
      }
    }
  }

  public task2Faster(): number {
    let possibleMatches = [0];
    this.instructions.reverse().forEach((instruction, index) => {
      console.debug(`Looking for 3-bit for instruction ${instruction} at ${index}`);
      possibleMatches = possibleMatches.map(match => this.searchForMatchForInstruction(match, +instruction)).flat();
      if (possibleMatches.length === 0) {
        throw new Error('Match not found');
      }
      console.debug(`Possible starts: ${possibleMatches.map(match => match.toString(2)).join(',')}`);
    });
    const a = possibleMatches.map(value => Math.floor(value / 8)).reduce((min, curr) => Math.min(min, curr), Number.MAX_SAFE_INTEGER);
    console.debug(`Found A = ${a} (${a.toString(2)})`);
    return a;
  }

  private searchForMatchForInstruction(startingNumber: number, instruction: number): number[] {
    const possibleMatches = [];
    for (let i = 0; i < 8; i++) {
      if (startingNumber === 0 && i === 0) {
        console.debug('Skipping start from 0');
        continue;
      }
      const a0 = startingNumber + i;
      const b0 = (a0 % 8) ^ 1;
      const c = Math.floor(a0 / Math.pow(2, b0));
      const b1 = BigInt(b0) ^ BigInt(c);
      const b2 = b1 ^ BigInt(4);
      console.debug(`Checking a0=${a0}, b0=${b0}, c=${c}, b1=${b1}, b2=${b2}, mod=${BigInt(b2 % BigInt(8))} for instruction=${instruction}`);
      if (BigInt(b2) % BigInt(8) === BigInt(+instruction)) {
        possibleMatches.push(a0 * 8);
        console.debug(`Found possible part of A -> ${(a0 * 8).toString(2)}`);
        // break;
      }
    }
    return possibleMatches;
  }

  public getComboValue(combo: ComboOperand): bigint {
    switch (combo) {
      case ComboOperand.LITERAL_0:
      case ComboOperand.LITERAL_1:
      case ComboOperand.LITERAL_2:
      case ComboOperand.LITERAL_3:
        return BigInt(+combo);
      case ComboOperand.REGISTRY_A:
        return this.getRegistryA();
      case ComboOperand.REGISTRY_B:
        return this.getRegistryB();
      case ComboOperand.REGISTRY_C:
        return this.getRegistryC();
      case ComboOperand.ILLEGAL:
        throw new Error('Combo 7 is reserved and should not appear in valid programs');
      default:
        throw new Error(`Unknown combo ${combo}`);
    }
  }
}

export enum Operator {
  ADV = '0',
  BXL = '1',
  BST = '2',
  JNZ = '3',
  BXC = '4',
  OUT = '5',
  BDV = '6',
  CDV = '7',
}

export enum ComboOperand {
  LITERAL_0 = '0',
  LITERAL_1 = '1',
  LITERAL_2 = '2',
  LITERAL_3 = '3',
  REGISTRY_A = '4',
  REGISTRY_B = '5',
  REGISTRY_C = '6',
  ILLEGAL = '7'
}

export type LiteralOperand = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

export type InstructionType = Operator | ComboOperand | LiteralOperand;

interface Registries {
  a: bigint;
  b: bigint;
  c: bigint;
}
