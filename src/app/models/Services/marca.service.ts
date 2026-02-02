import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { Marca } from '../../models/marca.model';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  private apiUrl = 'http://localhost:8080/api/v1/marcas';

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<ApiResponse<Marca[]>> {
    return this.http.get<ApiResponse<Marca[]>>(this.apiUrl);
  }
}