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
export class AuthService {

  private apiUrl:string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.baseUrl;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + '/accesstokens', {
      "canCreateAccount": false,
      "canChangePassword": true,
      email,      
      "processing": true,
      password
    }, httpOptions);
  }
}