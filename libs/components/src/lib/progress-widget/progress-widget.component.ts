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
 */
export class ProgressWidgetComponent {
  /** Controls spinner visibility. */
  isLoading = input(true);
  /** Text displayed below the spinner. */
  statusMessage = input('');
  /** Spinner diameter in rem. */
  spinnerSize = input(5);
  /** Enables the full-screen BlockUI overlay. */
  blockUi = input(false);
  /** PrimeIcons or custom CSS class for an icon beside the message. */
  iconClass = input('');
  /** Places the icon to the left of the message when true. */
  iconLeft = input(false);

  sizeObject = computed(() => {
    return {
      width: `${this.spinnerSize()}rem`,
      height: `${this.spinnerSize()}rem`,
    };
  });
}
