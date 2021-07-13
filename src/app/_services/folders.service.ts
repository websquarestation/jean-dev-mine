import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Folders } from '../models/folders.model';

@Injectable({
  providedIn: 'root'
})
export class FoldersService {

  private baseURL:string;

  constructor(private httpClient: HttpClient) { 
    this.baseURL = environment.baseUrl;
  }

  readAll(): Observable<Folders[]> {
    return this.httpClient.get<Folders[]>(this.baseURL + '/collections/PERSONAL/folders');
  }

  create(name: any): Observable<Folders[]> {
    return this.httpClient.post<Folders[]>(this.baseURL + '/folders', name);
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete(`${this.baseURL}/folders/${id}?type=PRIVATE`);
  }
}
