import { Observable, of, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { inject, signal } from '@angular/core';

export abstract class AbstractDay {
  protected dayNumber = signal(0);
  protected firstTaskSolved = signal(false);
  protected secondTaskSolved = signal(false);

  private readonly httpClient = inject(HttpClient);

  private readonly taskOneTestDataSource$ = toObservable(this.dayNumber).pipe(
    switchMap(dayNumber => this.httpClient.get(`./assets/day${dayNumber}/test1.txt`, {responseType: 'text'})));
  private readonly taskTwoTestDataSource$ = toObservable(this.dayNumber).pipe(
    switchMap(dayNumber => this.httpClient.get(`./assets/day${dayNumber}/test2.txt`, {responseType: 'text'})));
  private readonly finalDataSource$ = toObservable(this.dayNumber).pipe(
    switchMap(dayNumber => this.httpClient.get(`./assets/day${dayNumber}/final.txt`, {responseType: 'text'})));

  protected firstTaskTestDataSolution$ = this.taskOneTestDataSource$.pipe(
    switchMap(data => this.firstTask(data))
  );
  protected firstTaskFinalDataSolution$ = this.finalDataSource$.pipe(
    switchMap(data => this.firstTask(data))
  );
  protected secondTaskTestDataSolution$ = this.taskTwoTestDataSource$.pipe(
    switchMap(data => this.secondTask(data))
  );
  protected secondTaskFinalDataSolution$ = this.finalDataSource$.pipe(
    switchMap(data => this.secondTask(data))
  );

  protected abstract firstTask(data: string): Observable<number>;

  protected abstract secondTask(data: string): Observable<number>;

  protected soSthSpecial(): void {
    console.log('I am doing something special');
  }
}
