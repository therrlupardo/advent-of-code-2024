import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractDay } from './abstract-day';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { Button } from 'primeng/button';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

// const MAP_Y_SIZE = 7;
const MAP_Y_SIZE = 103;
// const MAP_X_SIZE = 11;
const MAP_X_SIZE = 101;
const INITIAL_SEMI_TREE_STEP = 31;
const STEPS_FOR_NEXT_SEMI_TREE = 103;

@Component({
  selector: 'aoc-day-14',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './day.component.html',
  imports: [RouterLink, Button, AsyncPipe]
})
export class Day14Component extends AbstractDay {
  private clicksBS = new BehaviorSubject<number>(0);

  constructor() {
    super();
    this.dayNumber.set(14);
    this.firstTaskSolved.set(false);
    this.secondTaskSolved.set(false);
  }

  protected firstTask(data: string): Observable<number> {
    return of(data).pipe(
      tap((data) => console.debug(data)),
      map((data) => this.preprocessData(data)),
      tap((robots) => console.debug(robots)),
      tap((robots) => this.printMap(robots)),
      map((robots) => this.simulateRobotsMovementFor(robots, 100)),
      tap((robots) => this.printMap(robots)),
      tap((robots) => this.printMapAsQuadrants(robots)),
      map((robots) => this.getNumberOfRobotsInEachQuadrant(robots)),
      map(
        (robotsInQuadrants) =>
          robotsInQuadrants.bottomLeft *
          robotsInQuadrants.bottomRight *
          robotsInQuadrants.topLeft *
          robotsInQuadrants.topRight
      )
    );
  }

  /**
   * This solution basically forces you to look at devtools until you see the tree pattern...
   * Task did not specify how the tree should look like, so I saw none other way to solve it (when I know how it looks it could be done programmatically of couse...)
   */
  protected secondTask(data: string): Observable<number> {
    return of(data).pipe(
      tap((data) => console.debug(data)),
      map((data) => this.preprocessData(data)),
      tap((robots) => console.debug(robots)),
      tap((robots) => this.printMap(robots)),
      tap((robots) => this.simulateRobotsMovementFor(robots, INITIAL_SEMI_TREE_STEP)),
      tap(() => this.clicksBS.next(INITIAL_SEMI_TREE_STEP + STEPS_FOR_NEXT_SEMI_TREE)),
      switchMap(robots => this.clicksBS.asObservable()
          .pipe(
            map(() => this.simulateRobotsMovementFor(robots, STEPS_FOR_NEXT_SEMI_TREE))
          )
      ),
      map(() => this.clicksBS.getValue())
    );
  }

  private preprocessData(data: string): Robot[] {
    return data
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const robotConfig = line.split(' ');
        const position = robotConfig[0]
          .replace('p=', '')
          .split(',')
          .map(Number);
        const velocity = robotConfig[1]
          .replace('v=', '')
          .split(',')
          .map(Number);
        return {
          position: { x: position[0], y: position[1] },
          velocity: { x: velocity[0], y: velocity[1] }
        };
      });
  }

  private prepareMap(robots: Robot[]): string[][] {
    const map = Array.from({ length: MAP_Y_SIZE }, () =>
      Array.from({ length: MAP_X_SIZE }, () => '.')
    );
    robots.forEach((robot) => {
      if (map[robot.position.y][robot.position.x] === '.') {
        map[robot.position.y][robot.position.x] = '1';
      } else {
        map[robot.position.y][robot.position.x] = (
          parseInt(map[robot.position.y][robot.position.x]) + 1
        ).toString();
      }
    });
    return map;
  }

  private printMap(robots: Robot[]): void {
    const map = this.prepareMap(robots);
    console.debug(`Attempt ${this.clicksBS.getValue()}`);
    console.debug(map.filter((_, index) => index <= map.length / 2).map((row) => row.join('')).join('\n'));
    console.debug(map.filter((_, index) => index > map.length / 2).map((row) => row.join('')).join('\n'));
  }

  private printMapAsQuadrants(robots: Robot[]): void {
    const map = this.prepareMap(robots);
    for (let i = 0; i < MAP_Y_SIZE; i++) {
      map[i][Math.floor(MAP_X_SIZE / 2)] = ' ';
    }
    for (let i = 0; i < MAP_X_SIZE; i++) {
      map[Math.floor(MAP_Y_SIZE / 2)][i] = ' ';
    }
    console.debug(map.map((row) => row.join('')).join('\n'));
  }

  private simulateRobotsMovementFor(robots: Robot[], seconds: number): Robot[] {
    for (let i = 0; i < seconds; i++) {
      // console.log(robots);
      robots.forEach((robot) => {
        // console.log(robot);
        const nextX = (robot.position.x + robot.velocity.x) % MAP_X_SIZE;
        robot.position.x = nextX < 0 ? MAP_X_SIZE + nextX : nextX;
        const nextY = (robot.position.y + robot.velocity.y) % MAP_Y_SIZE;
        robot.position.y = nextY < 0 ? MAP_Y_SIZE + nextY : nextY;
      });
    }
    this.printMap(robots);
    return robots;
  }

  private getNumberOfRobotsInEachQuadrant(robots: Robot[]): RobotsInQuadrants {
    const robotsInQuadrants: RobotsInQuadrants = {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 0,
      bottomRight: 0
    };
    const verticalQuadrantSplitterIndex = Math.floor(MAP_Y_SIZE / 2);
    const horizontalQuadrantSplitterIndex = Math.floor(MAP_X_SIZE / 2);
    robots.forEach((robot) => {
      if (
        robot.position.x < horizontalQuadrantSplitterIndex &&
        robot.position.y < verticalQuadrantSplitterIndex
      ) {
        robotsInQuadrants.topLeft++;
      }
      if (
        robot.position.x >= horizontalQuadrantSplitterIndex &&
        robot.position.y < verticalQuadrantSplitterIndex
      ) {
        robotsInQuadrants.topRight++;
      }
      if (
        robot.position.x < horizontalQuadrantSplitterIndex &&
        robot.position.y > verticalQuadrantSplitterIndex
      ) {
        robotsInQuadrants.bottomLeft++;
      }
      if (
        robot.position.x > horizontalQuadrantSplitterIndex &&
        robot.position.y > verticalQuadrantSplitterIndex
      ) {
        robotsInQuadrants.bottomRight++;
      }
    });
    console.debug('Robots in quadrants:', robotsInQuadrants);
    return robotsInQuadrants;
  }

  protected override soSthSpecial(): void {
    this.clicksBS.next(this.clicksBS.getValue() + STEPS_FOR_NEXT_SEMI_TREE);
  }
}

interface Robot {
  position: Position;
  velocity: Velocity;
}

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

interface RobotsInQuadrants {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}
