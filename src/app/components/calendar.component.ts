import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { appRoutes } from '../app.routes';

@Component({
  selector: 'aoc-calendar',
  standalone: true,
  template: `
    <main class="app__main">
      @for (day of days;track day) {
        @if (!day.notCompleted) {
          <a routerLink="day/{{day.index}}"
             class="app__section"
          >
            <span>Day {{ day.index }}</span>
            <div>
              <i class="pi pi-star-fill"></i>
              <i class="pi pi-star-fill"></i>
            </div>
          </a>
        } @else {
          <div class="app__section app__section--not-completed"
          >
            <span>Day {{ day.index }}</span>
            <div>
              <i class="pi pi-star"></i>
              <i class="pi pi-star"></i>
            </div>
          </div>
        }
      }
    </main>
  `,
  imports: [
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {
  readonly days: { index: number, notCompleted: boolean }[] = Array.from({length: 25}, (_, index) => ({
    index: index + 1,
    notCompleted: index >= appRoutes.length - 1
  }));

}
