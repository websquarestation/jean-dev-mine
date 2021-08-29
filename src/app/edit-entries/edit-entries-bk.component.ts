import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as englishStrings } from 'ngx-timeago/language-strings/en';
import { EditEntriesService } from '../_services/editentries.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-edit-entries',
  templateUrl: './edit-entries.component.html',
  styleUrls: ['./edit-entries.component.css']
})
export class EditEntriesComponent implements OnInit {
  limit: any = 1;
  offset: any = 0;
  id: any;
  dataset: any[];
  lastUpdate: any = new Date();
  hotRegisterer = new HotTableRegisterer();
  htid: any = 'hotInstance';
  hotSettings: Handsontable.GridSettings = {};

  constructor(
    private router: Router,
    private editEntriesService: EditEntriesService,
    private notifyService: NotificationService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.limit = 40;
    this.offset = 0;
    this.id = this.route.snapshot.paramMap.get('id');
    this.getUploads();
  }

  getUploads(): void {
    this.editEntriesService.getUploads(this.id, this.limit, this.offset)
      .subscribe(
        (res: any) => {
          console.log("res----", res);
          this.hotSettings = {
            colHeaders: true,
            height: 'auto',
            fixedColumnsLeft: 2,
            rowHeaders: true,
            licenseKey: 'non-commercial-and-evaluation'
          }
          this.dataset = res.entryList;
          this.lastUpdate = res.created;
        });
  }

  saveChanges(c: any, s: any): void {
    if (s === 'loadData') {
      //don't save this change
    } else if (s == 'edit') {
      if (c.length > 0) {
        let index = c[0][0];
      }
    }
  }

  gotoBack(): void {
    this.router.navigate(['/enteries/folder/personal']);
  }
}
