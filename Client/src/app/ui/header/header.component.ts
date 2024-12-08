import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgbCollapseModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() logout = new EventEmitter();
  private authService = inject(AuthStateService);
  isCollapsed: boolean = true;
  isAdmin$!: Observable<boolean>;

  ngOnInit() {
    this.isAdmin$ = this.authService.userAdmin$;
  }

  navClick() {
    if (window.innerWidth < 992)
      if (!this.isCollapsed) this.isCollapsed = !this.isCollapsed;
  }

  @ViewChild('navbar') navbar!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.navbar && !this.navbar.nativeElement.contains(event.target)) {
      this.navClick();
    }
  }
}
