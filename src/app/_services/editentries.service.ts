import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Enteries } from '../models/enteries.model';

@Injectable({
  providedIn: 'root'
})
export class EditEntriesService {

  private baseURL: string;

  constructor(private httpClient: HttpClient) {
    this.baseURL = environment.baseUrl;
  }

  uploads(params: any): Observable<Enteries[]> {
    return this.httpClient.put<Enteries[]>(this.baseURL + '/uploads', params);
  }

  getUploads(id: any, limit: any, offset: any): Observable<Enteries[]> {
    return this.httpClient.get<Enteries[]>(this.baseURL + `/uploads/${id}?limit=${limit}&offset=${offset}`);
  }

  updateSingleField(mid: any, eid: any, data: any): Observable<any> {
    return this.httpClient.post(this.baseURL + `/uploads/${mid}/entry/${eid}`, data);
  }
}
