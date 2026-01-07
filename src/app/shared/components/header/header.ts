import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  cantidadCarrito =0;
  cantidadDeseos= 0;
  usuarioAutenticado = false;
  nombreUsuario = 'Guest';
  menuAbierto = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.usuarioAutenticado = false;
    this.cantidadCarrito =  0;
    this.cantidadDeseos = 0;


  }

  logout():void{
    this.usuarioAutenticado = false;
    this.nombreUsuario = 'Guest';
    this.router.navigate(['/auth/login']);
  }

  agregaraCarrito():void{
    this.cantidadCarrito ++;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }



}
