import { Routes } from '@angular/router';
import { EventsComponent } from './features/events/events.component';
import { EventDescComponent } from './features/events/components/event-desc/event-desc.component';

export const routes: Routes = [
  {
    path: 'home',
    component: EventsComponent,
    title: 'Strona Główna',
  },
  {
    path: 'event/:id',
    component: EventDescComponent,
    title: 'Szczegóły',
  },
];
