import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pago } from '../../models/pago.model';
import { PagoService } from '../../service/pago.service';

@Component({
  selector: 'app-comprobante-pago',
  imports: [],
  templateUrl: './comprobante-pago.html',
  styleUrl: './comprobante-pago.css',
})
export class ComprobantePago {
  @Input({ required: true })
  pago!: Pago;

  @Input()
  plazoVencido = false;

  @Output()
  pagoActualizado = new EventEmitter<Pago>();

  archivoSeleccionado: File | null = null;

  subiendo = false;
  error = '';
  mensajeExito = '';

  private readonly maxTamano = 5 * 1024 * 1024;

  private readonly tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf'];

  constructor(private pagoService: PagoService) {}

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.procesarArchivo(input.files[0]);

    input.value = '';
  }

  arrastrarArchivo(event: DragEvent): void {
    event.preventDefault();
  }

  soltarArchivo(event: DragEvent): void {
    event.preventDefault();

    if (!event.dataTransfer?.files.length) {
      return;
    }

    this.procesarArchivo(event.dataTransfer.files[0]);
  }

  private procesarArchivo(archivo: File): void {
    this.error = '';
    this.mensajeExito = '';

    if (!this.tiposPermitidos.includes(archivo.type)) {
      this.error = 'Solo se permiten archivos JPG, PNG o PDF.';

      return;
    }

    if (archivo.size > this.maxTamano) {
      this.error = 'El archivo no puede superar los 5 MB.';

      return;
    }

    this.archivoSeleccionado = archivo;
  }

  quitarArchivo(): void {
    this.archivoSeleccionado = null;

    this.error = '';
    this.mensajeExito = '';
  }

  subirComprobante(): void {
    if (!this.archivoSeleccionado || this.subiendo || this.plazoVencido) {
      return;
    }

    this.subiendo = true;
    this.error = '';
    this.mensajeExito = '';

    this.pagoService.subirComprobante(this.pago.id, this.archivoSeleccionado).subscribe({
      next: (response) => {
        this.subiendo = false;

        this.mensajeExito = 'Comprobante enviado correctamente.';

        this.archivoSeleccionado = null;

        this.pagoActualizado.emit(response.data);
      },

      error: (error) => {
        this.subiendo = false;

        this.error = error?.error?.message || 'No se pudo enviar el comprobante.';
      },
    });
  }

  obtenerTamanoArchivo(): string {
    if (!this.archivoSeleccionado) {
      return '';
    }

    const mb = this.archivoSeleccionado.size / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    const kb = this.archivoSeleccionado.size / 1024;

    return `${kb.toFixed(0)} KB`;
  }
}
