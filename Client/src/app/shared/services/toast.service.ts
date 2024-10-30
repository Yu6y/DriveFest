import { Injectable } from '@angular/core';
import { DxToastComponent } from 'devextreme-angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toast: DxToastComponent | null = null;

  register(toast: DxToastComponent) {
    this.toast = toast;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    if (this.toast) {
      const width = this.calculateWidth(message);
      const height = this.calculateHeight(message);
      this.toast.instance.option({
        message: message,
        type: type,
        width: width,
        visible: true
      });
    }
  }

  private calculateWidth(message: string): number {
    const baseWidth = 200; // Minimalna szerokość toasta
    const additionalWidth = Math.min(200, message.length * 8); // Dodatkowa szerokość, maksymalnie 200
    const totalWidth = baseWidth + additionalWidth;

    // Ustawienie maksymalnej szerokości na 400
    return Math.min(totalWidth, 400); // Ostateczna szerokość nie może przekraczać 400 pikseli
  }

  private calculateHeight(message: string): number {
    const lineHeight = 24; // Wysokość jednej linii tekstu
    const numberOfLines = Math.ceil(message.length / 30); // Obliczenie liczby linii
    return Math.max(60, lineHeight * numberOfLines); // Minimalna wysokość to 60
  }
}
