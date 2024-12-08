import { Component, inject, Input, ViewChild } from '@angular/core';
import {
  EventListCardComponent,
  outputTypes,
} from '../event-list-card/event-list-card.component';
import { AdminStateService } from '../../services/admin-state.service';
import { AdminEvent } from '../../../../shared/models/AdminEvent';
import { Router } from '@angular/router';
import { AdminWorkshop } from '../../../../shared/models/AdminWorkshop';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DxLoadIndicatorModule } from 'devextreme-angular';
import { WorkshopListCardComponent } from '../workshop-list-card/workshop-list-card.component';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { UserData } from '../../../../shared/models/UserData';
import { UserListCardComponent } from '../user-list-card/user-list-card.component';
import { ListData } from '../../../../shared/models/AdminListData';

@Component({
  selector: 'app-linear-list',
  standalone: true,
  imports: [
    EventListCardComponent,
    AsyncPipe,
    DxLoadIndicatorModule,
    WorkshopListCardComponent,
    MatPaginatorModule,
    UserListCardComponent,
  ],
  templateUrl: './linear-list.component.html',
  styleUrl: './linear-list.component.scss',
})
export class LinearListComponent {
  @Input({ required: true }) flag!: 'events' | 'workshops' | 'users';
  private adminService = inject(AdminStateService);
  private router = inject(Router);

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  events$!: Observable<LoadingState<ListData<AdminEvent[]>>>;
  workshops$!: Observable<LoadingState<ListData<AdminWorkshop[]>>>;
  users$!: Observable<LoadingState<ListData<UserData[]>>>;
  pageSize = 10;
  pageIndex = 0;
  total = 0;

  ngOnInit() {
    this.loadData();
  }

  handleOutput(action: outputTypes) {
    if (this.flag === 'events') {
      if (action.type === 'event') this.moveToEvent(action.id);
      else if (action.type === 'accept') this.acceptEvent(action.id);
      else if (action.type === 'delete') this.deleteEvent(action.id);
      else if (action.type === 'edit') this.editEvent(action.id);
    } else if (this.flag === 'workshops') {
      if (action.type === 'workshop') this.moveToWorkshop(action.id);
      else if (action.type === 'accept') this.acceptWorkshop(action.id);
      else if (action.type === 'delete') this.deleteWorkshop(action.id);
      else if (action.type === 'edit') this.editWorkshop(action.id);
    } else if (this.flag === 'users') {
      if (action.type === 'accept') this.promoteUser(action.id);
      else if (action.type === 'delete') this.demoteUser(action.id);
    }
  }

  handlePage(page: PageEvent) {
    console.log(page);
    this.total = page.length;
    this.pageSize = page.pageSize;
    this.pageIndex = page.pageIndex;
    this.loadData();
  }

  loadData() {
    if (this.flag === 'events') {
      this.events$ = this.adminService.eventsList$;
      this.adminService.loadEventsList(this.pageIndex, this.pageSize);
    } else if (this.flag === 'workshops') {
      this.workshops$ = this.adminService.workshopsList$;
      this.adminService.loadWorkshopsList(this.pageIndex, this.pageSize);
    } else {
      this.users$ = this.adminService.usersData$;
      this.adminService.getUsersData(this.pageIndex, this.pageSize);
    }
  }

  moveToEvent(id: number) {
    this.router.navigate([`event/${id}`]);
  }

  acceptEvent(id: number) {
    this.adminService.acceptEvent(id);
    setTimeout(() => {
      this.loadData();
      setTimeout(() => {
        this.checkIfLastPage();
      }, 200);
    }, 200);
  }

  deleteEvent(id: number) {
    this.adminService.deleteEvent(id);
    setTimeout(() => {
      this.loadData();
      setTimeout(() => {
        this.checkIfLastPage();
      }, 200);
    }, 200);
  }

  editEvent(id: number) {
    this.router.navigate(['admin/edit-event'], {
      state: { id: id },
    });
  }

  moveToWorkshop(id: number) {
    this.router.navigate([`workshop/${id}`]);
  }

  acceptWorkshop(id: number) {
    this.adminService.acceptWorkshop(id);
    setTimeout(() => {
      this.loadData();
      setTimeout(() => {
        this.checkIfLastPage();
      }, 200);
    }, 200);
  }

  deleteWorkshop(id: number) {
    this.adminService.deleteWorkshop(id);
    setTimeout(() => {
      this.loadData();
      setTimeout(() => {
        this.checkIfLastPage();
      }, 200);
    }, 200);
  }

  editWorkshop(id: number) {
    this.router.navigate(['admin/edit-workshop'], {
      state: { id: id },
    });
  }

  promoteUser(id: number) {
    this.adminService.promoteUser(id);
    setTimeout(() => {
      this.loadData();
      setTimeout(() => {
        this.checkIfLastPage();
      }, 200);
    }, 200);
  }

  demoteUser(id: number) {
    this.adminService.demoteUser(id);
    setTimeout(() => {
      this.loadData();
      setTimeout(() => {
        this.checkIfLastPage();
      }, 200);
    }, 200);
  }

  checkIfLastPage() {
    if (this.paginator) this.total = this.paginator.length;

    if (this.pageIndex * this.pageSize === this.total)
      this.paginator.previousPage();
  }
}
