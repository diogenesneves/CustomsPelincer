import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError} from "rxjs";
import { map, catchError, flatMap} from "rxjs/operators"

import { Client } from "./client.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiPath: string = "https://sis.sandrapelincer.com.br/api/clientes/"

  constructor(private http: HttpClient) { }

  getAll(): Observable<Client[]>{
    return this.http.get(`${this.apiPath}${'index.json'}`).pipe(
      catchError(this.handleError),
      map(res => { return res.data; })
      )
  }

  getById(id: number): Observable<Client>{
    const url = `${this.apiPath}view/${id}.json`;
      return this.http.get(url).pipe(
        catchError(this.handleError),
        map(res => { return res.data[0]; })
        )
  }

  create(piece: Client): Observable<Client>{
    return this.http.post(`${this.apiPath}${'add.json'}`, piece).pipe(
      catchError(this.handleError),
      //map(this.jsonDataToPiece)
    )
  }

  update(piece: Client, data): Observable<Client>{
    const url = `${this.apiPath}edit/${piece.id}.json`;
     return this.http.post(url, data).pipe(
      catchError(this.handleError),
      //map(this.jsonDataToPiece)
     )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}${'delete'}/${id}.json`;
      return this.http.delete(url).pipe(
        catchError(this.handleError),
        map(() => console.log("EXCLUÍDO COM SUCESSO!"))
      )
  }

//  PRIVATE METHODS

private jsonDataToPieces(jsonData: any[]): Client[] {
  const pieces: Client[] = []
  jsonData.forEach(element => pieces.push( element as Client));
    return pieces;
}

private jsonDataToPiece(jsonData: any): Client{
  return jsonData as Client;
}

private handleError(error: any): Observable<any>{
  console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
}

}
