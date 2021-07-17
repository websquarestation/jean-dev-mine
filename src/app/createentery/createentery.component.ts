import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

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
  name: String = '';
  selectionMarkers: String = '';
  intellectualProperty: String = '';
  isSearchable: boolean = true;
  loading: boolean = false;
  loadingText: String = "Loading...";
  diseasesInp: any = [];
  labsData: any = [];
  PIVal: String = '';
  createdStatus: boolean = false;

  isFormSubmitted = false;
  public createEnteryModel: any;

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
    console.log("token", this.tokenStorage.getUser());
    let cuser = this.tokenStorage.getUser();
    this.createEnteryModel.creator = cuser.firstName + " " + cuser.lastName;
    this.createEnteryModel.creatormail = cuser.email;
    this.createEnteryModel.creationDate = new Date();
    this.createEnteryModel.disease = [];
    this.diseasesInp.length = 1;
    this.createEnteryModel.circular = 0;
    this.createEnteryModel.verified = 0;
    this.createEnteryModel.status = 'Complete';
    this.createEnteryModel.bioSafetyLevel = '1';

    this.createEnteryModel = {
        "type": "PLASMID",
        "creator": " Administrator",
        "creatoremail": "Administrator",
        "creationDate": "2021-07-17",
        "disease": [
            "test disease",
            "test disease 2"
        ],
        "circular": true,
        "verified": true,
        "status": "Complete",
        "bioSafetyLevel": "1",
        "shortDescription": "test desc... test desc... test desc... test desc... ",
        "name": "test name",
        "alias": "test alias",
        "principalInvestigator": "Test Source Labtest",
        "backbone": "test backbone",
        "originOfReplication": "test replication",
        "replicatesin": "Test Replicates this",
        "supplier": "Test Supplier",
        "fundingsource": "Test Function Source",
        "keywords": "Test Keywords",
        "benchinglink": "Test Links",
        "selectionmarkers": ["Test Makers"],
        "promoter": ["test promoter"],
        "hla": ["Test HLA"],
        "epitope": ["Test Epitope"],
        "domain": ["test domain"],
        "antigen": ["Test Antigen"],
        "links": ["Test External URL"],
        "summary": "test summary... test summary... test summary... test summary... \n\ntest summary... test summary... test summary... ",
        "references": "test references.. test references.. test references.. test references.. \n\ntest references.. test references.. test references.. test references.. test references.. ",
        "intellectualproperty": "test intellectual property... test intellectual property... test intellectual property... test intellectual property... \n\ntest intellectual property... test intellectual property... test intellectual property... test intellectual property... test intellectual property... ",
        "longDescription": "test notes... test notes... test notes... test notes... \n\ntest notes... test notes... test notes... test notes... test notes... test notes... "
    };

    console.log(this.createEnteryModel);
    // this.enteriesService.create(this.createEnteryModel)
    // .subscribe(
    //   (res: any) => {
    //     console.log("response", res);
    //   },
    //   err => {
    //     console.log("enteries error", err);        
    //   }
    // );


  }

  onSubmit(form: any): void {
    let formData = form.form.value;
    console.log(formData);
    let d = new Date(this.createEnteryModel.creationDate);
    this.createEnteryModel.creationDate = d.toISOString();
    console.log(this.createEnteryModel);
    console.log(JSON.stringify(this.createEnteryModel));
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
    this.diseasesInp.push(this.diseasesInp.length + 1);
  }

  removeMore(i: number, f: String): void {
    if(f == 'disease') {
      this.createEnteryModel.disease.splice(i,1);
      this.diseasesInp.splice(i, 1); 
      console.log(this.createEnteryModel.disease);
    }
  }

  addToModel(v: any, f: String): void {
    if(f == 'disease') {
      if(v.target.value != '') {        
        this.createEnteryModel.disease.push(v.target.value);
        v.target.disabled = true;
        this.createEnteryModel.disease = Array.from(new Set(this.createEnteryModel.disease));
        console.log(this.createEnteryModel.disease);
      }
    }
  }

  fetchFilterData(v: any, f: String): void {    
    if(f == "sourcelabs") {
      if(v.term != '') {
        this.loading = true;
        console.log(v.term);
        this.filtersService.search({field: "PI", "token": v.term})
          .subscribe(
            (res: any) => {
              this.loading = false;
              console.log("response", res);
              if(typeof res != 'undefined' ) {
                this.labsData = res;
              }
            },
            err => {
              this.loading = false;
              console.log("enteries error", err);        
            }
          );
      }
    }
  }

  updateListModel(term: string, item: any): void {
    console.log(term);
    console.log(item);
  }
}
