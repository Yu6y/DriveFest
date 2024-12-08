import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AsyncPipe } from '@angular/common';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../../ui/header/header.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, AsyncPipe],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss',
})
export class UserLayoutComponent {
  private authService = inject(AuthStateService);
  router = inject(Router);
  userLogged$!: Observable<boolean>;

  ngOnInit() {
    this.userLogged$ = this.authService.userLogged$;
    this.authService.isLogged();
  }

  logout() {
    this.authService.logout();
  }
}
