import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Enteries } from '../models/enteries.model';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';

import { EnteriesService } from '../_services/enteries.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { SearchService } from '../_services/search.service';


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
  constructor(private enteriesService: EnteriesService, 
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

  enteries?: Enteries[];
  searchEnteries?: any;
  slimit: number = 30;

  ngOnInit(): void {
    localStorage.clear();
    //this.searchKeyword = this.route.snapshot.paramMap.get('keyword');
    //console.log("keyword", this.searchKeyword);
    this.route.params.subscribe(params => {
      this.searchKeyword = params['keyword'];
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
      ajax: (dataTablesParameters: any, callback) => {
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
          const params = new HttpParams()
            .set('offset', dataTablesParameters.start)
            .set('limit', dataTablesParameters.length);
          this.enteriesService.readAll(params)
            .subscribe(
              (res: any) => {
                this.enteries = res.data;
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
}
