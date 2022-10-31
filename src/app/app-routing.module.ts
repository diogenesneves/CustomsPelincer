import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: '', canActivate: [AuthGuard],
  children: [
    { path: 'pendencies', loadChildren: './pages/categories/categories.module#CategoriesModule'},
    { path: 'pieces', loadChildren: './pages/pieces/pieces.module#PiecesModule'},
    { path: 'consultants', loadChildren: './pages/consultants/consultants.module#ConsultantsModule'},
    { path: 'clients', loadChildren: './pages/clients/clients.module#ClientsModule'},
  ]},
  { path: 'login', loadChildren: './pages/login/login.module#LoginModule'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
