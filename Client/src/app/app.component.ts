import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './ui/header/header.component';
import { AuthService } from './features/auth/services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthStateService } from './features/auth/services/auth-state.service';
import { DxToastComponent, DxToastModule } from 'devextreme-angular';
import { PositionConfig } from 'devextreme/animation/position';
import { PositionAlignment } from 'devextreme/common';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, AsyncPipe, DxToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('globalToast', { static: true }) toast!: DxToastComponent;
  private authService = inject(AuthStateService);
  private toastService = inject(ToastService);
  router = inject(Router);
  title = 'DriveFest';
  userLogged$!: Observable<boolean>;
  
  ngOnInit() {
    this.userLogged$ = this.authService.userLogged$;
    this.authService.isLogged();
    this.toastService.register(this.toast);
  }

  logout() {
    this.authService.logout();
  }
}
