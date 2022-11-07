import { map } from 'rxjs/operators';
import { ConsultantService } from './../../consultants/shared/consultant.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilterUtils } from '../shared/utils/filterutils';
import { ReportService } from './../shared/report.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {

  consultants: any;
  pendencies: any[] = [];
  cols: any[];
  showDialog: boolean;
  results: any;
  dataInicio: string;
  dataFinal: string;
  pedido: string;
  atendente: string;
  cliente: string;
  statusPedido: string;
  statusPagamento: string;
  qtdTotal: number = 0;
  valorTotal: number = 0;

  rutiQTD: number = 0;
  rutiVALUE: number = 0;

  yuriQTD: number = 0;
  yuriVALUE: number = 0;

  escritorioQTD: number = 0;
  escritorioVALUE: number = 0;

  michellyQTD: number = 0;
  michellyVALUE: number = 0;

  constructor(
    private router: Router,
    private consultantService: ConsultantService,

  ) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      this.results = this.router.getCurrentNavigation().extras.state.results;
      this.dataInicio = this.router.getCurrentNavigation().extras.state.dataInicio;
      this.dataFinal = this.router.getCurrentNavigation().extras.state.dataFinal;
      this.pedido = this.router.getCurrentNavigation().extras.state.pedido;
      this.atendente = this.router.getCurrentNavigation().extras.state.atendente;
      this.cliente = this.router.getCurrentNavigation().extras.state.cliente;
      this.statusPedido = this.router.getCurrentNavigation().extras.state.statusPedido;
      this.statusPagamento = this.router.getCurrentNavigation().extras.state.statusPagamento;
    } else {
      this.router.navigate(['reports'])
    }
  }

  ngOnInit() {
    this.consultantService.getAll().subscribe(
      res => this.consultants = res);
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'custom_piece', header: 'PEÇA' },
      { field: 'qtd', header: 'QTD' },
      { field: 'valor', header: 'VALOR' },
      { field: 'created', header: 'DATA' },
      { field: 'status', header: 'STATUS' },
      { field: 'pago', header: 'PAGAMENTO' },
      { field: 'cliente', header: 'CLIENTE' },
      { field: 'celular', header: 'CELULAR' },
      { field: 'atendente', header: 'ATDT' },
      { field: 'total', header: 'TOTAL' },
    ];


    this.results.forEach(item => {
      this.qtdTotal = this.qtdTotal + Number(item.qtd);
      this.valorTotal = this.valorTotal + Number(item.total);
    });

    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return parseInt(filter) > value;
    }
  }

  print() {
    let printData = document.getElementById('dataTable').cloneNode(true);

    let qtdP = document.createElement('p')
    qtdP.className = "format-p bottom-border"
    qtdP.innerHTML = "Quantidade Total: " + this.qtdTotal.toString()

    let valorP = document.createElement('p')
    valorP.className = "format-p bottom-border"
    valorP.innerHTML = "Valor Total: " + this.valorTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

    let divBox = document.createElement('div')
    divBox.className = "format-div top-margin"

    if (this.atendente == null) {
      this.consultants.forEach(atendente => {
        let div = document.createElement('div');
        div.className = "format-div border"
        let pNOME = document.createElement('p')
        pNOME.className = "format-p"
        pNOME.innerHTML = atendente.name

        let pQTD = document.createElement('p')
        pQTD.className = "format-p"
        let QTD: number = 0
        this.results.forEach(item => {
          if(item.cliente.atendente.toLowerCase() == atendente.name.toLowerCase()){
            QTD = QTD + Number(item.qtd)
          }
        });
        pQTD.innerHTML = "Quantidade Total: " + QTD;
        
        let pVALUE = document.createElement('p')
        pVALUE.className = "format-p"
        let VALOR: number = 0
        this.results.forEach(item => {
          if(item.cliente.atendente.toLowerCase() == atendente.name.toLowerCase()){
            VALOR = VALOR + Number(item.total)
          }
        });
        pVALUE.innerHTML = "Valor Total: " + VALOR.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

        div.appendChild(pNOME)
        div.appendChild(pQTD)
        div.appendChild(pVALUE)
        printData.appendChild(div)
      });
    }
    
    divBox.appendChild(qtdP)
    divBox.appendChild(valorP)

    document.body.appendChild(printData);
    printData.appendChild(divBox);
    window.print();
    document.body.removeChild(printData);
  }

}
