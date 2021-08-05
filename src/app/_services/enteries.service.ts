import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  readAll(params: HttpParams): Observable<Enteries[]> {
    return this.httpClient.get<Enteries[]>(this.baseURL + '/collections/personal/entries', { params });
  }

  getTooltip(PartID: any): Observable<Enteries[]> {
    return this.httpClient.get<Enteries[]>(this.baseURL + `/parts/${PartID}/tooltip`);
  }
  
  create(data: any): Observable<any> {
    return this.httpClient.post(this.baseURL + '/parts', data);
  }

  postFile(fileToUpload: File):Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(this.baseURL + '/file/attachment', formData);
  }

  detail(id: any): Observable<any> {
    return this.httpClient.get(this.baseURL + `/parts/${id}`);
  }

  uploadSeqFile(type: string, fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('entryType', type);
    return this.httpClient
      .post(this.baseURL + '/file/sequence', formData);
  }

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
