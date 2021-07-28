import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';

import { AuthGuard } from './_helpers/auth.gaurd';

import { LoginComponent } from './login/login.component';
import { EnteriesComponent } from './enteries/enteries.component';
import { SearchComponent } from './search/search.component';
import { CreateenteryComponent } from './createentery/createentery.component';

const routes: Routes = [
  { path: 'enteries', component: EnteriesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent },
  { path: 'create/entery', component: CreateenteryComponent },
  { path: 'folders/personal', component: EnteriesComponent },
  // { path: 'profile', component: ProfileComponent },
  // { path: 'user', component: BoardUserComponent },
  // { path: 'mod', component: BoardModeratorComponent },
  // { path: 'admin', component: BoardAdminComponent },
  { path: '', redirectTo: 'enteries', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
