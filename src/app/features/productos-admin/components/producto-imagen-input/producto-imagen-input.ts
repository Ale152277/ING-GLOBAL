import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ProductoImagenCambio {
  url: string;
  archivo: File | null;
}

@Component({
  selector: 'app-producto-imagen-input',
  imports: [],
  templateUrl: './producto-imagen-input.html',
  styleUrl: './producto-imagen-input.css',
})
export class ProductoImagenInput {
  @Input() url = '';
  @Input() bloqueado = false;

  @Output() cambio = new EventEmitter<ProductoImagenCambio>();
  @Output() errorValidacion = new EventEmitter<string>();

  modo: 'url' | 'archivo' = 'url';
  archivo: File | null = null;
  previsualizacion: string | null = null;

  cambiarModo(modo: 'url' | 'archivo'): void {
    this.modo = modo;
  }

  actualizarUrl(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.url = input.value;
    this.archivo = null;
    this.previsualizacion = null;
    this.emitirCambio();
  }

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!tiposPermitidos.includes(archivo.type)) {
      this.errorValidacion.emit('Solo se permiten imágenes JPG, JPEG o PNG.');
      input.value = '';
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      this.errorValidacion.emit('La imagen no puede pesar más de 5 MB.');
      input.value = '';
      return;
    }

    this.archivo = archivo;

    const reader = new FileReader();
    reader.onload = () => {
      this.previsualizacion = reader.result as string;
    };
    reader.readAsDataURL(archivo);

    this.emitirCambio();
  }

  private emitirCambio(): void {
    this.cambio.emit({
      url: this.url,
      archivo: this.archivo,
    });
  }
}
