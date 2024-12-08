import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { AdminStateService } from '../../services/admin-state.service';
import {
  DxCheckBoxModule,
  DxFormComponent,
  DxFormModule,
  DxSelectBoxModule,
  DxTextAreaModule,
} from 'devextreme-angular';
import { Observable } from 'rxjs';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { WorkshopEdit } from '../../../../shared/models/WorkshopEdit';
import { CustomTag } from '../edit-event/edit-event.component';
import { Voivodeships } from '../../../../shared/models/voivodeships';
import { Tag } from '../../../../shared/models/Tag';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-edit-workshop',
  standalone: true,
  imports: [
    AsyncPipe,
    DxFormModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxTextAreaModule,
  ],
  templateUrl: './edit-workshop.component.html',
  styleUrl: './edit-workshop.component.scss',
})
export class EditWorkshopComponent {
  private adminService = inject(AdminStateService);

  @ViewChild('form', { static: false }) form!: DxFormComponent;

  workshop$!: Observable<LoadingState<WorkshopEdit>>;
  tags$!: Observable<LoadingState<CustomTag[]>>;
  tagsList!: CustomTag[];
  workshopDesc!: WorkshopEdit;
  textAreaValid: boolean = true;
  checkboxesValid: boolean = true;
  voivodeships = Voivodeships;

  ngOnInit() {
    this.tags$ = this.adminService.tags$;
    this.workshop$ = this.adminService.workshopEdit$;
    this.adminService.getWorkshopToEdit(window.history.state.id);

    this.workshop$.subscribe((res) => {
      if (res.state === 'success') {
        this.workshopDesc = res.data;
      }
    });

    this.tags$.subscribe((res) => {
      if (res.state === 'success') this.tagsList = res.data;
    });
  }

  onTagChanged(tag: CustomTag) {
    const indexEvent = this.workshopDesc.tags.findIndex(
      (index) => index.id === tag.id
    );

    if (indexEvent === -1) {
      const newTag: Tag = { id: tag.id, name: tag.name };

      this.workshopDesc.tags.push(newTag);
    } else {
      this.workshopDesc.tags.splice(indexEvent, 1);
    }

    if (this.tagsList.some((x) => x.selected)) this.checkboxesValid = true;
    else this.checkboxesValid = false;

    console.log(this.tagsList);
    console.log(this.workshopDesc.tags);
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

    if (this.isFormValid()) this.adminService.editWorkshop(this.workshopDesc);
  }

  handlePhotoUpload(event: any) {
    this.workshopDesc.photoURL = event.target.files[0];
  }

  @HostListener('window:resize')
  onResize() {
    window.location.reload();
  }
}
