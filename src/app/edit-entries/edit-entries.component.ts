import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  curChange: any;
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
          this.dataset = res.entryList;
          this.lastUpdate = res.created;
        });
  }

  updateList(id: number, property: string, event: any) {
    let editField = event.target.textContent;
    console.log(editField);
    console.log(id);
    console.log(property);
    // {"id":1,"type":"MULTI","name":"PLASM 00111","index":0}
    if (this.curChange != editField) {
      let data: any = {
        "id": id,
        "type": "MULTI",
        [property]: editField,
        "index": 0
      }

      if(property == "circular") {
        console.log(event);
         data = {
          "id": id,
          "type": "PLASMID",
          plasmidData: {circular: event.target.checked},
          "index": 1
        }
      }

      if(property == "verified") {
        console.log(event);
         data = {
          "id": id,
          "type": "PLASMID",
          plasmidData: {},
          "verified": event.target.checked,
          "index": 1
        }
      }

      if(property == "selectionMarkers" || property == 'disease' || property == 'hla'
       || property == 'epitope' || property == 'domain' || property == 'antigen' || property == 'links') {
         data = {
          "id": id,
          "type": "PLASMID",
          plasmidData: {},
          [property]: event.target.textContent.split(","),
          "index": 1
        }
      }
      
      if(event.target.type == 'select-one') {
        if(property == 'status' || property == 'bioSafetyLevel') {
          data = {
            "id": id,
            "type": "PLASMID",
            plasmidData: {},
            [property]: event.target.value,
            "index": 0
          }
        }
      }

      this.editEntriesService.updateSingleField(this.id, id, data)
        .subscribe(
          (res: any) => {
            console.log("response", res);
            this.notifyService.showSuccess("Entry updated successfully !!", "Single Field Update");
          },
          err => {
            //console.log("enteries error", err);
            this.notifyService.showError("Entry error: " + err.message, "Single Field Update");
          }
        );
    }
  }

  changeValue(id: number, property: string, event: any) {
    this.curChange = event.target.textContent;
    console.log(this.curChange);
  }

  gotoBack(): void {    
    this.router.navigate(['/enteries/folder/personal']);
  }
}
