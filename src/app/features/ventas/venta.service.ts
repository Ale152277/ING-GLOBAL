import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../shared/models/api-response.model";
import { Venta } from "../../models/venta.model";

@Injectable({
    providedIn: 'root'
})

export  class VentaService{

    private apiUrl = `${environment.apiUrl}/api/v1/ventas`;

    constructor(private http : HttpClient) {}

    crearVenta(): Observable<ApiResponse<Venta>>{
        return this.http.post<ApiResponse<Venta>>(
            this.apiUrl,
            {}
        )
    }

    obtenerMisVentas(): Observable<ApiResponse<Venta[]>> {
    return this.http.get<ApiResponse<Venta[]>>(
      this.apiUrl
    );
  }



}