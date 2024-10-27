import { Component } from '@angular/core';
import { CardsListComponent } from '../../shared/components/cards-list/cards-list.component';
import { WorkshopFiltersComponent } from './components/workshop-filters/workshop-filters.component';

@Component({
  selector: 'app-workshops',
  standalone: true,
  imports: [CardsListComponent, WorkshopFiltersComponent],
  templateUrl: './workshops.component.html',
  styleUrl: './workshops.component.scss',
})
export class WorkshopsComponent {}
