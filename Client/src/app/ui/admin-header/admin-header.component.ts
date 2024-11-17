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

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterModule, NgbCollapseModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent {
  @Output() logout = new EventEmitter();
  isCollapsed: boolean = true;

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
