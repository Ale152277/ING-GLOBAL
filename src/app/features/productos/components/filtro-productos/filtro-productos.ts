import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria, FiltrosProductos } from '../../../../models/categoria.model';
@Component({
  selector: 'app-filtro-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-productos.html',
  styleUrl: './filtro-productos.css',
})
export class FiltroProductos {
  @Input() categorias: Categoria[] = [];
  @Output() filtrosChange = new EventEmitter<FiltrosProductos>();

  selectedCategoria: string = '';

  searchTerm: string = '';

  private emitirFiltros(): void{
    this.filtrosChange.emit({
      categoria: this.selectedCategoria,
      searchTerm: this.searchTerm
    })
  }

  onCategoriaChange():void{
    this.emitirFiltros();
  }

  onSearchChange():void{
    this.emitirFiltros();
  }


  limpiarFiltros():void{
    this.selectedCategoria = 'todos';
    this.searchTerm = '';
    this.emitirFiltros();
  }

}
