import { Component, OnInit } from '@angular/core';

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

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {    
    this.searchService.readAll()
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

}
