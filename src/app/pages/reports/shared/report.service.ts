import { map, catchError, flatMap } from "rxjs/operators"
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiPath: string = "https://sis.sandrapelincer.com.br/api/customOrders/"

  constructor(
    private http: HttpClient,
  ) { }


  getData(formData: any): Observable<any[]> {
    return this.http.post(`${this.apiPath}test.json`,
      {
        "dtInicio": formData.dtInicio !== null ? formData.dtInicio : '',
        "dtFinal": formData.dtFinal !== null ? formData.dtFinal : '',
        "cliente": formData.cliente !== null ? formData.cliente : '',
        "atendente": formData.atendente !== null ? formData.atendente : '',
        "pedido": formData.pedido !== null ? formData.pedido : '',
        "statusPedido": formData.statusPedido !== null ? formData.statusPedido : '',
        "statusPagamento": formData.statusPagamento !== null ? formData.statusPagamento : '',
      }).pipe(
        catchError(this.handleError),
        map(res => { return res.data; })
      )
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}
