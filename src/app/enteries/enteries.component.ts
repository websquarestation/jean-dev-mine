import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Enteries } from '../models/enteries.model';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';

import { EnteriesService } from '../_services/enteries.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { SearchService } from '../_services/search.service';
import { FoldersComponent } from '../folders/folders.component';
import { FoldersService } from '../_services/folders.service';
import { NotificationService } from '../_services/notification.service'
import { EditEntriesService } from '../_services/editentries.service';


@Component({
  selector: 'app-enteries',
  templateUrl: './enteries.component.html',
  styleUrls: ['./enteries.component.css']
})
export class EnteriesComponent implements OnInit {
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  itemsPerPage: number = 20;
  totalItems: any;
  page: any = 1;
  previousPage: any;
  gotData: boolean = false;
  tooltipData: any = {
    'selectionMarkers': '',
    'creator': '',
    'creatorEmail': '',
    'bioSafetyLevel': '',
    'principalInvestigator': '',
    "modificationTime": ''
  };
  tooltip: boolean = false;
  searchKeyword: string | null;

  enteries?: Enteries[];
  searchEnteries?: any;
  slimit: number = 30;
  addDisabled: boolean = true;
  entriesgrp: any = [];
  bsModalRef: NgbModalRef;
  folderId: any;
  delEntries: any = true;
  editEntries: any = true;
  isMasterSel: boolean = false;

  constructor(private enteriesService: EnteriesService, 
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private modalService: NgbModal,
    private notifyService: NotificationService,
    private editEntriesService: EditEntriesService
  ) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;      
    }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.searchKeyword = params['keyword'];
      this.folderId = params.folderId;      
    });
    this.getEnteries();
  }

  getTooltip(ID: number): void {
    this.tooltipData = {
      'selectionMarkers': '',
      'creator': '',
      'creatorEmail': '',
      'bioSafetyLevel': '',
      'principalInvestigator': '',
      "modificationTime": ''
    };
    const tooltipkey = 'tooltip-' + ID;
    if (localStorage.getItem(tooltipkey) === null) {
      this.enteriesService.getTooltip(ID)
        .subscribe(
          (res: any) => {
            this.tooltip = true;
            localStorage.setItem(tooltipkey, JSON.stringify(res));
            this.tooltipData = res;
          });
    } else {
      this.tooltip = true;
      this.tooltipData = JSON.parse(localStorage.getItem(tooltipkey) || '{}');
    }
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.getEnteries();
    }
  }

  entry(id: number) {
    this.router.navigate([`/entry/${id}`]);
  }

  // get search function
  getEnteries(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      serverSide: true,
      processing: true,
      lengthChange: false,
      columnDefs: [{
        orderable: false,
        targets: 0,
        searchable: false,
        visible: true
      }],
      ajax: (dataTablesParameters: any, callback) => {
        let sort = 'type';
        let asc = false;
        if (dataTablesParameters.order[0] !== 'undefined') {
          if (dataTablesParameters.order[0].column == '1') {
            sort = 'type';
          } else if (dataTablesParameters.order[0].column == '2') {
            sort = 'part_id';
          } else if (dataTablesParameters.order[0].column == '3') {
            sort = 'name';
          } else if (dataTablesParameters.order[0].column == '4') {
            sort = 'status';
          } else if (dataTablesParameters.order[0].column == '5') {
            sort = 'created';
          }

          if (dataTablesParameters.order[0].dir == 'asc') {
            asc = true;
          } else {
            asc = false;
          }
        }

        // getting search results
        if (this.searchKeyword != null) {
          let spage = dataTablesParameters.start;
          let limit = dataTablesParameters.length;
          const formData: any = {
            "queryString": this.searchKeyword,
            "blastQuery": {},
            "fieldFilters": [],
            "entryTypes": ["STRAIN", "PLASMID", "PART", "PROTEIN", "ORDER"],
            "parameters": { start: spage, retrieveCount: limit, sortField: "RELEVANCE" }
          };
          this.searchService.getSearch(formData)
            .subscribe(
              (res: any) => {
                let enteries: any = [];
                res.results.forEach((l: any) => {
                  let n: any = [];
                  let progress: any = Math.floor(l.score * 100);
                  let color: string = '';
                  if (progress < 55) {
                    color = '#d9534f';
                  } else if (progress < 75) {
                    color = '#f0ad4e';
                  } else {
                    color = '#5cb85c';
                  }
                  n['progress'] = progress;
                  n['score'] = l.score;
                  n['maxScore'] = l.maxScore;
                  n['color'] = color;
                  n['type'] = l.entryInfo.type;
                  n['partId'] = l.entryInfo.partId;
                  n['id'] = l.entryInfo.id;
                  n['name'] = l.entryInfo.name;
                  n['status'] = l.entryInfo.status;
                  n['creationTime'] = l.entryInfo.creationTime;
                  enteries.push(n);
                });
                this.enteries = enteries;
                callback({
                  recordsTotal: res.resultCount,
                  recordsFiltered: res.resultCount,
                  data: []
                });
              },
              err => {
                console.log("enteries error", err);
              }
            );
        } else {
          // get enteries list
          let params = new HttpParams();
          params = params.append('offset', dataTablesParameters.start);
          params = params.append('limit', dataTablesParameters.length);
          params = params.append('currentPage', (dataTablesParameters.start / dataTablesParameters.length) + 1);
          params = params.append('fields', 'status');
          params = params.append('fields', 'hasSample');
          params = params.append('fields', 'hasSequence');
          params = params.append('fields', 'creationTime');
          params = params.append('folderId', this.folderId);
          params = params.append('hstep', '25');
          params = params.append('hstep', '50');
          params = params.append('hstep', '100');
          params = params.append('hstep', '250');
          params = params.append('hstep', '500');
          params = params.append('hstep', '1000');
          if (this.totalItems) {
            params = params.append('count', this.totalItems);
          }
          params = params.append('asc', asc);
          params = params.append('sort', sort);

          this.enteriesService.readAll(params)
            .subscribe(
              (res: any) => {
                this.enteries = res.data;
                this.totalItems = res.resultCount;
                callback({
                  recordsTotal: res.resultCount,
                  recordsFiltered: res.resultCount,
                  data: []
                });
              });
        } // end if
      }
    }
  }
  
  changeSelection(id: any, e: Event): void {
    let target = e.target as HTMLInputElement;
    this.manageChecks(id, target);
  }

  manageChecks(id: any, target: any): void {
    // if checkbox type is checkbox
    if (target.type == 'checkbox') {
      // if checkbox checked true
      if (target.checked == true) {
        this.entriesgrp.push(id);
      } else if (target.checked == false) {
        let index = this.entriesgrp.indexOf(id);
        if (index !== -1) this.entriesgrp.splice(index, 1);
      }
    }
    this.manageButtons();
  }

  manageButtons(): void {
    // selected entries ids length
    if (this.entriesgrp.length > 0) {
      this.addDisabled = false;
      this.delEntries = false;
      this.editEntries = false;
    } else {
      this.addDisabled = true;
      this.delEntries = true;
      this.editEntries = true;
    }
  }

  confirmDelEntries(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.DelEntries();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmEditEntries(): void {
    if (this.entriesgrp.length == 1) {
      this.editEntry();
    } else {
      this.editMiltipleEntries();
    }
  }

  checkUncheckAll(): void {
    this.enteries?.forEach((i: any) => {
      i.isSelected = this.isMasterSel;
      if (i.isSelected == true) {
        this.entriesgrp.push(i.id);
      } else {
        let index = this.entriesgrp.indexOf(i.id);
        if (index !== -1) this.entriesgrp.splice(index, 1);
      }
    });
    this.manageButtons();
  }

  editEntry(): void {
    let id = this.entriesgrp[0];
    this.router.navigate([`/entery/${id}`]);
  }

  editMiltipleEntries(): void {
    let id = this.entriesgrp[0];
    this.uploads();
  }

  DelEntries(): void {
    if (this.entriesgrp.length > 0) {
      let data: any = [];
      this.entriesgrp.forEach((j: any) => {
        data.push({ 'id': j, 'visible': 'OK' });
      });
      this.enteriesService.trash(data)
        .subscribe(
          (response: any) => {
            this.reloadCurrentRoute();
            this.notifyService.showSuccess("Entries Deleted Successfully !!", "Delete Entry");
          },
          error => {
            error = JSON.parse(error._body);
            this.notifyService.showError("Entries Deleted Error: " + error.message, "Delete Entry");
          }
        );
    } else {
      this.notifyService.showError("Can't Delete Entries, Please try again.", "Delete Entry");
    }
  }

  uploads(): void {
    let ids: any = [];
    this.entriesgrp.forEach((id: any) => {
      ids.push({ "id": id, "visible": "OK" });
    });
    console.log(ids)
    let data = {
      "entryList": ids,
      "name": "Bulk Edit",
      "type": "MULTI",
      "status": "BULK_EDIT",
      "returnURL": "/folders/personal"
    };
     
    this.editEntriesService.uploads(data)
      .subscribe(
        (res: any) => {
          console.log("response", res);
          this.notifyService.showSuccess("Upload Success!!", "Uploads");
          this.router.navigate([`/upload/${res.id}`]);
        },
        err => {
          //console.log("enteries error", err);
          this.notifyService.showError("Uploads Error: " + err.message, "Uploads");
        }
      );
  }

  openModal(): void {
    if (this.folderId != 'undefined') {
      const modalRef = this.modalService.open(FoldersComponent);
      modalRef.componentInstance.entries = this.entriesgrp;
      modalRef.componentInstance.folderId = this.folderId;
    } else {
      this.notifyService.showError("Add To folder error, Please try again.", "Entries");
    }
  }

  reloadCurrentRoute(): void {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
