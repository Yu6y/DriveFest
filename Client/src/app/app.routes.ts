import { Routes } from '@angular/router';
import { EventsComponent } from './features/events/events.component';
import { EventDescComponent } from './features/events/components/event-desc/event-desc.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { authGuard } from './features/auth/services/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: EventsComponent,
    title: 'Strona Główna',
    canActivate: [authGuard],
  },
  {
    path: 'event/:id',
    component: EventDescComponent,
    title: 'Szczegóły',
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Logowanie',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Rejestracja',
  },
];
