import { ConsultantService } from './../../consultants/shared/consultant.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportService } from './../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {
  imaskConfig ={
    mask: Number,
    scale: 2,
    thoushandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }
  consultants: any[]=[];
  reportForm: FormGroup;
  results: any[] = [];
  loading: boolean;

  constructor(
    private reportService: ReportService, 
    private consultantService: ConsultantService,
    private router: Router,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.consultantService.getAll().subscribe(
      res => this.consultants = res);
      this.reportForm = this.formBuilder.group({
        dtInicio: [null],
        dtFinal: [null],
        statusPagamento: [null],
        pedido: [null],
        statusPedido: [null],
        atendente: [null],
        cliente: [null]
      })
  }

  submitForm(){
    this.loading = true;
    if(this.reportForm.get('dtInicio').value == null || this.reportForm.get('dtFinal').value == null){
      this.loading = false;
      alert('É necessario inserir uma data inicial e uma data final.')
    } else {
      let dataInicio = this.reportForm.get('dtInicio').value;
      let dataFinal = this.reportForm.get('dtFinal').value;
      let atendente = this.reportForm.get('atendente').value;
      let pedido = this.reportForm.get('pedido').value;
      let cliente = this.reportForm.get('cliente').value;
      let statusPagamento = this.reportForm.get('statusPagamento').value;
      let statusPedido = this.reportForm.get('statusPedido').value;

      console.log(this.reportForm.value)
      this.reportService.getData(this.reportForm.value).subscribe(
        results => {
          this.router.navigate(['reports/list'] , { state: { results, dataInicio, dataFinal, atendente, pedido, cliente, statusPagamento, statusPedido  } })
          this.loading = false;
        },
        error => console.log(error)
      )
    }
  }

}
