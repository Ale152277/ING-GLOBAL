import { Component,Input  } from '@angular/core';

@Component({
  selector: 'app-dashboard-resumen',
  imports: [],
  templateUrl: './dashboard-resumen.html',
  styleUrl: './dashboard-resumen.css',
})
export class DashboardResumen {

  @Input() pedidosTotales: number = 0;
  @Input() pedidosPendientes: number =0;
  @Input() pedidosCompletados: number =0;

  @Input() productosActivos: number =0;
  @Input() productosStockBajo: number =0;


}
