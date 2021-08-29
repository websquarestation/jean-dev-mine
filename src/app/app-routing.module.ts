import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';

import { AuthGuard } from './_helpers/auth.gaurd';

import { LoginComponent } from './login/login.component';
import { EnteriesComponent } from './enteries/enteries.component';
import { EntryComponent } from './entry/entry.component';
import { SearchComponent } from './search/search.component';
import { CreateenteryComponent } from './createentery/createentery.component';
import { ProfileComponent } from './profile/profile.component';
import { EditEntriesComponent } from './edit-entries/edit-entries.component';

const routes: Routes = [
  { path: 'enteries/:keyword', component: EnteriesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent },
  { path: 'create/entery', component: CreateenteryComponent },
  { path: 'upload/:id', component: EditEntriesComponent },
  { path: 'enteries/folder/:folderId', component: EnteriesComponent },
  { path: 'entry/:id', component: EntryComponent },
  { path: 'entery/:id', component: CreateenteryComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:slug', component: ProfileComponent },
  { path: '', redirectTo: 'enteries/folder/personal', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
