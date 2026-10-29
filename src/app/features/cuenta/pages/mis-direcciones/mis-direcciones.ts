import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Direccion, DireccionRequest } from '../../../../models/direccion.model';
import { DireccionService } from '../../services/direccion.service';

@Component({
  selector: 'app-mis-direcciones',
  imports: [FormsModule],
  templateUrl: './mis-direcciones.html',
  styleUrl: './mis-direcciones.css',
})
export class MisDirecciones implements OnInit {
  direcciones: Direccion[] = [];

  cargando = false;
  guardando = false;
  operandoId: number | null = null;

  mostrarFormulario = false;
  editandoId: number | null = null;

  error = '';
  mensaje = '';

  formulario: DireccionRequest = this.nuevoFormulario();

  seleccionadaId: number | null = null;

  get seleccionada(): Direccion | undefined {
    return this.direcciones.find((d) => d.id === this.seleccionadaId);
  }

  seleccionar(direccion: Direccion): void {
    this.editar(direccion);
  }

  constructor(private direccionService: DireccionService) {}

  ngOnInit(): void {
    this.cargarDirecciones();
  }

  cargarDirecciones(): void {
    this.cargando = true;

    this.direccionService.listar().subscribe({
      next: (response) => {
        this.direcciones = response.success ? (response.data ?? []) : [];
        this.error = response.success ? '' : response.message;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudieron cargar las direcciones.';
        this.cargando = false;
      },
    });

    if(!this.mostrarFormulario){
      const actual = this.direcciones.find(d => d.id === this.seleccionadaId) ?? this.direcciones[0];
      if(actual) {
        this.seleccionar(actual)
      }else{
        this.seleccionadaId = null
      }
    }
  }

  nueva(): void {
    this.editandoId = null;
    this.formulario = this.nuevoFormulario();
    this.mostrarFormulario = true;
    this.error = '';
    this.seleccionadaId = null
  }

  editar(direccion: Direccion): void {
    const { id, ...datos } = direccion;

    this.editandoId = id;
    this.formulario = { ...datos };
    this.mostrarFormulario = true;
    this.error = '';
    this.seleccionadaId = direccion.id
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.editandoId = null;
    this.formulario = this.nuevoFormulario();
    this.error = '';
  }

  guardar(form: NgForm): void {
    if (form.invalid || this.guardando) return;

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    const request = { ...this.formulario };

    const operacion =
      this.editandoId === null
        ? this.direccionService.crear(request)
        : this.direccionService.actualizar(this.editandoId, request);

    operacion.subscribe({
      next: (response) => {
        this.guardando = false;

        if (!response.success) {
          this.error = response.message || 'No se pudo guardar la dirección.';
          return;
        }

        this.seleccionadaId = response.data?.id ?? this.seleccionadaId;
        this.mensaje = response.message || 'Dirección guardada correctamente.';
        this.cancelar();
        this.cargarDirecciones();
      },
      error: (err) => {
        this.guardando = false;
        this.error = err.error?.message || 'No se pudo guardar la dirección.';
      },
    });
  }

  establecerPredeterminada(id: number): void {
    if (this.operandoId !== null) return;

    this.operandoId = id;
    this.error = '';

    this.direccionService.establecerPredeterminada(id).subscribe({
      next: (response) => {
        this.operandoId = null;

        if (response.success) {
          this.mensaje = 'Dirección predeterminada actualizada.';
          this.cargarDirecciones();
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.operandoId = null;
        this.error = err.error?.message || 'No se pudo actualizar la dirección.';
      },
    });
  }

  eliminar(direccion: Direccion): void {
    if (this.operandoId !== null) return;

    if (!confirm(`¿Eliminar la dirección "${direccion.alias}"?`)) return;

    this.operandoId = direccion.id;
    this.error = '';

    this.direccionService.eliminar(direccion.id).subscribe({
      next: (response) => {
        this.operandoId = null;

        if (response.success) {
          if (this.editandoId === direccion.id) this.cancelar();

          this.mensaje = 'Dirección eliminada correctamente.';
          this.cargarDirecciones();
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.operandoId = null;
        this.error = err.error?.message || 'No se pudo eliminar la dirección.';
      },
    });
  }

  private nuevoFormulario(): DireccionRequest {
    return {
      alias: '',
      nombreReceptor: '',
      telefono: '',
      departamento: '',
      provincia: '',
      distrito: '',
      direccion: '',
      referencia: '',
      codigoPostal: '',
      predeterminada: false,
    };
  }
}
