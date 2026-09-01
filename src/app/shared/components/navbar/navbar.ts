import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
   @Input() menuAbierto: boolean = false;
   @Output() menuCerrado = new EventEmitter<void>();

  cerrarMenu(): void {
    this.menuCerrado.emit();
  }

}
