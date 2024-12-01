import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'aoc-root',
  template: `
    <header>
      <h1>Advent of Code 2023</h1>
    </header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'advent-of-code-2024';
}
