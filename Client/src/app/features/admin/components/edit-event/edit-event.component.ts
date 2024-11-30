import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
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
DxTagBoxModule,
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
import { DxoSummaryModule } from 'devextreme-angular/ui/nested';
import { AdminStateService } from '../../services/admin-state.service';
import { Observable } from 'rxjs';
import { LoadingState } from '../../../../shared/models/LoadingState';
import { EventDesc } from '../../../../shared/models/EventDesc';
import { EventStateService } from '../../../events/services/event-state.service';
import { Tag } from '../../../../shared/models/Tag';
import { AsyncPipe } from '@angular/common';

type CustomTag = Tag & {
  selected: boolean;
}

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
    DxTextAreaModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    AsyncPipe,
  ],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss',
})
export class EditEventComponent {
  private adminService = inject(AdminStateService);
  private eventService = inject(EventStateService);
  private router = inject(Router);

  @ViewChild('tagsForm', { static: false }) cosiek!: DxFormComponent;

  event$!: Observable<LoadingState<EventDesc>>;
  tagsList!: CustomTag[];
  eventDesc!: EventDesc;
  textAreaValid: boolean = true;

  ngOnInit() {
    //observable 2 na html, na przycisk sciagniecie danych z formularza
    this.eventService.getTags().subscribe(
      (response) => {
        this.tagsList = response.map((tag) => ({ ...tag, selected: false }));
        console.log(response);
      },
      (error) => {
        console.log(error);
        alert('Wystąpił błąd. Spróbuj ponownie później');
        this.router.navigate(['admin']);
      }
    );

    this.event$ = this.adminService.eventEdit$;
    this.adminService.getEventToEdit(window.history.state.id);

    this.event$.subscribe(res => {
      if(res.state === 'success'){
        this.eventDesc = res.data;
        this.onTagsLoad(res.data);
      }
    })
  } //tagi? mapowac do event decs i jednorazowo pobrac tagi?

  onTagsLoad(event: EventDesc) {
    this.tagsList.forEach(x => x.selected = event.tags.some(y => y.id === x.id));
  }

  onTagChanged(tag: CustomTag) {
    const indexEvent = this.eventDesc.tags.findIndex(index => index.id === tag.id);

    if (indexEvent === -1) {
      const newTag: Tag = {id: tag.id, name: tag.name};

      this.eventDesc.tags.push(newTag); 
    } else{
      this.eventDesc.tags.splice(indexEvent, 1); 
    }

    console.log(this.tagsList);
    console.log(this.eventDesc.tags);
  }

  textChange(data: string){
    console.log(data)
    if(data.trim().length > 0)
      this.textAreaValid = true;
    else this.textAreaValid = false;
  }

  isFormValid(): boolean {
    let valid = true;
    if(this.cosiek){
      if(this.cosiek.instance.validate().isValid)
        valid = true;
      else 
        valid = false;
    }
    // const formValid: boolean = this.cosiek.instance.validate().isValid !== undefined ? this.cosiek.instance.validate().isValid as boolean: false;
    return valid &&  this.textAreaValid;
  }

  cos() {
    console.log(this.eventDesc);
    console.log(this.tagsList);
    console.log(this.cosiek.instance.option('formData'));
  }

  dateBoxOptions: DxDateBoxTypes.Properties = {
    // zamienic na html
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

  // // submitForm() {
  // //   const selectedTags = this.tagsList
  // //     .filter((tag) => tag.selected)
  // //     .map((tag) => tag.id);

  //   console.log('Dane formularza:', this.employee);
  // }

  uploadedFiles: any[] = [];

  handlePhotoUpload(event: any) {
    const file: File = event.target.files[0];
    console.log('Uploaded file:', file);
  }
  voivodeships = Voivodeships;

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

  dwa = 'Dolnośląskie';

  // validateTags(){
  //   if(this.tagsList.some(tag => tag.selected)){
  //     console.log('true')
  //   }
  //   else
  //   console.log('false')
  //   return this.tagList.some(tag => tag.selected);
  // }

  validate() {}
  borderStyle: string = 'none';
  callbacks = [];
  adapterConfig = {
    getValue: () => {
      return this.tagsList;
    },
    validationRequestsCallbacks: [],
  };

  True = true;
}