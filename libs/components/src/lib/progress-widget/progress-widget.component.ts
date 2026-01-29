import { Component, computed, input } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'lib-jds-progress-widget',
  imports: [ProgressSpinner, BlockUIModule, NgTemplateOutlet, NgClass],
  templateUrl: './progress-widget.component.html',
  styleUrl: './progress-widget.component.css',
})
/**
 * A progress widget component that displays a loading spinner with an optional status message.
 *
 * @input isLoading - A boolean indicating the current loading state. Default is true.
 * @input statusMessage - A string representing the status message to be displayed below the spinner. Default is an empty string.
 * @input spinnerSize - A number representing the size of the spinner in rem units. Default is 5.
 * @input blockUi - A boolean indicating whether to block user interaction while loading. Default is false.
 * @input iconClass - A string representing additional CSS classes to apply to the spinner icon. Default is an empty string.
 * @input iconLeft - A boolean indicating whether the spinner icon should be aligned to the left. Default is false.
 */
export class ProgressWidgetComponent {
  isLoading = input(true);
  statusMessage = input('');
  spinnerSize = input(5);
  blockUi = input(false);
  iconClass = input('');
  iconLeft = input(false);

  sizeObject = computed(() => {
    return {
      width: `${this.spinnerSize()}rem`,
      height: `${this.spinnerSize()}rem`,
    };
  });
}
