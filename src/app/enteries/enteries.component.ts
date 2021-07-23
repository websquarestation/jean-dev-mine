import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Enteries } from '../models/enteries.model';
import { EnteriesService } from '../_services/enteries.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-enteries',
  templateUrl: './enteries.component.html',
  styleUrls: ['./enteries.component.css']
})
export class EnteriesComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  public page = 1;
  public pageSize = 10;
  itemsPerPage = 10;
  totalItems: any;

  constructor(private enteriesService: EnteriesService, 
              private tokenStorageService: TokenStorageService) { }

  enteries?: Enteries[];
  ngOnInit(): void {
    console.log(this.tokenStorageService.getToken()); 
    this.getEnteries();
  }

  getPageSymbol(current: number) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    console.log(this.page);
    this.getEnteries();
  }


  getEnteries(): void {

    const params = new HttpParams()
      .set('offset', this.page - 1)
      .set('limit', this.itemsPerPage);

    this.enteriesService.readAll(params)
    .subscribe(
      (res: any) => {
        console.log("response", res);
        this.totalItems = res.resultCount;
        console.log("tl---", this.totalItems);
        this.enteries = res.data;
      },
      err => {
        console.log("enteries error", err);        
      }
    );
  }

}
