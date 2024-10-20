import { Component, Input } from '@angular/core';
import { Comment } from '../../models/Comment';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
})
export class CommentCardComponent {
  @Input({ required: true }) value!: Comment;
}
