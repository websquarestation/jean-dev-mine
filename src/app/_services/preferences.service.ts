import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders(
    { 
      "Content-Type": "application/json; charset=UTF-8"
    }
  )
};

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  private apiUrl:string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.baseUrl;
  }

  get(id: any): Observable<any> {
    return this.http.get(this.apiUrl + `/users/${id}/preferences`);
  }

  save(name: any, value: any): Observable<any> {
    return this.http.post(this.apiUrl + `/users/1/preferences/${name}?value=${value}`,"");
  }
}
