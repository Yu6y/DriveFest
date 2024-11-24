import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import {
  DxDateBoxModule,
  DxFileUploaderModule,
  DxFormModule,
  DxSelectBoxModule,
  DxTagBoxModule,
  DxTextAreaModule,
} from 'devextreme-angular';
import { DxDateBoxTypes } from 'devextreme-angular/ui/date-box';
import {
  DxCheckBoxModule,
  DxCheckBoxTypes,
} from 'devextreme-angular/ui/check-box';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    DxFormModule,
    DxTextAreaModule,
    DxDateBoxModule,
    DxCheckBoxModule,
    DxFileUploaderModule,
    DxSelectBoxModule,
  ],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss',
})
export class EditEventComponent {
  private router = inject(Router);

  date = '2024-02-12';
  ngOnInit() {
    console.log(window.history.state.id);
  }
  employee = {
    name: 'John Heart',
    position: 'CEO',
    hireDate: '2024-01-12',
    officeNumber: 901,
    phone: '+1(213) 555-9392',
    skype: 'jheart_DX_skype',
    email: 'jheart@dx-email.com',
    tags: [] as any,
    voiv: 'coipawn' as string,
  };

  cos() {
    console.log(this.employee);
  }
  dateBoxOptions: DxDateBoxTypes.Properties = {
    placeholder: this.employee.hireDate,
    acceptCustomValue: false,
    openOnFieldClick: true,
    displayFormat: 'yyyy-MM-dd',
  };
  isHomeAddressVisible: boolean | undefined | null = true;
  checkBoxOptions: DxCheckBoxTypes.Properties = {
    text: 'Show Address',
    value: true,
    onValueChanged: (e: DxCheckBoxTypes.ValueChangedEvent) => {
      this.isHomeAddressVisible = e.component.option('value');
    },
  };

  tagList = [
    { id: 1, nazwa: 'Tag 1', selected: false },
    { id: 2, nazwa: 'Tag 2', selected: false },
    { id: 3, nazwa: 'Tag 3', selected: false },
  ];

  submitForm() {
    const selectedTags = this.tagList
      .filter((tag) => tag.selected)
      .map((tag) => tag.id);

    this.employee.tags = selectedTags;

    console.log('Dane formularza:', this.employee);
  }

  uploadedFiles: any[] = [];

  handlePhotoUpload(event: any) {
    const file = event.file;
    console.log('Uploaded file:', file);
  }

  showScrollbarModes: { text: string; value: string }[] = [
    {
      text: 'On Scroll',
      value: 'onScroll',
    },
    {
      text: 'On Hover',
      value: 'onHover',
    },
    {
      text: 'Always',
      value: 'always',
    },
    {
      text: 'Never',
      value: 'never',
    },
  ];
}
