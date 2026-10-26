import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PagoTemporizadorService {
  crearCuentaRegresiva(fechaExpiracion: string): Observable<number> {
    return timer(0, 1000).pipe(
      map(() => this.calcularSegundosRestantes(fechaExpiracion)),

      takeWhile((segundos) => segundos > 0, true),
    );
  }

  calcularSegundosRestantes(fechaExpiracion: string): number {
    const fecha = this.convertirFechaBackend(fechaExpiracion);

    const diferencia = fecha.getTime() - Date.now();

    return Math.max(0, Math.floor(diferencia / 1000));
  }

  formatearTiempo(segundosTotales: number): string {
    const horas = Math.floor(segundosTotales / 3600);

    const minutos = Math.floor((segundosTotales % 3600) / 60);

    const segundos = segundosTotales % 60;

    return [horas, minutos, segundos].map((valor) => valor.toString().padStart(2, '0')).join(':');
  }

  private convertirFechaBackend(fecha: string): Date {
    const fechaNormalizada = fecha.replace(/(\.\d{3})\d+$/, '$1');

    return new Date(fechaNormalizada);
  }
}
