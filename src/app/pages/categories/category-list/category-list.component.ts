import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { PendencyService } from '../shared/pendency.service';
import { Pendency } from '../shared/pendency.model';
import { FilterUtils } from '../../pieces/shared/utils/filterutils';
import { SortEvent } from 'primeng/api/sortevent';
import { Router } from '@angular/router';
import { NgxPrinterService } from 'ngx-printer';


import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas'; 

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  @ViewChild('screen', { static:true}) screen: ElementRef;
  @ViewChild('canvas', { static:true}) canvas: ElementRef;
  @ViewChild('downloadLink', { static:true}) downloadLink: ElementRef;
  
  @ViewChild('PrintTemplate',{ static:false})
  private PrintTemplateTpl: TemplateRef<any>

  @ViewChild(CategoryListComponent, { static:false})read: ElementRef;
  PrintComponent: ElementRef;

  pendencies: Pendency[] = [];
  cols: any[];
  displayBasic2: boolean;
  printContent:any = [];
  selected:[] = [];

  resume:any;

  node = document.getElementById('my-node');
  capturedImage: any;


  constructor(private categoryService: PendencyService, 
              private router: Router, 
              private printerService: NgxPrinterService) 
              { }

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'nome', header: 'NOME' },
      { field: 'cordobanho', header: 'Cor' },
      { field: 'created', header: 'CRIADO' },
      { field: 'modified', header: 'MODIFICADO' },
      { field: 'status', header: 'STATUS' }
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
    this.categoryService.getAll().subscribe(
      pendencies => this.pendencies = pendencies.sort((a,b)=> b.id - a.id),
      error => alert('Erro ao carregar a lista' )
    )
    
  }

  public captureScreen()  
  {  
    var data = document.getElementById('idOfDivToPrint');  //Id of the table
    html2canvas(data, { useCORS: true, })
      .then(canvas => {  
        this.capturedImage = canvas.toDataURL();

      // Few necessary setting options  
      let imgWidth = 390;   
      let pageHeight = 691;    
      let imgHeight = canvas.height * imgWidth / canvas.width;  
      let heightLeft = imgHeight;  

      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('l', 'mm', [390, 691]);  
      let position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });  
  }  

  print(){
    //this.displayBasic2 = true;
    this.printerService.printOpenWindow = false;
    this.printerService.printDiv('idOfDivToPrint');
  }
  printSelecteds(){
    this.printContent = [];
    this.selected.forEach(element => {
      this.printContent.push(element);
    });
    this.displayBasic2 = true;
  }
  showDialog(row) {
    this.printContent = [];
    this.printContent.push(row);
    this.displayBasic2 = true;
  }

  deletePendency(pendency) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      this.categoryService.delete(pendency.id).subscribe(
        () => this.pendencies = this.pendencies.filter(element => element != pendency),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }

  editPendency(id){
    console.log(id);
    this.router.navigateByUrl("pendencies", {skipLocationChange: true}).then(
      () => this.router.navigate(['pendencies', id, 'edit'])
    )
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
