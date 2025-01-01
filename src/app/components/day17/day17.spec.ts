import { ComboOperand, Day17Solver, LiteralOperand } from './day17Solver';

describe('Day 17', () => {
  describe('Parser', () => {
    it('Big example 1', () => {
      const input = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;

      const solver = new Day17Solver();
      solver.parseInput(input);
      expect(solver.getRegistryA()).toEqual(BigInt(729));
      expect(solver.getRegistryB()).toEqual(BigInt(0));
      expect(solver.getRegistryC()).toEqual(BigInt(0));
      expect(solver.getInstructions()).toEqual('0,1,5,4,3,0')
    });
  });
  describe('Getting combo value', () => {
    let solver: Day17Solver;
    beforeEach(() => {
      solver = new Day17Solver();
      solver.setRegistryA(BigInt(1000));
      solver.setRegistryB(BigInt(2000));
      solver.setRegistryC(BigInt(3000));
    });
    test.each([
      [ComboOperand.LITERAL_0, BigInt(0)],
      [ComboOperand.LITERAL_1, BigInt(1)],
      [ComboOperand.LITERAL_2, BigInt(2)],
      [ComboOperand.LITERAL_3, BigInt(3)],
      [ComboOperand.REGISTRY_A, BigInt(1000)],
      [ComboOperand.REGISTRY_B, BigInt(2000)],
      [ComboOperand.REGISTRY_C, BigInt(3000)]
    ])('should return correct value for combo %s', (combo: ComboOperand, correctValue: bigint) => {
      expect(solver.getComboValue(combo)).toEqual(correctValue);
    });
    // FIXME: 31-12-2024 mateusz.buchajewicz dlaczego nie działa łapie że leci wyjątek?
    // it('should throw error for getting value for combo=7', () => {
    //   expect(solver.getComboValue('7' as Combo)).toThrow('Combo 7 is reserved and should not appear in valid programs');
    // })
  });
  describe('Handling ADV', () => {
    it('should correctly set value of registry A if A=10, combo=1', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.handleADV(ComboOperand.LITERAL_1);
      expect(solver.getRegistryA()).toEqual(BigInt(5));
    });
    it('should correctly set value of registry A if A=10, combo=2', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.handleADV(ComboOperand.LITERAL_2);
      expect(solver.getRegistryA()).toEqual(BigInt(2));
    });
    it('should correctly set value of registry A if A=10, combo=3', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.handleADV(ComboOperand.LITERAL_3);
      expect(solver.getRegistryA()).toEqual(BigInt(1));
    });
    it('should correctly set value of registry A if A=10, B=2', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.setRegistryB(BigInt(2));
      solver.handleADV(ComboOperand.REGISTRY_B);
      expect(solver.getRegistryA()).toEqual(BigInt(2));
    });
    it('should correctly set value of registry A if A=10, C=2', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.setRegistryC(BigInt(2));
      solver.handleADV(ComboOperand.REGISTRY_C);
      expect(solver.getRegistryA()).toEqual(BigInt(2));
    });
  });
  describe('Handling BXL', () => {
    it('should handle BXL of B=29 and literal=7', () => {
      const solver = new Day17Solver();
      solver.setRegistryB(BigInt(29));
      solver.handleBXL('7');
      expect(solver.getRegistryB()).toEqual(BigInt(26));
    })
  });
  describe('Handling BST', () => {
    it('should handle BST for combo=REG_C,C=9', () => {
      const solver = new Day17Solver();
      solver.setRegistryC(BigInt(9));
      solver.handleBST(ComboOperand.REGISTRY_C);
      expect(solver.getRegistryB()).toEqual(BigInt(1));
    })
  });
  describe('Handling JNZ', () => {
    it('should return undefined if A=0', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(0));
      expect(solver.handleJNZ('0')).toBeUndefined();
    });
    test.each([
      ['0' as LiteralOperand, 0],
      ['1' as LiteralOperand, 1],
      ['2' as LiteralOperand, 2],
      ['3' as LiteralOperand, 3],
      ['4' as LiteralOperand, 4],
      ['5' as LiteralOperand, 5],
      ['6' as LiteralOperand, 6],
      ['7' as LiteralOperand, 7],
    ])('should return literalValue=%s if REG_A is NOT ZERO', (literal: LiteralOperand, numericValue: number) => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(1));
      expect(solver.handleJNZ(literal)).toEqual(numericValue);
    })
  });
  describe('Handling BXC', () => {
    it('should handle BXL of B=29 and C=7', () => {
      const solver = new Day17Solver();
      solver.setRegistryB(BigInt(29));
      solver.setRegistryC(BigInt(7));
      solver.handleBXC();
      expect(solver.getRegistryB()).toEqual(BigInt(26));
    })
  });
  describe('Handling OUT', () => {
    it('should correctly add values to output', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(4));
      solver.handleOUT(ComboOperand.LITERAL_0);
      solver.handleOUT(ComboOperand.LITERAL_1);
      solver.handleOUT(ComboOperand.REGISTRY_A);
      expect(solver.getOutput()).toEqual('0,1,4')
    })
  });
  describe('Handling BDV', () => {
    it('should correctly set value of registry B if A=10, combo=1', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.handleBDV(ComboOperand.LITERAL_1);
      expect(solver.getRegistryB()).toEqual(BigInt(5));
    });
    it('should correctly set value of registry B if A=10, combo=2', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.handleBDV(ComboOperand.LITERAL_2);
      expect(solver.getRegistryB()).toEqual(BigInt(2));
    });
    it('should correctly set value of registry B if A=10, combo=3', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.handleBDV(ComboOperand.LITERAL_3);
      expect(solver.getRegistryB()).toEqual(BigInt(1));
    });
    it('should correctly set value of registry B if A=10, B=2', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.setRegistryB(BigInt(2));
      solver.handleBDV(ComboOperand.REGISTRY_B);
      expect(solver.getRegistryB()).toEqual(BigInt(2));
    });
    it('should correctly set value of registry B if A=10, C=2', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.setRegistryC(BigInt(2));
      solver.handleBDV(ComboOperand.REGISTRY_C);
      expect(solver.getRegistryB()).toEqual(BigInt(2));
    });
  });
  describe('Handling CDV', () => {
    it('should correctly set value of registry C if A=10, combo=1', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.handleCDV(ComboOperand.LITERAL_1);
      expect(solver.getRegistryC()).toEqual(BigInt(5));
    });
    it('should correctly set value of registry C if A=10, combo=2', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.handleCDV(ComboOperand.LITERAL_2);
      expect(solver.getRegistryC()).toEqual(BigInt(2));
    });
    it('should correctly set value of registry C if A=10, combo=3', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.handleCDV(ComboOperand.LITERAL_3);
      expect(solver.getRegistryC()).toEqual(BigInt(1));
    });
    it('should correctly set value of registry C if A=10, B=2', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.setRegistryB(BigInt(2));
      solver.handleCDV(ComboOperand.REGISTRY_B);
      expect(solver.getRegistryC()).toEqual(BigInt(2));
    });
    it('should correctly set value of registry C if A=10, C=2', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.setRegistryC(BigInt(2));
      solver.handleCDV(ComboOperand.REGISTRY_C);
      expect(solver.getRegistryC()).toEqual(BigInt(2));
    });
  });
  describe('Handle example programs', () => {
    it('If register C contains 9, the program 2,6 would set register B to 1', ()=> {
      const solver = new Day17Solver();
      solver.setRegistryC(BigInt(9));
      solver.setInstructions(['2', '6']);
      solver.runInstructions();
      expect(solver.getRegistryB()).toEqual(BigInt(1));
    });
    it('If register A contains 10, the program 5,0,5,1,5,4 would output 0,1,2.', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(10));
      solver.setInstructions(['5', '0', '5', '1', '5', '4']);
      solver.runInstructions();
      expect(solver.getOutput()).toEqual('0,1,2');
    });
    it('If register A contains 2024, the program 0,1,5,4,3,0 would output 4,2,5,6,7,7,7,7,3,1,0 and leave 0 in register A', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(2024));
      solver.setInstructions(['0','1','5','4','3','0']);
      solver.runInstructions();
      expect(solver.getRegistryA()).toEqual(BigInt(0));
    });
    it('If register B contains 29, the program 1,7 would set register B to 26.', () => {
      const solver = new Day17Solver();
      solver.setRegistryB(BigInt(29));
      solver.setInstructions(['1','7']);
      solver.runInstructions();
      expect(solver.getRegistryB()).toEqual(BigInt(26));
    });
    it('If register B contains 2024 and register C contains 43690, the program 4,0 would set register B to 44354.', () => {
      const solver = new Day17Solver();
      solver.setRegistryB(BigInt(2024));
      solver.setRegistryC(BigInt(43690));
      solver.setInstructions(['4','0']);
      solver.runInstructions();
      expect(solver.getRegistryB()).toEqual(BigInt(44354));
    })
  });
  describe('Solve Task 1', () => {
    it('should solve full example', () => {
      const input = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;
      const solver = new Day17Solver();
      solver.parseInput(input);
      solver.runInstructions();
      expect(solver.getOutput()).toEqual('4,6,3,5,6,3,5,2,1,0');
    });
    it('should solve for final example', () => {
      const input = `Register A: 30553366
Register B: 0
Register C: 0

Program: 2,4,1,1,7,5,4,7,1,4,0,3,5,5,3,0`;
      const solver = new Day17Solver();
      solver.parseInput(input);
      solver.runInstructions();
      expect(solver.getOutput()).toEqual('1,3,7,4,6,4,2,3,5');

    })
  });
  describe('Solve Task 2', () => {
    it('should solve full example', () => {
      const solver = new Day17Solver();
      solver.setInstructions(['0','3','5','4','3','0']);
      expect(solver.task2Slow()).toEqual(BigInt(117440));
    });
    it('should solve final example', () => {
      const solver = new Day17Solver();
      solver.setInstructions(['2','4','1','1','7','5','4','7','1','4','0','3','5','5','3','0']);
      expect(solver.task2Faster()).toEqual(202367025818154);
    });
    it('try solution', () => {
      const solver = new Day17Solver();
      solver.setRegistryA(BigInt(202367025818154));
      solver.setRegistryB(BigInt(0));
      solver.setRegistryC(BigInt(0));
      solver.setInstructions(['2','4','1','1','7','5','4','7','1','4','0','3','5','5','3','0']);
      solver.runInstructions();
      expect(solver.getOutput()).toEqual('2,4,1,1,7,5,4,7,1,4,0,3,5,5,3,0')
    })
  });
})
