import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError} from "rxjs";
import { map, catchError, flatMap} from "rxjs/operators"

import { Pendency } from "./pendency.model";

@Injectable({
  providedIn: 'root'
})
export class PendencyService {

  private apiPath: string = "https://sis.sandrapelincer.com.br/api/customOrders/"

  constructor(private http: HttpClient) { }

  getAll(dtInicio: any, dtFinal: any): Observable<Pendency[]>{
    return this.http.post(`${this.apiPath}index.json`,
    {
      "dtInicio": dtInicio,
      "dtFinal": dtFinal,
    }).pipe(
      catchError(this.handleError),
      map(res => {
        return res.data;
      }))
  }

  getById(id: number): Observable<Pendency>{
    const url = `${this.apiPath}${'view'}/${id}.json`;
      return this.http.get(url).pipe(
        catchError(this.handleError),
        map(res => {
          return res.data;
        })
      )
  }

  create(pendency: Pendency): Observable<Pendency>{
    return this.http.post(`${this.apiPath}${'add.json'}`, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
    )
  }

  update(pendency: Pendency): Observable<Pendency>{
    const url = `${this.apiPath}${'edit'}/${pendency.id}.json`;
     return this.http.put(url, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
     )
  }

  pay(pendency: Pendency): Observable<Pendency>{
    const url = `${this.apiPath}${'pay'}/${pendency.id}.json`;
     return this.http.put(url, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
     )
  }

  delivery(pendency: Pendency): Observable<Pendency>{
    const url = `${this.apiPath}${'delivery'}/${pendency.id}.json`;
     return this.http.put(url, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
     )
  }

  pendency(pendency: Pendency): Observable<Pendency>{
    const url = `${this.apiPath}${'pendency'}/${pendency.id}.json`;
     return this.http.put(url, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
     )
  }

  multPendency(pendency): Observable<any>{
    return this.http.post(`${this.apiPath}${'addMult.json'}`, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
    )
  }

  multPay(pendency): Observable<any>{
    return this.http.post(`${this.apiPath}${'payMult.json'}`, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
    )
  }

  multDelivery(pendency): Observable<any>{
    return this.http.post(`${this.apiPath}${'deliveryMult.json'}`, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
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

private jsonDataToPendencies(jsonData: any[]): Pendency[] {
  const pendencies: Pendency[] = []
  jsonData.forEach(element => pendencies.push( element as Pendency));
    return pendencies;
}

private jsonDataToPendency(jsonData: any): Pendency{
  return jsonData as Pendency;
}

private handleError(error: any): Observable<any>{
  console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
}

}
