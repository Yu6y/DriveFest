import { Component, inject } from '@angular/core';
import { AdminStateService } from '../../services/admin-state.service';
import { Observable } from 'rxjs';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { AdminEvent } from '../../../../shared/models/AdminEvent';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {}
