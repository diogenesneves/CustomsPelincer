import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';


const routes: Routes = [
  { path: '', canActivate: [AuthGuard],
  children: [
    { path: 'pendencies', loadChildren: './pages/categories/categories.module#CategoriesModule'},
    { path: 'pieces', loadChildren: './pages/pieces/pieces.module#PiecesModule'},
  ]},
  { path: 'login', loadChildren: './pages/login/login.module#LoginModule'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
