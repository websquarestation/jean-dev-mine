import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from "angular-datatables";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TimeagoModule } from 'ngx-timeago';
import { NgxFileDropModule } from 'ngx-file-drop';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { EnteriesComponent } from './enteries/enteries.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavComponent } from './layout/nav/nav.component';
import { CreateenteryComponent } from './createentery/createentery.component';
import { SearchComponent } from './search/search.component';

import { LoaderService } from './_services/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { MyLoaderComponent } from './components/my-loader/my-loader.component';

import { DatepickerModule } from 'ng2-datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EntryComponent } from './entry/entry.component';

import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './profile/profile.component';
import { FoldersComponent } from './folders/folders.component';
import { EditEntriesComponent } from './edit-entries/edit-entries.component';

import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EnteriesComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    CreateenteryComponent,
    SearchComponent,
    MyLoaderComponent,
    EntryComponent,
    ProfileComponent,
    FoldersComponent,
    EditEntriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DataTablesModule,
    BsDropdownModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    DatepickerModule,
    NgSelectModule,
    ToastrModule.forRoot(),
    Ng2SearchPipeModule,
    TimeagoModule.forRoot(),
    NgxFileDropModule,
    ConfirmDialogModule
  ],
  providers: [
    authInterceptorProviders,
    LoaderService,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
