import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost:8080/api/v1'
    
    constructor(private http: HttpClient){}

    /**
     * Realiza una peticion Get generica
     */

    //metodo get de tipo <T>(devuelve cualquier tipo que indiquemosEs), que recibe un endopoint y parametros opcionales
    get<T> (endpoint: string, params?: any): Observable<T>{
      let httpParams = new HttpParams();


      //si el usuario envio parametros (no asumes que params existe)
      if(params){
        //obtengo todas las claves del params y recorro cada una {page:1, size:10} => [page, size]
        Object.keys(params).forEach(key=>{

          //si el valor de esa clave no es null o undefined (pero permite 0 '' false)
          if(params[key] != null){

            //agrego un parametro con clave o valor
            httpParams = httpParams.set (key, params[key]);
          }
        });
      }

      //devuelvo un peticion get con la url base + endpoints y adjunto parametros
      return this.http.get<T>(`${this.apiUrl}${endpoint}`,{params: httpParams})
    }


    post<T>(endpoint: string, body:any): Observable<T>{
      return this.http.post<T> (`${this.apiUrl}${endpoint}`, body);
    }

    
    put<T> (endopoint: string, body:any):Observable<T>{
      return this.http.put<T>(`${this.apiUrl}${endopoint}`, body)
    }

    delete<T>(endpoint:string): Observable<T>{
      return this.http.delete<T>(`${this.apiUrl}${endpoint}`)

    }







  
}




/*
  HttpClient = permite realizar peticiones GET, POST, PUT, DELETA a servidores y APIs
  HttpParams = permite gestionar, serializar y añadir parametros de consulta (query params) a dichas peticiones /productos?page=1&size=10


*/