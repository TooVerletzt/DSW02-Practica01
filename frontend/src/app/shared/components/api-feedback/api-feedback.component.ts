import { AsyncPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ApiFeedbackService } from '../../../core/http/api-feedback.service';

@Component({
  selector: 'app-api-feedback',
  imports: [AsyncPipe, NgClass],
  templateUrl: './api-feedback.component.html',
  styleUrl: './api-feedback.component.scss'
})
export class ApiFeedbackComponent {
  readonly message$;

  constructor(private readonly apiFeedbackService: ApiFeedbackService) {
    this.message$ = this.apiFeedbackService.message$;
  }

  clear(): void {
    this.apiFeedbackService.clear();
  }
}
