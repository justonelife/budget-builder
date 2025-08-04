import { Component } from '@angular/core';
import { BudgetBuilderComponent } from '@features/budget-builder/features/budget-builder/budget-builder.component';

@Component({
  selector: 'app-root',
  imports: [BudgetBuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
