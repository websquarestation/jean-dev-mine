import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Enteries } from '../models/enteries.model';
import { SearchService } from '../_services/search.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  enteries?: any;

  constructor(private searchService: SearchService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let searchKeyword = params['keyword'];
      if (searchKeyword != '') {
        const formData: any = {
          "queryString": searchKeyword,
          "blastQuery": {},
          "fieldFilters": [],
          "entryTypes": ["STRAIN", "PLASMID", "PART", "PROTEIN", "ORDER"],
          "parameters": { start: 0, retrieveCount: 30, sortField: "RELEVANCE" }
        };
        this.searchService.getSearch(formData)
          .subscribe(
            (res: any) => {
              this.enteries = res.results;
              console.log("e--", this.enteries);
            },
            err => {
              console.log("enteries error", err);
            }
          );
      }
    });

    
  }

}
