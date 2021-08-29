import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FoldersService } from '../_services/folders.service';
import { NotificationService } from '../_services/notification.service'

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css']
})
export class FoldersComponent implements OnInit {
  folders: any = [];
  createFolder: boolean = false;
  txtFolder: string;
  totalFolders: number = 0;
  filterText: string;
  items: any = [];
  folderIds: any = [];
  @Input() public entries: any;
  @Input() public folderId: any;
  selectionType: any;

  constructor(public activeModal: NgbActiveModal,
    private foldersService: FoldersService,
    private notifyService: NotificationService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getFolders();
    },0);
  }

  getFolders(): void {
    this.foldersService.readAll()
      .subscribe(
        (res: any) => {
          this.folders = res;
          this.totalFolders = res.length;
        },
        err => {
          console.log("enteries error", err);
        }
      );
  }

  enableCreateFolder(): void {
    this.createFolder = true;
  }

  disableCreateFolder(): void {
    this.createFolder = false;
  }
  
  filterFolders(text: string): void {
    if (text != '') {
      this.folders = Object.assign([], this.items).filter(
        (item: any) => item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
      );
    }
  }

  saveFolder(): void {
    let txtFolderVal = this.txtFolder;
    if (txtFolderVal != "") {
      this.createFolder = false;
      this.foldersService.create({ folderName: txtFolderVal })
        .subscribe(
          (response: any) => {
            this.notifyService.showSuccess("Folder created successfully !!", "New Folder");
            this.getFolders();
          },
          error => {
            error = JSON.parse(error._body);
            this.notifyService.showError("Entry error: " + error.message, "New Folder");
          }
        );
    }
  }

  changeSelection(item: any, e: Event): void {
    let target = e.target as HTMLInputElement;
    // if checkbox type is checkbox
    if (target.type == 'checkbox') {
      // if checkbox checked true
      if (target.checked == true) {
        this.folderIds.push(item);
      } else if (target.checked == false) {
        let index = this.folderIds.indexOf(item);
        if (index !== -1) this.folderIds.splice(index, 1);
      }
    }
  }

  moveToFolder(): void {
    if (this.folderId == 'personal') {
      this.selectionType = 'COLLECTION';
    } else {
      this.selectionType = 'FOLDER';
    }
    let model: any = {
      'all': false,
      'selectionType': this.selectionType,
      'entries': this.entries,
      'destination': this.folderIds,
      'folderId': this.folderId
    }

    this.foldersService.moveEntries(model)
      .subscribe(
        (res: any) => {
          //console.log("response", res);
          this.notifyService.showSuccess("Entries added successfully !!", "Add Entries");
        },
        err => {
          //console.log("enteries error", err);
          this.notifyService.showError("Entries added error: " + err.message, "Add Entries");
        }
      );
  }
}
