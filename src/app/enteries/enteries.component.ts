import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Enteries } from '../models/enteries.model';
import { EnteriesService } from '../_services/enteries.service';
import { TokenStorageService } from '../_services/token-storage.service';

import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-enteries',
  templateUrl: './enteries.component.html',
  styleUrls: ['./enteries.component.css']
})
export class EnteriesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  itemsPerPage: number = 20;
  totalItems: any;
  page: any = 1;
  previousPage: any;
  gotData: boolean = false;

  constructor(private enteriesService: EnteriesService, 
              private tokenStorageService: TokenStorageService) { }

  enteries?: Enteries[];

  ngOnInit(): void {
    //this.getEnteries();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      serverSide: true,
      processing: true,
      lengthChange: false,
      ajax: (dataTablesParameters: any, callback) => {
        const params = new HttpParams()
          .set('offset', dataTablesParameters.draw - 1)
          .set('limit', dataTablesParameters.length);
        this.enteriesService.readAll(params)
          .subscribe(
            (res: any) => {
              this.enteries = res.data;
              callback({
                recordsTotal: res.recordsTotal,
                recordsFiltered: res.recordsFiltered,
                data: []
              });
            });
      }
    };
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.getEnteries();
    }
  }

  getEnteries(): void {

    const params = new HttpParams()
      .set('offset', this.page - 1)
      .set('limit', this.itemsPerPage);

    this.enteriesService.readAll(params)
    .subscribe(
      (res: any) => {
        this.gotData = true;
        this.totalItems = res.resultCount;
        this.enteries = res.data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 2,
          serverSide: true,
          processing: true,
          lengthChange: false,
          data: res.data,
          columns: [
            { title: 'TYPE', data: 'type' },
            { title: 'PART ID', data: 'partId' },
            { title: 'Name', data: 'name' },
            { title: 'STATUS', data: 'status' },
            { title: 'CREATED', data: 'creationTime' },
          ]
        };
      },
      err => {
        console.log("enteries error", err);
        //this.dataTable = $(this.table.nativeElement);
        //this.dataTable.DataTable(this.dtOptions);
      }
    );
  }

}
