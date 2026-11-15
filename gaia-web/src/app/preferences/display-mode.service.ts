import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DisplayModeService {
  private readonly adminState = signal(false);
  readonly admin = this.adminState.asReadonly();

  setAdmin(admin: boolean): void {
    this.adminState.set(admin);
  }
}
