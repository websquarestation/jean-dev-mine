import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  private baseURL:string;

  constructor(private httpClient: HttpClient) { 
    this.baseURL = environment.baseUrl;
  }

  search(data: any): Observable<any[]> {
    let queryString = new HttpParams({fromObject: data}).toString();
    return this.httpClient.get<any[]>(this.baseURL + '/search/filter?' + queryString);
  }
}
