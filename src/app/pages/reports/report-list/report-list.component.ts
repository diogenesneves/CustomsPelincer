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
  colsAtendentes: any[];
  showDialog: boolean;
  results: any;
  resultsAtendentes: any = [];
  dataInicio: string;
  dataFinal: string;
  pedido: string;
  atendente: string;
  cliente: string;
  statusPedido: string;
  statusPagamento: string;
  qtdTotal: number = 0;
  valorTotal: number = 0;

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
      res => this.consultants = res
    );
    this.results.forEach(item => {
      this.qtdTotal = this.qtdTotal + Number(item.qtd);
      this.valorTotal = this.valorTotal + Number(item.total);
    });
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

    this.colsAtendentes = [
      { field: 'atendente', header: 'ATENDENTE' },
      { field: 'qtd', header: 'QUANTIDADE DE VENDAS' },
      { field: 'valor', header: 'VALOR TOTAL' }
    ];

    this.results.forEach(item => {
      if (this.resultsAtendentes.indexOf(item.cliente.atendente.toLowerCase()) == -1) {
        this.resultsAtendentes.push(item.cliente.atendente.toLowerCase())
      }
    });

    this.resultsAtendentes.forEach(atendente => {
      let QTD: number = 0
      this.results.forEach(item => {
        if (item.cliente.atendente.toLowerCase() == atendente.toLowerCase()) {
          QTD = QTD + Number(item.qtd)
        }
      });

      let VALOR: number = 0
      this.results.forEach(item => {
        if (item.cliente.atendente.toLowerCase() == atendente.toLowerCase()) {
          VALOR = VALOR + Number(item.total)
        }
      });
      this.resultsAtendentes[this.resultsAtendentes.indexOf(atendente)] = {
        "atendente": atendente,
        "qtd": QTD,
        "valor": VALOR
      }
    })

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
      let atendentes = [];
      this.results.forEach(item => {
        if (atendentes.indexOf(item.cliente.atendente.toLowerCase()) == -1) {
          atendentes.push(item.cliente.atendente.toLowerCase())
        }
      });

      let tabela = document.createElement('table')
      tabela.className = "tabela-atendentes"
      let thead = document.createElement('thead')
      let tr = document.createElement('tr')
      tr.className = "trHEAD-atendentes"
      thead.appendChild(tr)

      let thATDT = document.createElement('th')
      thATDT.innerHTML = "ATENDENTE"
      let thQTD = document.createElement('th')
      thQTD.innerHTML = "QTD"
      let thVALOR = document.createElement('th')
      thVALOR.innerHTML = "VALOR"

      tr.appendChild(thATDT)
      tr.appendChild(thQTD)
      tr.appendChild(thVALOR)

      let tbody = document.createElement('tbody')

      atendentes.forEach(atendente => {

        let trBODY = document.createElement('tr')

        let tdATDT = document.createElement('td')
        tdATDT.innerHTML = atendente[0].toUpperCase() + atendente.substring(1)

        let QTD: number = 0
        this.results.forEach(item => {
          if (item.cliente.atendente.toLowerCase() == atendente.toLowerCase()) {
            QTD = QTD + Number(item.qtd)
          }
        });
        let tdQTD = document.createElement('td')
        tdQTD.innerHTML = QTD.toString()

        let VALOR: number = 0
        this.results.forEach(item => {
          if (item.cliente.atendente.toLowerCase() == atendente.toLowerCase()) {
            VALOR = VALOR + Number(item.total)
          }
        });
        let tdVALOR = document.createElement('td')
        tdVALOR.innerHTML = VALOR.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

        trBODY.appendChild(tdATDT)
        trBODY.appendChild(tdQTD)
        trBODY.appendChild(tdVALOR)
        tbody.appendChild(trBODY)
      });
      tabela.appendChild(thead)
      tabela.appendChild(tbody)
      printData.appendChild(tabela)
    }

    divBox.appendChild(qtdP)
    divBox.appendChild(valorP)

    document.body.appendChild(printData);
    printData.appendChild(divBox);
    window.print();
    document.body.removeChild(printData);
  }

}
