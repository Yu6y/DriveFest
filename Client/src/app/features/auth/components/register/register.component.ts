import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterCredentials } from '../../models/RegisterCredentials';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';
import { AsyncPipe } from '@angular/common';
import { DxLoadIndicatorModule } from 'devextreme-angular';
import { FormValue } from '../../../../shared/utils/FromValue';

type RegisterError = {
  username?: string;
  email?: string;
  photo?: string;
  general?: string;
};

type RegisterForm = FormGroup<{
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  photoURL: FormControl<File | null>;
}>;

export type RegisterFormValue = FormValue<RegisterForm>;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, DxLoadIndicatorModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private authService = inject(AuthStateService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);

  errors: RegisterError = {};
  registerState$ = this.authService.registerState$;

  form: RegisterForm = this.formBuilder.group({
    email: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(100),
    ]),
    username: this.formBuilder.control<string>('', [
      Validators.pattern(/^[a-zA-Z0-9.()_-]{1,30}$/),
      Validators.required,
      Validators.maxLength(30),
    ]),
    password: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    photoURL: this.formBuilder.control<File | null>(null),
  });

  ngOnInit() {
    this.registerState$.subscribe((res) => {
      if (res.state === 'error') this.errors = res.error;
    });
  }

  submit() {
    this.authService.registerUser(this.form.getRawValue());
  }

  sendPhoto(event: any) {
    this.form.patchValue({
      photoURL: event.target.files[0],
    });
  }
}
