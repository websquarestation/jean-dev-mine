import { Component, OnInit } from '@angular/core';

import { StarRatingComponent } from 'ng-starrating';
import { TokenStorageService } from './../_services/token-storage.service';

import { DatepickerOptions } from 'ng2-datepicker';

import { CreateEntery } from './../models/createentry.model';
import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import {Observable} from 'rxjs';

import { EnteriesService } from '../_services/enteries.service';
import { FiltersService } from '../_services/filters.service';

@Component({
  selector: 'app-createentery',
  templateUrl: './createentery.component.html',
  styleUrls: ['./createentery.component.css']
})
export class CreateenteryComponent implements OnInit {
  currentRate = 3.2;
  
  CreatorName: String = '';
  CreatorEmail: String = '';
  CreationDate: any = new Date();
  name: String = '';
  selectionMarkers: any = '';
  intellectualProperty: String = '';
  isSearchable: boolean = true;
  loading: boolean = false;
  loadingText: String = "Loading...";
  parametersInp: any = [];
  diseasesInp: any = [];  
  promoterInp: any = [];
  epitopeInp: any = [];
  domainInp: any = [];
  linksInp: any = [];
  antigenInp: any = [];
  hlaInp: any = [];
  seletionmakersInp: any = [];
  labsData: any = [];
  backboneData: any = [];
  originreplicationData: any = [];
  replicatesinData: any = [];
  supplierData: any = [];
  PIVal: String = '';
  createdStatus: boolean = false;  
  isFormSubmitted = false;
  public createEnteryModel: any;
  parametersModel: any = {
    "key": "",
    "name": "",
    "value": ""
  };
  // options sample with default values
  options: DatepickerOptions = {
    calendarClass: 'datepicker-blue',
    scrollBarColor: '#ffffff',
    maxDate: new Date(),
    format: 'yyyy-MM-dd', // date format to display in input
  };

  constructor(private tokenStorage: TokenStorageService,
    private enteriesService: EnteriesService,
    private filtersService: FiltersService,
    ) {
    this.createEnteryModel = new CreateEntery();
  }

  ngOnInit(): void {
    let cuser = this.tokenStorage.getUser();
    this.createEnteryModel.creator = cuser.firstName + " " + cuser.lastName;
    this.createEnteryModel.creatorEmail = cuser.email;    
    this.createEnteryModel.disease = [];
    this.createEnteryModel.selectionMarkers = [];
    this.createEnteryModel.promoter = [];
    this.createEnteryModel.hla = [];
    this.createEnteryModel.epitope = [];
    this.createEnteryModel.antigen = [];
    this.createEnteryModel.domain = [];
    this.createEnteryModel.parameters = [];

    this.createEnteryModel.links = [];
    this.diseasesInp.length = 1;
    this.seletionmakersInp.length = 1;
    this.promoterInp.length = 1;
    this.epitopeInp.length = 1;
    this.domainInp.length = 1;
    this.hlaInp.length = 1;
    this.antigenInp.length = 1;
    this.linksInp.length = 1;
    this.createEnteryModel.circular = 0;
    this.createEnteryModel.verified = false;
    this.createEnteryModel.status = 'Complete';
    this.createEnteryModel.expressionType = 'DNA';
    this.createEnteryModel.bioSafetyLevel = 1;
  }

  onSubmit(form: any): void {
    let formData = form.form.value;
    this.createEnteryModel.type = 'PLASMID';
    this.createEnteryModel.creationDate = new Date(this.CreationDate).toISOString();
    console.log(this.createEnteryModel);  
    this.enteriesService.create(this.createEnteryModel)
    .subscribe(
      (res: any) => {
        console.log("response", res);
      },
      err => {
        console.log("enteries error", err);        
      }
    );
  }

  addMore(t: any): void {
    if(t == 'disease') {
      this.diseasesInp.push(this.diseasesInp.length + 1);
    } else if(t == 'selectionmarkers') {
      this.seletionmakersInp.push(this.seletionmakersInp.length + 1);
    } else if(t == 'promoter') {
      this.promoterInp.push(this.promoterInp.length + 1);
    } else if(t == 'hla') {
      this.hlaInp.push(this.hlaInp.length + 1);
    } else if(t == 'epitope') {   
      this.epitopeInp.push(this.epitopeInp.length + 1);
    } else if(t == 'antigen') {      
      this.antigenInp.push(this.antigenInp.length + 1);
    } else if(t == 'domain') {
      this.domainInp.push(this.domainInp.length + 1);
    } else if(t == 'links') {
      this.linksInp.push(this.linksInp.length + 1);
    }
  }

  removeMore(i: number, f: String): void {
    if(f == 'disease') {
      this.createEnteryModel.disease.splice(i,1);
      this.diseasesInp.splice(i, 1);
    } else if(f == 'selectionmarkers') {
      this.createEnteryModel.selectionmarkers.splice(i,1);
      this.seletionmakersInp.splice(i, 1);
    } else if(f == 'promoter') {
      this.createEnteryModel.promoter.splice(i,1);
      this.promoterInp.splice(i, 1);
    } else if(f == 'hla') {
      this.createEnteryModel.hla.splice(i,1);
      this.hlaInp.splice(i, 1);
    } else if(f == 'epitope') {
      this.createEnteryModel.epitope.splice(i,1);
      this.epitopeInp.splice(i, 1);
    } else if(f == 'antigen') {
      this.createEnteryModel.antigen.splice(i,1);
      this.antigenInp.splice(i, 1);
    } else if(f == 'domain') {
      this.createEnteryModel.domain.splice(i,1);
      this.domainInp.splice(i, 1);
    } else if(f == 'links') {
      this.createEnteryModel.links.splice(i,1);
      this.linksInp.splice(i, 1);
    }
  }

  addToModel(v: any, f: String): void {    
    if(v.target.value != '') { 
      if(f == 'disease') {
        this.createEnteryModel.disease.push(v.target.value);          
        this.createEnteryModel.disease = Array.from(new Set(this.createEnteryModel.disease));
      } else if(f == 'selectionmarkers') {
        this.createEnteryModel.selectionMarkers.push(v.target.value);        
        this.createEnteryModel.selectionMarkers = Array.from(new Set(this.createEnteryModel.selectionMarkers));
      } else if(f == 'promoter') {        
        this.createEnteryModel.promoter.push(v.target.value);          
        this.createEnteryModel.promoter = Array.from(new Set(this.createEnteryModel.promoter));
      } else if(f == 'hla') {       
        this.createEnteryModel.hla.push(v.target.value);        
        this.createEnteryModel.hla = Array.from(new Set(this.createEnteryModel.hla));
      } else if(f == 'epitope') {        
        this.createEnteryModel.epitope.push(v.target.value);        
        this.createEnteryModel.epitope = Array.from(new Set(this.createEnteryModel.epitope));
      } else if(f == 'antigen') {        
        this.createEnteryModel.antigen.push(v.target.value);        
        this.createEnteryModel.antigen = Array.from(new Set(this.createEnteryModel.antigen));
      } else if(f == 'domain') {        
        this.createEnteryModel.domain.push(v.target.value);        
        this.createEnteryModel.domain = Array.from(new Set(this.createEnteryModel.domain));        
      } else if(f == 'links') {
        this.createEnteryModel.links.push(v.target.value);        
        this.createEnteryModel.links = Array.from(new Set(this.createEnteryModel.links));
      }
    }
  }

  fetchFilterData(v: any, f: String): void {    
    let filterData: any = {};
    if(v.term != '') {
      if(f == "sourcelabs") {
        filterData = {field: "PI", "token": v.term};
      } else if(f == "backbone") {
        filterData = {field: "BACKBONE", "token": v.term};
      } else if(f == "originreplication") {
        filterData = {field: "ORIGIN_OF_REPLICATION", "token": v.term};  
      } else if(f == "replicatesIn") {
        filterData = {field: "REPLICATES_IN", "token": v.term};  
      } else if(f == "supplier") {
        filterData = {field: "SUPPLIER", "token": v.term};  
      }
    }

    if(filterData.hasOwnProperty('token')) {
      this.loading = true;
      this.filtersService.search(filterData)
        .subscribe(
          (res: any) => {
            this.loading = false;
            if(typeof res != 'undefined' ) {              
              if(f == "sourcelabs") {
                this.labsData = res;
              } else if(f == "backbone") {
                this.backboneData = res;
              } else if(f == "originreplication") {
                this.originreplicationData = res;
              } else if(f == "replicatesIn") {
                this.replicatesinData = res;
              } else if(f == "supplier") {
                this.supplierData = res;
              }
            }
          },
          err => {
            this.loading = false;
            console.log("enteries error", err);        
          }
        );
    }    
  }

  addMoreParameters(): void {
    this.createEnteryModel.parameters.push({
      "key": "",
      "name": "",
      "value": ""
    });
  }
  removeParameters(i: number): void {  
    this.createEnteryModel.parameters.splice(i,1);
  }

  updateListModel(term: string, item: any): void {
    console.log(term);
    console.log(item);
  }
}
