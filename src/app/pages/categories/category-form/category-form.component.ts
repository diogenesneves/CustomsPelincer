import { Component, OnInit, AfterContentChecked} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms'
import { ActivatedRoute, Router} from '@angular/router'

import { Pendency } from '../shared/pendency.model'
import {PendencyService} from '../shared/pendency.service'

import { switchMap } from 'rxjs/operators'
import {MessageService} from 'primeng/api';

import toastr from "toastr"
import { PieceService } from '../../pieces/shared/piece.service';
import { Piece } from '../../pieces/shared/piece.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css',],
  providers: [MessageService]

})
export class CategoryFormComponent implements OnInit {

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  imaskConfig ={
    mask: Number,
    scale: 2,
    thoushandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  currentAction: string;
  pendencyForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean =false;
  pendency: Pendency = new Pendency();
  customPiece: any[] = [];
  photo: string = "";
  photoShow: boolean = false;
  images: any[];
  filteredPieces: any[];
  piece: string;
  matchID: string = "";
  valor:string ="";
  tipo:string ="";
  codigo:string ="";
  peso:string ="";
  tamanho:string ="";
  modelo:string ="";
  nomePeca: string;
  
  constructor(
    private pendencyService: PendencyService,
    private pieceService: PieceService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildPendencyForm();
    this.loadPendency();
    this.loadPiece();
  }
  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == "new")
      this.createPendency();
    else
      this.updatePendency();
  }
  filterPieces(event:any) {
    this.filteredPieces = [];
    for(let i = 0; i < this.customPiece.length; i++) {
        let piece = this.customPiece[i].nome;
        if(piece.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            this.filteredPieces.push(piece);
        }
    }
  }
  matchId(data){
    var index,value;
    for (index = 0; index < this.customPiece.length; ++index) {
      value = this.customPiece[index].nome;
    if (value === data) {
        this.matchID = this.customPiece[index].id;
        this.photo = this.customPiece[index].photo;
        this.pendencyForm.controls['valor_bruto'].setValue(
          this.customPiece[index].valor_bruto
        ); 
        this.pendencyForm.controls['valor_banho'].setValue(
          this.customPiece[index].valor_banho
        ); 
        this.tipo = this.customPiece[index].tipo;
        this.codigo = this.customPiece[index].codigo;
        this.peso = this.customPiece[index].peso;
        this.tamanho = this.customPiece[index].tamanho;
        this.modelo = this.customPiece[index].modelo;
        this.photoShow = true;
        break;
      }
    }
  }
  // PRIVATE METHODS

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildPendencyForm() {
    this.pendencyForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      custom_piece_id: [null,Validators.required],
      descricao: [null, [Validators.required, Validators.minLength(5)]],
      cordobanho: [null, [Validators.required]],
      valor: [null, [Validators.required]],
      valor_bruto: [null, [Validators.required]],
      status: ['Aberto', [Validators.required]],
      obs: [null],
      peso: [null],
      categoria: [null],
      valor_banho: [null],
    })
  }

  private loadPendency() {
    if(this.currentAction == "edit"){

      this.route.paramMap.pipe(
        switchMap(params => this.pendencyService.getById(+params.get("id")))
      )
      .subscribe(
        (pendency) => {
          this.pieceService.getById(pendency[0].custom_piece_id).subscribe(
            (piece: any) => {
              this.pendencyForm.patchValue(
                {id: pendency[0].id,
                nome: pendency[0].nome,
                custom_piece_id: pendency[0].custom_piece.nome,
                descricao: pendency[0].descricao,
                cordobanho: pendency[0].cordobanho,
                status: pendency[0].status,
                valor:pendency[0].valor,
                valor_banho:piece.valor_banho,
                valor_bruto:piece.valor_bruto,
                obs: pendency[0].obs}
              ) // binds loaded pendency data to pendencyForm
            }
          )
          this.pendency = pendency[0];
          this.tipo = pendency[0].custom_piece.tipo;
          this.codigo = pendency[0].custom_piece.codigo;
          this.peso = pendency[0].custom_piece.peso;
          this.tamanho = pendency[0].custom_piece.tamanho;
          this.modelo = pendency[0].custom_piece.modelo;
          this.matchID = pendency[0].custom_piece_id;
          this.photo = pendency[0].custom_piece.photo;
          this.photoShow = true;
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }
  private loadPiece() {
    this.pieceService.getAll().subscribe(
      pieces => this.customPiece = pieces,
      error => alert('Erro ao carregar a lista')
    )
  }

  private setPageTitle() {
    if(this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Novo Pedido'
    else{
      const pendencyNome = this.pendency.nome || ''
      this.pageTitle = 'Editando Pedido: '+ pendencyNome;
    }
  }

  private createPendency(){
    // SET CUSTOM PIECE ID IN FORM VALUE
    this.pendencyForm.value.custom_piece_id = this.matchID;
    const pendency: Pendency = Object.assign(new Pendency(), this.pendencyForm.value)

    this.pendencyService.create(pendency)
      .subscribe( 
        pendency => this.actionsForSucess('new'),
        error => this.actionsForError(error)
      )
  }

  private updatePendency(){
    this.pendencyForm.value.custom_piece_id = this.matchID;
    const pendency: Pendency = Object.assign(new Pendency(), this.pendencyForm.value);

    this.pendencyService.update(pendency)
    .subscribe( 
      pendency => this.actionsForSucess('edit'),
      error => this.actionsForError(error)
    )
  }

  private actionsForSucess(type:any){
//    toastr.success("Solicitação processada com sucesso!");
  this.addSingle(type)

    // REDIRECT/RELOAD COMPONENT PAGE
    // setTimeout(() => {
    //   this.router.navigateByUrl("pendencies", {skipLocationChange: true}).then(
    //     () => this.router.navigate(['pendencies', pendency.data, 'edit'])
    //   )
    // }, 1000);

  }

addSingle(type:any) {
  if(type === 'new'){
   return this.messageService.add({severity:'success', summary:'Serviço de Mensagem', detail:'Salvo com sucesso!'});
  }
    this.messageService.add({severity:'success', summary:'Serviço de Mensagem', detail:'Editado com sucesso!'});
}

addMultiple() {
    this.messageService.addAll([{severity:'success', summary:'Service Message', detail:'Via MessageService'},
                                {severity:'info', summary:'Info Message', detail:'Via MessageService'}]);
}

clear() {
    this.messageService.clear();
}

  private actionsForError(error){
    toastr.error('Ocorreu um erro ao processar a sua solicitação!')

    this.submittingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]  
  }

}
