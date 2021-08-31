import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as englishStrings } from 'ngx-timeago/language-strings/en';
import { EditEntriesService } from '../_services/editentries.service';
import { NotificationService } from '../_services/notification.service';
import { EnteriesService } from '../_services/enteries.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';


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
  public files: NgxFileDropEntry[] = [];
  seqFile: any;

  constructor(
    private router: Router,
    private editEntriesService: EditEntriesService,
    private entriesService: EnteriesService,
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

  dropped(id: any, files: NgxFileDropEntry[]): void {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.seqFile = file.name;
          this.entriesService.uploadSingleSeqFile(this.id, id, 'plasmid', file)          
          .subscribe(
            (res: any) => {
              console.log("response", res);
              this.notifyService.showSuccess("Entry Seq File updated successfully !!", "Single Field Update");
            },
            err => {
              //console.log("enteries error", err);
              this.notifyService.showError("Entry Seq File error: " + err.message, "Single Field Update");
            }
          );
          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
        this.notifyService.showError("File Upload Error", "Single Field Update");
      }
    }
  }

  dragInfo(): void {
    this.notifyService.showInfo("Drag to upload new Sequence file, Supported file formats are Genbank, Fasta and SBOL !!", "Single Field Update");
  }
}
