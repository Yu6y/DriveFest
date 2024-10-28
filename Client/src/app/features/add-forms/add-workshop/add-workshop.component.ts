import { Component, inject } from '@angular/core';
import { WorkshopApiService } from '../../workshops/services/workshop-api.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Voivodeships } from '../../../shared/models/voivodeships';
import { Tag } from '../../../shared/models/Tag';
import { FormValue } from '../../../shared/utils/FromValue';
import { WorkshopStateService } from '../../workshops/services/workshop-state.service';

type WorkshopAddForm = FormGroup<{
  name: FormControl<string>;
  city: FormControl<string>;
  address: FormControl<string>;
  photoURL: FormControl<File | null>;
  voivodeship: FormControl<string>;
  tags: FormControl<Tag[]>;
  desc: FormControl<string>;
}>;

export type WorkshopAddFormValue = FormValue<WorkshopAddForm>;

@Component({
  selector: 'app-add-workshop',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-workshop.component.html',
  styleUrl: './add-workshop.component.scss',
})
export class AddWorkshopComponent {
  private workshopService = inject(WorkshopStateService);
  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);
  voivodeships = Voivodeships;

  tagsList!: Tag[];
  selectedTags: Tag[] = [];

  workshopForm: WorkshopAddForm = this.formBuilder.group({
    name: this.formBuilder.control<string>(''),
    city: this.formBuilder.control<string>(''),
    address: this.formBuilder.control<string>(''),
    photoURL: this.formBuilder.control<File | null>(null),
    voivodeship: this.formBuilder.control<string>(''),
    tags: this.formBuilder.control<Tag[]>(this.tagsList),
    desc: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.workshopService.getWorkshopsTags().subscribe(
      (response) => {
        this.tagsList = response;
      },
      (error) => {
        console.log(error);
        alert('Wystąpił błąd. Spróbuj ponownie później');
        this.router.navigate(['home']);
      }
    );
  }

  checkboxChange(tag: Tag) {
    if (this.selectedTags.includes(tag))
      this.selectedTags.splice(
        this.selectedTags.findIndex((o) => o.id === tag.id),
        1
      );
    else this.selectedTags.push(tag);
  }

  submit() {
    this.workshopForm.patchValue({
      tags: this.selectedTags,
    });
    if (this.validateForm(this.workshopForm.getRawValue())) {
      this.workshopService
        .addWorkshop(this.workshopForm.getRawValue())
        .subscribe(
          (response) => {
            this.router.navigate([`workshops`]);
          },
          (error) => {
            console.log(error);
            alert(error);
          }
        );
    }
  }

  validateForm(form: WorkshopAddFormValue): boolean {
    if (!form.name.trim().length) {
      alert('Niepoprawna wartość w nazwie!');
      return false;
    }
    if (!form.city.trim().length) {
      alert('Niepoprawna wartość w miejscowości!');
      return false;
    }
    if (!form.address.trim().length) {
      alert('Niepoprawna wartość w adresie!');
      return false;
    }
    if (!form.photoURL) {
      alert('Niepoprawne zdjęcie!');
      return false;
    }
    if (!form.voivodeship.trim().length) {
      alert('Wybierz województwo!');
      return false;
    }
    if (!form.tags.length) {
      alert('Zaznacz przynajmniej jeden tag!');
      return false;
    }
    if (!form.desc.trim().length) {
      alert('Niepoprawny opis!');
      return false;
    }
    return true;
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  sendPhoto(event: any) {
    this.workshopForm.patchValue({
      photoURL: event.target.files[0],
    });
  }
}
