import { Component, OnInit } from '@angular/core';
import { ProgressWidgetComponent } from '@jax-data-science/components';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-showcase-progress-widget',
  imports: [ProgressWidgetComponent, Button],
  templateUrl: './showcase-progress-widget.component.html',
  styleUrl: './showcase-progress-widget.component.css',
})
export class ShowcaseProgressWidgetComponent implements OnInit {
  message = 'Loading...';
  isLoading = true;
  blockUi = false;
  unblockMessage = '';

  ngOnInit() {
    // Simulate a loading process
    setTimeout(() => {
      this.message = 'Done!';
      this.isLoading = false;
    }, 3000);
  }

  toggleBlockUi() {
    this.blockUi = true;
    this.unblockMessage = 'UI is blocked';
    let countdown = 4;
    const interval = setInterval(() => {
      countdown--;
      this.unblockMessage = `Unblocking in ${countdown}...`;
      if (countdown === 0) {
        clearInterval(interval);
        this.blockUi = false;
      }
    }, 1000);
  }
}
