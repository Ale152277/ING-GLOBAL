import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Toast, ToastService, ToastTipo } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule, RouterLink],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {
  toasts$: Observable<Toast[]>;

  readonly iconos: Record<ToastTipo, string> = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info',
  };

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  ejecutarAccion(toast: Toast): void {
    this.toastService.cerrar(toast.id);
    toast.accion?.ejecutar?.();
  }

  cerrar(toast: Toast): void {
    this.toastService.cerrar(toast.id);
  }
}
