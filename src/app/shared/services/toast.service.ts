import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastTipo = 'success' | 'error' | 'info';

export interface ToastAccion {
  etiqueta: string;
  /** Ruta interna a la que navega la acción. */
  enlace?: string;
  /** Callback al pulsar la acción. El toast se cierra al ejecutarla. */
  ejecutar?: () => void;
}

export interface Toast {
  id: number;
  mensaje: string;
  tipo: ToastTipo;
  accion?: ToastAccion;
  icono?: string;
  /** El toast ya se cerró y está animando su salida antes de quitarse del DOM. */
  saliendo?: boolean;
}

export interface ToastOpciones {
  tipo?: ToastTipo;
  accion?: ToastAccion;
  /** Clase Font Awesome que reemplaza el icono del tipo (ej. 'fa-circle-xmark'). */
  icono?: string;
  /** Milisegundos antes de cerrarse solo. */
  duracion?: number;
}

const MAX_TOASTS = 3;
/** Debe coincidir con la transición de salida de .toast-slot en toast-container.css. */
const DURACION_SALIDA = 300;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private siguienteId = 1;
  private temporizadores = new Map<number, ReturnType<typeof setTimeout>>();

  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  mostrar(mensaje: string, opciones: ToastOpciones = {}): void {
    const toast: Toast = {
      id: this.siguienteId++,
      mensaje,
      tipo: opciones.tipo ?? 'info',
      accion: opciones.accion,
      icono: opciones.icono,
    };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    this.temporizadores.set(
      toast.id,
      setTimeout(() => this.cerrar(toast.id), opciones.duracion ?? 4000),
    );

    const activos = this.toastsSubject.value.filter((t) => !t.saliendo);
    activos.slice(0, Math.max(0, activos.length - MAX_TOASTS)).forEach((t) => this.cerrar(t.id));
  }

  exito(mensaje: string, opciones: Omit<ToastOpciones, 'tipo'> = {}): void {
    this.mostrar(mensaje, { ...opciones, tipo: 'success' });
  }

  error(mensaje: string, opciones: Omit<ToastOpciones, 'tipo'> = {}): void {
    this.mostrar(mensaje, { ...opciones, tipo: 'error' });
  }

  /** Marca el toast como "saliendo" para animarlo y lo quita del DOM al terminar. */
  cerrar(id: number): void {
    const temporizador = this.temporizadores.get(id);

    if (temporizador) {
      clearTimeout(temporizador);
      this.temporizadores.delete(id);
    }

    const toast = this.toastsSubject.value.find((t) => t.id === id);

    if (!toast || toast.saliendo) return;

    this.toastsSubject.next(
      this.toastsSubject.value.map((t) => (t.id === id ? { ...t, saliendo: true } : t)),
    );

    setTimeout(() => {
      this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
    }, DURACION_SALIDA);
  }
}
