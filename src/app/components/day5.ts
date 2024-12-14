import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractDay } from './abstract-day';
import { map, Observable, of, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
  selector: 'aoc-day-5',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, AsyncPipe, Button],
})
export class Day5Component extends AbstractDay {
  constructor() {
    super();
    this.dayNumber.set(5);
    this.firstTaskSolved.set(true);
    this.secondTaskSolved.set(true);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => data.split('\n\n')),
      map((data) => ({
        orderingRules: data[0]
          .split('\n')
          .filter((rule) => rule !== '')
          .map((rule) => rule.split('|').map((rule) => parseInt(rule)))
          .map((rule) => ({ x: rule[0], y: rule[1] }))
          .reduce((rulebook, rule) => {
            if (rulebook[rule.x] === undefined) {
              rulebook[rule.x] = [];
            }
            rulebook[rule.x].push(rule.y);
            return rulebook;
          }, {} as Record<number, number[]>),
        updates: data[1]
          .split('\n')
          .filter((update) => update !== '')
          .map((update) => update.split(',').map((part) => parseInt(part))),
      })),
      // tap(console.log),
      map(
        ({
          updates,
          orderingRules,
        }: {
          updates: number[][];
          orderingRules: Record<number, number[]>;
        }) =>
          updates.filter((update) =>
            this.doesUpdateMatchRules(update, orderingRules)
          )
      ),
      // tap(console.log),
      map((correctUpdates: number[][]) =>
        correctUpdates
          .map((update) => {
            // console.log(`Middle entry of ${update} is ${update[Math.floor(update.length / 2)]} at index ${Math.floor(update.length / 2)}`);
            const numberOfUpdates = update.length;
            return update[Math.floor(numberOfUpdates / 2)];
          })
          .reduce((sum, value) => sum + value, 0)
      )
      // tap(console.log)
    );
  }

  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      map((data) => data.split('\n\n')),
      map((data) => ({
        orderingRules: data[0]
          .split('\n')
          .filter((rule) => rule !== '')
          .map((rule) => rule.split('|').map((rule) => parseInt(rule)))
          .map((rule) => ({ x: rule[0], y: rule[1] }))
          .reduce((rulebook, rule) => {
            if (rulebook[rule.x] === undefined) {
              rulebook[rule.x] = [];
            }
            rulebook[rule.x].push(rule.y);
            return rulebook;
          }, {} as Record<number, number[]>),
        updates: data[1]
          .split('\n')
          .filter((update) => update !== '')
          .map((update) => update.split(',').map((part) => parseInt(part))),
      })),
      // tap(console.log),
      map(
        ({
          updates,
          orderingRules,
        }: {
          updates: number[][];
          orderingRules: Record<number, number[]>;
        }) => ({
          incorrectUpdates: updates.filter(
            (update) => !this.doesUpdateMatchRules(update, orderingRules)
          ),
          orderingRules,
        })
      ),
      // tap(console.log),
      map(
        ({
          incorrectUpdates,
          orderingRules,
        }: {
          incorrectUpdates: number[][];
          orderingRules: Record<number, number[]>;
        }) =>
          incorrectUpdates.map((update) =>
            this.fixUpdate(update, orderingRules)
          )
      ),
      // tap(console.log),
      map((correctUpdates: number[][]) =>
        correctUpdates
          .map((update) => {
            // console.log(`Middle entry of ${update} is ${update[Math.floor(update.length / 2)]} at index ${Math.floor(update.length / 2)}`);
            const numberOfUpdates = update.length;
            return update[Math.floor(numberOfUpdates / 2)];
          })
          .reduce((sum, value) => sum + value, 0)
      ),
      // tap(console.log)
      // map(() => 0)
    );
  }

  private doesUpdateMatchRules(
    update: number[],
    orderingRules: Record<number, number[]>
  ): boolean {
    // console.log(`Checking ${update}`);
    const result = update
      .map((value, index) => {
        const rules = orderingRules[value];
        if (!rules) {
          return true;
        }
        // console.log(`Found rule for ${value}: ${rules}`);
        return (
          rules
            .map((rule) => {
              const ruleIndex = update.indexOf(rule);
              if (ruleIndex === -1) {
                // console.log(`Rule ${rule} not found in ${update}. Looks fine`);
                return true;
              }
              // console.log(`Rule ${rule} found at index ${ruleIndex} in ${update}. It looks ${ruleIndex > index ? 'fine' : 'bad'}`);
              return ruleIndex > index;
            })
            .filter(Boolean).length === rules.length
        );
      })
      .filter(Boolean).length;
    // console.log(`correct matches ${result}/${update.length}`);
    // console.log(`Result of checking ${update} is ${result}`);
    return result === update.length;
  }

  private fixUpdate(
    update: number[],
    orderingRules: Record<number, number[]>
  ): number[] {
    const result: number[] = [];
    // console.log(`Fixing ${update}`);
    update.forEach((value, index) => {
      const rules = orderingRules[value];
      if (!rules) {
        // console.log(`No rules for ${value}, adding it to the result`);
        result.push(value);
      } else {
        const meaningfulRules = rules.filter((rule) => result.includes(rule));
        if (meaningfulRules.length === 0) {
          // console.log(`No meaningful rules found for ${value}, adding it to the result`);
          result.push(value);
        } else {
          const indexMap = meaningfulRules.reduce((mapper, rule) => {
            mapper[rule] = result.indexOf(rule);
            return mapper;
          }, {} as Record<number, number>);
          // console.log(`Created index map for matching values for ${value}`, indexMap);
          const smallestIndex = Math.min(...Object.values(indexMap));
          result.splice(smallestIndex, 0, value);
          // console.log(`Added ${value} to the result at index ${smallestIndex}`);
        }
      }
      // console.log('Result after this iteration:', result);
    });
    // console.log(`Result:`, result);
    return result;
  }
}
