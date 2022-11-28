import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api/sortevent';
import { Router } from '@angular/router';
import { FilterUtils } from '../../clients/shared/utils/filterutils';
import { Client } from '../../clients/shared/client.model';
import { ConsultantService } from '../shared/consultant.service';

@Component({
  selector: 'app-consultants-list',
  templateUrl: './consultants-list.component.html',
  styleUrls: ['./consultants-list.component.css']
})
export class ConsultantsListComponent implements OnInit {

  pendencies: Client[] = [];
  nome="";
  cols: any[];
  loading: boolean;

  constructor(private consultantService: ConsultantService, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.consultantService.getAll().subscribe(
      pendencies =>{
        this.pendencies = pendencies.sort((a,b)=> b.id - a.id)
        this.loading = false;
      } ,
      error => alert('Erro ao carregar a lista')
    )

    this.cols = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'NOME' },
        { field: 'phone', header: 'TELEFONE' },
        { field: 'address', header: 'ENDEREÇO' },
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
  }

  deleteConsultant(pendency) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      this.consultantService.delete(pendency.id).subscribe(
        () => this.pendencies = this.pendencies.filter(element => element != pendency),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }
  editConsultant(id){
    console.log(id);
    this.router.navigateByUrl("consultants", {skipLocationChange: true}).then(
      () => this.router.navigate(['consultants', id, 'edit'])
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
