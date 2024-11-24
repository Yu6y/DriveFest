import { Routes } from '@angular/router';
import { EventsComponent } from './features/events/events.component';
import { EventDescComponent } from './features/events/components/event-desc/event-desc.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { authGuard } from './features/auth/services/auth.guard';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { FavListComponent } from './features/events/components/fav-list/fav-list.component';
import { WorkshopsComponent } from './features/workshops/workshops.component';
import { WorkshopDescComponent } from './features/workshops/components/workshop-desc/workshop-desc.component';
import { AddEventComponent } from './features/add-forms/add-event/add-event.component';
import { AddWorkshopComponent } from './features/add-forms/add-workshop/add-workshop.component';
import { RegistryComponent } from './features/registry/registry.component';
import { CarDataComponent } from './features/registry/components/car-data/car-data.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UsersListComponent } from './features/admin/components/users-list/users-list.component';
import { adminGuard } from './features/auth/services/admin.guard';
import { EventsListPageComponent } from './features/admin/components/events-list-page/events-list-page.component';
import { EditEventComponent } from './features/admin/components/edit-event/edit-event.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
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
      {
        path: 'favorites',
        component: FavListComponent,
        title: 'Zaobserwowane',
        canActivate: [authGuard],
      },
      {
        path: 'workshops',
        component: WorkshopsComponent,
        title: 'Watsztaty',
        canActivate: [authGuard],
      },
      {
        path: 'workshop/:id',
        component: WorkshopDescComponent,
        title: 'Szczegóły',
        canActivate: [authGuard],
      },
      {
        path: 'error',
        component: ErrorPageComponent,
        title: 'Błąd',
      },
      {
        path: 'add-event',
        component: AddEventComponent,
        title: 'Dodaj wydarzenie',
        canActivate: [authGuard],
      },
      {
        path: 'add-workshop',
        component: AddWorkshopComponent,
        title: 'Dodaj warsztat',
        canActivate: [authGuard],
      },
      {
        path: 'registry',
        component: RegistryComponent,
        title: 'Pojazdy',
        canActivate: [authGuard],
      },
      {
        path: 'registry/:id',
        component: CarDataComponent,
        title: 'Rejestr',
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        title: 'Profil',
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    //canActivate: [authGuard, adminGuard], na czas testowania
    children: [
      {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersListComponent,
        title: 'Użytkownicy',
        //canActivate: [authGuard],
      },
      {
        path: 'events',
        component: EventsListPageComponent,
        title: 'Wydarzenia',
        //canActivate: [authGuard],
      },
      {
        path: 'edit-event',
        component: EditEventComponent,
        title: 'Szczegóły',
        //canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'error',
    pathMatch: 'full',
  },
];
