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

constructor(private enteriesService: EnteriesService, 
              private tokenStorageService: TokenStorageService) { }

  enteries?: Enteries[];
  ngOnInit(): void {
    console.log(this.tokenStorageService.getToken()); 
    this.getEnteries();
  }

  getEnteries(): void {
    this.enteriesService.readAll()
    .subscribe(
      (res: any) => {
        console.log("response", res);
        this.enteries = res.data;
      },
      err => {
        console.log("enteries error", err);        
      }
    );
  }

}
