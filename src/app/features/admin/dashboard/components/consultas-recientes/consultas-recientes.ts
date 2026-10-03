import { Component, Input } from '@angular/core';
import { ConsultaReciente } from '../../model/dashboard.model';
import { EstadoConsultaDashboard } from '../../model/dashboard.model';
@Component({
  selector: 'app-consultas-recientes',
  imports: [],
  templateUrl: './consultas-recientes.html',
  styleUrl: './consultas-recientes.css',
})
export class ConsultasRecientes {
  @Input() consultas: ConsultaReciente[] = [];

  obtenerClaseEstado(estado: EstadoConsultaDashboard): string {
    switch (estado) {
      case 'RESPONDIDA':
        return 'consulta-respondida';

      case 'PENDIENTE':
        return 'consulta-pendiente';

      default:
        return '';
    }
  }
}
