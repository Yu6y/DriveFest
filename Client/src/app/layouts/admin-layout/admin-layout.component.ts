import { Component, inject } from '@angular/core';
import { AdminHeaderComponent } from '../../ui/admin-header/admin-header.component';
import { AsyncPipe } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthStateService } from '../../features/auth/services/auth-state.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent, AsyncPipe],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
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
