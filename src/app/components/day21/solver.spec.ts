import { Solver } from './solver';

const DAY_21_TEST1_INPUT = `029A
980A
179A
456A
379A`;
describe('Day 21: Keypad Conundrum', () => {
  describe('Parsing input', () => {
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
  })

  describe('Finding shortest path for 2 robots', () => {
    test.each([
      ['029A', 68],
      ['980A', 60],
      ['179A', 68],
      ['456A', 64],
      ['379A', 64],
      ['805A', 72],
      ['964A', 72],
      ['459A', 74],
      ['968A', 70],
      ['671A', 74]
    ])(`should solve first task for %s`, (input, expected) => {
      const solver = new Solver();
      const calculatedSolution = solver.calculateShortestPathFor(input, 2);
      expect(calculatedSolution).toBe(expected)
    });
  });

  describe('Finding solution for examples with 2 robots', () => {

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
        solution: solver.calculateShortestPathFor(subtask, 2),
        numericValue: solver.getNumberFromInput(subtask)
      }))
      console.debug(subtaskSolutions);
      const solution = subtaskSolutions.reduce((acc, subtask) => acc + subtask.solution * subtask.numericValue, 0);
      expect(solution).toEqual(126384);
    })
  })

  describe('Final examples', () => {
    it('should solve final example for task 1', () => {
      const solver = new Solver();
      const solutions = ['805A', '964A', '459A', '968A','671A'].map(subtask => ({
        subtask,
        solution: solver.calculateShortestPathFor(subtask, 2),
        numericValue: solver.getNumberFromInput(subtask)
      }));
      console.debug(solutions);
      const solution = solutions.reduce((acc, subtask) => acc + subtask.solution * subtask.numericValue, 0);
      console.debug(solution);
      expect(solution).toEqual(278748);
    })
    it('should solve final example for task 2', () => {
      const solver = new Solver();
      const solutions = ['805A', '964A', '459A', '968A','671A'].map(subtask => ({
        subtask,
        solution: solver.calculateShortestPathFor(subtask, 25),
        numericValue: solver.getNumberFromInput(subtask)
      }));
      console.debug(solutions);
      const solution = solutions.reduce((acc, subtask) => acc + subtask.solution * subtask.numericValue, 0);
      console.debug(solution);
      expect(solution).toEqual(337744744231414);
    })
  })
})
