import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../models/categoria.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {

  private apiUrl = 'http://localhost:8080/api/v1/categorias'

  constructor(private http: HttpClient){}

  obtenerTodas(): Observable<ApiResponse<Categoria[]>>{
    return this.http.get<ApiResponse<Categoria[]>>(this.apiUrl)
  }

  obtenerPorId(id: number): Observable<ApiResponse<Categoria>>{
    return this.http.get<ApiResponse<Categoria>>(`${this.apiUrl}/${id}`)

  }

  obtenerPorSlug(slug: string): Observable<ApiResponse<Categoria>>{
    return this.http.get<ApiResponse<Categoria>>(`${this.apiUrl}/${slug}`)
  }


  
}
