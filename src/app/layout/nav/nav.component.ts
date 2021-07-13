import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FoldersService } from '../../_services/folders.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  navs: any = [];
  new_nav: any = [];
  submenu_height : String = '';
  delFolder : boolean = false;
  isInp : boolean = false;
  isLoading : boolean =false;
  error_message:any;
  success_message!:String;

  constructor(
    private foldersService: FoldersService,
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get("assets/navigation.json").subscribe(data =>{
      this.navs = data;
    });
    this.getFolders();
  }

  getFolders() {    
    this.foldersService.readAll()
    .subscribe(
      (res: any) => {
        this.submenu_height = (50 * res.length) + 'px';
        this.navs = this.navs.map((v: any) => {
            return v.label == "Personal" ? {...v, children: res} : v 
          });
      },
      err => {
        console.log("enteries error", err);        
      }
    );
  }

  addFolder() {
    // show folder input
    this.isInp = true;
  }

  saveFolder(event: any) {    
    // save folder  
    let txtFolder = event.target;
    let txtFolderVal = txtFolder.value;
    if(txtFolderVal != "") {
      this.foldersService.create({folderName: txtFolderVal})
      .subscribe(
        (response: any) => {                  
          this.isLoading=false;
          this.error_message='';
          this.success_message = response.message;
          txtFolder.value = '';
          this.getFolders();
        },
        error => {
          error=JSON.parse(error._body);

          if(typeof(error.message) !== "undefined" && typeof(error.message.error) !== "undefined") {
            this.error_message=error.message.error;
          } else {
            this.error_message=error.error.message;
          }
          if(typeof(this.error_message) === "object") {
            var msg = '';
            var err_keys = Object.keys(this.error_message);                    
            for(var i = 0; i < err_keys.length; i++) {
              var eid = err_keys[i];
              msg += this.error_message[eid]['message'] + '<br/>';
            }
            this.error_message = msg;
          }
          this.isLoading=false;

        }

        );
      this.isInp = false; 
    }      
  }

  closeFolderInp() {
    // hide folder input
    this.isInp = false;
  }

  showDeleteFolder(e: any, f: boolean) {    
    this.delFolder = f;
  }

  deleteFolder(id: any, folder: String) {
    var confirm = window.confirm("Do you really want to delete {" + folder + "} folder?");
    if(confirm) {
      this.foldersService.delete(id)
      .subscribe(
        (response: any) => {
          this.getFolders();
        },
        error => {
          error=JSON.parse(error._body);
        }
      );
    }
  }

}
