import { Component, OnInit } from '@angular/core';
import { ClientService } from '../shared/client.service';
import { Client } from '../shared/client.model';
import { SortEvent } from 'primeng/api/sortevent';
import { Router } from '@angular/router';
import { FilterUtils } from '../shared/utils/filterutils';


@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  pendencies: Client[] = [];
  nome = "";
  cols: any[];
  loading: boolean;

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.clientService.getAll().subscribe(
      pendencies =>{
        this.pendencies = pendencies.sort((a, b) => b.id - a.id)
        this.loading = false;
      },
      error => alert('Erro ao carregar a lista')
    )

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'nome', header: 'NOME' },
      { field: 'celular', header: 'TELEFONE' },
      { field: 'endereco', header: 'ENDEREÇO' },
      { field: 'atendente', header: 'ATENDENTE' },
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

  deletePiece(pendency) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.clientService.delete(pendency.id).subscribe(
        () => this.pendencies = this.pendencies.filter(element => element != pendency),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }
  editPiece(id) {
    console.log(id);
    this.router.navigateByUrl("clients", { skipLocationChange: true }).then(
      () => this.router.navigate(['clients', id, 'edit'])
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
