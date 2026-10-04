import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../../shared/models/api-response.model';
import { AdminDashboardData } from '../model/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService{
    private apiUrl = `${environment.apiUrl}/api/v1/admin/dashboard`

    constructor(private http:HttpClient){}

    obtenerDashboard() : Observable<ApiResponse<AdminDashboardData>>{
        return this.http.get<ApiResponse<AdminDashboardData>>(this.apiUrl);
    }


}