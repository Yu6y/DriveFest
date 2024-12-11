import { Component } from '@angular/core';
import { PopupComponent } from './components/popup/popup.component';
import { CarsListComponent } from './components/cars-list/cars-list.component';

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [PopupComponent, CarsListComponent],
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
})
export class RegistryComponent {}
