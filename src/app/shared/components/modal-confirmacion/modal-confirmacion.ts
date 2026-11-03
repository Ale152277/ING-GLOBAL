import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  templateUrl: './modal-confirmacion.html',
  styleUrl: './modal-confirmacion.css',
})
export class ModalConfirmacion implements AfterViewInit {
  /** 'peligro' (rojo, acciones destructivas) o 'exito' (verde). */
  @Input() variante: 'peligro' | 'exito' = 'peligro';
  /** Clases Font Awesome del icono, ej. 'fab fa-whatsapp'. */
  @Input() icono = 'fas fa-triangle-exclamation';
  @Input() titulo = '¿Estás seguro?';
  @Input() mensaje = '';
  /** Frase de advertencia destacada bajo el mensaje (ej. "Esta acción no puede deshacerse"). */
  @Input() advertencia = '';
  @Input() textoConfirmar = 'Confirmar';
  @Input() textoCancelar = 'Cancelar';
  @Input() procesando = false;

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  @ViewChild('botonCancelar') botonCancelar?: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    // La acción es destructiva: el foco inicial va a "Cancelar".
    this.botonCancelar?.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrar();
  }

  cerrar(): void {
    if (!this.procesando) {
      this.cancelar.emit();
    }
  }
}
