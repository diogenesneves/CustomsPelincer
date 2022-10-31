import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError} from "rxjs";
import { map, catchError, flatMap} from "rxjs/operators"

import { Consultant } from "./consultant.model";

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {

  private apiPath: string = "https://sis.sandrapelincer.com.br/api/consultants/"

  constructor(private http: HttpClient) { }

  getAll(): Observable<Consultant[]>{
    return this.http.get(`${this.apiPath}${'index.json'}`).pipe(
      catchError(this.handleError),
      map(res => { return res.data; })
      )
  }

  getById(id: number): Observable<Consultant>{
    const url = `${this.apiPath}view/${id}.json`;
      return this.http.get(url).pipe(
        catchError(this.handleError),
        map(res => { return res.data[0]; })
        )
  }

  create(piece: Consultant): Observable<Consultant>{
    return this.http.post(`${this.apiPath}${'add.json'}`, piece).pipe(
      catchError(this.handleError),
      //map(this.jsonDataToPiece)
    )
  }

  update(piece: Consultant, data): Observable<Consultant>{
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

private jsonDataToPieces(jsonData: any[]): Consultant[] {
  const pieces: Consultant[] = []
  jsonData.forEach(element => pieces.push( element as Consultant));
    return pieces;
}

private jsonDataToPiece(jsonData: any): Consultant{
  return jsonData as Consultant;
}

private handleError(error: any): Observable<any>{
  console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
}

}
