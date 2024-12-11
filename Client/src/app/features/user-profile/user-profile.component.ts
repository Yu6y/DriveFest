import { Component, inject } from '@angular/core';
import { AuthStateService } from '../auth/services/auth-state.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfile } from '../../shared/models/UserProfile';
import { LoadingState } from '../../shared/models/LoadingState';
import { UserStateService } from './services/user-state.service';
import { AsyncPipe } from '@angular/common';
import { EventCardComponent } from '../events/components/event-card/event-card.component';
import { DxLoadIndicatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [AsyncPipe, EventCardComponent, DxLoadIndicatorModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private authService = inject(AuthStateService);
  private router = inject(Router);
  private userService = inject(UserStateService);
  user$!: Observable<LoadingState<UserProfile>>;

  ngOnInit() {
    this.user$ = this.userService.user$;
    this.userService.getUser();
  }

  regClick() {
    this.router.navigate(['registry']);
  }

  logout() {
    this.authService.logout();
  }

  eventClick(id: number) {
    this.router.navigate(['/event', id]);
  }
}
