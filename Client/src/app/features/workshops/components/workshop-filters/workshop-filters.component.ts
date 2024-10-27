import { Component, inject } from '@angular/core';
import { WorkshopCardComponent } from '../workshop-card/workshop-card.component';
import { WorkshopStateService } from '../../services/workshop-state.service';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { SORT_BY, SortBy } from '../../../../shared/models/Sort';
import { Voivodeships } from '../../../../shared/models/voivodeships';
import { Tag } from '../../../../shared/models/Tag';
import { FormValue } from '../../../../shared/utils/FromValue';

type WorkshopListFiltersForm = FormGroup<{
  searchTerm: FormControl<string>;
  sortBy: FormControl<SortBy>;
  tags: FormControl<Tag[]>;
  voivodeships: FormControl<string[]>;
}>;

export type WorkshopListFiltersFormValue = FormValue<WorkshopListFiltersForm>;

@Component({
  selector: 'app-workshop-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './workshop-filters.component.html',
  styleUrl: './workshop-filters.component.scss',
})
export class WorkshopFiltersComponent {
  private stateService = inject(WorkshopStateService);
  private formBuilder = inject(NonNullableFormBuilder);
  protected sortOption = SORT_BY;
  check: boolean = true;
  voivodeships: string[] = Voivodeships;
  tags!: Tag[];
  selectedVoivodeships: string[] = [];
  selectedTags: Tag[] = [];

  form: WorkshopListFiltersForm = this.formBuilder.group({
    //formarray
    searchTerm: this.formBuilder.control<string>(''),
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
        console.log(error); //strona bledu
      }
    );
  }

  submitFilters() {
    this.form.patchValue({
      tags: this.selectedTags,
      voivodeships: this.selectedVoivodeships,
    });

    this.stateService.loadFilteredWorkshops(this.form.getRawValue());
  }

  clearFilters() {
    //this.check = false;
    this.selectedTags = [];
    this.selectedVoivodeships = [];
    this.form.reset({
      searchTerm: '',
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
  //do poprawy
  voivChange(voiv: string) {
    if (this.selectedVoivodeships.includes(voiv))
      this.selectedVoivodeships.splice(
        this.selectedVoivodeships.findIndex((o) => o === voiv),
        1
      );
    else this.selectedVoivodeships.push(voiv);
  }
}
