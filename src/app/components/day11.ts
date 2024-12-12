import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AbstractDay } from './abstract-day';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'aoc-day-11',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe],
})
export class Day11Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(11);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map(
        (data) =>
          data
            .split('\n')
            .filter(Boolean)
            .map((line) => line.split(' ').filter((x) => x !== ''))[0]
      ),
      map((data) => {
        Array.from({ length: 25 }).forEach((_, index) => {
          data = this.blink(data);
          // console.log(
          //   `After ${index + 1} blinks: ${data.join(' ')} (${data.length})`
          // );
        });
        return data;
      }),
      // tap(console.log),
      map((data) => data.length)
    );
  }

  private blink(data: string[]): string[] {
    return data.map((entry) => this.applyBlinkRules(entry)).flat();
  }

  private applyBlinkRules(entry: string): string[] {
    // console.log(`Apply rules to |${entry}|. Length: ${entry.length}`);
    if (entry === '0') {
      // console.log('Applying rule 1: 0 -> 1')
      return ['1'];
    }
    if (entry.length % 2 === 0) {
      // console.log('Applying rule 2: split in half')
      // split entry in half
      const half = entry.length / 2;
      const firstHalf = parseInt(entry.slice(0, half)).toString();
      const secondHalf = parseInt(entry.slice(half)).toString();
      return [firstHalf, secondHalf];
    }
    // console.log('Applying rule 3: multiply by 2024')
    return [(parseInt(entry) * 2024).toString()];
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map(
        (data) =>
          data
            .split('\n')
            .filter(Boolean)
            .map((line) => line.split(' ').filter((x) => x !== ''))[0]
      ),
      map((data) => {
        data.forEach((entry) => {
          const values = this.getOrSetGlobalMapFor(entry);
          values.forEach((value) => {
            if (!this.globalMap[value]) {
              const thirdValues = this.getOrSetGlobalMapFor(value);
              thirdValues.forEach((thirdValue) =>
                this.getOrSetGlobalMapFor(thirdValue)
              );
            }
          });
        });
        // console.log('Established all', Object.keys(this.globalMap).length);
        return data;
      }),
      // tap(() => console.log(this.globalMap)),
      map((data) => {
        return data
          .map((entry) =>
            this.getOrSetGlobalMapFor(entry)
              .map((secondaryEntry) =>
                this.getOrSetGlobalMapFor(secondaryEntry)
                  .map((thirdEntry) => this.getOrSetGlobalMapFor(thirdEntry))
                  .reduce((acc, val) => (acc += val?.length), 0)
              )
              .reduce((acc, val) => (acc += val), 0)
          )
          .reduce((acc, val) => (acc += val), 0);
      })
    );
  }

  private getOrSetGlobalMapFor(value: string): string[] {
    if (this.globalMap[value]) {
      return this.globalMap[value];
    }
    const data = this.buildMapFor(value);
    this.globalMap[value] = data;
    // console.log(`(${Object.keys(this.globalMap).length}) Creating entry map for`, value, data.length);
    return data;
  }

  private globalMap: Record<string, string[]> = {};

  private buildMapFor(value: string): string[] {
    let data = [value];
    Array.from({ length: 25 }).forEach((_, index) => {
      data = this.blink(data);
    });
    return data;
  }
}
