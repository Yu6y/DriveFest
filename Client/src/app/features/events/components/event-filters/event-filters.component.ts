import { Component, inject } from '@angular/core';
import { Voivodeships } from '../../../../shared/models/voivodeships';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Tag } from '../../../../shared/models/Tag';
import { EventStateService } from '../../services/event-state.service';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { SORT_BY, SortBy } from '../../../../shared/models/Sort';
import { FormValue } from '../../../../shared/utils/FromValue';

type EventListFiltersForm = FormGroup<{
  searchTerm: FormControl<string>;
  dateFrom: FormControl<string>;
  dateTo: FormControl<string>;
  sortBy: FormControl<SortBy>;
  tags: FormControl<Tag[]>;
  voivodeships: FormControl<string[]>;
}>;

export type EventListFiltersFormValue = FormValue<EventListFiltersForm>;

@Component({
  selector: 'app-event-filters',
  standalone: true,
  imports: [NgbCollapseModule, ReactiveFormsModule],
  templateUrl: './event-filters.component.html',
  styleUrl: './event-filters.component.scss',
})
export class EventFiltersComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private stateService = inject(EventStateService);
  protected sortOption = SORT_BY;
  voivodeships: string[] = Voivodeships;
  tags!: Tag[];
  selectedVoivodeships: string[] = [];
  selectedTags: Tag[] = [];
  check: boolean = true;

  form: EventListFiltersForm = this.formBuilder.group({
    searchTerm: this.formBuilder.control<string>(''),
    dateFrom: this.formBuilder.control<string>(''),
    dateTo: this.formBuilder.control<string>(''),
    sortBy: this.formBuilder.control<SortBy>(SORT_BY.NONE),
    tags: this.formBuilder.control<Tag[]>(this.tags),
    voivodeships: this.formBuilder.control<string[]>(this.voivodeships),
  });

  ngOnInit() {
    this.stateService.getTags().subscribe(
      (response) => {
        this.tags = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  submitFilters() {
    this.form.patchValue({
      tags: this.selectedTags,
      voivodeships: this.selectedVoivodeships,
    });

    this.stateService.loadFilteredEvents(this.form.getRawValue());
  }

  clearFilters() {
    this.check = true;
    this.selectedTags = [];
    this.selectedVoivodeships = [];
    this.form.reset({
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      sortBy: SORT_BY.NONE,
      tags: [],
      voivodeships: [],
    });
  }

  inputChange(option: Tag) {
    if (this.selectedTags.includes(option))
      this.selectedTags.splice(
        this.selectedTags.findIndex((o) => o.id === option.id),
        1
      );
    else this.selectedTags.push(option);
  }

  voivChange(voiv: string) {
    if (this.selectedVoivodeships.includes(voiv))
      this.selectedVoivodeships.splice(
        this.selectedVoivodeships.findIndex((o) => o === voiv),
        1
      );
    else this.selectedVoivodeships.push(voiv);
  }

  dateChange() {
    if (this.form.value.dateFrom && this.form.value.dateTo) {
      let from: Date = new Date(this.form.value.dateFrom);
      let to: Date = new Date(this.form.value.dateTo);

      if (from > to) this.check = false;
      else this.check = true;
    }
  }
}
