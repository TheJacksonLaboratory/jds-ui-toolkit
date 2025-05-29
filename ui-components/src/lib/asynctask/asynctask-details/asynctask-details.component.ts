import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunInput } from '../asynctask.model';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'lib-asynctask-details',
  imports: [CommonModule, Divider],
  templateUrl: './asynctask-details.component.html',
  styleUrl: './asynctask-details.component.css',
})
export class AsyncTaskDetailsComponent {
  // TODO [BW 2025/5/21] This will be replaced in another ticket that adds error handling
  error = '';
  @Input() bodyTemplate?: TemplateRef<null>;
  @Input() task!: RunInput;
}
