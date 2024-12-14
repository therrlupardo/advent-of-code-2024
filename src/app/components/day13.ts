import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AbstractDay } from './abstract-day';
import { map, Observable, of, tap } from 'rxjs';

const MEASUREMENT_ERROR = 10_000_000_000_000;

@Component({
  selector: 'aoc-day-13',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe],
})
export class Day13Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(13);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => this.preprocessData(data)),
      tap((data) => console.debug(data)),
      map((machines) =>
        machines
          .map((machine) => this.getAllWinningCombinationsForFirstTask(machine))
          .filter((combinations) => combinations !== undefined)
          .map((combination) => 3 * combination.pressA + combination.pressB)
          .reduce((sum, current) => sum + current, 0)
      ),
      tap((data) => console.debug(data))
    );
  }

  private preprocessData(data: string) {
    return data.split('\n\n').map((machine) => {
      const machineConfig = machine.split('\n');
      const buttonA = machineConfig[0]
        .replace('Button A: ', '')
        .replace('X+', '')
        .replace('Y+', '')
        .split(',')
        .map(Number);
      const buttonB = machineConfig[1]
        .replace('Button B: ', '')
        .replace('X+', '')
        .replace('Y+', '')
        .split(',')
        .map(Number);
      const prize = machineConfig[2]
        .replace('Prize: ', '')
        .replace('X=', '')
        .replace('Y=', '')
        .split(',')
        .map(Number);
      return {
        buttonA: { x: buttonA[0], y: buttonA[1] } as Button,
        buttonB: { x: buttonB[0], y: buttonB[1] } as Button,
        prize: { x: prize[0], y: prize[1] },
      };
    });
  }

  private getAllWinningCombinationsForFirstTask(
    machine: MachineConfig
  ): { pressA: number; pressB: number } | undefined {
    const numberOfButtonBPresses = (
      (machine.buttonA.y * machine.prize.x - machine.buttonA.x * machine.prize.y)
      / (machine.buttonA.y*machine.buttonB.x - machine.buttonA.x*machine.buttonB.y)
    )
    console.debug('Required number of button B presses:', numberOfButtonBPresses);
    if (numberOfButtonBPresses === Math.floor(numberOfButtonBPresses)) {
      const numberOfButtonAPresses = (machine.prize.x - machine.buttonB.x * numberOfButtonBPresses) / machine.buttonA.x;
      if (numberOfButtonAPresses === Math.floor(numberOfButtonAPresses) && numberOfButtonAPresses >= 0) {
        return {
          pressB: numberOfButtonBPresses,
          pressA: numberOfButtonAPresses
        }
      }
    }

    return undefined;
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => this.preprocessData(data)),
      tap((data) => console.debug(data)),
      map((machines) =>
        machines
          .map((machine) => this.getAllWinningCombinationsForSecondTask(machine))
          .filter(Boolean)
      ),
      map(combinations => {
      console.debug(combinations);
      return combinations.map(combination => 3 * combination!.pressA + combination!.pressB)
          .reduce((sum, current) => sum + current, 0)
      }),
      tap((data) => console.debug(data)),
      // map(() => 0)
    );
  }

  private getAllWinningCombinationsForSecondTask(machine: MachineConfig): { pressA: number; pressB: number } | undefined {

    const numberOfButtonBPresses = (
      (machine.buttonA.y * (machine.prize.x + MEASUREMENT_ERROR) - machine.buttonA.x * (machine.prize.y + MEASUREMENT_ERROR))
      / (machine.buttonA.y*machine.buttonB.x - machine.buttonA.x*machine.buttonB.y)
    )
    console.debug('Required number of button B presses:', numberOfButtonBPresses);
    if (numberOfButtonBPresses === Math.floor(numberOfButtonBPresses)) {
      const numberOfButtonAPresses = (machine.prize.x + MEASUREMENT_ERROR - machine.buttonB.x * numberOfButtonBPresses) / machine.buttonA.x;
      console.debug('Required number of button A presses:', numberOfButtonAPresses);
      if (numberOfButtonAPresses === Math.floor(numberOfButtonAPresses) && numberOfButtonAPresses >= 0) {
        return {
          pressB: numberOfButtonBPresses,
          pressA: numberOfButtonAPresses
        }
      }
    }

    return undefined;
  }
}

interface Button {
  x: number;
  y: number;
}

interface Location {
  x: number;
  y: number;
}

interface MachineConfig {
  buttonA: Button;
  buttonB: Button;
  prize: Location;
}
