import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './ui/header/header.component';
import { AuthService } from './features/auth/services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthStateService } from './features/auth/services/auth-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private authService = inject(AuthStateService);
  router = inject(Router);
  title = 'DriveFest';
  userLogged$!: Observable<boolean>;

  ngOnInit() {
    this.userLogged$ = this.authService.userLogged$;
    this.authService.isLogged();
  }

  logout() {
    this.authService.logout();
  }
}
