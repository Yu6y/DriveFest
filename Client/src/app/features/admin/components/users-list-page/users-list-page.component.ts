import { Component } from '@angular/core';
import { LinearListComponent } from '../linear-list/linear-list.component';

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [LinearListComponent],
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.scss',
})
export class UsersListPageComponent {
  flag: 'users' = 'users';
}
