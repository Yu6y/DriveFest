import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DxToastComponent, DxToastModule } from 'devextreme-angular';
import { ToastService } from './shared/services/toast.service';
import { AuthStateService } from './features/auth/services/auth-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DxToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('globalToast', { static: true }) toast!: DxToastComponent;
  private toastService = inject(ToastService);
  private authService = inject(AuthStateService);
  title = 'DriveFest';

  ngOnInit() {
    this.toastService.register(this.toast);
    this.authService.getUserRole();
  }
}
