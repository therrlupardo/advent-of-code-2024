import { Solver } from './solver';

const DAY_21_TEST1_INPUT = `029A
980A
179A
456A
379A`;
describe('Day 21: Keypad Conundrum', () => {
  it('should parse input', () => {
    const solver = new Solver();
    solver.parseInput(DAY_21_TEST1_INPUT);
    const codes = solver.getCodes();
    expect(codes.length).toBe(5);
    expect(codes[0]).toBe('029A');
    expect(codes[1]).toBe('980A');
    expect(codes[2]).toBe('179A');
    expect(codes[3]).toBe('456A');
    expect(codes[4]).toBe('379A');

  });
  it('should give solution for first step', () => {
    const solver = new Solver();
    const solution = solver.solveFirstStep('029A');
    console.debug(solution);
    expect(solution).toHaveLength(12)
  })

  test.each([
    ['029A', 68],
    ['980A', 60],
    ['179A', 68],
    ['456A', 64],
    ['379A', 64]
  ])(`should solve first task for %s`, (input, expected) => {
    const solver = new Solver();
    const solution = solver.solveFirstTaskFor(input);
    expect(solution).toBe(expected);
  });

  test.each([
    ['029A', 29],
    ['980A', 980],
    ['179A', 179],
    ['456A', 456],
    ['379A', 379]
  ])('should get number from input %s', (input, expected) => {
    const solver = new Solver();
    const solution = solver.getNumberFromInput(input);
    expect(solution).toBe(expected);
  });

  it('should solve entire task 1 example', () => {
    const solver = new Solver();
    const subtasks = solver.parseInput(DAY_21_TEST1_INPUT);
    const subtaskSolutions = subtasks.map(subtask => ({
      subtask,
      solution: solver.solveFirstTaskFor(subtask),
      numericValue: solver.getNumberFromInput(subtask)
    }))
    console.debug(subtaskSolutions);
    const solution = subtaskSolutions.reduce((acc, subtask) => acc + subtask.solution * subtask.numericValue, 0);
    // const solution = subtasks.reduce((acc, subtask) => acc + solver.solveFirstTaskFor(subtask) * solver.getNumberFromInput(subtask), 0);
    expect(solution).toEqual(126384);
  })

  it('should check test values', () => {
    const solver = new Solver();
    const option = ['<<^^', '^^<<', '<^<^', '^<^<', '<^^<', '^<<^'];
    const result = option.map(opt => solver.solveSecondStep(opt));
    console.debug(option.map((opt, i) => (`${opt}: ${result[i]} (${result[i].length})`)));
    expect(result).toHaveLength(6);
  })

  it('should find shortest path for nums', () => {
    const solver = new Solver();
    expect(solver.findShortestPathForNums('37')).toBe('v<A<AA>^>AAvA^<A>AAvA^A')
  })

  it('should solve final example for task 1', () => {
    const solver = new Solver();
    const solutions = ['805A', '964A', '459A', '968A','671A'].map(subtask => ({
      subtask,
      solution: solver.solveFirstTaskFor(subtask),
      numericValue: solver.getNumberFromInput(subtask)
    }));
    console.debug(solutions);
    const solution = solutions.reduce((acc, subtask) => acc + subtask.solution * subtask.numericValue, 0);
    console.debug(solution);
    expect(solution).toEqual(278748);
  })
})
