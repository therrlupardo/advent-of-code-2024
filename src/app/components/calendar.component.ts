import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { appRoutes } from '../app.routes';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'aoc-calendar',
  standalone: true,
  template: `
    <main class="flex flex-row flex-wrap gap-2 justify-center">
      @for (day of days; track day) {
        @if (!day.notCompleted) {
          <a
            routerLink="day/{{ day.index }}"
            class="border rounded-md flex flex-col gap-1 p-2 min-w-[100px] items-center border-[#00FF00] hover:border-[#FFD700] hover:shadow-xl cursor-pointer"
            pTooltip="Go to solution of day {{ day.index }}"
          >
            <span class="align-center">Day {{ day.index }}</span>
            <div class="flex flex-row gap-1">
              <i class="pi pi-star-fill text-amber-500"></i>
              <i class="pi pi-star-fill text-amber-500"></i>
            </div>
          </a>
        } @else {
          <div
            class="border rounded-md flex flex-col gap-1 p-2 min-w-[100px] items-center cursor-not-allowed blur-[2px]"
            pTooltip="Day {{ day.index }} was not completed yet"
          >
            <span>Day {{ day.index }}</span>
            <div class="flex flex-row gap-1">
              <i class="pi pi-star text-amber-500"></i>
              <i class="pi pi-star text-amber-500"></i>
            </div>
          </div>
        }
      }
    </main>
  `,
  imports: [RouterLink, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  readonly days: { index: number; notCompleted: boolean }[] = Array.from(
    { length: 25 },
    (_, index) => ({
      index: index + 1,
      notCompleted: index >= appRoutes.length - 1,
    })
  );
}
