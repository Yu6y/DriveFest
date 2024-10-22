import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterCredentials } from '../../models/RegisterCredentials';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

type RegisterError = {
  username?: string;
  email?: string;
  general?: string;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  form!: FormGroup;
  errors: RegisterError = {};

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    this.authService
      .registerUser({
        email: this.form.value.email,
        username: this.form.value.username,
        password: this.form.value.password,
      } as RegisterCredentials)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.errors = error.error.errors as RegisterError;
          console.log(this.errors.email);
        },
      });
  }
}
