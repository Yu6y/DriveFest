import { Routes } from '@angular/router';
import { EventsComponent } from './features/events/events.component';

export const routes: Routes = [
  {
    path: 'home',
    component: EventsComponent,
    title: 'Strona Główna',
  },
];
