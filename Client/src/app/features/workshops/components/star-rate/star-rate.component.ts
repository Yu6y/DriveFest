import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'

@Component({
  selector: 'app-star-rate',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './star-rate.component.html',
  styleUrl: './star-rate.component.scss'
})
export class StarRateComponent {
  @Input() rating: number = 0;
  @Output() starClick = new EventEmitter<number>();
  faStar = faStar;

ngOnInit(){
  console.log(this.rating);
}

  setRating(value: number){
    this.rating = value;
  }
}
