import { Component, inject } from '@angular/core';
import { Tag } from '../../../shared/models/Tag';
import { Voivodeships } from '../../../shared/models/voivodeships';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormValue } from '../../../shared/utils/FromValue';
import { EventStateService } from '../../events/services/event-state.service';
import { ToastService } from '../../../shared/services/toast.service';

type EventAddForm = FormGroup<{
  name: FormControl<string>;
  date: FormControl<string>;
  city: FormControl<string>;
  address: FormControl<string>;
  photoURL: FormControl<File | null>;
  voivodeship: FormControl<string>;
  tags: FormControl<Tag[]>;
  desc: FormControl<string>;
}>;

export type EventAddFormValue = FormValue<EventAddForm>;

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss',
})
export class AddEventComponent {
  private eventService = inject(EventStateService);
  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);
  private toastState = inject(ToastService);
  voivodeships = Voivodeships;

  tagsList!: Tag[];
  selectedTags: Tag[] = [];
  disableSubmit = false;

  eventForm: EventAddForm = this.formBuilder.group({
    name: this.formBuilder.control<string>(''),
    date: this.formBuilder.control<string>(''),
    city: this.formBuilder.control<string>(''),
    address: this.formBuilder.control<string>(''),
    photoURL: this.formBuilder.control<File | null>(null),
    voivodeship: this.formBuilder.control<string>(''),
    tags: this.formBuilder.control<Tag[]>(this.tagsList),
    desc: this.formBuilder.control<string>(''),
  });

  ngOnInit() {
    this.eventService.getTags().subscribe(
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
    this.eventForm.patchValue({
      tags: this.selectedTags,
    });
    if (this.validateForm(this.eventForm.getRawValue())) {
      this.disableSubmit = true;
      this.eventService.addEvent(this.eventForm.getRawValue()).subscribe(
        (response) => {
          this.toastState.showToast('Dodano wydarzenie', 'success');
          this.router.navigate([`home`]);
        },
        (error) => {
          console.log(error);
          this.toastState.showToast('Nie udało się dodać wydarzenia.', 'error');
        }
      );
    }
  }

  validateForm(form: EventAddFormValue): boolean {
    if (!form.name.trim().length) {
      alert('Niepoprawna wartość w nazwie!');
      return false;
    }
    if (!form.date) {
      alert('Niepoprawna wartość w dacie!');
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
    this.eventForm.patchValue({
      photoURL: event.target.files[0],
    });
  }
}
