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

  pendencies: any[] = [];
  cols: any[];
  results: any;
  showDialog: boolean;
  dataInicio: string;
  dataFinal: string;

  constructor(
    private router: Router
  ) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      this.dataInicio = this.router.getCurrentNavigation().extras.state.dataInicio;
      this.dataFinal = this.router.getCurrentNavigation().extras.state.dataFinal;
      this.results = this.router.getCurrentNavigation().extras.state.results;
    } else {
      this.router.navigate(['reports'])
    }
  }

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'ID PEDIDO' },
      { field: 'custom_piece', header: 'PEÇA' },
      { field: 'created', header: 'DATA' },
      { field: 'status', header: 'STATUS' },
      { field: 'pago', header: 'PAGAMENTO' },
      { field: 'cliente', header: 'CLIENTE' },
      { field: 'celular', header: 'CELULAR' },
      { field: 'atendente', header: 'ATENDENTE' },
      { field: 'total', header: 'TOTAL' },
    ];

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
    document.body.appendChild(printData);
    window.print();
    document.body.removeChild(printData);
  }

}
