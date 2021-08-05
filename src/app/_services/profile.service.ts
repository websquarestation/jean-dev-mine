import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseURL: string;

  constructor(private httpClient: HttpClient) {
    this.baseURL = environment.baseUrl;
  }

  getProfile(id: any): Observable<any[]> {
    return this.httpClient.get<any>(this.baseURL + `/users/${id}`);
  }

  submitProfile(id: any, profileData: any): Observable<any[]> {
    return this.httpClient.put<any>(this.baseURL + `/users/${id}`, profileData);
  }

  changePassword(id: any, profileData: any): Observable<any[]> {
    return this.httpClient.put<any>(this.baseURL + `/users/${id}/password`, profileData);
  }
}
