import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GenericHttpService<T> {
  constructor(
    private httpClient: HttpClient,
    private url: string,
  ) {}
  public add(item: T): Observable<T> {
    return this.httpClient.post<T>(`${this.url}`, item);
  } // add
  public update(item: T): Observable<T> {
    return this.httpClient.put<T>(`${this.url}`, item);
  } // update
  public getAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.url}`);
  } // getAll
  public delete(id: any): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/${id}`);
  } // delete
  public getById(id: number): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.url}/${id}`);
  } // getById

} // GenericHttpService
