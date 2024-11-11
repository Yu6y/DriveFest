import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/LoginCredentials';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthStateService } from '../../services/auth-state.service';
import { Observable } from 'rxjs';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { AsyncPipe } from '@angular/common';
import {
  DxLoadIndicatorComponent,
  DxLoadIndicatorModule,
} from 'devextreme-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, DxLoadIndicatorModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthStateService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  form!: FormGroup;
  loginState$ = this.authService.loginState$;

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    this.authService.loginUser({
      email: this.form.value.email,
      password: this.form.value.password,
    } as LoginCredentials);
  }
}
