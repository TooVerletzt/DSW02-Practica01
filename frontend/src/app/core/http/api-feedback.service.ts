import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ApiFeedbackMessage {
  type: 'info' | 'error' | 'success';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ApiFeedbackService {
  private readonly messageSubject = new BehaviorSubject<ApiFeedbackMessage | null>(null);
  readonly message$ = this.messageSubject.asObservable();

  showError(text: string): void {
    this.messageSubject.next({ type: 'error', text });
  }

  showSuccess(text: string): void {
    this.messageSubject.next({ type: 'success', text });
  }

  clear(): void {
    this.messageSubject.next(null);
  }
}
