export class Solver {
  public parseInput(input: string): {locks: Lock[], keys: Key[]} {
    const locks: Lock[] = [];
    const keys: Key[] = [];
    input.trim().split('\n\n')
      .filter(x => x.length > 0)
      .map(e => e.split('\n').map(x => x.split('')))
      .map(entry => {
        if (entry[0].every(x => x === '.')) {
          // we have key
          const key: Key = [0, 0, 0, 0, 0];
          entry.forEach((row, index) => {
            if (index === entry.length - 1) {
              return;
            }
            row.forEach((cell, x) => {
              if (cell === '#') {
                key[x]++;
              }
            })
          })
          keys.push(key);
        }
        if (entry[0].every(x => x === '#')) {
          // we have lock
          const lock: Lock = [0, 0, 0, 0, 0];
          entry.forEach((row, index) => {
            if (index === 0) {
              return;
            }
            row.forEach((cell, x) => {
              if (cell === '#') {
                lock[x]++;
              }
            })
          });
          locks.push(lock);
        }
      })

    return {locks, keys};
  }

  public solvePart1(locks: Lock[], keys: Key[]): number {
    let matches = 0;
    locks.forEach(lock => {
      keys.forEach(key => {
        let isMatch = true;
        for (let i = 0; i < key.length; i++) {
          if (key[i] + lock[i] > 5) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          matches++;
        }
      })
    })
    return matches;
  }
}

type Lock = [number, number, number, number, number];
type Key = [number, number, number, number, number];
