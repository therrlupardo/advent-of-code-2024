export class Solver {
  public parseInputData(input: string): {
    memory: Memory;
    calculations: Calculation[];
  } {
    const memory: Memory = input
      .split('\n\n')[0]
      .split('\n')
      .filter((x) => x.length > 0)
      .map((x) => x.split(':').map((y) => y.trim()))
      .reduce((result, entry) => {
        result[entry[0]] = +entry[1];
        return result;
      }, {} as Memory);
    const calculations = input
      .split('\n\n')[1]
      .split('\n')
      .filter((x) => x.length > 0)
      .map((x) => x.split(' ').map((y) => y.trim()))
      .map(
        (entry) =>
          ({
            operands: [entry[0], entry[2]],
            operation: entry[1] as OperationType,
            target: entry[4],
          } satisfies Calculation)
      );

    return {
      memory: this.fillMemoryWithOperands(memory, calculations),
      calculations,
    };
  }

  public fillMemoryWithOperands(
    memory: Memory,
    instructions: Calculation[]
  ): Memory {
    instructions.forEach((calculation) => {
      [
        calculation.target,
        calculation.operands[0],
        calculation.operands[1],
      ].forEach((operand) => {
        if (!(operand in memory)) {
          memory[operand] = undefined;
        }
      });
    });
    return memory;
  }

  public getVariablesToBeCalculated(memory: Memory, sign = 'z'): string[] {
    return Object.keys(memory).filter((key) => key.startsWith(sign ?? 'z'));
  }

  public areAllNeededVariablesCalculated(memory: Memory): boolean {
    const neededVariables = this.getVariablesToBeCalculated(memory);
    return neededVariables.every((key) => memory[key] !== undefined);
  }

  public calculateAsMuchAsPossible(
    calculations: Calculation[],
    memory: Memory
  ): {
    memory: Memory;
    calculations: Calculation[];
  } {
    const remainingCalculations: Calculation[] = [];
    calculations.forEach((calculation) => {
      const value1 = memory[calculation.operands[0]];
      const value2 = memory[calculation.operands[1]];
      if (value1 !== undefined && value2 !== undefined) {
        memory[calculation.target] = this.calculate(
          value1,
          value2,
          calculation.operation
        );
      } else if (
        (value1 === 0 || value2 === 0) &&
        calculation.operation === 'AND'
      ) {
        memory[calculation.target] = 0;
      } else if (
        (value1 === 1 || value2 === 1) &&
        calculation.operation === 'OR'
      ) {
        memory[calculation.target] = 1;
      } else {
        remainingCalculations.push(calculation);
      }
    });
    return { memory, calculations: remainingCalculations };
  }

  private calculate(
    operand1: number,
    operand2: number,
    operation: OperationType
  ): number {
    switch (operation) {
      case 'AND':
        return operand1 & operand2;
      case 'OR':
        return operand1 | operand2;
      case 'XOR':
        return operand1 ^ operand2;
    }
  }

  public calculateTask1Result(memory: Memory): number {
    const neededVariables = this.getVariablesToBeCalculated(memory)
      .sort()
      .reverse();
    const binaryString = neededVariables.reduce(
      (acc, key) => acc + memory[key],
      ''
    );
    console.debug('Result in binary', binaryString);
    return parseInt(binaryString, 2);
  }

  public solveTask1(input: string): number {
    let { memory, calculations } = this.parseInputData(input);
    while (!this.areAllNeededVariablesCalculated(memory)) {
      const result = this.calculateAsMuchAsPossible(calculations, memory);
      memory = result.memory;
      calculations = result.calculations;
    }
    return this.calculateTask1Result(memory);
  }

  public memoryAfterSolutionToPart1(input: string): Memory {
    let { memory, calculations } = this.parseInputData(input);
    while (!this.areAllNeededVariablesCalculated(memory)) {
      const result = this.calculateAsMuchAsPossible(calculations, memory);
      memory = result.memory;
      calculations = result.calculations;
    }
    return memory;
  }

  public findInitialValues(memory: Memory): [string, string] {
    const variablesX = this.getVariablesToBeCalculated(memory, 'x')
      .sort()
      .reverse();
    const xValue = variablesX.reduce((acc, key) => acc + memory[key], '');
    const variablesY = this.getVariablesToBeCalculated(memory, 'y')
      .sort()
      .reverse();
    const yValue = variablesY.reduce((acc, key) => acc + memory[key], '');
    return [xValue, yValue];
  }

  public convertToGraph(memory: Memory, calculations: Calculation[]): string {
    let result = '';
    Object.keys(memory).forEach((key) => (result += `${key}\n`));
    calculations.forEach((calculation) => {
      result += `${calculation.operands[0]} ${calculation.target}\n`;
      result += `${calculation.operands[1]} ${calculation.target}\n`;
    });
    console.debug(result);
    return result;
  }

  public printData(memory: Memory, calculations: Calculation[]) {
    console.debug(
      'Memory:',
      Object.keys(memory)
        .map((key) => `${key}: ${memory[key]}`)
        .join('\n')
    );
    console.debug(
      'Calculations:',
      calculations
        .sort((a, b) => a.target.localeCompare(b.target))
        .map(
          (calculation) =>
            `${calculation.target} = ${calculation.operands[0]} ${calculation.operation} ${calculation.operands[1]}`
        )
        .join('\n')
    );
  }

  public checkIfMachineIsWorking(
    memory: Memory,
    calculations: Calculation[]
  ): boolean {
    const neededVariables = this.getVariablesToBeCalculated(memory)
      .sort()
      .filter((key) => key !== 'z00' && key !== 'z01' && key !== 'z45');
    console.debug('Needed variables:', neededVariables);
    let carry = 'dnc';
    return neededVariables.every((key, index) => {
      const calculation = calculations.find((c) => c.target === key);
      if (!calculation) {
        throw new Error(`Calculation for ${key} not found`);
      }
      const result = this.isCorrectZnCalculation(
        index + 2,
        calculation,
        calculations,
        carry
      );
      if (result) {
        const carryOperation = calculations.find(c => c.operation === 'AND'
          && c.operands.includes(calculation.operands[0])
          && c.operands.includes(calculation.operands[1])
        );
        if (!carryOperation) {
          throw new Error(`Carry operation for ${key} not found`);
        }
        carry = carryOperation.target;
        console.debug('New carry:', carry);
      }
      return true;
    })
  }

  private isCorrectZnCalculation(
    n: number,
    calculation: Calculation,
    allCalculations: Calculation[],
    carry: string
  ): boolean {
    console.debug(`Checking if ${calculation.target} is correct`);
    if (!calculation.target.startsWith('z')) {
      throw new Error(`Target ${calculation.target} does not start with z`);
    }
    if (calculation.operation !== 'XOR') {
      throw new Error(`[${calculation.target}] Operation ${calculation.operation} is not XOR`);
    }
    console.debug(`[${calculation.target}] has correct operation`);
    const calculation1 = allCalculations.find(
      (c) => c.target === calculation.operands[0]
    );
    const calculation2 = allCalculations.find(
      (c) => c.target === calculation.operands[1]
    );
    if (!calculation1 || !calculation2) {
      throw new Error(`[${calculation.target}] Calculation ${calculation.target} has missing operand`);
    }
    if (calculation1.operation === 'OR') {
      console.debug(`[${calculation.target}] checking if ${calculation1.target} is B, and ${calculation2.target} is A`);
      const result = (
        this.isCorrectBnCalculation(n, calculation1, allCalculations, carry) &&
        this.isCorrectAnCalculation(n, calculation2)
      );
      console.debug(`[${calculation.target}] result: ${result}`);
      return result;
    } else {
      console.debug(`[${calculation.target} checking if ${calculation1.target} is A, and ${calculation2.target} is B`);
      const result = (
        this.isCorrectAnCalculation(n, calculation1) &&
        this.isCorrectBnCalculation(n, calculation2, allCalculations, carry)
      );
      console.debug(`[${calculation.target}] result: ${result}`);
      return result;
    }
  }

  private isCorrectBnCalculation(
    n: number,
    calculation: Calculation,
    allCalculations: Calculation[],
    carry: string
  ): boolean {
    if (!calculation.operands.includes(carry)) {
      throw new Error(`[${calculation.target}] Calculation ${calculation.target} does not include carry`);
    }
    const calculationC = allCalculations.find(
      (c) => c.target === calculation.operands.find((op) => op !== carry)
    );
    if (!calculationC) {
      throw new Error(`[${calculation.target}] Calculation ${calculation.target} does not have C`);
    }
    if (calculationC.operation !== 'AND') {
      throw new Error(`[${calculation.target}] Calculation ${calculation.target} does not have AND operation`);
    }
    if (!calculationC.operands.includes(this.generateValueIndex('x', n-1))) {
      throw new Error(`[${calculation.target}] Calculation ${calculation.target} does not have x operand`);
    }
    if (!calculationC.operands.includes(this.generateValueIndex('y', n-1))) {
      throw new Error(`[${calculation.target}] Calculation ${calculation.target} does not have y operand`);
    }
    return true;
  }

  private generateValueIndex(variable: string, index: number): string {
    const formattedIndex = index < 10 ? `0${index}` : `${index}`;
    return `${variable}${formattedIndex}`;
  }

  private isCorrectAnCalculation(n: number, calculation: Calculation): boolean {
    if (calculation.operation !== 'XOR') {
      throw new Error(`[${calculation.target}] Operation ${calculation.operation} is not XOR`);
    }
    if (!calculation.operands.includes(this.generateValueIndex('x', n))) {
      throw new Error(`[${calculation.target}] Calculation ${calculation.target} does not have x operand`);
    }
    if (!calculation.operands.includes(this.generateValueIndex('y', n))) {
      throw new Error(`[${calculation.target}] Calculation ${calculation.target} does not have y operand`);
    }
    return true;
  }
}

type Memory = Record<string, number | undefined>;
type OperationType = 'AND' | 'OR' | 'XOR';

interface Calculation {
  target: string;
  operation: OperationType;
  operands: [string, string];
}
