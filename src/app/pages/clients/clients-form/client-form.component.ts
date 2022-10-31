import { Component, OnInit, AfterContentChecked} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms'
import { ActivatedRoute, Router} from '@angular/router'

import { Client } from '../shared/client.model'
import { ClientService } from '../shared/client.service'

import { switchMap } from 'rxjs/operators'

import toastr from "toastr"
import { ConsultantService } from '../../consultants/shared/consultant.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

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
  pieceForm: FormGroup;
  pageTitle: string;
  imageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean =false;
  piece: Client = new Client();
  uploadedFiles: any[]=[];
  chargeFiles: any[]=[];
  imageURL: string;
  photo: string = "";
  consultants: any[]=[];

  
  constructor(
    private clientService: ClientService,
    private consultantService: ConsultantService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.consultantService.getAll().subscribe(
      res => this.consultants = res);
    this.setCurrentAction();
    this.buildPieceForm();
    this.loadPiece();
    console.log(this.consultants)
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.setPageTitle();
  }

  // Image Preview
  showPreview(event) {
    const file = (event as HTMLInputElement).files[0];
    
    this.pieceForm.patchValue({
      photo: file
    });
    this.pieceForm.get('photo').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == "new")
      this.createpiece();
    else
      this.updatepiece();
  }

  // PRIVATE METHODS

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildPieceForm() {
    this.pieceForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(1)]],
      endereco: [null, [Validators.required, Validators.minLength(1)]],
      atendente: [null, [Validators.required]],
      celular: [null, [Validators.required]],
      status: [true, [Validators.required]],
      obs: [null]
    })
  }

  private loadPiece() {
    if(this.currentAction == "edit"){

      this.route.paramMap.pipe(
        switchMap(params => this.clientService.getById(+params.get("id")))
      )
      .subscribe(
        (client) => {
          this.piece = client;
          this.chargeFiles=[1]
          this.pieceForm.patchValue(this.piece) // binds loaded piece data to pieceForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de Novo(a) Cliente'
    }else{
      const pieceNome = this.piece.nome || ''
      this.pageTitle = 'Editando Cliente: '+ pieceNome;
    }
  }
  createFormData(){
     var formData: any = new FormData();
      formData.append("nome", this.pieceForm.get('nome').value);
      formData.append("celular", this.pieceForm.get('celular').value);
      formData.append("endereco", this.pieceForm.get('endereco').value);
      formData.append("status", this.pieceForm.get('status').value);
      formData.append("obs", this.pieceForm.get('obs').value);
      formData.append("atendente", this.pieceForm.get('atendente').value);
      return formData;
  }

  private createpiece(){
    //const piece: Piece = Object.assign(new Piece(), this.pieceForm.value)
    this.clientService.create(this.createFormData())
      .subscribe( 
        piece => this.actionsForSucess(piece),
        error => this.actionsForError(error)
      )
  }

  private updatepiece(){
   const piece: Client = Object.assign(new Client(), this.pieceForm.value);
    this.clientService.update(piece, this.createFormData())
    .subscribe( 
      piece => this.actionsForSucess(piece),
      error => this.actionsForError(error)
    )
  }

  private actionsForSucess(piece: Client){
    toastr.success("Solicitação processada com sucesso!");


    // REDIRECT/RELOAD COMPONENT PAGE
    setTimeout(() => {this.router.navigate(['clients'])}, 500);
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
