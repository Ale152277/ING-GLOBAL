import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';
import { Marca } from '../../models/marca.model';

@Component({
  selector: 'app-producto-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './producto-modal.html'
})
export class ProductoModal implements OnChanges {

    @Input() categorias: Categoria[] = [];
    @Input() marcas: Marca[] = [];
    @Input() isEditando = false
    @Input() productoSeleccionado: Producto | null = null;
    @Input() bloqueado = false;

    @Output() cerrar = new EventEmitter<void>();
    @Output() guardar = new EventEmitter<{values: any; modoImagen: 'url' | 'archivo'; archivoSeleccionado: File | null}>()
    @Output() errorValidacion = new EventEmitter<string>()

    productoForm: FormGroup;
    modoImagen: 'url'|'archivo' = 'url'
    archivoSeleccionado: File | null = null;
    previsualizacionImagen: string | null = null
    etiquetasDisponibles: string[] = ['bestseller', 'new', 'premium', 'promo', 'agotado'];


    constructor(private fb: FormBuilder){
        
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required, Validators.minLength(3)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      categoriaId: ['', Validators.required],
      marcaId: [''],
      descripcion: [''],
      stock: ['', [Validators.required, Validators.min(0)]],
      descuento: ['', [Validators.min(0), Validators.max(100)]],
      etiqueta: [''],
      imagen: [''],
      rating: ['', [Validators.min(0), Validators.max(5)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoSeleccionado']) {
      if (this.productoSeleccionado) {
        this.productoForm.patchValue(this.productoSeleccionado);
      } else {
        this.productoForm.reset();
        this.modoImagen = 'url';
        this.archivoSeleccionado = null;
        this.previsualizacionImagen = null;
      }
    }
  }

  esValido(campo: string): boolean{
    const control = this.productoForm.get(campo)
    return !!(control && control.invalid && control.touched)

  }

  onArchivoSeleccionado(event: Event): void{
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length >0){
        const archivo = input.files[0];
        const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];

        if (!tiposPermitidos.includes(archivo.type)){
            this.errorValidacion.emit('Solo se permiten imágenes JPG, JPEG O PNG')
            return;
        }
        if(archivo.size > 5 * 1024 * 1024){
            this.errorValidacion.emit('La imagen no puede pesar mas de 5MB');
            return;
        }

        this.archivoSeleccionado = archivo;
        const reader = new FileReader();
        reader.onload = ()=> (this.previsualizacionImagen = reader.result as string);
        reader.readAsDataURL(archivo)

    }
  }

  onGuardar(): void{
    if(!this.productoForm.valid){
        this.errorValidacion.emit('Por favor completa todos los campos requeridos');
        this.productoForm.markAllAsTouched();
        return
    }

    this.guardar.emit({
        values: this.productoForm.value,
        modoImagen: this.modoImagen,
        archivoSeleccionado: this.archivoSeleccionado
    })
  }
  
  
}