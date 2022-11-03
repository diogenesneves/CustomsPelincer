import { Component, OnInit, TemplateRef, ElementRef, ViewChild, LOCALE_ID } from '@angular/core';
import { PendencyService } from '../shared/pendency.service';
import { Pendency } from '../shared/pendency.model';
import { SortEvent } from 'primeng/api/sortevent';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxPrinterService, PrintItem } from 'ngx-printer';


import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { filter } from 'rxjs/operators';
import { FilterUtils } from '../../clients/shared/utils/filterutils';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

registerLocaleData(localePt, 'pt-BR');


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [MessageService,{ provide: LOCALE_ID, useValue: 'pt-BR'}]
})
export class CategoryListComponent implements OnInit {

  @ViewChild('screen', { static: true }) screen: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('downloadLink', { static: true }) downloadLink: ElementRef;

  @ViewChild('PrintTemplate', { static: false })
  private PrintTemplateTpl: TemplateRef<any>

  @ViewChild(CategoryListComponent, { static: false }) read: ElementRef;
  PrintComponent: ElementRef;

  pendencies: Pendency[] = [];
  cols: any[];
  displayBasic2: boolean;
  printContent: any = [];
  selected: [] = [];
  pdfTitle: string = "";
  action:string = "";

  observable = [];

  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  selecteds: boolean = true;
  show: boolean = false;

  resume: any;

  node = document.getElementById('my-node');
  capturedImage: any;
  title: string = ""
  loading: boolean;
  displayConfirm: boolean = false;

  constructor(private categoryService: PendencyService,
    private router: Router,
    private printerService: NgxPrinterService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.cols = [
      { field: 'nome', header: 'NOME' },
      { field: 'descricao', header: 'DESCRIÇÃO' },
      { field: 'codigo', header: 'CÓDIGO' },
      { field: 'valor', header: 'VALOR' },
      { field: 'tipo', header: 'TIPO' },
      { field: 'cordobanho', header: 'Cor' },
      { field: 'pago', header: 'Pago' },
      { field: 'created', header: 'CRIADO' },
      { field: 'modified', header: 'MODIFICADO' },
      { field: 'status', header: 'STATUS' }
    ];

    this.loadTable();
  }

  private loadTable() {
    this.categoryService.getAll().subscribe(
      pendencies => this.pendencies = pendencies.sort((a, b) => b.id - a.id),
      error => alert('Erro ao carregar a lista')).add(() => {
        if (this.route.snapshot.url[0] == undefined) {
          this.loading = false;
          this.title = "Em aberto"
          this.show = true;
          this.pendencies = this.pendencies.filter(e => e.status == 'Aberto')
          console.log('aberto')
        }
        else if (this.route.snapshot.url[0].path == "pendente") {
          this.loading = false;
          this.title = "Ag. Fornecedor";
          this.pendencies = this.pendencies.filter(e => e.status == "Pendente")
        }
        else if (this.route.snapshot.url[0].path == "entregue") {
          this.loading = false;
          this.title = "Entregue";
          this.pendencies = this.pendencies.filter(e => e.status == "Entregue")
        }
      }
      )
  }

  public total(data) {
    const qtd = data.qtd == null ? 1 : data.qtd;
    const total = parseFloat(data.valor) * qtd;
    return total;
  }

  public entrega(days, created) {
    let entrega = new Date(created);
    entrega.setDate(entrega.getDate() + days)
    return entrega
  }

  public captureScreen() {
    var data = document.getElementById('printDiv');  //Id of the table
    html2canvas(data)
      .then(canvas => {
        this.capturedImage = canvas.toDataURL();

        // Few necessary setting options  
        let imgWidth = 390;
        let pageHeight = 691;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jspdf('l', 'mm', [196, 562]);
        let position = 1;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
        pdf.save(`${this.printContent[0].cliente.nome} - ${this.printContent[0].custom_piece.nome}` + '.pdf'); // Generated PDF   
      });
  }


  print() {
    let printData = document.getElementById('printDiv').cloneNode(true);
    document.body.appendChild(printData);
    window.print();
    document.body.removeChild(printData);
  }
  printSelecteds() {
    this.selecteds = false;
    this.pdfTitle = 'Pedidos';
    this.printContent = [];
    this.selected.forEach(element => {
      this.printContent.push(element);
    });
    this.displayBasic2 = true;
  }
  showDialog(row) {
    this.selecteds = true;
    this.pdfTitle = row.nome;
    this.printContent = [];
    this.printContent.push(row);
    this.displayBasic2 = true;
  }

  showDialogConfirm(action) {
    this.displayConfirm = true;
    switch (action) {
      case 'pend':
        this.action = "PENDENTE";
        break;
      case 'pay':
        this.action = "PAGO";
        break;
      case 'delivered':
        this.action = "ENTREGUE";
        break;
    }
  }

  deletePendency(pendency) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.categoryService.delete(pendency.id).subscribe(
        () => this.pendencies = this.pendencies.filter(element => element != pendency),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }

  editPendency(id) {
    this.router.navigateByUrl("pendencies", { skipLocationChange: true }).then(
      () => this.router.navigate(['pendencies', id, 'edit'])
    )
  }

  payPendency(id) {
    this.categoryService.pay(id)
      .subscribe(
        pendency => this.actionsForSucess('edit'),
        error => this.actionsForError(error)
      ).add(() =>
        this.loadTable()
      )
  }

  sendToPendSelecteds() {
    this.categoryService.multPendency(this.selected).subscribe(res => {
      this.loadTable(); 
      this.displayConfirm=false
    });
  }

  paySelecteds() {
    this.categoryService.multPay(this.selected).subscribe(res => {
      this.loadTable(); 
      this.displayConfirm=false
    });
  }

  sendToDeliveredSelecteds() {
    this.categoryService.multDelivery(this.selected).subscribe(res => {
      this.loadTable(); 
      this.displayConfirm=false
    });
  }

  deliveryPendency(id) {
    this.categoryService.delivery(id)
      .subscribe(
        pendency => this.actionsForSucess('edit'),
        error => this.actionsForError(error)
      ).add(() =>
        this.loadTable()
      )
  }

  private actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!')

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
  }


  private actionsForSucess(type: any) {
    //    toastr.success("Solicitação processada com sucesso!");
    this.addSingle(type)
  }

  addSingle(type: any) {
    if (type === 'new') {
      return this.messageService.add({ severity: 'success', summary: 'Serviço de Mensagem', detail: 'Salvo com sucesso!' });
    }
    this.messageService.add({ severity: 'success', summary: 'Serviço de Mensagem', detail: 'Editado com sucesso!' });
  }
  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }

}
