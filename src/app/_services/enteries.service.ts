import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Enteries } from '../models/enteries.model';

@Injectable({
  providedIn: 'root'
})
export class EnteriesService {

  private baseURL:string;

  constructor(private httpClient: HttpClient) { 
    this.baseURL = environment.baseUrl;
  }

  readAll(): Observable<Enteries[]> {
    return this.httpClient.get<Enteries[]>(this.baseURL + '/collections/personal/entries');
  }

  // read(id): Observable<any> {
  //   return this.httpClient.get(`${baseURL}/${id}`);
  // }

  // create(data): Observable<any> {
  //   return this.httpClient.post(baseURL, data);
  // }

  // update(id, data): Observable<any> {
  //   return this.httpClient.put(`${baseURL}/${id}`, data);
  // }

  // delete(id): Observable<any> {
  //   return this.httpClient.delete(`${baseURL}/${id}`);
  // }

  // deleteAll(): Observable<any> {
  //   return this.httpClient.delete(baseURL);
  // }

  // searchByName(name): Observable<any> {
  //   return this.httpClient.get(`${baseURL}?name=${name}`);
  // }
}
