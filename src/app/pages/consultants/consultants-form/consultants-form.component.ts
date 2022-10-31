import { Component, OnInit, AfterContentChecked} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms'
import { ActivatedRoute, Router} from '@angular/router'

import { switchMap } from 'rxjs/operators'

import toastr from "toastr"
import { Consultant } from '../shared/consultant.model';
import { ConsultantService } from '../shared/consultant.service';

@Component({
  selector: 'app-consultants-form',
  templateUrl: './consultants-form.component.html',
  styleUrls: ['./consultants-form.component.css']
})
export class ConsultantsFormComponent implements OnInit {

  currentAction: string;
  pieceForm: FormGroup;
  pageTitle: string;
  imageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean =false;
  piece: Consultant = new Consultant();

  
  constructor(
    private consultantService: ConsultantService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildPieceForm();
    this.loadPiece();
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.setPageTitle();
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
      name: [null, [Validators.required, Validators.minLength(1)]],
      address: [null, [Validators.minLength(1)]],
      phone: [null,],
      status: [true, [Validators.required]],
      obs: [null]
    })
  }

  private loadPiece() {
    if(this.currentAction == "edit"){

      this.route.paramMap.pipe(
        switchMap(params => this.consultantService.getById(+params.get("id")))
      )
      .subscribe(
        (consultant) => {
          this.piece = consultant;
          this.pieceForm.patchValue(this.piece) // binds loaded piece data to pieceForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de Novo(a) Atendente(a)'
    }else{
      const pieceNome = this.piece.name || ''
      this.pageTitle = 'Editando Atendente: '+ pieceNome;
    }
  }
  createFormData(){
     var formData: any = new FormData();
      formData.append("name", this.pieceForm.get('name').value);
      formData.append("phone", this.pieceForm.get('phone').value);
      formData.append("address", this.pieceForm.get('address').value);
      formData.append("obs", this.pieceForm.get('obs').value);
      formData.append("status", this.pieceForm.get('status').value);
      return formData;
  }

  private createpiece(){
    //const piece: Piece = Object.assign(new Piece(), this.pieceForm.value)
    this.consultantService.create(this.createFormData())
      .subscribe( 
        piece => this.actionsForSucess(piece),
        error => this.actionsForError(error)
      )
  }

  private updatepiece(){
   const piece: Consultant = Object.assign(new Consultant(), this.pieceForm.value);
    this.consultantService.update(piece, this.createFormData())
    .subscribe( 
      piece => this.actionsForSucess(piece),
      error => this.actionsForError(error)
    )
  }

  private actionsForSucess(piece: Consultant){
    toastr.success("Solicitação processada com sucesso!");


    // REDIRECT/RELOAD COMPONENT PAGE
    setTimeout(() => {this.router.navigate(['consultants'])}, 500);
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
