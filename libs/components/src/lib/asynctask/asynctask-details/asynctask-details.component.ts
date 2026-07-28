import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunInput } from '../asynctask.model';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'lib-asynctask-details',
  imports: [CommonModule, Divider],
  templateUrl: './asynctask-details.component.html',
  styleUrl: './asynctask-details.component.css',
  standalone: true
})
export class AsyncTaskDetailsComponent {
  // TODO [BW 2025/5/21] This will be replaced in another ticket that adds error handling
  error = '';
  /** Optional template rendered inside the expanded row body; receives the task as its context. */
  @Input() bodyTemplate?: TemplateRef<null>;
  /** The task whose details are rendered in the expanded row. */
  @Input() task!: RunInput;
}
