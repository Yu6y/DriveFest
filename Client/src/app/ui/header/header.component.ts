import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgbCollapseModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() logout = new EventEmitter();
  isCollapsed: boolean = true;

  navClick() {
    if (window.innerWidth < 992) this.isCollapsed = !this.isCollapsed;
  }

  @ViewChild('navbar') navbar!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.navbar && !this.navbar.nativeElement.contains(event.target)) {
      this.navClick();
    }
  }
}
