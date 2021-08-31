import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { StarRatingComponent } from 'ng-starrating';
import { TokenStorageService } from './../_services/token-storage.service';

import { DatepickerOptions } from 'ng2-datepicker';

import { CreateEntery } from './../models/createentry.model';
import { getYear } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import {Observable} from 'rxjs';

import { EnteriesService } from '../_services/enteries.service';
import { FiltersService } from '../_services/filters.service';
import { NotificationService } from '../_services/notification.service';


@Component({
  selector: 'app-createentery',
  templateUrl: './createentery.component.html',
  styleUrls: ['./createentery.component.css']
})
export class CreateenteryComponent implements OnInit {
  currentRate = 0;
  
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
  addUploadAttachments: any = [];
  public createEnteryModel: any;
  fileToUpload: File | null;
  parametersModel: any = {
    "key": "",
    "name": "",
    "value": ""
  };
  type: String;
  typeTxt: String;
  isCircular: boolean = true;
  isBackbone: boolean = true;
  isOriginReplication: boolean = true;
  isReplicatesIn: boolean = true;
  isPromoters: boolean = true;
  isGenotype: boolean = false;
  isHost: boolean = false;

  // options sample with default values
  options: DatepickerOptions = {
    calendarClass: 'datepicker-blue',
    scrollBarColor: '#ffffff',
    maxDate: new Date(),
    format: 'yyyy-MM-dd', // date format to display in input
  };
    
  progress: number;
  seqFiledata: boolean = false;
  id: any = '';
  edit: boolean = false;
  add: boolean = false;
  constructor(private tokenStorage: TokenStorageService,
    private enteriesService: EnteriesService,
    private filtersService: FiltersService,
    private route: ActivatedRoute,
    private router: Router,
    private notifyService: NotificationService
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

    // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements
    this.route.queryParams
      .subscribe((params: any) => {
      if (params['type']) {
        this.type = params['type'];
        this.typeTxt = params['type'].toUpperCase();
        if (this.typeTxt == 'PLASMID') {
          this.createEnteryModel.circular = true;
        } else if (this.typeTxt == 'STRAIN') {
          this.isCircular = false;
          this.isBackbone = false;
          this.isOriginReplication = false;
          this.isReplicatesIn = false;
          this.isPromoters = false;
          this.isGenotype = true;
          this.isHost = true;
        }
      }
      });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != null) {
      this.edit = true;
      this.getEntryDetails();
    } else {
      this.add = true;
    }
  }

  getEntryDetails(): void {
    this.enteriesService.detail(this.id)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.createEnteryModel = res;
          this.currentRate = res.ratingStars;
          this.type = res.type;
        },
        err => {
          console.log("entry errpr", err);
        }
      );
  }

  onSubmit(form: any): void {
    let formData = form.form.value;
    //console.log(formData);
    this.createEnteryModel.type = this.type.toUpperCase();
    this.createEnteryModel.ratingStars = this.currentRate;
    this.createEnteryModel.creationDate = new Date(this.CreationDate).toISOString();
    if (this.type == 'Strain') {
      this.createEnteryModel.strainData = {
        "host": this.createEnteryModel.host,
        "genotypePhenotype": this.createEnteryModel.genotypePhenotype
      }
    }

    if (this.add == true) {
      this.enteriesService.create(this.createEnteryModel)
        .subscribe(
          (res: any) => {
            console.log("response", res);
            this.notifyService.showSuccess("Entry created successfully !!", this.type + " Entry");
            this.router.navigateByUrl('/entry/' + res.id);
          },
          err => {
            //console.log("enteries error", err);
            this.notifyService.showError("Entry error: " + err.message, this.type + " Entry");
          }
        );
    } else {
      this.enteriesService.update(this.id, this.createEnteryModel)
        .subscribe(
          (res: any) => {
            console.log("response", res);
            this.notifyService.showSuccess("Entry updated successfully !!", this.type + " Entry");
            this.router.navigateByUrl('/entry/' + res.id);
          },
          err => {
            //console.log("enteries error", err);
            this.notifyService.showError("Entry error: " + err.message, this.type + " Entry");
          }
        );
    }
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
            //console.log("enteries error", err);        
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

  addCustomTag  = (term:any) => ({id: term, name: term});  

  addAttachment = () => {
    this.addUploadAttachments.push(this.addUploadAttachments + 1);
  };

  handleFileInput(files: FileList): void {
    //console.log(files);
    if(files.length > 0) {
      this.fileToUpload = files.item(0);
      //console.log(this.fileToUpload);
      if(this.fileToUpload != null) {
        this.enteriesService.postFile(this.fileToUpload).subscribe(data => {
            //console.log(data);
          // do something, if upload success
          }, error => {
            //console.log(error);
          });
      } else {
        //console.log("please provide file to upload");
      }
    }
}

  updateListModel(term: string, item: any): void {
    console.log(term);
    console.log(item);
  }

  uploadSeq(ev: any) {
    let sfile = ev.target.files;
    let filedata = sfile.item(0);
    this.progress = 1;
    this.seqFiledata = true;
    this.enteriesService.uploadSeqFile(this.type.toString(), filedata)
      .subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.seqFiledata = false;
            this.progress = 0;
            //console.log(event);
          }
        },
        (error) => {
          this.progress = 0;
          this.seqFiledata = false;
        }
      )
  }

  gotoBack(): void {
    this.router.navigate(['enteries/folder/personal']);
  }
}
