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
    this.reportService.getData(this.reportForm.value).subscribe(
      results => {
        this.router.navigate(['reports/list'] , { state: { results } })
      },
      error => console.log(error)
    )
  }

}
