import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import {
  DxDateBoxModule,
  DxFileUploaderModule,
  DxFormComponent,
  DxFormModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxValidationSummaryModule,
  DxValidatorModule,
} from 'devextreme-angular';
import { DxDateBoxTypes } from 'devextreme-angular/ui/date-box';
import {
  DxCheckBoxModule,
  DxCheckBoxTypes,
} from 'devextreme-angular/ui/check-box';
import { Voivodeships } from '../../../../shared/models/voivodeships';
import { AdminStateService } from '../../services/admin-state.service';
import { Observable } from 'rxjs';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { EventDesc } from '../../../../shared/models/EventDesc';
import { EventStateService } from '../../../events/services/event-state.service';
import { Tag } from '../../../../shared/models/Tag';
import { AsyncPipe } from '@angular/common';
import { EventEdit } from '../../../../shared/models/EventEdit';

export type CustomTag = Tag & {
  selected: boolean;
};

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DxFormModule,
    DxTextAreaModule,
    DxDateBoxModule,
    DxCheckBoxModule,
    DxFileUploaderModule,
    DxSelectBoxModule,
    AsyncPipe,
  ],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss',
})
export class EditEventComponent {
  private adminService = inject(AdminStateService);

  @ViewChild('form', { static: false }) form!: DxFormComponent;

  event$!: Observable<LoadingState<EventEdit>>;
  tags$!: Observable<LoadingState<CustomTag[]>>;
  tagsList!: CustomTag[];
  eventDesc!: EventEdit;
  textAreaValid: boolean = true;
  checkboxesValid: boolean = true;
  voivodeships = Voivodeships;

  ngOnInit() {
    this.tags$ = this.adminService.tags$;
    this.event$ = this.adminService.eventEdit$;
    this.adminService.getEventToEdit(window.history.state.id);

    this.event$.subscribe((res) => {
      if (res.state === 'success') {
        this.eventDesc = res.data;
      }
    });

    this.tags$.subscribe((res) => {
      if (res.state === 'success') this.tagsList = res.data;
    });
  }

  onTagChanged(tag: CustomTag) {
    const indexEvent = this.eventDesc.tags.findIndex(
      (index) => index.id === tag.id
    );

    if (indexEvent === -1) {
      const newTag: Tag = { id: tag.id, name: tag.name };

      this.eventDesc.tags.push(newTag);
    } else {
      this.eventDesc.tags.splice(indexEvent, 1);
    }

    if (this.tagsList.some((x) => x.selected)) this.checkboxesValid = true;
    else this.checkboxesValid = false;

    console.log(this.tagsList);
    console.log(this.eventDesc.tags);
  }

  textChange(data: string) {
    console.log(data);
    if (data.trim().length > 0) this.textAreaValid = true;
    else this.textAreaValid = false;
  }

  isFormValid(): boolean {
    let valid = true;
    if (this.form) {
      if (this.form.instance.validate().isValid) valid = true;
      else valid = false;
    }

    return valid && this.textAreaValid && this.checkboxesValid;
  }

  submit() {
    console.log(this.form.instance.option('formData'));

    if (this.isFormValid()) this.adminService.editEvent(this.eventDesc);
  }

  dateBoxOptions: DxDateBoxTypes.Properties = {
    acceptCustomValue: false,
    openOnFieldClick: true,
    displayFormat: 'yyyy-MM-dd',
  };

  handlePhotoUpload(event: any) {
    this.eventDesc.photoURL = event.target.files[0];
  }

  @HostListener('window:resize')
  onResize() {
    window.location.reload();
  }
}
