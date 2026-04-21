import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'lib-jds-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {
  /** Image src for the logo rendered in the left column. */
  @Input() logo = '';

  /** Alt text for the logo image. */
  @Input() logoAlt = 'Logo';

  /** Href / route the logo links to. Defaults to "/". */
  @Input() logoHref = '/';

  /** Navigation links rendered in a responsive grid in the center column. */
  @Input() items: MenuItem[] = [];

  /** Optional caption text pinned to the right column (e.g. version). */
  @Input() caption = '';
}
